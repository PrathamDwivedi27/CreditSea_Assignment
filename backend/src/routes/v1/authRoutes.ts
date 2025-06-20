import Router from "express";
import { register, login } from "../../controller/authController";

const router = Router();

router.post("/auth/register", register);
router.post("/auth/login", login);

export default router;
