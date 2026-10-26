import cookieParser from "cookie-parser";
import cors from "cors";
import dotenv from "dotenv";
import express, { json } from "express";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import bookRoutes from "./routes/bookRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";
import readerRoutes from "./routes/readerRoutes.js";
import { connectDB } from "./utils/connectDB.js";

dotenv.config();
await connectDB();

const PORT = process.env.PORT || 80;

const app = express();
app.use(
  cors({
    origin: process.env.FRONT_URL,
    credentials: true,
  }),
);
app.use(json());
app.use(cookieParser());

app.get("/", (req, res) => {
  res.status(200).json("API IS RUNNING");
});

app.use("/readers", readerRoutes);
app.use("/auth", authRoutes);
app.use("/admin", adminRoutes);
app.use("/books", bookRoutes);
app.use("/comments", commentRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
});
