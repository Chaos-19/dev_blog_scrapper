import express, { Request, Response } from "express";

import {
  registerUser,
  updateUserPreferce,
} from "../controllers/userController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/updatePreferences", updateUserPreferce);

export default router;
