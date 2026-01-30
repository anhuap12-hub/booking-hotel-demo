import express from "express";
import {
  getAllRooms,
  createRoom,
  deleteRoom,
  updateRoom,
  getAvailableRooms,
  getRoomsByHotel, 
  getRoomBookedDates,
  getRoomDetail,
  getAdminRoomMap,
  updateRoomStatus
} from "../controllers/room.controller.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.js";

const router = express.Router();

router.get("/available", getAvailableRooms);
router.get("/admin/map", protect, adminOnly, getAdminRoomMap);
router.get("/hotel/:hotelId", getRoomsByHotel);
router.get("/:roomId/booked-dates", getRoomBookedDates);
router.get("/", getAllRooms);
router.get("/:id", getRoomDetail);

router.post("/by-hotel/:hotelId", protect, adminOnly, createRoom);
router.patch("/:id/status", protect, adminOnly, updateRoomStatus);
router.put("/:id", protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

export default router;