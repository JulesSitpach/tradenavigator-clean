import { Request, Response, Express } from "express";
import { storage } from "../storage";
import { insertProductSchema, insertAnalysisSchema } from "../../shared/schema";
import { verifyToken } from "../middleware/auth";

export function setupAnalysisRoutes(app: Express) {
  // Product routes
  app.get("/api/products", verifyToken, getProducts);
  app.post("/api/products", verifyToken, createProduct);
  app.get("/api/products/:id", verifyToken, getProductById);
  app.put("/api/products/:id", verifyToken, updateProduct);
  app.delete("/api/products/:id", verifyToken, deleteProduct);
  
  // Analysis routes
  app.get("/api/analyses", verifyToken, getAnalyses);
  app.post("/api/analyses", verifyToken, createAnalysis);
  app.get("/api/analyses/:id", verifyToken, getAnalysisById);
  app.delete("/api/analyses/:id", verifyToken, deleteAnalysis);
  
  // Compliance requirements routes
  app.get("/api/compliance", verifyToken, getComplianceRequirements);
  app.post("/api/compliance", verifyToken, createComplianceRequirement);
  app.put("/api/compliance/:id", verifyToken, updateComplianceRequirement);
  
  // External services routes
  app.get("/api/tariff", verifyToken, getTariffRate);
  app.get("/api/hsCode/suggest", verifyToken, getHSCodeSuggestions);
  app.post("/api/hs-code-suggestions", getAIHSCodeSuggestions);
  app.post("/api/shipping/estimate", verifyToken, getShippingEstimates);
  app.post("/api/currency/convert", verifyToken, convertCurrency);
  app.get("/api/currency/list", verifyToken, getCurrencies);
}

