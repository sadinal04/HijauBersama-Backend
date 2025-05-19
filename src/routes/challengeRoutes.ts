import express from "express";
import {
  getChallenges,
  addChallenge,
  updateChallenge,
  deleteChallenge,
} from "../controllers/challengeController";

const router = express.Router();

router.get("/", getChallenges);
router.post("/", addChallenge);
router.put("/:id", updateChallenge);
router.delete("/:id", deleteChallenge);

export default router;
