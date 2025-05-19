// routes/submissionRoutes.ts
import express from "express";
import { uploadSubmission, verifySubmission, getAllSubmissions, getSubmissionById } from "../controllers/submissionController";
import { authMiddleware } from "../middleware/auth";

const router = express.Router();

router.post("/", authMiddleware, uploadSubmission);
router.put("/verify/:id", verifySubmission);
router.get("/", getAllSubmissions);
router.get("/:id", authMiddleware, getSubmissionById);

export default router;
