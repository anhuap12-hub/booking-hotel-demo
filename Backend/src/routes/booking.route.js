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
  getBookingById,
  requestRefund,
} from "../controllers/booking.controller.js";
import { requireEmailVerified } from "../middleware/requireEmailVerified.js";

const router = express.Router();

router.post("/rooms/:roomId/check-availability", checkAvailability);

router.get("/my", protect, getUserBookings);
router.get("/admin", protect, adminOnly, getAllBookings);

router.get("/:id/status", getBookingStatus); 
router.get("/:id", getBookingById); 

router.post("/", protect, requireEmailVerified, createBooking);
router.put("/:id/cancel", protect, cancelBooking);
router.put("/:id/request-refund", protect, requestRefund);
router.put("/:id", protect, adminOnly, updateBooking);

export default router;