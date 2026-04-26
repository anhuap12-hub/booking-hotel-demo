// src/routes/recommend.route.js
import express from "express";
import { recommendHotels } from "../controllers/recommend.controller.js";
import { protect } from "../middleware/auth.js";
import { requireEmailVerified } from "../middleware/requireEmailVerified.js";

const router = express.Router();

// Route recommendation: chỉ cho phép user đã đăng nhập và verify email
router.get("/", protect, requireEmailVerified, recommendHotels);

export default router;
