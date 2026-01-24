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

    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    if (!room || !checkIn || !checkOut || !guest || !guestsCount) {
      return res.status(400).json({ message: "Vui lòng nhập đầy đủ thông tin đặt phòng" });
    }

    const roomExists = await Room.findById(room).populate("hotel");
    if (!roomExists || !roomExists.hotel?._id) {
      return res.status(404).json({ message: "Không tìm thấy thông tin phòng hoặc khách sạn" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    const dIn = new Date(checkInDate).setHours(12, 0, 0, 0);
    const dOut = new Date(checkOutDate).setHours(12, 0, 0, 0);
    
    if (dIn >= dOut) {
      return res.status(400).json({ message: "Ngày trả phòng phải sau ngày nhận phòng ít nhất 1 ngày" });
    }
    const nights = Math.round((dOut - dIn) / (24 * 60 * 60 * 1000));

    const originalPrice = roomExists.price ?? roomExists.pricePerNight;
    const discount = roomExists.discount || 0;
    const finalPricePerNight = discount > 0 
      ? Math.round(originalPrice * (1 - discount / 100)) 
      : originalPrice;

    const totalPrice = finalPricePerNight * nights;
    const DEPOSIT_RATE = 0.3; 
    const depositAmount = Math.round(totalPrice * DEPOSIT_RATE);
    const remainingAmount = totalPrice - depositAmount;

    // [UPDATE] Chỉnh sửa conflict để chính xác hơn với luồng hoàn tiền
    const conflict = await Booking.findOne({
  room,
  status: { $in: ["pending", "confirmed"] },
  // SỬA DÒNG NÀY: Loại bỏ cả đơn đã hoàn tiền VÀ đơn đang chờ hoàn tiền
  paymentStatus: { $nin: ["REFUNDED", "REFUND_PENDING"] }, 
  checkIn: { $lt: checkOutDate },
  checkOut: { $gt: checkInDate },
});

if (conflict) {
  return res.status(400).json({ message: "Phòng này đang có đơn đặt hoặc đang chờ thanh toán." });
}

    const expiryTime = new Date(Date.now() + 30 * 60 * 1000); 

    const booking = await Booking.create({
      user: userId,
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
        note: `Đơn hàng được tạo. Hết hạn thanh toán lúc: ${expiryTime.toLocaleTimeString('vi-VN')}`
      }]
    });

    return res.status(201).json({ 
      success: true,
      message: "Tạo đơn hàng thành công. Vui lòng thanh toán trong 30 phút.", 
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
    // [UPDATE] Ghi log khi hủy đơn trực tiếp
    booking.paymentLogs.push({
      at: new Date(),
      by: req.user._id,
      action: "CANCELLED",
      note: "Đơn hàng đã bị hủy bởi người dùng hoặc quản trị viên."
    });

    await booking.save();
    return res.json({ message: "Booking cancelled successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ==============================
 * REQUEST REFUND (USER)
 * ==============================
 */
export const requestRefund = async (req, res) => {
  try {
    const { id } = req.params;
    const { bankName, accountNumber, accountHolder, reason } = req.body;

    const booking = await Booking.findById(id);
    if (!booking) return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });

    // [UPDATE] Bảo mật: Kiểm tra quyền sở hữu đơn
    if (booking.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Bạn không có quyền thực hiện yêu cầu này" });
    }

    if (!["DEPOSITED", "PAID"].includes(booking.paymentStatus)) {
      return res.status(400).json({ message: "Đơn hàng này chưa có giao dịch thanh toán để hoàn tiền" });
    }

    // [UPDATE] Sử dụng virtual field potentialRefundAmount để lấy số tiền chính xác
    const refundAmount = booking.potentialRefundAmount;

    booking.paymentStatus = "REFUND_PENDING";
    booking.status = "cancelled";
    booking.expireAt = undefined; // [UPDATE] QUAN TRỌNG: Gỡ TTL Index để đơn không bị xóa tự động
    
    booking.refundInfo = {
      bankName,
      accountNumber,
      accountHolder,
      reason,
      amount: refundAmount,
      requestedAt: new Date()
    };

    booking.paymentLogs.push({
      at: new Date(),
      by: req.user._id,
      action: "CANCELLED",
      note: `Khách yêu cầu hủy & hoàn tiền. Số tiền dự kiến: ${refundAmount.toLocaleString()} VNĐ`
    });

    // [UPDATE] Tự động cộng lại phòng trống khi khách hủy
    await Room.findByIdAndUpdate(booking.room, { $inc: { availableCount: 1 } });

    await booking.save();
    res.status(200).json({ success: true, message: "Đã gửi yêu cầu hoàn tiền thành công", refundAmount });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



/**
 * ==============================
 * GET MY BOOKINGS (USER)
 * ==============================
 */
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user?._id || req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const bookings = await Booking.find({ user: userId })
      .populate("room", "name type price photos")
      .populate("hotel", "name city address photos")
      .sort({ createdAt: -1 });

    // CHỐNG CRASH: Lọc bỏ các đơn hàng mà Hotel hoặc Room đã bị xóa khỏi DB
    const validBookings = bookings.filter(b => b.hotel && b.room);

    // [UPDATE] Giữ lại .map để format nhưng bỏ .lean() để Virtual field hoạt động
    const formattedBookings = validBookings.map((b) => {
      const bookingObj = b.toObject({ virtuals: true }); // [UPDATE] Đảm bảo virtual field xuất hiện
      return {
        ...bookingObj,
        status: b.status || "pending",
        totalNights: Math.max(1, Math.ceil(
          (new Date(b.checkOut) - new Date(b.checkIn)) / (1000 * 60 * 60 * 24)
        ))
      };
    });

    return res.status(200).json(formattedBookings); 
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

// Các hàm khác giữ nguyên...
export const getAllBookings = async (req, res) => {
  try {
    const filter = {};
    if (req.query.status) filter.status = req.query.status;
    const bookings = await Booking.find(filter).sort({ createdAt: -1 }).populate("room hotel user");
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const updateBooking = async (req, res) => {
  try {
    const { status, paymentStatus } = req.body;
    const updateData = {};
    if (status) updateData.status = status;
    if (paymentStatus) updateData.paymentStatus = paymentStatus.toUpperCase();

    const booking = await Booking.findByIdAndUpdate(req.params.id, updateData, { new: true });
    return res.json({ message: "Booking updated successfully", booking });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

export const getBookingStatus = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).select("paymentStatus status");
    return res.status(200).json({ success: true, booking });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};

export const checkAvailability = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { checkInDate, checkOutDate } = req.body;

    const conflict = await Booking.findOne({
      room: roomId,
      // CHỈNH SỬA: Chấp nhận cả đơn đã cọc (DEPOSITED) là đơn gây xung đột phòng
      status: { $in: ["confirmed", "pending"] }, 
      paymentStatus: { $in: ["PAID", "DEPOSITED"] }, 
      checkIn: { $lt: new Date(checkOutDate) }, 
      checkOut: { $gt: new Date(checkInDate) }
    });

    return res.status(200).json({ success: true, available: !conflict });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const getBookingById = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id).populate("room hotel");
    res.status(200).json({ success: true, booking });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};