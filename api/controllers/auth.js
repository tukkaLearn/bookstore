import { decryptPass, encryptPass } from "../lib/bcrypt.js";
import { generateToken } from "../lib/jwt.js";
import { makePool } from "../utils/connectDB.js";

export const loginReader = async (req, res) => {
  try {
    const { reader_user_name, reader_password } = req.body;

    if (
      typeof reader_user_name !== "string" ||
      !reader_user_name.trim() ||
      typeof reader_password !== "string" ||
      !reader_password
    ) {
      return res.status(400).json({
        error: "Username and password are required",
      });
    }

    const q = `
      SELECT
        reader_id,
        reader_user_name,
        reader_password,
        reader_name,
        reader_location,
        reader_avatar,
        book_id,
        reader_role
      FROM book_readers
      WHERE reader_user_name = ?
      LIMIT 1
    `;

    const [rows] = await makePool().execute(q, [reader_user_name.trim()]);

    if (rows.length === 0) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const reader = rows[0];

    const isValid = decryptPass(reader_password, reader.reader_password);

    if (!isValid) {
      return res.status(401).json({
        error: "Invalid username or password",
      });
    }

    const isAdmin = reader.reader_role === "admin";

    generateToken(res, reader.reader_id, reader.reader_user_name, isAdmin);

    return res.status(200).json({
      message: "Login successful",
      data: {
        reader_id: reader.reader_id,
        reader_user_name: reader.reader_user_name,
        reader_name: reader.reader_name,
        reader_location: reader.reader_location,
        reader_avatar: reader.reader_avatar,
        book_id: reader.book_id,
        reader_role: reader.reader_role,
      },
    });
  } catch (error) {
    console.error("loginReader:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const registerReader = async (req, res) => {
  try {
    const {
      reader_user_name,
      reader_password,
      reader_name,
      reader_location,
      reader_avatar,
      book_id,
    } = req.body;

    if (!reader_user_name || !reader_password || !reader_name) {
      return res.status(400).json({
        error: "Username, password and name are required",
      });
    }

    if (reader_user_name.length > 10) {
      return res.status(400).json({
        error: "Username must not exceed 10 characters",
      });
    }

    if (reader_password.length > 20) {
      return res.status(400).json({
        error: "Password must not exceed 20 characters",
      });
    }

    if (reader_name.length > 20) {
      return res.status(400).json({
        error: "Name must not exceed 20 characters",
      });
    }

    const checkQuery = `
      SELECT reader_id
      FROM book_readers
      WHERE reader_user_name = ?
    `;

    const [existingReader] = await makePool().execute(checkQuery, [
      reader_user_name,
    ]);

    if (existingReader.length > 0) {
      return res.status(409).json({
        error: "Username already exists",
      });
    }

    const hashPassword = encryptPass(reader_password);

    const q = `
      INSERT INTO book_readers (
        reader_user_name,
        reader_password,
        reader_name,
        reader_location,
        reader_avatar,
        book_id
      )
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const [result] = await makePool().execute(q, [
      reader_user_name,
      hashPassword,
      reader_name,
      reader_location || null,
      reader_avatar || null,
      book_id || null,
    ]);

    return res.status(201).json({
      message: "Reader created successfully",
      data: {
        reader_id: result.insertId,
        reader_user_name,
        reader_name,
        reader_location: reader_location || null,
        reader_avatar: reader_avatar || null,
        book_id: book_id || null,
      },
    });
  } catch (error) {
    console.error("createReader:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const logoutReader = async (req, res) => {
  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "lax",
  });

  return res.status(200).json({
    message: "Logout successful",
  });
};
