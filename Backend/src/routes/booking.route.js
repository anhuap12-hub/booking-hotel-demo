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
// Khách gửi yêu cầu (Cần auth khách hàng)
router.put("/:id/request-refund", protect, requestRefund);

// Admin xác nhận (Cần auth admin)
router.put("/admin/:id/confirm-refund", protect, adminOnly, confirmRefunded);
// ================= 1. CÁC ROUTE TĨNH (STATIC) =================
// Đưa các route không chứa tham số biến đổi (:id) lên trên cùng
router.post("/rooms/:roomId/check-availability", checkAvailability);
router.get("/my", protect, getUserBookings); // CHUYỂN LÊN ĐÂY
router.get("/admin", protect, adminOnly, getAllBookings); // CHUYỂN LÊN ĐÂY

// ================= 2. CÁC ROUTE ĐỘNG (DYNAMIC) =================
// Các route có ":id" phải nằm dưới các route tĩnh để tránh bị hiểu nhầm
router.get("/:id/status", getBookingStatus); 
router.get("/:id", getBookingById); 

// ================= 3. CÁC THAO TÁC CẬP NHẬT/TẠO =================
router.post("/", protect, requireEmailVerified, createBooking);
router.put("/:id/cancel", protect, cancelBooking);
router.put("/:id", protect, adminOnly, updateBooking);

export default router;