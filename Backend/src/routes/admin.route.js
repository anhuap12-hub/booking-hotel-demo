import express from "express";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.js";
import uploadImage from "../middleware/uploadImage.js";

import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { getAdminRoomMap, updateRoomStatus } from "../controllers/room.controller.js";
import { 
  getAllUsers, 
  getUserById, 
  updateUserByAdmin, 
  updateUserRole, 
  deleteUser 
} from "../controllers/user.controller.js";
import {
  markBookingPaid,
  getAdminBookings,
  updateContactStatus,
  getFollowUpBookings,
  confirmRefunded,
  markNoShow
} from "../controllers/admin.booking.controller.js";
import { getAdminStats } from "../controllers/admin.stats.controller.js";

const router = express.Router();

// Áp dụng middleware protect và adminOnly cho TOÀN BỘ route trong file này
// Giúp code ngắn gọn hơn, không phải viết lại ở từng dòng
router.use(protect);
router.use(adminOnly);

/* ========= USERS (Quản lý người dùng) ========= */
router.get("/users", getAllUsers); // Lấy danh sách
router.get("/users/:id", getUserById); // Chi tiết 1 user
router.put("/users/:id", updateUserByAdmin); // Sửa username/email
router.patch("/users/:id/role", updateUserRole); // Chốt sửa quyền (Role)
router.delete("/users/:id", deleteUser); // Xóa user
/* ========= HOTEL (Khách sạn) ========= */
router.post("/hotels", async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.json(hotel);
  } catch (err) {
    next(err);
  }
});

router.put("/hotels/:id", uploadImage.array("images", 10), async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(hotel);
  } catch (err) {
    res.status(500).json(err);
  }
});

/* ========= ROOM (Phòng) ========= */
router.post("/rooms/:hotelId", async (req, res) => {
  const room = await Room.create({ ...req.body, hotel: req.params.hotelId });
  res.json(room);
});
router.get("/room-map", getAdminRoomMap);
router.put("/rooms-status/:id", updateRoomStatus);

/* ========= BOOKINGS (Đơn đặt phòng) ========= */
router.get("/bookings", getAdminBookings);
router.get("/bookings/follow-up", getFollowUpBookings);

router.put("/bookings/:id/action", updateContactStatus);
router.put("/bookings/:id/pay", markBookingPaid);
router.put("/bookings/:id/confirm-refund", confirmRefunded); // Xác nhận hoàn tiền
router.patch("/bookings/:id/no-show", markNoShow);
/* ========= STATS (Thống kê) ========= */
router.get("/stats", getAdminStats);

export default router;