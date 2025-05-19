import express from "express";
import { getPosts, addPost, addReply } from "../controllers/forumController";

const router = express.Router();

router.get("/", getPosts);
router.post("/", addPost);
router.post("/:postId/replies", addReply);

export default router;
