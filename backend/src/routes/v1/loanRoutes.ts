import Router from "express";
import authMiddleware from "../../middleware/authMiddleware";
import roleMiddleware from "../../middleware/roleMiddleware";
import { approveAndCreateLoan, getLoanDetails, getLoanStatistics, getUserLoans, getUserTotalLoanAmount } from "../../controller/loan-controller";


const router = Router();

// Helper to wrap async route handlers
const asyncHandler = (fn: any) => (req: any, res: any, next: any) => {
	Promise.resolve(fn(req, res, next)).catch(next);
};

router.post("/loan/approve/:appId", authMiddleware, roleMiddleware("ADMIN"), asyncHandler(approveAndCreateLoan));

router.get("/loan/user", authMiddleware, roleMiddleware("USER"),asyncHandler(getUserLoans));

router.get("/loan/get-total", authMiddleware, asyncHandler(getUserTotalLoanAmount));

router.get("/loan/get-stats",asyncHandler(getLoanStatistics));

router.get("/loan/:loanId", authMiddleware, asyncHandler(getLoanDetails));




export default router;
