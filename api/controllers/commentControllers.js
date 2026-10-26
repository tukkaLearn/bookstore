import { makePool } from "../utils/connectDB.js";

const isValidId = (id) =>
  /^\d+$/.test(String(id)) &&
  Number.isSafeInteger(Number(id)) &&
  Number(id) > 0;

// Get all comments for a book
export const getCommentsByBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!isValidId(bookId)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const [comments] = await makePool().execute(
      `SELECT
         c.comment_id,
         c.reader_id,
         c.book_id,
         c.isAdmin,
         c.description,
         c.created_at,
         r.reader_user_name,
         r.reader_name,
         r.reader_avatar,
         r.reader_role
       FROM comments c
       JOIN book_readers r ON r.reader_id = c.reader_id
       WHERE c.book_id = ?
       ORDER BY c.created_at DESC`,
      [Number(bookId)],
    );

    return res.status(200).json({ data: comments });
  } catch (error) {
    console.error("getCommentsByBook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Add a comment to a book
export const createComment = async (req, res) => {
  try {
    const { bookId } = req.params;
    const { description } = req.body;

    if (!isValidId(bookId)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    if (
      typeof description !== "string" ||
      !description.trim() ||
      description.trim().length > 5000
    ) {
      return res.status(400).json({
        error: "Comment is required and must not exceed 5000 characters",
      });
    }

    const pool = makePool();

    const [books] = await pool.execute(
      "SELECT book_id FROM book_stores WHERE book_id = ?",
      [Number(bookId)],
    );

    if (books.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    const [result] = await pool.execute(
      `INSERT INTO comments
        (reader_id, book_id, isAdmin, description)
       VALUES (?, ?, ?, ?)`,
      [
        req.reader.reader_id,
        Number(bookId),
        req.reader.isAdmin === true ? "true" : "false",
        description.trim(),
      ],
    );

    return res.status(201).json({
      message: "Comment added successfully",
      data: { comment_id: result.insertId },
    });
  } catch (error) {
    console.error("createComment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Update a comment — author or admin
export const updateComment = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    if (
      typeof description !== "string" ||
      !description.trim() ||
      description.trim().length > 5000
    ) {
      return res.status(400).json({
        error: "Comment is required and must not exceed 5000 characters",
      });
    }

    const pool = makePool();

    const [comments] = await pool.execute(
      "SELECT comment_id, reader_id FROM comments WHERE comment_id = ?",
      [Number(id)],
    );

    if (comments.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = comments[0];
    const isOwner = Number(comment.reader_id) === Number(req.reader.reader_id);
    const isAdmin = req.reader.isAdmin === true;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: "You cannot edit this comment",
      });
    }

    await pool.execute(
      "UPDATE comments SET description = ? WHERE comment_id = ?",
      [description.trim(), Number(id)],
    );

    return res.status(200).json({
      message: "Comment updated successfully",
    });
  } catch (error) {
    console.error("updateComment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Delete a comment — author or admin
export const deleteComment = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid comment ID" });
    }

    const pool = makePool();

    const [comments] = await pool.execute(
      "SELECT comment_id, reader_id FROM comments WHERE comment_id = ?",
      [Number(id)],
    );

    if (comments.length === 0) {
      return res.status(404).json({ error: "Comment not found" });
    }

    const comment = comments[0];
    const isOwner = Number(comment.reader_id) === Number(req.reader.reader_id);
    const isAdmin = req.reader.isAdmin === true;

    if (!isOwner && !isAdmin) {
      return res.status(403).json({
        error: "You cannot delete this comment",
      });
    }

    await pool.execute("DELETE FROM comments WHERE comment_id = ?", [
      Number(id),
    ]);

    return res.status(200).json({
      message: "Comment deleted successfully",
    });
  } catch (error) {
    console.error("deleteComment:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
