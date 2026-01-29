import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary"; // PHẢI IMPORT
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";

// Cấu hình Cloudinary để các hàm destroy hoạt động
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const syncHotelPrice = async (hotelId) => {
  if (!hotelId) return;
  try {
    const hotel = await Hotel.findById(hotelId).populate("rooms");
    if (hotel && hotel.rooms.length > 0) {
      const validPrices = hotel.rooms
        .filter(r => r.status === "active" && typeof r.price === "number")
        .map(r => r.price);
      
      const cheapest = validPrices.length > 0 ? Math.min(...validPrices) : 0;
      
      await Hotel.updateOne({ _id: hotelId }, { $set: { cheapestPrice: cheapest } });
    }
  } catch (err) {
    console.error("Lỗi đồng bộ giá:", err.message);
  }
};

export const getAllRooms = async (req, res, next) => {
  try {
    const rooms = await Room.find().populate("hotel", "name city");
    res.json(rooms);
  } catch (error) {
    next(error);
  }
};

export const getRoomById = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel", "name city address");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    next(error);
  }
};

export const updateRoom = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });

    const oldHotelId = room.hotel?.toString();
    const newHotelId = req.body.hotel;

    if (req.body.photos) {
      const photosToDelete = room.photos.filter(
        (oldPhoto) => !req.body.photos.find((newPhoto) => newPhoto.public_id === oldPhoto.public_id)
      );

      if (photosToDelete.length > 0) {
        await Promise.all(
          photosToDelete.map((photo) => cloudinary.uploader.destroy(photo.public_id))
        );
      }
    }

    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    if (newHotelId && oldHotelId !== newHotelId) {
      if (oldHotelId) {
        await Hotel.findByIdAndUpdate(oldHotelId, { $pull: { rooms: req.params.id } });
        await syncHotelPrice(oldHotelId);
      }
      await Hotel.findByIdAndUpdate(newHotelId, { $addToSet: { rooms: req.params.id } });
      await syncHotelPrice(newHotelId);
    } else if (oldHotelId) {
      await syncHotelPrice(oldHotelId);
    }

    res.status(200).json({ success: true, data: updatedRoom });
  } catch (error) {
    next(error);
  }
};

export const createRoom = async (req, res, next) => {
  try {
    const hotelId = req.params.hotelId;
    const newRoom = new Room({ ...req.body, hotel: hotelId });
    const savedRoom = await newRoom.save();

    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: savedRoom._id },
    });
    
    await syncHotelPrice(hotelId); // Nên đồng bộ giá ngay khi tạo phòng mới

    res.status(201).json({ success: true, data: savedRoom });
  } catch (error) {
    next(error);
  }
};

export const deleteRoom = async (req, res, next) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid room id" });

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const hotelId = room.hotel;
    if (room.photos && room.photos.length > 0) {
      await Promise.all(
        room.photos.map(photo => cloudinary.uploader.destroy(photo.public_id))
      );
    }
    if (hotelId) {
      await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: room._id } });
    }
    await room.deleteOne();
    if (hotelId) {
      await syncHotelPrice(hotelId);
    }

    res.json({ success: true, message: "Room and associated images deleted successfully" });
  } catch (error) {
    next(error);
  }
};

export const getAvailableRooms = async (req, res, next) => {
  try {
    const { checkIn, checkOut, hotelId } = req.query;
    if (!checkIn || !checkOut) return res.status(400).json({ message: "Thiếu checkIn hoặc checkOut" });

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate) || checkOutDate <= checkInDate) {
      return res.status(400).json({ message: "Ngày không hợp lệ" });
    }

    const bookings = await Booking.find({
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
      status: { $ne: "cancelled" },
    }).select("room");

    const bookedRoomIds = bookings.map(b => b.room);

    const rooms = await Room.find({
      _id: { $nin: bookedRoomIds },
      ...(hotelId && { hotel: hotelId }),
      status: "active",
    }).populate("hotel", "name city address");

    res.json({ rooms });
  } catch (error) {
    next(error);
  }
};

export const getRoomsByHotel = async (req, res, next) => {
  try {
    const { hotelId } = req.params;
    const hotel = await Hotel.findById(hotelId).select("name city address");
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const rooms = await Room.find({ hotel: hotelId }).populate("hotel", "name city address");
    res.json({ hotel, rooms });
  } catch (error) {
    next(error);
  }
};

export const getRoomBookedDates = async (req, res, next) => {
  try {
    const { roomId } = req.params;
    if (!mongoose.Types.ObjectId.isValid(roomId)) return res.status(400).json({ message: "Invalid room id" });

    const bookings = await Booking.find({
      room: roomId,
      status: { $ne: "cancelled" }
    }).select("checkIn checkOut");

    const dates = [];
    bookings.forEach(b => {
      let current = new Date(b.checkIn);
      const end = new Date(b.checkOut);
      while (current < end) {
        dates.push(current.toISOString().split("T")[0]);
        current.setDate(current.getDate() + 1);
      }
    });

    res.json({ dates });
  } catch (err) {
    next(err);
  }
};

export const getAdminRoomMap = async (req, res, next) => {
  try {
    const { hotelId } = req.query;
    const now = new Date();
    const query = hotelId ? { hotel: hotelId } : {};
    
    const rooms = await Room.find(query).populate("hotel", "name").sort({ name: 1 });

    const bookingQuery = {
      status: { $in: ["pending", "confirmed"] },
      checkIn: { $lte: now },
      checkOut: { $gte: now },
    };
    if (hotelId) bookingQuery.hotel = hotelId;

    const activeBookings = await Booking.find(bookingQuery).populate("user", "name email");

    const roomMap = rooms.map((room) => {
      const currentBooking = activeBookings.find(b => b.room.toString() === room._id.toString());
      let displayStatus = "available";
      
      if (room.status === "maintenance") displayStatus = "maintenance";
      else if (room.status === "inactive") displayStatus = "inactive";
      else if (currentBooking) {
        displayStatus = currentBooking.paymentStatus === "PAID" ? "occupied" : "booked";
      }

      return {
        _id: room._id,
        roomName: room.name,
        roomType: room.type,
        hotelName: room.hotel?.name,
        price: room.price,
        displayStatus,
        bookingDetails: currentBooking ? {
          bookingId: currentBooking._id,
          customerName: currentBooking.guest?.name || currentBooking.user?.name,
          checkOut: currentBooking.checkOut,
          paymentStatus: currentBooking.paymentStatus
        } : null
      };
    });

    res.json(roomMap);
  } catch (error) {
    next(error);
  }
};

export const updateRoomStatus = async (req, res, next) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedRoom = await Room.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedRoom) return res.status(404).json({ message: "Không tìm thấy phòng" });
    
    await syncHotelPrice(updatedRoom.hotel);
    res.status(200).json(updatedRoom);
  } catch (error) {
    next(error);
  }
};

export const getRoomDetail = async (req, res, next) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel", "name location address");
    if (!room) return res.status(404).json({ message: "Không tìm thấy phòng này" });
    if (room.status === "inactive") return res.status(400).json({ message: "Phòng hiện tại đã ngừng kinh doanh" });
    res.status(200).json(room);
  } catch (error) {
    next(error);
  }
};