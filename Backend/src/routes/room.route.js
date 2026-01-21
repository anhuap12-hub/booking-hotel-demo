import express from "express";
import {
  getAllRooms,
  getRoomById,
  createRoom,
  deleteRoom,
  updateRoom,
  getAvailableRooms,
  getRoomsByHotel, 
  getRoomBookedDates,
  getRoomDetail,
} from "../controllers/room.controller.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.js";

const router = express.Router();

/// public
router.get("/available", getAvailableRooms);
router.get("/hotel/:hotelId", getRoomsByHotel);
router.get("/:roomId/booked-dates", getRoomBookedDates);
router.get("/", getAllRooms);
router.get("/:id", getRoomById);
router.get("/:id", getRoomDetail);
// admin
router.post("/by-hotel/:hotelId", protect, adminOnly, createRoom);
router.put("/:id", protect, adminOnly, updateRoom);
router.delete("/:id", protect, adminOnly, deleteRoom);

export default router;
