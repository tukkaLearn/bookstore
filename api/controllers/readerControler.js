import { encryptPass } from "../lib/bcrypt.js";
import { makePool } from "../utils/connectDB.js";

export const getAllStores = async (req, res) => {
  try {
    const q = `
      SELECT *
      FROM book_stores
    `;

    const [result] = await makePool().execute(q);

    return res.status(200).json({
      data: result,
    });
  } catch (error) {
    console.error("getAllStores:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const getReaderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        error: "Invalid reader ID",
      });
    }

    const q = `
      SELECT *
      FROM book_readers
      WHERE reader_id = ?
    `;

    const [result] = await makePool().execute(q, [Number(id)]);

    if (result.length === 0) {
      return res.status(404).json({
        error: "Reader not found",
      });
    }

    const { reader_password, ...info } = result[0];

    return res.status(200).json({
      data: info,
    });
  } catch (error) {
    console.error("getReaderById:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const createReader = async (req, res) => {
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

export const deleteReaderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        error: "Invalid reader ID",
      });
    }

    const q = `
      DELETE FROM book_readers
      WHERE reader_id = ?
    `;

    const [result] = await makePool().execute(q, [Number(id)]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        error: "Reader not found",
      });
    }

    return res.status(200).json({
      message: "Reader deleted successfully",
    });
  } catch (error) {
    console.error("deleteReader:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};

export const updateReaderById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || !Number.isInteger(Number(id))) {
      return res.status(400).json({
        error: "Invalid reader ID",
      });
    }

    const {
      reader_user_name,
      reader_password,
      reader_name,
      reader_location,
      reader_avatar,
      book_id,
    } = req.body;

    const checkQuery = `
      SELECT reader_id
      FROM book_readers
      WHERE reader_id = ?
    `;

    const [reader] = await makePool().execute(checkQuery, [Number(id)]);

    if (reader.length === 0) {
      return res.status(404).json({
        error: "Reader not found",
      });
    }

    if (reader_user_name !== undefined) {
      if (!reader_user_name || reader_user_name.length > 10) {
        return res.status(400).json({
          error: "Invalid username",
        });
      }

      const usernameQuery = `
        SELECT reader_id
        FROM book_readers
        WHERE reader_user_name = ?
        AND reader_id != ?
      `;

      const [existingUsername] = await makePool().execute(usernameQuery, [
        reader_user_name,
        Number(id),
      ]);

      if (existingUsername.length > 0) {
        return res.status(409).json({
          error: "Username already exists",
        });
      }
    }

    if (reader_password !== undefined && reader_password.length > 20) {
      return res.status(400).json({
        error: "Password must not exceed 20 characters",
      });
    }

    if (
      reader_name !== undefined &&
      (!reader_name || reader_name.length > 20)
    ) {
      return res.status(400).json({
        error: "Invalid reader name",
      });
    }

    const q = `
      UPDATE book_readers
      SET
        reader_user_name = COALESCE(?, reader_user_name),
        reader_password = COALESCE(?, reader_password),
        reader_name = COALESCE(?, reader_name),
        reader_location = COALESCE(?, reader_location),
        reader_avatar = COALESCE(?, reader_avatar),
        book_id = COALESCE(?, book_id)
      WHERE reader_id = ?
    `;
    const hashPassword = encryptPass(hashPassword);

    const [result] = await makePool().execute(q, [
      reader_user_name ?? null,
      hashPassword ?? null,
      reader_name ?? null,
      reader_location ?? null,
      reader_avatar ?? null,
      book_id ?? null,
      Number(id),
    ]);

    return res.status(200).json({
      message: "Reader updated successfully",
      data: {
        reader_id: Number(id),
      },
    });
  } catch (error) {
    console.error("updateReader:", error);

    return res.status(500).json({
      error: "Internal server error",
    });
  }
};
