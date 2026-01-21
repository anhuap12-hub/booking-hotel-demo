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
  checkAvailability
} from "../controllers/booking.controller.js";
import { requireEmailVerified } from "../middleware/requireEmailVerified.js";

const router = express.Router();
router.post("/rooms/:roomId/check-availability", checkAvailability);
// ================= USER =================
router.post("/", protect, requireEmailVerified, createBooking);
router.get("/my", protect, getUserBookings);
router.put("/:id/cancel", protect, cancelBooking);
router.get("/:id/status", protect, getBookingStatus);

// ================= ADMIN =================
router.get("/admin", protect, adminOnly, getAllBookings);
router.put("/:id", protect, adminOnly, updateBooking);


export default router;
