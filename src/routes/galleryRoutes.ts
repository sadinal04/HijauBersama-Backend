import express from "express";
import { authMiddleware } from "../middleware/auth";
import {
  getPosts,
  uploadPost,
  addComment,
  toggleLike,
  deletePost,
  getUserPosts,   // Import fungsi baru ini
} from "../controllers/galleryController";

const router = express.Router();

router.get("/", authMiddleware, getPosts);
router.get("/user", authMiddleware, getUserPosts);
router.post("/", authMiddleware, uploadPost);
router.post("/:postId/comments", authMiddleware, addComment);
router.put("/:postId/like", authMiddleware, toggleLike);
router.delete("/:postId", authMiddleware, deletePost);

export default router;
