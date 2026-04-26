// src/routes/chat.route.js
import express from "express";
import { chatWithAI } from "../controllers/chat.controller.js";
import { protect } from "../middleware/auth.js";
import { requireEmailVerified } from "../middleware/requireEmailVerified.js";

const router = express.Router();

// Route chatbox: chỉ cho phép user đã đăng nhập và đã verify email
router.post("/", protect, requireEmailVerified, chatWithAI);

export default router;
