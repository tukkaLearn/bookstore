import express from "express";
import {
  deleteReaderById,
  getReaderById,
  updateReaderById,
} from "../controllers/readerAdminControllers.js";
import { authenticateReader } from "../middleware/authMiddleware.js";

const router = express.Router();
router.get("/", authenticateReader, getReaderById);
router.put("/", authenticateReader, updateReaderById);
router.delete("/", authenticateReader, deleteReaderById);

export default router;
