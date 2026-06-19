import mongoose from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import Room from "../models/Room.js";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";

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

// ĐÃ XÓA THAM SỐ NEXT Ở TẤT CẢ CÁC HÀM DƯỚI ĐÂY
export const getAllRooms = async (req, res) => {
  try {
    const rooms = await Room.find().populate("hotel", "name city");
    res.json({ success: true, data: rooms }); // Đồng bộ cấu trúc trả về
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoomsByHotel = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const rooms = await Room.find({ hotel: hotelId }).populate("hotel");
    
    // Luôn bọc trong { success, data }
    res.status(200).json({ success: true, data: rooms }); 
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRoom = async (req, res) => {
  try {
    const roomId = req.params.id;

    // 1. Kiểm tra phòng có tồn tại không
    const room = await Room.findById(roomId);
    if (!room) {
      return res.status(404).json({ success: false, message: "Không tìm thấy phòng để cập nhật" });
    }

    const oldHotelId = room.hotel?.toString();
    let newHotelId = req.body.hotel;

    // 2. NGĂN CHẶN LỖI CAST OBJECTID: Nếu hotel gửi lên là chuỗi rỗng, dùng lại ID cũ
    if (newHotelId === "" || !newHotelId) {
      newHotelId = oldHotelId;
      req.body.hotel = oldHotelId; 
    }

    // 3. Xử lý xóa ảnh cũ trên Cloudinary (nếu ảnh đó không còn trong mảng photos mới)
    if (req.body.photos && Array.isArray(req.body.photos)) {
      const photosToDelete = room.photos.filter(
        (oldPhoto) => !req.body.photos.find((newPhoto) => newPhoto.public_id === oldPhoto.public_id)
      );
      
      if (photosToDelete.length > 0) {
        await Promise.all(
          photosToDelete.map((photo) => cloudinary.uploader.destroy(photo.public_id))
        );
      }
    }

    // 4. Cập nhật dữ liệu phòng vào Database
    const updatedRoom = await Room.findByIdAndUpdate(
      roomId,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    // 5. Logic chuyển phòng từ Khách sạn A sang Khách sạn B (nếu có đổi hotelId)
    if (newHotelId && oldHotelId !== newHotelId) {
      // Xóa phòng khỏi danh sách của khách sạn cũ
      if (oldHotelId) {
        await Hotel.findByIdAndUpdate(oldHotelId, { $pull: { rooms: roomId } });
        await syncHotelPrice(oldHotelId);
      }
      // Thêm phòng vào danh sách của khách sạn mới
      await Hotel.findByIdAndUpdate(newHotelId, { $addToSet: { rooms: roomId } });
      await syncHotelPrice(newHotelId);
    } else if (oldHotelId) {
      // Nếu không đổi khách sạn, chỉ cần đồng bộ lại giá (phòng có thể đổi giá/trạng thái)
      await syncHotelPrice(oldHotelId);
    }

    res.status(200).json({ 
      success: true, 
      message: "Cập nhật phòng thành công", 
      data: updatedRoom 
    });

  } catch (error) {
    console.error("Lỗi updateRoom:", error);

    // Trả về lỗi 400 nếu lỗi do định dạng ID (CastError)
    if (error.name === "CastError") {
      return res.status(400).json({ 
        success: false, 
        message: `Định dạng ID không hợp lệ: ${error.value}. Vui lòng kiểm tra lại ID khách sạn.` 
      });
    }

    res.status(500).json({ 
      success: false, 
      message: "Lỗi server khi cập nhật phòng", 
      error: error.message 
    });
  }
};

export const createRoom = async (req, res) => {
  try {
    const hotelId = req.params.hotelId;
    const newRoom = new Room({ ...req.body, hotel: hotelId });
    const savedRoom = await newRoom.save();

    await Hotel.findByIdAndUpdate(hotelId, { $push: { rooms: savedRoom._id } });
    await syncHotelPrice(hotelId);

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
    if (room.photos?.length > 0) {
      await Promise.all(room.photos.map(photo => cloudinary.uploader.destroy(photo.public_id)));
    }
    if (hotelId) {
      await Hotel.findByIdAndUpdate(hotelId, { $pull: { rooms: room._id } });
    }
    await room.deleteOne();
    if (hotelId) await syncHotelPrice(hotelId);

    res.json({ success: true, message: "Room deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAvailableRooms = async (req, res) => {
  try {
    const { checkIn, checkOut, hotelId } = req.query;
    
    // Nếu không có ngày, trả về toàn bộ phòng của hotel đó hoặc lỗi rõ ràng
    if (!checkIn || !checkOut) {
       const allRooms = await Room.find({ 
         ...(hotelId && { hotel: hotelId }), 
         status: "active" 
       }).populate("hotel", "name city address");
       return res.json({ success: true, data: allRooms });
    }

    const bookings = await Booking.find({
      checkIn: { $lt: new Date(checkOut) },
      checkOut: { $gt: new Date(checkIn) },
      status: { $ne: "cancelled" },
    }).select("room");

    const bookedRoomIds = bookings.map(b => b.room);
    
    const rooms = await Room.find({
      _id: { $nin: bookedRoomIds },
      ...(hotelId && { hotel: hotelId }),
      status: "active",
    }).populate("hotel", "name city address");

    // FIX: Trả về cấu trúc { success, data } để Frontend map được
    res.json({ success: true, data: rooms });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getAdminRoomMap = async (req, res) => {
  try {
    const { hotelId } = req.query;
    const now = new Date();
    const query = hotelId ? { hotel: hotelId } : {};

    // 1. Lấy tất cả phòng và populate tên khách sạn
    const rooms = await Room.find(query).populate("hotel", "name address").sort({ name: 1 });

    // 2. Lấy các booking đang ở (có checkIn <= now <= checkOut)
    const activeBookings = await Booking.find({
      status: { $in: ["confirmed", "completed"] }, // Thêm 'completed' nếu cần
      checkIn: { $lte: now },
      checkOut: { $gte: now },
    });

    // 3. Map dữ liệu
    const roomMap = rooms.map((room) => {
  const currentBooking = activeBookings.find(b => b.room?.toString() === room._id.toString());
  return {
    _id: room._id,
    roomName: room.name,
    hotelName: room.hotel?.name || "N/A",
    hotelAddress: room.hotel?.address || "N/A", // Lấy địa chỉ
    displayStatus: currentBooking ? "occupied" : room.status,
    bookingDetails: currentBooking ? {
        customerName: currentBooking.guest?.name || "Khách hàng",
        customerPhone: currentBooking.guest?.phone || "Chưa có SĐT"
    } : null
  };
});

    res.json({ success: true, data: roomMap });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getRoomBookedDates = async (req, res) => {
  try {
    const { id } = req.params;

    // Chỉ lấy các booking có khả năng chiếm phòng (Chờ thanh toán hoặc Đã xác nhận)
    // Loại bỏ: cancelled (đã hủy), expired (hết hạn), no_show (khách ko đến)
    const bookings = await Booking.find({
      room: id,
      status: { $in: ["pending", "confirmed", "completed"] },
    }).select("checkIn checkOut");

    let bookedDates = [];

    bookings.forEach((booking) => {
      // Khởi tạo ngày bắt đầu và ngày kết thúc
      let currentDate = new Date(booking.checkIn);
      const endDate = new Date(booking.checkOut);

      while (currentDate < endDate) {
        bookedDates.push(currentDate.toISOString().split("T")[0]);
        currentDate.setDate(currentDate.getDate() + 1);
      }
    });

    // Loại bỏ các ngày trùng lặp nếu có nhiều booking gối đầu nhau
    const uniqueDates = [...new Set(bookedDates)].sort();

    res.status(200).json({
      success: true,
      count: uniqueDates.length,
      data: uniqueDates,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Lỗi khi lấy danh sách ngày đã đặt",
      error: error.message,
    });
  }
};
export const getRoomDetail = async (req, res) => {
  try {
    const room = await Room.findById(req.params.id).populate("hotel", "name location address");
    if (!room) return res.status(404).json({ success: false, message: "Không tìm thấy phòng" });
    
    // Đồng bộ cấu trúc
    res.status(200).json({ success: true, data: room });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateRoomStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const updatedRoom = await Room.findByIdAndUpdate(
      id,
      { $set: { status } },
      { new: true }
    );
    if (!updatedRoom) return res.status(404).json({ message: "Không tìm thấy phòng" });
    res.status(200).json({ success: true, data: updatedRoom });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const getAvailableAmenities = async (req, res) => {
  try {
    const { hotelId } = req.params;
    // Tìm tất cả các phòng thuộc khách sạn này, lấy ra mảng amenities và loại bỏ giá trị trùng lặp
    const rooms = await Room.find({ hotel: hotelId }, "amenities");
    
    // Gom tất cả vào 1 mảng và dùng Set để lọc trùng
    const allAmenities = [...new Set(rooms.flatMap(r => r.amenities))].filter(Boolean);
    
    res.status(200).json({ success: true, data: allAmenities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};