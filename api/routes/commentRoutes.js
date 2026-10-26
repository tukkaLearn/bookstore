import express from "express";
import {
  createComment,
  deleteComment,
  getCommentsByBook,
  updateComment,
} from "../controllers/commentControllers.js";
import { authenticateReader } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public: fetch comments for a book
router.get("/book/:bookId", getCommentsByBook);

// Authenticated: add a comment
router.post("/book/:bookId", authenticateReader, createComment);

// Authenticated: author or admin permissions are checked in the controller
router.put("/:id", authenticateReader, updateComment);
router.delete("/:id", authenticateReader, deleteComment);

export default router;
