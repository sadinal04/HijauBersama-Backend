// userRoutes.ts
import express from "express";
import { getProfile, updateProfile } from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);

export default router;
