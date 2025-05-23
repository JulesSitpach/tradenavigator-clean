import { Request, Response, Express } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { storage } from "../storage";
import { loginSchema, registerSchema } from "../../shared/schema";
import { verifyToken } from "../middleware/auth";

const JWT_SECRET = process.env.JWT_SECRET || "tradenavigator-secret-key";

export function setupAuthRoutes(app: Express) {
  // Register new user
  app.post("/api/auth/register", register);
  
  // Login user
  app.post("/api/auth/login", login);
  
  // Get current user profile
  app.get("/api/auth/profile", verifyToken, getProfile);
  
  // Update user profile
  app.put("/api/auth/profile", verifyToken, updateProfile);
}

export const register = async (req: Request, res: Response) => {
  try {
    // Validate request body against schema
    const validatedData = registerSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      return res.status(400).json({ error: validatedData.error.format() });
    }
    
    const { email, password, companyName, industry, confirmPassword, ...rest } = validatedData.data;
    
    // Check if user already exists
    const existingUser = await storage.getUserByEmail(email);
    if (existingUser) {
      return res.status(409).json({ error: "User with this email already exists" });
    }
    
    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    
    // Create user
    const newUser = await storage.createUser({
      email,
      password: hashedPassword,
      companyName,
      industry,
      ...rest
    });
    
    // Generate JWT token
    const token = jwt.sign(
      { id: newUser.id, email: newUser.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = newUser;
    
    res.status(201).json({
      message: "User registered successfully",
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    console.log("Login attempt received:", req.body);
    
    // Validate request body
    const validatedData = loginSchema.safeParse(req.body);
    
    if (!validatedData.success) {
      console.log("Login validation failed:", validatedData.error.format());
      return res.status(400).json({ error: validatedData.error.format() });
    }
    
    const { email, password } = validatedData.data;
    console.log("Attempting login for email:", email);
    
    // Check if user exists
    const user = await storage.getUserByEmail(email);
    if (!user) {
      console.log("User not found for email:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    console.log("User found, verifying password");
    
    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      console.log("Password validation failed for user:", email);
      return res.status(401).json({ error: "Invalid email or password" });
    }
    
    console.log("Password verified, generating token");
    
    // Generate JWT token
    const token = jwt.sign(
      { id: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
    
    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;
    
    console.log("Login successful for user:", email);
    
    res.status(200).json({
      message: "Login successful",
      user: userWithoutPassword,
      token
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const getProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = user;
    
    res.status(200).json(userWithoutPassword);
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

export const updateProfile = async (req: Request, res: Response) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ error: "Unauthorized" });
    }
    
    const user = await storage.getUser(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    
    // Validate and update fields
    const updatedUser = await storage.updateUser(req.user.id, req.body);
    if (!updatedUser) {
      return res.status(404).json({ error: "Failed to update user" });
    }
    
    // Remove password from response
    const { password, ...userWithoutPassword } = updatedUser;
    
    res.status(200).json({
      message: "Profile updated successfully",
      user: userWithoutPassword
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};