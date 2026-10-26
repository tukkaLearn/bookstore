import express from "express";
import { loginReader,registerReader,logoutReader } from "../controllers/auth.js";

const router = express.Router();

router.post("/login", loginReader);
router.post("/register", registerReader);
router.post("/logout", logoutReader);

export default router;
