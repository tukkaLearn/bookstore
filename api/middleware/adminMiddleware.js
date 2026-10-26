import { verifyToken } from "../lib/jwt.js";

export const adminMiddleware = (req, res, next) => {
  try {
    const token = req.cookies.access_token;

    if (!token) {
      return res.status(401).json({
        error: "Authentication required",
      });
    }

    const decoded = verifyToken(token);
    if (decoded.isAdmin !== true) {
      return res.status(403).json({
        error: "You Are Not Authorize",
      });
    }
    req.reader = decoded;
    next();
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({
        error: "Session expired",
      });
    }

    return res.status(401).json({
      error: "Invalid authentication token",
    });
  }
};
