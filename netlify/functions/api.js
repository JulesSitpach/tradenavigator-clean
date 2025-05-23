import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Database connection setup
let dbClient = null;
let isUsingRealDB = false;

// Try to set up database connection if credentials are available
async function setupDatabase() {
  try {
    if (process.env.DATABASE_URL) {
      console.log('Database URL found, attempting to connect...');
      
      // Only import pg if we have database credentials
      const { Pool } = await import('pg');
      
      dbClient = new Pool({
        connectionString: process.env.DATABASE_URL,
        ssl: { rejectUnauthorized: false }
      });
      
      // Test the connection
      const client = await dbClient.connect();
      console.log('Database connection successful');
      client.release();
      isUsingRealDB = true;
      
      return true;
    }
  } catch (error) {
    console.error('Database connection error:', error);
    dbClient = null;
    isUsingRealDB = false;
  }
  
  console.log('Using mock database');
  return false;
}

// Mock user database (used if real DB connection fails)
const USERS = [
  {
    id: 1,
    email: 'demo@example.com',
    password: '$2b$10$XLxMiNM4W0UNzfTXX9Q1AuuufZYqyW7ivW1yZ6B1RiVHmlhUcLsiy', // "password123"
    companyName: 'Demo Company',
    industry: 'Technology',
    subscriptionTier: 'professional',
    subscriptionStatus: 'active'
  }
];

// Mock analyses database
const ANALYSES = [];

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'tradenavigator-demo-secret';

// Authentication middleware
const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// Helper function to get user by email - handles both DB and mock data
async function getUserByEmail(email) {
  if (isUsingRealDB && dbClient) {
    try {
      const result = await dbClient.query(
        'SELECT * FROM users WHERE email = $1',
        [email]
      );
      return result.rows[0];
    } catch (error) {
      console.error('Database query error:', error);
    }
  }
  
  // Fall back to mock data
  return USERS.find(u => u.email === email);
}

// Helper function to create user - handles both DB and mock data
async function createUser(userData) {
  if (isUsingRealDB && dbClient) {
    try {
      const result = await dbClient.query(
        'INSERT INTO users (email, password, company_name, industry, subscription_tier, subscription_status) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
        [userData.email, userData.password, userData.companyName, userData.industry, 'free', 'active']
      );
      return result.rows[0];
    } catch (error) {
      console.error('Database insert error:', error);
    }
  }
  
  // Fall back to mock data
  const newUser = {
    id: USERS.length + 1,
    email: userData.email,
    password: userData.password,
    companyName: userData.companyName,
    industry: userData.industry,
    subscriptionTier: 'free',
    subscriptionStatus: 'active'
  };
  
  USERS.push(newUser);
  return newUser;
}

// Authentication routes
app.post('/api/auth/login', async (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = await getUserByEmail(email);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
  }
  
  // Verify password
  try {
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  } catch (error) {
    // For demo purposes, allow password "password123" for all users
    if (password !== 'password123') {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
  }
  
  // Generate JWT token
  const token = jwt.sign(
    { id: user.id, email: user.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  
  res.status(200).json({
    message: 'Login successful',
    user: userWithoutPassword,
    token
  });
});

app.post('/api/auth/register', async (req, res) => {
  const { email, password, companyName, industry } = req.body;
  
  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }
  
  // Hash password
  let hashedPassword;
  try {
    hashedPassword = await bcrypt.hash(password, 10);
  } catch (error) {
    hashedPassword = 'hashed_password_mock';
  }
  
  // Create new user
  const newUser = await createUser({
    email,
    password: hashedPassword,
    companyName,
    industry
  });
  
  // Generate JWT token
  const token = jwt.sign(
    { id: newUser.id, email: newUser.email },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = newUser;
  
  res.status(201).json({
    message: 'User registered successfully',
    user: userWithoutPassword,
    token
  });
});

app.get('/api/auth/profile', authenticate, async (req, res) => {
  let user;
  
  if (isUsingRealDB && dbClient) {
    try {
      const result = await dbClient.query(
        'SELECT * FROM users WHERE id = $1',
        [req.user.id]
      );
      user = result.rows[0];
    } catch (error) {
      console.error('Database query error:', error);
    }
  } else {
    // Fall back to mock data
    user = USERS.find(u => u.id === req.user.id);
  }
  
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  
  // Remove password from response
  const { password: _, ...userWithoutPassword } = user;
  
  res.status(200).json({
    user: userWithoutPassword
  });
});

// Analysis routes
app.post('/api/analysis', authenticate, async (req, res) => {
  const { type, data } = req.body;
  
  let newAnalysis;
  
  if (isUsingRealDB && dbClient) {
    try {
      const result = await dbClient.query(
        'INSERT INTO analyses (user_id, analysis_type, data) VALUES ($1, $2, $3) RETURNING *',
        [req.user.id, type, JSON.stringify(data)]
      );
      newAnalysis = result.rows[0];
    } catch (error) {
      console.error('Database insert error:', error);
    }
  }
  
  if (!newAnalysis) {
    // Fall back to mock data
    newAnalysis = {
      id: ANALYSES.length + 1,
      userId: req.user.id,
      type,
      data,
      createdAt: new Date().toISOString()
    };
    
    ANALYSES.push(newAnalysis);
  }
  
  res.status(201).json({
    message: 'Analysis saved successfully',
    analysis: newAnalysis
  });
});

app.get('/api/analysis', authenticate, async (req, res) => {
  let userAnalyses = [];
  
  if (isUsingRealDB && dbClient) {
    try {
      const result = await dbClient.query(
        'SELECT * FROM analyses WHERE user_id = $1 ORDER BY created_at DESC',
        [req.user.id]
      );
      userAnalyses = result.rows;
    } catch (error) {
      console.error('Database query error:', error);
    }
  } else {
    // Fall back to mock data
    userAnalyses = ANALYSES.filter(a => a.userId === req.user.id);
  }
  
  res.status(200).json({
    analyses: userAnalyses
  });
});

// API route for HS code suggestions
app.post('/api/hs-code-suggestions', (req, res) => {
  const { productName, productDescription, productCategory } = req.body;
  
  // Mock response for HS code suggestions
  const mockSuggestions = [
    {
      code: '847130',
      description: 'Portable automatic data processing machines, weighing not more than 10 kg, consisting of a central processing unit, a keyboard and a display',
      confidence: 0.92,
      reasoning: 'Product description matches portable computing devices.'
    },
    {
      code: '847141',
      description: 'Other automatic data processing machines comprising in the same housing at least a central processing unit and an input and output unit',
      confidence: 0.78,
      reasoning: 'Alternative classification for computing devices.'
    }
  ];
  
  res.json({ suggestions: mockSuggestions });
});

// Status route
app.get('/api/status', async (req, res) => {
  const dbStatus = isUsingRealDB ? 'connected' : 'using mock data';
  
  res.json({ 
    status: 'ok', 
    version: '1.0.0',
    database: dbStatus,
    environment: process.env.NODE_ENV || 'development'
  });
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    database: isUsingRealDB ? 'connected' : 'using mock data',
    environment: process.env.NODE_ENV || 'development',
    timestamp: new Date().toISOString(),
  });
});

// Catch-all route for not found
app.use('/api/*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Set up database if possible, then create the handler
async function initialize() {
  await setupDatabase();
  
  // Create serverless handler
  return serverless(app);
}

// Export the handler for Netlify Functions
export const handler = async (event, context) => {
  // Initialize the serverless handler
  const serverlessHandler = await initialize();
  
  // Call the handler with the event and context
  return serverlessHandler(event, context);
};
