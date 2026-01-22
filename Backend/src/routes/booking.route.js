import express from "express";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.js";
import {
  createBooking,
  cancelBooking,
  getUserBookings,
  getAllBookings,
  updateBooking,
  getBookingStatus,
  checkAvailability,
  getBookingById
} from "../controllers/booking.controller.js";
import { requireEmailVerified } from "../middleware/requireEmailVerified.js";

const router = express.Router();

// 1. Các route kiểm tra (Ưu tiên lên đầu)
router.post("/rooms/:roomId/check-availability", checkAvailability);
router.get("/:id/status", getBookingStatus); // Đưa status lên trước :id chung chung

// 2. Route lấy chi tiết
router.get("/:id", getBookingById); 

// ================= USER =================
router.post("/", protect, requireEmailVerified, createBooking);
router.get("/my", protect, getUserBookings);
router.put("/:id/cancel", protect, cancelBooking);

// ================= ADMIN =================
router.get("/admin", protect, adminOnly, getAllBookings);
router.put("/:id", protect, adminOnly, updateBooking);

export default router;
