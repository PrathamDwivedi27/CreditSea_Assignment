import Router,{RequestHandler} from "express";
import { applyForLoan, getUser, getUserApplications } from "../../controller/applicationController";
import authMiddleware from "../../middleware/authMiddleware";

const router = Router();

router.post("/applications/apply", authMiddleware, applyForLoan as RequestHandler);
router.get("/applications/get-user", authMiddleware, getUser as RequestHandler);
router.get("/applications", authMiddleware, getUserApplications as RequestHandler);

export default router;
