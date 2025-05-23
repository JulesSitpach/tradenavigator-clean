import { WebSocketServer } from 'ws';
import express, { Request, Response, NextFunction } from "express";
import dotenv from "dotenv";
import { json, urlencoded } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic } from "./vite";
import http from "http";
import OpenAI from "openai";

// Load environment variables
dotenv.config();

// Create Express app
export const app = express();

// CORS middleware to fix API call issues
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Middleware
app.use(json());
app.use(urlencoded({ extended: true }));

// Add the AI HS Code route BEFORE other routes to bypass authentication
app.post('/api/hs-code-suggestions', async (req, res) => {
  console.log('🤖 HS Code AI request received:', req.body);
  
  try {
    const { productName, productDescription, productCategory } = req.body;
    
    if (!productName) {
      return res.status(400).json({ error: 'Product name required' });
    }

    // Use OpenRouter for authentic HS code suggestions
    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1"
    });

    const prompt = `Analyze this product and suggest the most accurate HS (Harmonized System) trade codes:

Product Category: ${productCategory || 'Not specified'}
Product Name: ${productName}
Description: ${productDescription || 'No additional description'}

Provide 2-3 HS code suggestions with:
- 6-digit HS code
- Official description 
- Confidence score (0-1)
- Brief reasoning

Respond in JSON format: { "suggestions": [{"code": "123456", "description": "...", "confidence": 0.9, "reasoning": "..."}] }`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 800
    });

    const content = response.choices[0].message.content;
    if (!content) {
      throw new Error('No response content from AI');
    }
    const result = JSON.parse(content);
    console.log('✅ AI HS code suggestions generated successfully!');
    res.json(result);
    
  } catch (error) {
    console.error('🚨 Error generating HS codes:', error);
    res.status(500).json({ 
      error: 'Unable to generate HS code suggestions. Please check API configuration.',
      suggestions: [] 
    });
  }
});

// Global error handler
app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
  console.error("Global error handler caught:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ error: message });
});

// Register API routes - this is important for serverless
registerRoutes(app).catch(error => {
  console.error("Failed to register routes:", error);
});

// Only start the server in non-serverless environments
if (process.env.NODE_ENV !== "serverless") {
  // Create HTTP server
  const server = http.createServer(app);

  // Enable WebSocket support (only in non-serverless mode)
  const wss = new WebSocketServer({ 
    server,
    path: '/ws' // Specify a distinct path for your WebSocket server
  });

  wss.on('connection', (ws) => {
    console.log('WebSocket client connected');
    
    ws.on('message', (message) => {
      console.log('Received:', message);
    });
    
    ws.on('close', () => {
      console.log('WebSocket client disconnected');
    });
  });

  // Setup routes and start server
  async function main() {
    try {
      // Set up Vite in development mode
      if (process.env.NODE_ENV === "development") {
        await setupVite(app, server);
      } else {
        // Serve static files in production
        serveStatic(app);
      }

      // Start the server
      const port = process.env.PORT || 3001;
      const host = '0.0.0.0';
      server.listen(parseInt(port.toString()), host, () => {
        console.log(`Server listening on ${host}:${port}`);
      });
    } catch (error) {
      console.error("Failed to start server:", error);
      process.exit(1);
    }
  }

  main();
}
