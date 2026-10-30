import express from "express";
import {
  createBook,
  deleteBook,
  getAllBooks,
  getBookById,
  getSavedBooks,
  removeSavedBook,
  saveBook,
  updateBook,
} from "../controllers/bookControllers.js";
import { adminMiddleware } from "../middleware/adminMiddleware.js";
import { authenticateReader } from "../middleware/authMiddleware.js";

const router = express.Router();

router.get("/", getAllBooks);
router.get("/saved", authenticateReader, getSavedBooks);
router.get("/:id", getBookById);

router.post("/saved/:bookId", authenticateReader, saveBook);
router.delete("/saved/:bookId", authenticateReader, removeSavedBook);

// from books rotes

router.post("/", authenticateReader, adminMiddleware, createBook);
router.put("/:id", authenticateReader, adminMiddleware, updateBook);
router.delete("/:id", authenticateReader, adminMiddleware, deleteBook);

export default router;
