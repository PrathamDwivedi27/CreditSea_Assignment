// --- FILE: src/controllers/adminController.ts ---
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import { AuthRequest } from "../types/AuthRequest";
import AdminService from "../service/admin-service";

const adminService= new AdminService();

export const getAllUsers = async (req: AuthRequest, res: Response) => {
  try {
    
    const users = await adminService.getAllUsers();
    res.status(200).json({ message: "All users retrieved", users });
  } catch (error) {
    logger.error("[AdminController] Error fetching users:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const getAllApplications = async (req: AuthRequest, res: Response) => {
  try {
    const applications = await adminService.getAllApplications();
    res.status(200).json({ message: "All applications retrieved", applications });
  } catch (error) {
    logger.error("[AdminController] Error fetching applications:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const approveApplication = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const adminId = req.user?.userId;

    if (!adminId) {
      logger.warn("[AdminController] Missing admin ID in request");
      res.status(401).json({ message: "Unauthorized: Admin ID is missing" });
      return;
    }

    await adminService.approveOrRejectApplication(id, status, adminId);

    res.status(200).json({ message: `Application ${status.toLowerCase()} successfully` });
  } catch (error) {
    logger.error(`[AdminController] Error processing application ${req.params.id}:`, error);
    next(error);
  }
};
