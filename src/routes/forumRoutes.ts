import express from "express";
import { getPosts, addPost, addReply } from "../controllers/forumController";
import { authMiddleware } from "../middleware/auth"; // import middleware auth

const router = express.Router();

router.get("/", getPosts);

// Tambahkan authMiddleware supaya cuma user login yang bisa post
router.post("/", authMiddleware, addPost);

// Tambahkan authMiddleware juga di route reply
router.post("/:postId/replies", authMiddleware, addReply);

export default router;
