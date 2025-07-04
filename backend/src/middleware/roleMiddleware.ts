import { Response, NextFunction } from "express";
import { AuthRequest } from "../types/AuthRequest";

const roleMiddleware = (requiredRole: "SUPER_ADMIN" | "ADMIN" | "VERIFIER" | "USER") => {
  return (req: AuthRequest, res: Response, next: NextFunction): void => {
    if (!req.user?.role) {
      res.status(403).json({ message: "Forbidden: No role assigned" });
      return;
    }

    const role:"ADMIN" | "VERIFIER" | "USER" = req.user.role;
   
    if (requiredRole === "ADMIN" && role !== "ADMIN") {
      res.status(403).json({ message: "Forbidden: Admin access required" });
      return;
    }

    next();
  };
};

export default roleMiddleware;
