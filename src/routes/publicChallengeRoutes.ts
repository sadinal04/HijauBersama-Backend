import express from "express";
import { getChallenges, getChallengeById } from "../controllers/challengeController";

const router = express.Router();

router.get("/", getChallenges); // Daftar tantangan
router.get("/:id", getChallengeById); // Detail tantangan berdasarkan ID

export default router;
