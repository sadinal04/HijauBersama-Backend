import express from "express";
import {
  getAllEdukasi,
  createEdukasi,
  updateEdukasi,
  deleteEdukasi,
} from "../controllers/edukasiController";
import { adminAuthMiddleware } from "../middleware/adminAuth"; // middleware untuk cek token admin

const router = express.Router();

router.get("/", getAllEdukasi);
router.post("/", adminAuthMiddleware, createEdukasi);
router.put("/:id", adminAuthMiddleware, updateEdukasi);
router.delete("/:id", adminAuthMiddleware, deleteEdukasi);

export default router;