// Product controllers
export const getProducts = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const products = await storage.getProductsByUser(req.user.id);
    res.status(200).json(products);
  } catch (error) {
    console.error("Get products error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Validate request body
    const validatedData = insertProductSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ error: validatedData.error.format() });
    }
    
    // Create product with user ID
    const product = await storage.createProduct({
      ...validatedData.data,
      userId: req.user.id
    });
    
    res.status(201).json(product);
  } catch (error) {
    console.error("Create product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProductById = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    const product = await storage.getProduct(productId);
    
    if (!product) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    // Ensure user owns the product
    if (product.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    res.status(200).json(product);
  } catch (error) {
    console.error("Get product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    // Check if product exists and belongs to user
    const existingProduct = await storage.getProduct(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    if (existingProduct.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    // Update product
    const updatedProduct = await storage.updateProduct(productId, req.body);
    
    res.status(200).json(updatedProduct);
  } catch (error) {
    console.error("Update product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteProduct = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const productId = parseInt(req.params.id);
    if (isNaN(productId)) {
      return res.status(400).json({ error: "Invalid product ID" });
    }
    
    // Check if product exists and belongs to user
    const existingProduct = await storage.getProduct(productId);
    if (!existingProduct) {
      return res.status(404).json({ error: "Product not found" });
    }
    
    if (existingProduct.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    // Delete product
    const success = await storage.deleteProduct(productId);
    
    if (success) {
      res.status(200).json({ message: "Product deleted successfully" });
    } else {
      res.status(500).json({ error: "Failed to delete product" });
    }
  } catch (error) {
    console.error("Delete product error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Analysis controllers
export const getAnalyses = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Check if filtering by type
    const type = req.query.type as string;
    
    let analyses;
    if (type) {
      analyses = await storage.getAnalysesByType(req.user.id, type);
    } else {
      analyses = await storage.getAnalysesByUser(req.user.id);
    }
    
    res.status(200).json(analyses);
  } catch (error) {
    console.error("Get analyses error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createAnalysis = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Validate request body
    const validatedData = insertAnalysisSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ error: validatedData.error.format() });
    }
    
    // Create analysis with user ID
    const analysis = await storage.createAnalysis({
      ...validatedData.data,
      userId: req.user.id
    });
    
    res.status(201).json(analysis);
  } catch (error) {
    console.error("Create analysis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getAnalysisById = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const analysisId = parseInt(req.params.id);
    if (isNaN(analysisId)) {
      return res.status(400).json({ error: "Invalid analysis ID" });
    }
    
    const analysis = await storage.getAnalysis(analysisId);
    
    if (!analysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }
    
    // Ensure user owns the analysis
    if (analysis.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    res.status(200).json(analysis);
  } catch (error) {
    console.error("Get analysis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteAnalysis = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const analysisId = parseInt(req.params.id);
    if (isNaN(analysisId)) {
      return res.status(400).json({ error: "Invalid analysis ID" });
    }
    
    // Check if analysis exists and belongs to user
    const existingAnalysis = await storage.getAnalysis(analysisId);
    if (!existingAnalysis) {
      return res.status(404).json({ error: "Analysis not found" });
    }
    
    if (existingAnalysis.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    // Delete analysis
    const success = await storage.deleteAnalysis(analysisId);
    
    if (success) {
      res.status(200).json({ message: "Analysis deleted successfully" });
    } else {
      res.status(500).json({ error: "Failed to delete analysis" });
    }
  } catch (error) {
    console.error("Delete analysis error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Compliance Requirements controllers
export const getComplianceRequirements = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const requirements = await storage.getComplianceRequirementsByUser(req.user.id);
    res.status(200).json(requirements);
  } catch (error) {
    console.error("Get compliance requirements error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const createComplianceRequirement = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    // Create compliance requirement
    const requirement = await storage.createComplianceRequirement({
      ...req.body,
      userId: req.user.id
    });
    
    res.status(201).json(requirement);
  } catch (error) {
    console.error("Create compliance requirement error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateComplianceRequirement = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const requirementId = parseInt(req.params.id);
    if (isNaN(requirementId)) {
      return res.status(400).json({ error: "Invalid requirement ID" });
    }
    
    // Check if requirement exists and belongs to user
    const existingRequirement = await storage.getComplianceRequirement(requirementId);
    if (!existingRequirement) {
      return res.status(404).json({ error: "Requirement not found" });
    }
    
    if (existingRequirement.userId !== req.user.id) {
      return res.status(403).json({ error: "Access denied" });
    }
    
    // Update requirement
    const updatedRequirement = await storage.updateComplianceRequirement(requirementId, req.body);
    
    res.status(200).json(updatedRequirement);
  } catch (error) {
    console.error("Update compliance requirement error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

// AI-powered HS Code suggestions using OpenAI
export const getAIHSCodeSuggestions = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const { productName, productDescription } = req.body;
    
    if (!productName || !productDescription) {
      return res.status(400).json({ error: "Product name and description are required" });
    }

    // Use OpenRouter to generate intelligent HS code suggestions
    const OpenAI = require('openai');
    const openai = new OpenAI({ 
      apiKey: process.env.OPENAI_API_KEY,
      baseURL: "https://openrouter.ai/api/v1"
    });

    const prompt = `As an international trade expert, analyze this product and suggest the most accurate HS codes:

Product Name: ${productName}
Product Description: ${productDescription}

Please provide 2-3 most likely HS codes in JSON format with the following structure:
{
  "suggestions": [
    {
      "code": "8518.30.10",
      "description": "Detailed HS code description",
      "confidence": 0.95,
      "reasoning": "Brief explanation of why this code fits"
    }
  ]
}

Focus on accuracy and provide confidence scores between 0.1 and 1.0 based on how well the product matches the HS code classification.`;

    const response = await openai.chat.completions.create({
      model: "openai/gpt-4o", // OpenRouter format for GPT-4o
      messages: [
        {
          role: "system",
          content: "You are an expert in international trade classification and HS codes. Respond only with valid JSON."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      response_format: { type: "json_object" },
      max_tokens: 1000
    });

    const aiResult = JSON.parse(response.choices[0].message.content);
    
    res.status(200).json(aiResult);
  } catch (error) {
    console.error("AI HS Code suggestion error:", error);
    res.status(500).json({ 
      error: "Failed to get AI suggestions",
      suggestions: []
    });
  }
};

// External service mock endpoints
export const getTariffRate = async (req: Request, res: Response) => {
  try {
    // Mock tariff data for demonstration
    const hsCode = req.query.hsCode as string;
    const origin = req.query.origin as string;
    const destination = req.query.destination as string;
    
    if (!hsCode || !origin || !destination) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    
    // Mock tariff response
    const tariffData = {
      hsCode,
      description: "Sample product description for " + hsCode,
      baseRate: Math.random() * 10,
      preferentialRates: [
        {
          program: "Free Trade Agreement",
          rate: Math.random() * 5,
          requirements: ["Certificate of Origin", "Direct Shipment"]
        },
        {
          program: "GSP",
          rate: Math.random() * 2,
          requirements: ["GSP Form A", "35% Value Addition"]
        }
      ]
    };
    
    res.status(200).json(tariffData);
  } catch (error) {
    console.error("Get tariff rate error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getHSCodeSuggestions = async (req: Request, res: Response) => {
  try {
    const description = req.query.description as string;
    
    if (!description) {
      return res.status(400).json({ error: "Missing product description" });
    }
    
    // Mock HS code suggestions
    const suggestions = [
      {
        hsCode: "8471.30.00",
        description: "Portable computers weighing not more than 10 kg",
        confidence: 0.92
      },
      {
        hsCode: "8471.41.00",
        description: "Other computers comprising a CPU and input/output units",
        confidence: 0.85
      },
      {
        hsCode: "8473.30.00",
        description: "Parts and accessories for computers",
        confidence: 0.78
      }
    ];
    
    res.status(200).json(suggestions);
  } catch (error) {
    console.error("Get HS code suggestions error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getShippingEstimates = async (req: Request, res: Response) => {
  try {
    // Mock shipping estimates based on request body
    const shippingParams = req.body;
    
    // Mock shipping options
    const shippingOptions = [
      {
        carrier: "Express Logistics",
        service: "Priority Express",
        estimatedDays: 3,
        cost: 1250.00,
        currency: "USD",
        riskLevel: "low"
      },
      {
        carrier: "Global Freight",
        service: "Standard Air",
        estimatedDays: 7,
        cost: 875.50,
        currency: "USD",
        riskLevel: "low"
      },
      {
        carrier: "Ocean Transit",
        service: "Container Shipping",
        estimatedDays: 30,
        cost: 450.75,
        currency: "USD",
        riskLevel: "medium"
      }
    ];
    
    res.status(200).json(shippingOptions);
  } catch (error) {
    console.error("Get shipping estimates error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const convertCurrency = async (req: Request, res: Response) => {
  try {
    const { from, to, amount } = req.body;
    
    if (!from || !to || !amount) {
      return res.status(400).json({ error: "Missing required parameters" });
    }
    
    // Mock exchange rate calculation
    const mockRates: {[key: string]: number} = {
      "USD": 1.0,
      "EUR": 0.85,
      "GBP": 0.75,
      "JPY": 110.15,
      "CNY": 6.45,
      "CAD": 1.25,
      "AUD": 1.35,
      "INR": 74.50
    };
    
    const fromRate = mockRates[from] || 1;
    const toRate = mockRates[to] || 1;
    
    const convertedAmount = (amount / fromRate) * toRate;
    
    res.status(200).json({
      from,
      to,
      amount,
      result: parseFloat(convertedAmount.toFixed(2)),
      rate: parseFloat((toRate / fromRate).toFixed(4)),
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Currency conversion error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getCurrencies = async (req: Request, res: Response) => {
  try {
    // Mock list of supported currencies
    const currencies = [
      "USD", "EUR", "GBP", "JPY", "CNY", "CAD", "AUD", "INR", 
      "SGD", "HKD", "CHF", "ZAR", "NZD", "MXN", "BRL", "SEK"
    ];
    
    res.status(200).json(currencies);
  } catch (error) {
    console.error("Get currencies error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};