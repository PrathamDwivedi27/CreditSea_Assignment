import Router from "express";
import { getAllApplications, verifyApplication, rejectApplication } from "../../controller/verifierController";
import authMiddleware from "../../middleware/authMiddleware";
import roleMiddleware from "../../middleware/roleMiddleware";

const router = Router();


router.get("/verifier", authMiddleware, roleMiddleware("VERIFIER"), getAllApplications);


router.put("/verifier/verify/:id", authMiddleware, roleMiddleware("VERIFIER"), verifyApplication);


router.put("/verifier/reject/:id", authMiddleware, roleMiddleware("VERIFIER"), rejectApplication);

export default router;
