import express from "express";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.js";
import {
  createBooking,
  cancelBooking,
  getUserBookings,
  getAllBookings,
  updateBooking,
} from "../controllers/booking.controller.js";
import { requireEmailVerified } from "../middleware/requireEmailVerified.js";

const router = express.Router();

// ================= USER =================
router.post("/", protect, requireEmailVerified, createBooking);
router.get("/my", protect, getUserBookings);
router.put("/:id/cancel", protect, cancelBooking);

// ================= ADMIN =================
router.get("/admin", protect, adminOnly, getAllBookings);
router.put("/:id", protect, adminOnly, updateBooking);

export default router;
