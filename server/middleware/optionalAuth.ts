import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// Optional authentication - allows both authenticated and guest users
export const optionalAuth = (req: Request, res: Response, next: NextFunction) => {
  console.log('🔓 Optional auth middleware checking...');
  
  const token = req.headers.authorization?.split(' ')[1];
  
  if (token) {
    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET!);
      (req as any).user = decoded;
      console.log('🔓 User authenticated:', (decoded as any).email || 'user');
    } catch (error) {
      console.log('🔓 Invalid token, continuing as guest');
      // Don't block - just continue without user
    }
  } else {
    console.log('🔓 No token provided, continuing as guest');
  }
  
  next();
};

// Log middleware for debugging API calls
export const logRequest = (req: Request, res: Response, next: NextFunction) => {
  console.log(`📡 ${req.method} ${req.path}`, {
    body: req.body,
    headers: {
      'content-type': req.headers['content-type'],
      'authorization': req.headers.authorization ? 'Bearer [REDACTED]' : 'none'
    }
  });
  next();
};
