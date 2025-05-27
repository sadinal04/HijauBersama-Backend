import express from "express";
import { getProfile, updateProfile, getUserNotifications, markNotificationRead } from "../controllers/userController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.get("/profile", authMiddleware, getProfile);
router.put("/profile", authMiddleware, updateProfile);
router.get("/notifications", authMiddleware, getUserNotifications);
router.put("/notifications/:id/read", authMiddleware, markNotificationRead);


export default router;
