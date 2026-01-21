import mongoose from "mongoose";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";

export const createRoom = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const {
      name,
      type,
      price,
      maxPeople,
      status,
      desc,
      photos,
      amenities,
      cancellationPolicy,
    } = req.body;

    const hotel = await Hotel.findById(hotelId);
    if (!hotel) {
      return res.status(404).json({ message: "Hotel not found" });
    }

    const room = await Room.create({
      name,
      type,
      price,
      maxPeople,
      status,
      desc,
      photos,
      amenities,
      cancellationPolicy,
      hotel: hotelId,
    });

    hotel.rooms.push(room._id);
    await hotel.save();

    res.status(201).json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
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
    const room = await Room.findById(req.params.id).populate(
      "hotel",
      "name city address"
    );
    if (!room) return res.status(404).json({ message: "Room not found" });
    res.json(room);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const room = await Room.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );
    if (!room) return res.status(404).json({ message: "Room not found" });

    res.json({ message: "Room updated", room });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deleteRoom = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid room id" });
    }

    const room = await Room.findById(id);
    if (!room) return res.status(404).json({ message: "Room not found" });

    await Hotel.updateMany(
      { rooms: room._id },
      { $pull: { rooms: room._id } }
    );

    await room.deleteOne();

    res.json({ message: "Room deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getAvailableRooms = async (req, res) => {
  try {
    const { checkIn, checkOut, hotelId } = req.query;

    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: "Thiếu checkIn hoặc checkOut" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (isNaN(checkInDate) || isNaN(checkOutDate)) {
      return res.status(400).json({ message: "Ngày không hợp lệ" });
    }

    if (checkOutDate <= checkInDate) {
      return res.status(400).json({ message: "Check-out phải sau check-in" });
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
      status: { $ne: "Unavailable" },
    }).populate("hotel", "name city address");

    res.json({ rooms });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: error.message });
  }
};


export const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;

    const hotel = await Hotel.findById(hotelId).select("name city address");
    if (!hotel) return res.status(404).json({ message: "Hotel not found" });

    const rooms = await Room.find({ hotel: hotelId })
  .populate("hotel", "name city address");

    res.json({
  hotel,
  rooms,
});
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getRoomBookedDates = async (req, res) => {
  try {
    const { roomId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(roomId)) {
      return res.status(400).json({ message: "Invalid room id" });
    }

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

    // 1. Lấy danh sách phòng (Lọc theo hotelId nếu có)
    const query = hotelId ? { hotel: hotelId } : {};
    const rooms = await Room.find(query)
      .populate("hotel", "name")
      .sort({ name: 1 }); // Sắp xếp theo tên/số phòng cho dễ nhìn

    // 2. Lấy danh sách booking đang hiệu lực (Checked-in hoặc sắp Check-in hôm nay)
   const bookingQuery = {
  status: { $in: ["pending", "confirmed"] },
  checkIn: { $lte: now },
  checkOut: { $gte: now },
};
if (hotelId) bookingQuery.hotel = hotelId; // Chỉ lấy booking của hotel đang xem

const activeBookings = await Booking.find(bookingQuery).populate("user", "name email");

    // 3. Tổ chức lại dữ liệu cho Map
    const roomMap = rooms.map((room) => {
      const currentBooking = activeBookings.find(
        (b) => b.room.toString() === room._id.toString()
      );

      let displayStatus = "available"; // Mặc định
      
      // Kiểm tra trạng thái vận hành từ Schema của bạn
      if (room.status === "maintenance") displayStatus = "maintenance";
      else if (room.status === "inactive") displayStatus = "inactive";
      // Nếu phòng active, mới kiểm tra đến booking
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
    const { status } = req.body; // active hoặc maintenance

    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { status },
      { new: true }
    );

    if (!updatedRoom) {
      return res.status(404).json({ message: "Không tìm thấy phòng" });
    }

    res.status(200).json(updatedRoom);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const getRoomDetail = async (req, res) => {
  try {
    const { id } = req.params;

    // Tìm phòng và lấy thêm dữ liệu từ model Hotel đã ref trong Schema
    const room = await Room.findById(id).populate("hotel", "name location address");

    if (!room) {
      return res.status(404).json({ message: "Không tìm thấy phòng này" });
    }

    // Nếu phòng đang ở trạng thái 'inactive', có thể chặn không cho khách xem (tùy logic của bạn)
    if (room.status === "inactive") {
      return res.status(400).json({ message: "Phòng hiện tại đã ngừng kinh doanh" });
    }

    res.status(200).json(room);
  } catch (error) {
    res.status(500).json({ message: "Lỗi hệ thống: " + error.message });
  }
};