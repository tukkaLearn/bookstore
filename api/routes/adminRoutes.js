import express from "express";
import {
  deleteReaderById,
  getAllReaders,
  getReaderById,
  updateReaderById,
} from "../controllers/adminControllers.js";
import { authenticateReader } from "../middleware/authMiddleware.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";

const router = express.Router();
router.get("/", adminMiddleware, getAllReaders);
router.get("/:id", adminMiddleware, getReaderById);
router.put("/:id", adminMiddleware, updateReaderById);
router.delete("/:id", adminMiddleware, deleteReaderById);

export default router;
