import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

/**
 * ==============================
 * CREATE BOOKING (USER)
 * ==============================
 */
export const createBooking = async (req, res) => {
  try {
    console.log("📥 CREATE BOOKING REQUEST:", req.body);
    const { room, checkIn, checkOut, guest, guestsCount } = req.body;

    // 1. Kiểm tra xác thực
    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    // 2. Kiểm tra dữ liệu đầu vào
    if (!room || !checkIn || !checkOut || !guest || !guestsCount) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin đặt phòng" });
    }

    // 3. Kiểm tra sự tồn tại của phòng và khách sạn
    const roomExists = await Room.findById(room).populate("hotel");
    if (!roomExists || !roomExists.hotel?._id) {
      return res.status(404).json({ message: "Không tìm thấy thông tin phòng hoặc khách sạn" });
    }

    // 4. Chuẩn hóa ngày để tính số đêm chính xác (về 12h trưa để tránh sai lệch múi giờ/giờ lẻ)
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    const dIn = new Date(checkInDate).setHours(12, 0, 0, 0);
    const dOut = new Date(checkOutDate).setHours(12, 0, 0, 0);
    
    if (dIn >= dOut) {
      return res.status(400).json({ message: "Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày" });
    }

    const nights = Math.round((dOut - dIn) / (24 * 60 * 60 * 1000));

    // 5. Tính toán giá tiền tại Backend (Bảo mật: Không dùng giá từ Frontend gửi lên)
    const originalPrice = roomExists.price ?? roomExists.pricePerNight;
    const discount = roomExists.discount || 0;
    const finalPricePerNight = discount > 0 
      ? Math.round(originalPrice * (1 - discount / 100)) 
      : originalPrice;

    if (!finalPricePerNight) return res.status(400).json({ message: "Dữ liệu giá phòng không hợp lệ" });

    const totalPrice = finalPricePerNight * nights;
    const DEPOSIT_RATE = 0.3; // Đặt cọc 30%
    const depositAmount = Math.round(totalPrice * DEPOSIT_RATE);
    const remainingAmount = totalPrice - depositAmount;

    // 6. Kiểm tra trùng lịch (Chỉ tính các đơn đã xác nhận hoặc đã thanh toán)
    const conflict = await Booking.findOne({
      room,
      status: { $ne: "cancelled" }, // Bỏ qua các đơn đã hủy
      $or: [
        { status: "confirmed" },
        { paymentStatus: { $in: ["PAID", "DEPOSITED"] } }
      ],
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });
    
    if (conflict) {
      return res.status(400).json({ message: "Phòng này đã có người khác đặt trong khoảng thời gian này" });
    }

    // 7. Thiết lập thời gian hết hạn thanh toán (30 phút)
    const expiryTime = new Date(Date.now() + 30 * 60 * 1000);

    // 8. Tạo đơn hàng
    const booking = await Booking.create({
      user: req.user.id,
      hotel: roomExists.hotel._id,
      room: roomExists._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guest,
      guestsCount,
      roomSnapshot: {
        name: roomExists.name,
        type: roomExists.type,
        pricePerNight: finalPricePerNight,
        originalPrice: originalPrice,
        discount: discount,
        maxPeople: roomExists.maxPeople,
        cancellationPolicy: roomExists.cancellationPolicy,
      },
      nights,
      totalPrice,
      depositAmount,    
      remainingAmount,  
      status: "pending",
      paymentStatus: "UNPAID",
      contactStatus: "NEW",
      expireAt: expiryTime,
      paymentLogs: [{
        at: new Date(),
        action: "CREATED",
        note: `Đơn hàng được tạo. Tổng: ${totalPrice.toLocaleString()}đ cho ${nights} đêm. Tiền cọc 30%: ${depositAmount.toLocaleString()}đ`
      }]
    });

    console.log(`✅ BOOKING CREATED: ${booking._id} | Nights: ${nights} | Deposit: ${depositAmount}`);
    
    return res.status(201).json({ 
      success: true,
      message: "Tạo đơn hàng thành công. Vui lòng thanh toán đặt cọc trong vòng 30 phút.", 
      booking 
    });

  } catch (error) {
    console.error("❌ CREATE BOOKING ERROR:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
/**
 * ==============================
 * CANCEL BOOKING (USER / ADMIN)
 * ==============================
 */
export const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(403).json({ message: "Not authorized" });
    }

    booking.status = "cancelled";
    // Nếu hủy đơn, bạn có thể cân nhắc logic hoàn cọc ở đây nếu cần
    await booking.save();

    return res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ==============================
 * GET MY BOOKINGS (USER)
 * ==============================
 */
export const getUserBookings = async (req, res) => {
  try {
    // Đảm bảo dùng đúng ID từ middleware protect (req.user.id hoặc req.user._id)
    const userId = req.user.id || req.user._id;

    let bookings = await Booking.find({ user: userId })
      .sort({ createdAt: -1 })
      .populate("room", "name type price photos")
      .populate("hotel", "name city address photos");

    // Lọc bỏ các đơn hàng mà Room hoặc Hotel đã bị xóa (tránh lỗi UI)
    bookings = bookings.filter((b) => b.room !== null && b.hotel !== null);

    // TRẢ VỀ CẤU TRÚC CHUẨN ĐỂ FRONTEND KHÔNG BỊ LỖI
    return res.status(200).json({
      success: true,
      bookings: bookings
    });
  } catch (error) {
    console.error("❌ GET USER BOOKINGS ERROR:", error);
    return res.status(500).json({ 
      success: false, 
      message: "Không thể lấy danh sách đơn hàng",
      error: error.message 
    });
  }
};

/**
 * ==============================
 * ADMIN: GET ALL BOOKINGS
 * ==============================
 */
export const getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate("room", "name type price")
      .populate("hotel", "name city")
      .populate("user", "username email");

    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ==============================
 * ADMIN: UPDATE BOOKING STATUS
 * ==============================
 */
export const updateBooking = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = {};
    
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus.toUpperCase();

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true }
    );

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    return res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .select("paymentStatus status"); // Tối ưu: Chỉ lấy 2 trường cần thiết

    if (!booking) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    // Trả về cấu trúc có bọc 'booking' để khớp với Frontend: res.data.booking
    return res.status(200).json({
      success: true,
      booking: {
        paymentStatus: booking.paymentStatus,
        status: booking.status
      }
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// 2. Hàm kiểm tra phòng trống (Logic loại bỏ đơn ảo)
export const checkAvailability = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { checkInDate, checkOutDate } = req.body;

    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    const conflict = await Booking.findOne({
      room: roomId,
      $or: [
        { status: "confirmed" }, 
        { paymentStatus: { $in: ["PAID", "DEPOSITED"] } }
      ],
      checkIn: { $lt: end }, 
      checkOut: { $gt: start }
    });

    return res.status(200).json({
      success: true,
      available: !conflict, 
      message: conflict ? "Phòng đã có khách đặt chắc chắn" : "Phòng trống"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// 3. Hàm lấy chi tiết đầy đủ (Dùng cho trang My Bookings / chi tiết đơn)
export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id)
      .populate("room"); // Lấy thêm thông tin chi tiết phòng nếu cần

    if (!booking) {
      return res.status(404).json({ success: false, message: "Không tìm thấy đơn hàng" });
    }

    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};