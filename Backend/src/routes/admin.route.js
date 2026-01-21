import express from "express";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.js";
import uploadImage from "../middleware/uploadImage.js";

import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import { getAdminRoomMap, updateRoomStatusg } from "../controllers/room.controller.js";
import {
  markBookingPaid,
  getAdminBookings,
  updateContactStatus,
  getFollowUpBookings,
} from "../controllers/admin.booking.controller.js";

import { getAdminStats } from "../controllers/admin.stats.controller.js";

const router = express.Router();

/* ========= HOTEL ========= */
router.post("/hotels", protect, adminOnly, async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.json(hotel);
  } catch (err) {
    next(err); // Đẩy lỗi sang Middleware xử lý lỗi mà tôi đã nhắc ở file server.js
  }
});

router.put(
  "/hotels/:id",
  protect,
  adminOnly,
  uploadImage.array("images", 10),
  async (req, res) => {
    try {
      const hotel = await Hotel.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true }
      );
      res.json(hotel);
    } catch (err) {
      res.status(500).json(err);
    }
  }
);

/* ========= ROOM ========= */
router.post("/rooms/:hotelId", protect, adminOnly, async (req, res) => {
  const room = await Room.create({
    ...req.body,
    hotel: req.params.hotelId,
  });
  res.json(room);
});
router.get("/room-map", protect, adminOnly, getAdminRoomMap);
/* ========= BOOKINGS ========= */
router.get("/bookings", protect, adminOnly, getAdminBookings);

router.put(
  "/bookings/:id/action",
  protect,
  adminOnly,
  updateContactStatus
);

router.put(
  "/bookings/:id/pay",
  protect,
  adminOnly,
  markBookingPaid
);

router.get(
  "/bookings/follow-up",
  protect,
  adminOnly,
  getFollowUpBookings
);
router.put("/rooms-status/:id", protect, adminOnly, updateRoomStatus);

/* ========= STATS ========= */
router.get("/stats", protect, adminOnly, getAdminStats);

export default router;
