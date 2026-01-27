import mongoose from "mongoose";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";

const syncHotelPrice = async (hotelId) => {
  if (!hotelId) return;
  try {
    const hotel = await Hotel.findById(hotelId).populate("rooms");
    if (hotel && hotel.rooms.length > 0) {
      const validPrices = hotel.rooms
        .filter(r => r.status === "active" && typeof r.price === "number")
        .map(r => r.price);
      
      const cheapest = validPrices.length > 0 ? Math.min(...validPrices) : 0;
      
      // CHỐT: Dùng updateOne để bỏ qua Middleware pre('save')
      await Hotel.updateOne({ _id: hotelId }, { $set: { cheapestPrice: cheapest } });
    }
  } catch (err) {
    console.error("Lỗi đồng bộ giá:", err.message);
  }
};



export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("hotel", "name city");
    res.json(rooms);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomById = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel", "name city address");
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    // 1. Tìm phòng hiện tại
    const room = await Room.findById(req.params.id);
    if (!room) return res.status(404).json({ success: false, message: "Room not found" });

    const oldHotelId = room.hotel?.toString();
    const newHotelId = req.body.hotel;

    // 2. Cập nhật phòng (sử dụng runValidators để đảm bảo dữ liệu chuẩn)
    const updatedRoom = await Room.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // 3. Nếu thay đổi khách sạn chủ quản, cập nhật lại mảng rooms ở cả 2 Hotel
    if (newHotelId && oldHotelId !== newHotelId) {
      // Xóa ở hotel cũ
      await Hotel.findByIdAndUpdate(oldHotelId, { $pull: { rooms: req.params.id } });
      // Thêm vào hotel mới
      await Hotel.findByIdAndUpdate(newHotelId, { $addToSet: { rooms: req.params.id } });
    }

    res.status(200).json({ success: true, data: updatedRoom });
  } catch (error) {
    // Trả về lỗi validation chi tiết nếu có
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createRoom = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const newRoom = new Room({ ...req.body, hotel: hotelId });
    const savedRoom = await newRoom.save();

    // Đẩy ID phòng vào mảng rooms của Hotel
    await Hotel.findByIdAndUpdate(hotelId, {
      $push: { rooms: savedRoom._id },
    });

    res.status(201).json({ success: true, data: savedRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) return res.status(400).json({ message: "Invalid room id" });

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    const hotelId = room.hotel;
    await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: room._id } });
    await room.deleteOne();
    await syncHotelPrice(hotelId);

    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableRooms = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

export const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const hotel = await Hotel.findById(hotelId).select("name city address");
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const rooms = await Room.find({ hotel: hotelId }).populate("hotel", "name city address");
    res.json({ hotel, rooms });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomBookedDates = async (req, res) => {
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
    res.status(500).json({ message: err.message });
  }
};

export const getAdminRoomMap = async (req, res) => {
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
    res.status(500).json({ message: error.message });
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedRoom = await Room.findByIdAndUpdate(id, { status }, { new: true });
    if (!updatedRoom) return res.status(404).json({ message: "Không tìm thấy phòng" });
    
    await syncHotelPrice(updatedRoom.hotel);
    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomDetail = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel", "name location address");
    if (!room) return res.status(404).json({ message: "Không tìm thấy phòng này" });
    if (room.status === "inactive") return res.status(400).json({ message: "Phòng hiện tại đã ngừng kinh doanh" });
    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};