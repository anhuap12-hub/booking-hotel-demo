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
router.get("/:id", getBookingById);
router.post("/rooms/:roomId/check-availability", checkAvailability);
router.get("/:id/status", getBookingStatus);
// ================= USER =================
router.post("/", protect, requireEmailVerified, createBooking);
router.get("/my", protect, getUserBookings);
router.put("/:id/cancel", protect, cancelBooking);

// ================= ADMIN =================
router.get("/admin", protect, adminOnly, getAllBookings);
router.put("/:id", protect, adminOnly, updateBooking);


export default router;
