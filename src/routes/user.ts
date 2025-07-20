import { Router } from "express";
import { registerUser } from "../controllers/userController.js";

const router = Router();

// User registration route
router.post("/api/auth/register", registerUser);

export default router;
