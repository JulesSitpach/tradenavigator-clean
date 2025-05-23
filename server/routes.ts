import { Express } from "express";
import { Server } from "http";
import { setupAuthRoutes } from "./controllers/auth";
import { setupAnalysisRoutes } from "./controllers/analysis";
import { setupShippingRoutes } from "./controllers/shipping";
import { setupTradeDataRoutes } from "./controllers/tradeData";

export async function registerRoutes(app: Express): Promise<Express> {
  // Status route
  app.get("/api/status", (_, res) => {
    res.json({ status: "ok", version: "1.0.0" });
  });
  
  // Register authentication routes
  setupAuthRoutes(app);
  
  // Register analysis routes
  setupAnalysisRoutes(app);
  
  // Register shipping and tariff routes
  setupShippingRoutes(app);
  
  // Register real trade data routes for UN Comtrade
  setupTradeDataRoutes(app);
  
  // Handle all other routes for SPA support with hash router
  app.get('*', (req, res, next) => {
    // Skip API routes
    if (req.path.startsWith('/api')) {
      return next();
    }
    
    // Since we're using client-side hash routing with the HashRouter component,
    // we don't actually need to serve the HTML for all paths as the hash part
    // is processed entirely on the client. 
    // Just continue the middleware chain for non-API routes.
    next();
  });
  
  // AI-powered HS Code suggestions endpoint (NO AUTH)
  app.post('/api/hs-code-suggestions', async (req, res) => {
    console.log('🤖 HS Code request received:', req.body);
    
    try {
      const { productName, productDescription, productCategory } = req.body;
      
      if (!productName) {
        return res.status(400).json({ error: 'Product name required' });
      }

      // Use OpenRouter for authentic HS code suggestions
      const OpenAI = require('openai');
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

      const result = JSON.parse(response.choices[0].message.content);
      console.log('✅ AI HS code suggestions generated');
      res.json(result);
      
    } catch (error) {
      console.error('🚨 Error generating HS codes:', error);
      res.status(500).json({ 
        error: 'Unable to generate HS code suggestions. Please check API configuration.',
        suggestions: [] 
      });
    }
  });

  return app;
}