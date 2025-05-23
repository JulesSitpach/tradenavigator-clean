#!/bin/bash

# Exit on error
set -e

echo "============================================"
echo "Starting TradeNavigator deployment process"
echo "============================================"

# Install dependencies
echo "Installing root dependencies..."
npm ci || npm install

# Install client dependencies
echo "Installing client dependencies..."
cd client
npm ci || npm install
cd ..

# Build client application
echo "Building client application..."
cd client
npm run build
cd ..

# Create functions directory
echo "Creating Netlify functions directory..."
mkdir -p netlify/functions

# Create API function
echo "Creating API serverless function..."
cat > netlify/functions/api.js << 'APIFUNCTION'
import serverless from 'serverless-http';
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Mock user database
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

// JWT Secret
const JWT_SECRET = process.env.JWT_SECRET || 'tradenavigator-demo-secret';

// Authentication routes
app.post('/api/auth/login', (req, res) => {
  const { email, password } = req.body;
  
  // Find user by email
  const user = USERS.find(u => u.email === email);
  
  // In a real app, we would verify the password hash
  // For demo, just check if user exists
  if (!user) {
    return res.status(401).json({ error: 'Invalid email or password' });
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

app.post('/api/auth/register', (req, res) => {
  const { email, password, companyName, industry } = req.body;
  
  // Check if user already exists
  if (USERS.some(u => u.email === email)) {
    return res.status(409).json({ error: 'User with this email already exists' });
  }
  
  // Create new user
  const newUser = {
    id: USERS.length + 1,
    email,
    password: 'hashed_password', // In a real app, we would hash this
    companyName,
    industry,
    subscriptionTier: 'free',
    subscriptionStatus: 'active'
  };
  
  USERS.push(newUser);
  
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
app.get('/api/status', (req, res) => {
  res.json({ status: 'ok', version: '1.0.0' });
});

// Catch-all route for not found
app.use('*', (req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Create serverless handler
const handler = serverless(app);

// Export the handler for Netlify Functions
export { handler };
APIFUNCTION

# Create dist directory if it doesn't exist
echo "Ensuring dist directory exists..."
mkdir -p dist

# Copy client build to dist
echo "Copying client build to dist directory..."
cp -r client/dist/* dist/

echo "============================================"
echo "Deployment preparation complete!"
echo "============================================"
