import { makePool } from "../utils/connectDB.js";

const isValidId = (id) =>
  /^\d+$/.test(String(id)) &&
  Number.isSafeInteger(Number(id)) &&
  Number(id) > 0;

export const getAllBooks = async (req, res) => {
  try {
    const [books] = await makePool().execute(`
      SELECT *
      FROM book_stores
      ORDER BY created_at DESC
    `);

    return res.status(200).json({ data: books });
  } catch (error) {
    console.error("getAllBooks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getBookById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const [books] = await makePool().execute(
      "SELECT * FROM book_stores WHERE book_id = ?",
      [Number(id)],
    );

    if (books.length === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json({ data: books[0] });
  } catch (error) {
    console.error("getBookById:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const createBook = async (req, res) => {
  try {
    const {
      book_name,
      book_author,
      book_image,
      book_price,
      book_description,
      book_rating,
    } = req.body;

    if (
      typeof book_name !== "string" ||
      !book_name.trim() ||
      book_name.trim().length > 20
    ) {
      return res.status(400).json({
        error: "Book name is required and must not exceed 20 characters",
      });
    }

    if (
      book_price === undefined ||
      !Number.isInteger(Number(book_price)) ||
      Number(book_price) < 0
    ) {
      return res.status(400).json({
        error: "Book price must be a non-negative integer",
      });
    }

    if (
      book_author != null &&
      (typeof book_author !== "string" || book_author.length > 20)
    ) {
      return res.status(400).json({ error: "Invalid book author" });
    }

    if (
      book_rating !== undefined &&
      (!Number.isFinite(Number(book_rating)) ||
        Number(book_rating) < 0 ||
        Number(book_rating) > 5)
    ) {
      return res.status(400).json({
        error: "Book rating must be between 0 and 5",
      });
    }

    const [result] = await makePool().execute(
      `INSERT INTO book_stores
        (book_name, book_author, book_image, book_price,
         book_description, book_rating)
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        book_name.trim(),
        book_author ?? null,
        book_image ?? null,
        Number(book_price),
        book_description ?? null,
        book_rating === undefined ? 0 : Number(book_rating),
      ],
    );

    return res.status(201).json({
      message: "Book created successfully",
      data: { book_id: result.insertId },
    });
  } catch (error) {
    console.error("createBook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const updateBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const allowedFields = [
      "book_name",
      "book_author",
      "book_image",
      "book_price",
      "book_description",
      "book_rating",
    ];

    const updates = [];
    const values = [];

    for (const field of allowedFields) {
      if (!Object.hasOwn(req.body, field)) continue;

      const value = req.body[field];

      if (field === "book_name") {
        if (
          typeof value !== "string" ||
          !value.trim() ||
          value.trim().length > 20
        ) {
          return res.status(400).json({ error: "Invalid book name" });
        }
        updates.push(`${field} = ?`);
        values.push(value.trim());
      } else if (field === "book_price") {
        if (
          !Number.isInteger(Number(value)) ||
          Number(value) < 0 ||
          value === null ||
          value === ""
        ) {
          return res.status(400).json({ error: "Invalid book price" });
        }
        updates.push(`${field} = ?`);
        values.push(Number(value));
      } else if (field === "book_rating") {
        if (
          value === null ||
          value === "" ||
          !Number.isFinite(Number(value)) ||
          Number(value) < 0 ||
          Number(value) > 5
        ) {
          return res.status(400).json({
            error: "Book rating must be between 0 and 5",
          });
        }
        updates.push(`${field} = ?`);
        values.push(Number(value));
      } else {
        if (value !== null && typeof value !== "string") {
          return res.status(400).json({ error: `Invalid ${field}` });
        }
        if (field === "book_author" && value?.length > 20) {
          return res.status(400).json({ error: "Author name is too long" });
        }
        updates.push(`${field} = ?`);
        values.push(value);
      }
    }

    if (updates.length === 0) {
      return res.status(400).json({
        error: "Provide at least one field to update",
      });
    }

    values.push(Number(id));

    const [result] = await makePool().execute(
      `UPDATE book_stores SET ${updates.join(", ")} WHERE book_id = ?`,
      values,
    );

    if (result.affectedRows === 0) {
      const [existing] = await makePool().execute(
        "SELECT book_id FROM book_stores WHERE book_id = ?",
        [Number(id)],
      );

      if (existing.length === 0) {
        return res.status(404).json({ error: "Book not found" });
      }
    }

    return res.status(200).json({
      message: "Book updated successfully",
    });
  } catch (error) {
    console.error("updateBook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const deleteBook = async (req, res) => {
  try {
    const { id } = req.params;

    if (!isValidId(id)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const [result] = await makePool().execute(
      "DELETE FROM book_stores WHERE book_id = ?",
      [Number(id)],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Book not found" });
    }

    return res.status(200).json({
      message: "Book deleted successfully",
    });
  } catch (error) {
    if (error.code === "ER_ROW_IS_REFERENCED_2") {
      return res.status(409).json({
        error: "Cannot delete this book while readers or comments reference it",
      });
    }

    console.error("deleteBook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// Save a book to the logged-in reader's collection.
export const saveBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!isValidId(bookId)) {
      return res.status(400).json({ error: "Invalid book ID" });
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
      `INSERT IGNORE INTO reader_saved_books (reader_id, book_id)
       VALUES (?, ?)`,
      [req.reader.reader_id, Number(bookId)],
    );

    return res.status(result.affectedRows ? 201 : 200).json({
      message: result.affectedRows
        ? "Book saved successfully"
        : "Book is already saved",
    });
  } catch (error) {
    console.error("saveBook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const getSavedBooks = async (req, res) => {
  try {
    const [books] = await makePool().execute(
      `SELECT b.*, s.created_at AS saved_at
       FROM reader_saved_books s
       JOIN book_stores b ON b.book_id = s.book_id
       WHERE s.reader_id = ?
       ORDER BY s.created_at DESC`,
      [req.reader.reader_id],
    );

    return res.status(200).json({ data: books });
  } catch (error) {
    console.error("getSavedBooks:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};

export const removeSavedBook = async (req, res) => {
  try {
    const { bookId } = req.params;

    if (!isValidId(bookId)) {
      return res.status(400).json({ error: "Invalid book ID" });
    }

    const [result] = await makePool().execute(
      `DELETE FROM reader_saved_books
       WHERE reader_id = ? AND book_id = ?`,
      [req.reader.reader_id, Number(bookId)],
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: "Saved book not found" });
    }

    return res.status(200).json({
      message: "Saved book removed successfully",
    });
  } catch (error) {
    console.error("removeSavedBook:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
};
