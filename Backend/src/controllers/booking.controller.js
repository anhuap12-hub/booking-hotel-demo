import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

/**
 * ==============================
 * CREATE BOOKING (USER)
 * ==============================
 */
export const createBooking = async (req, res) => {
  try {
    console.log("📥 CREATE BOOKING BODY:", req.body);
    const { room, checkIn, checkOut, guest, guestsCount } = req.body;

    if (!req.user?.id) return res.status(401).json({ message: "Unauthorized" });

    if (!room || !checkIn || !checkOut || !guest || !guestsCount) {
      return res.status(400).json({ message: "Missing booking data" });
    }

    const roomExists = await Room.findById(room).populate("hotel");
    if (!roomExists || !roomExists.hotel?._id) {
      return res.status(404).json({ message: "Room or Hotel not found" });
    }

    // --- LOGIC TÍNH GIÁ ĐÃ GIẢM (DISCOUNT) ---
    const originalPrice = roomExists.price ?? roomExists.pricePerNight;
    const discount = roomExists.discount || 0; // Lấy % giảm giá từ Database
    
    // Tính giá thực tế của 1 đêm sau khi giảm
    const finalPricePerNight = discount > 0 
      ? Math.round(originalPrice * (1 - discount / 100)) 
      : originalPrice;

    if (!finalPricePerNight) return res.status(400).json({ message: "Room price missing" });

    // --- KIỂM TRA SỨC CHỨA & NGÀY THÁNG ---
    if (guestsCount > roomExists.maxPeople) {
      return res.status(400).json({ message: "Guests exceed room capacity" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
    if (nights < 1) return res.status(400).json({ message: "At least 1 night required" });

    // Kiểm tra trùng lịch
    const conflict = await Booking.findOne({
      room,
      status: { $nin: ["cancelled"] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });
    if (conflict) return res.status(400).json({ message: "Room already booked" });

    // --- LOGIC TÍNH TỔNG TIỀN VÀ CỌC ---
    const totalPrice = finalPricePerNight * nights; // Tổng tiền dựa trên giá đã giảm
    const DEPOSIT_RATE = 0.3; 
    const depositAmount = Math.round(totalPrice * DEPOSIT_RATE);
    const remainingAmount = totalPrice - depositAmount;

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
        pricePerNight: finalPricePerNight, // Lưu lại giá đã giảm vào lịch sử đơn
        originalPrice: originalPrice,      // Lưu thêm giá gốc để đối soát nếu cần
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
    });

    console.log("✅ BOOKING CREATED WITH DISCOUNT:", booking._id, "Total:", totalPrice);
    return res.status(201).json({ message: "Booking created successfully", booking });
  } catch (error) {
    console.error("❌ CREATE BOOKING ERROR:", error);
    return res.status(500).json({ message: error.message });
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
    let bookings = await Booking.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate("room", "name type price photos")
      .populate("hotel", "name city address photos");

    bookings = bookings.filter((b) => b.room !== null && b.hotel !== null);
    return res.json(bookings);
  } catch (error) {
    return res.status(500).json({ message: error.message });
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
      .select("paymentStatus status"); // Chỉ lấy các trường cần thiết để tối ưu tốc độ

    if (!booking) {
      return res.status(404).json({ message: "Không tìm thấy đơn hàng" });
    }

    return res.json({
      paymentStatus: booking.paymentStatus, // UNPAID, DEPOSITED, hoặc PAID
      status: booking.status                // pending, confirmed...
    });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
export const checkAvailability = async (req, res) => {
  try {
    const { roomId } = req.params;
    const { checkInDate, checkOutDate } = req.body; // Đây là dữ liệu từ Frontend gửi lên

    // Chuyển đổi sang Date để so sánh
    const start = new Date(checkInDate);
    const end = new Date(checkOutDate);

    // TÌM KIẾM THEO ĐÚNG TÊN TRƯỜNG TRONG MODEL (checkIn, checkOut)
    const conflict = await Booking.findOne({
      room: roomId,
      status: { $nin: ["cancelled"] }, // Bỏ qua đơn đã hủy
      $or: [
        {
          // Logic: Nếu ngày Check-in hiện có TRƯỚC ngày khách định Check-out
          // VÀ ngày Check-out hiện có SAU ngày khách định Check-in
          checkIn: { $lt: end }, 
          checkOut: { $gt: start }
        }
      ]
    });

    return res.status(200).json({
      success: true,
      available: !conflict, // Nếu tìm thấy conflict thì available = false
      message: conflict ? "Phòng đã có khách đặt" : "Phòng trống"
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};