import { Router } from "express";
import authRoutes from "./v1/authRoutes";
import applicationRoutes from "./v1/applicationRoutes";
import adminRoutes from "./v1/adminRoutes";
import verifierRoutes from "./v1/verifierRoutes";
import loanRoutes from "./v1/loanRoutes";


const router = Router();

router.use("/v1", authRoutes);
router.use("/v1", applicationRoutes);
router.use("/v1", adminRoutes);
router.use("/v1", verifierRoutes);
router.use("/v1", loanRoutes);


export default router;