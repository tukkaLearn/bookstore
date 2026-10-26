import jwt from "jsonwebtoken";

export const generateToken = (res, reader_id, reader_user_name, isAdmin) => {
  const token = jwt.sign(
    { reader_id, reader_user_name, isAdmin },
    process.env.SECRETE_KEY,
    { expiresIn: "1d" },
  );

  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 24 * 60 * 60 * 1000,
  });
};

export const verifyToken = (token) => {
  return jwt.verify(token, process.env.SECRETE_KEY);
};
