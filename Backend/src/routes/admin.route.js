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
  markNoShow,
  cancelBooking
} from "../controllers/admin.booking.controller.js";
import { getAdminStats } from "../controllers/admin.stats.controller.js";

const router = express.Router();

router.use(protect);
router.use(adminOnly);

router.get("/users", getAllUsers);
router.get("/users/:id", getUserById);
router.put("/users/:id", updateUserByAdmin);
router.patch("/users/:id/role", updateUserRole);
router.delete("/users/:id", deleteUser);

router.post("/hotels", async (req, res, next) => {
  try {
    const hotel = await Hotel.create(req.body);
    res.status(201).json(hotel);
  } catch (err) {
    next(err);
  }
});

router.put("/hotels/:id", uploadImage.array("images", 10), async (req, res) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(hotel);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/rooms/:hotelId", async (req, res) => {
  try {
    const room = await Room.create({ ...req.body, hotel: req.params.hotelId });
    res.status(201).json(room);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/room-map", getAdminRoomMap);
router.put("/rooms-status/:id", updateRoomStatus);

router.get("/bookings", getAdminBookings);
router.get("/bookings/follow-up", getFollowUpBookings);
router.put("/bookings/:id/action", updateContactStatus);
router.put("/bookings/:id/pay", markBookingPaid);
router.put("/bookings/:id/confirm-refund", confirmRefunded);
router.patch("/bookings/:id/no-show", markNoShow);
router.put("/bookings/:id/cancel", cancelBooking);

router.get("/stats", getAdminStats);

export default router;