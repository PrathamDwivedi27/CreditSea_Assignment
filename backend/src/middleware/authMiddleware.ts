import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../config/server-config";

// Extend Express Request type to include user
export interface AuthRequest extends Request {
  user?: {
    userId: string;
    role: string;
  };
}

const authMiddleware = (req: AuthRequest, res: Response, next: NextFunction): void => {
  try {
    const token = req.header("Authorization")?.replace("Bearer ", "");

    if (!token) {
      res.status(401).json({ message: "Access Denied. No token provided." });
      return; 
    }

    const decoded = jwt.verify(token, JWT_SECRET as string) as unknown as { userId: string; role: string };
    req.user = decoded; 

    next(); 
  } catch (error) {
    res.status(401).json({ message: "Invalid token." });
    return;
  }
};

export default authMiddleware;
