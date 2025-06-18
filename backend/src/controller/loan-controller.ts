// src/controllers/loanController.ts
import { Request, Response, NextFunction } from "express";
import logger from "../utils/logger";
import LoanService from "../service/loan-service";

const loanService = new LoanService();

const approveAndCreateLoan = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { appId } = req.params;
    const adminId = (req as any).user?.userId;

    if (!adminId) return res.status(401).json({ message: "Unauthorized" });

    const service = req.app.get("loanService") as LoanService;
    const loan = await service.approveAndCreateLoan(appId, adminId);

    res.status(201).json({ message: "Loan Approved & Created", loan });
  } catch (error) {
    logger.error("approveAndCreateLoan failed", error);
    next(error);
  }
};

const getLoanDetails = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { loanId } = req.params;
    const service = req.app.get("loanService") as LoanService;
    const loan = await service.getLoanDetails(loanId);

    if (!loan) return res.status(404).json({ message: "Loan not found" });
    res.status(200).json(loan);
  } catch (error) {
    logger.error("getLoanDetails failed", error);
    next(error);
  }
};

const getUserLoans = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const service = req.app.get("loanService") as LoanService;
    const loans = await service.getUserLoans(userId);

    if (!loans.length) return res.status(404).json({ message: "No loans found" });
    res.status(200).json({ message: "User loans fetched", loans });
  } catch (error) {
    logger.error("getUserLoans failed", error);
    next(error);
  }
};

const getUserTotalLoanAmount = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const userId = (req as any).user?.userId;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const service = req.app.get("loanService") as LoanService;
    const totalAmount = await service.getUserTotalLoan(userId);

    res.status(200).json({ message: "Total loan calculated", totalAmount });
  } catch (error) {
    logger.error("getUserTotalLoanAmount failed", error);
    next(error);
  }
};

const getLoanStatistics = async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const service = res.app.get("loanService") as LoanService;
    const stats = await service.getLoanStats();
    res.status(200).json({ message: "Statistics retrieved", ...stats });
  } catch (error) {
    logger.error("getLoanStatistics failed", error);
    next(error);
  }
};

export {
    approveAndCreateLoan,
    getLoanDetails,
    getUserLoans,
    getUserTotalLoanAmount,
    getLoanStatistics,
}
