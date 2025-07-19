import { Router } from "express";
import { registerUser } from "../controllers/userController";

const router = Router();

// User registration route
router.post("/api/auth/register", registerUser);

export default router;
