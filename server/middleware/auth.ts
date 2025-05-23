import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET || "tradenavigator-secret-key";

// Extend Express Request type to include user
declare global {
    namespace Express {
        interface Request {
            user?: {
                id: number;
                email: string;
            };
        }
    }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        
        if (!token) {
            return res.status(401).json({ error: "No authentication token provided" });
        }
        
        // Verify the token
        const decoded = jwt.verify(token, JWT_SECRET) as { id: number; email: string };
        
        // Add user to request object
        req.user = {
            id: decoded.id,
            email: decoded.email
        };
        
        next();
    } catch (error) {
        console.error("Token verification error:", error);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

export const generateToken = (user: { id: number; email: string }) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        JWT_SECRET,
        { expiresIn: "7d" }
    );
};