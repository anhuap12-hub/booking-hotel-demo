import Booking from "../models/Booking.js";

/* ======================
   GET ALL BOOKINGS (ADMIN)
====================== */
export const getAdminBookings = async (req, res) => {
  try {
    const bookings = await Booking.find()
      .sort({ createdAt: -1 })
      .populate("user", "name email")
      .populate("hotel", "name city")
      .populate("room", "name type price");

    res.json(bookings);
  } catch (err) {
    console.error("ADMIN GET BOOKINGS ERROR:", err);
    res.status(500).json({ message: "Fetch bookings failed" });
  }
};

/**
 * ==============================
 * ADMIN: CONFIRM REFUNDED
 * ==============================
 */
export const confirmRefunded = async (req, res) => {
  try {
    const { id } = req.params;
    const booking = await Booking.findById(id);

    if (!booking || booking.paymentStatus !== "REFUND_PENDING") {
      return res.status(400).json({ message: "Đơn hàng không ở trạng thái chờ hoàn tiền" });
    }

    booking.paymentStatus = "REFUNDED";
    booking.refundInfo.processedAt = new Date();

    booking.paymentLogs.push({
      at: new Date(),
      by: req.user._id,
      action: "REFUNDED",
      note: `Admin xác nhận đã chuyển khoản hoàn tiền thành công.`
    });

    await booking.save();
    res.status(200).json({ success: true, message: "Xác nhận hoàn tiền hoàn tất" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
/* ======================
   UPDATE CONTACT STATUS
====================== */
export const updateContactStatus = async (req, res) => {
  try {
    const { contactStatus, result, note } = req.body;

    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (contactStatus) {
      booking.contactStatus = contactStatus;
      booking.contactedAt = new Date();
    }

    if (result) {
      booking.contactLogs.push({
        by: req.user.id,
        result,
        note,
      });
    }

    await booking.save();

    res.json(booking);
  } catch (err) {
    console.error("UPDATE CONTACT ERROR:", err);
    res.status(500).json({ message: "Update failed" });
  }
};

/* ======================
   CONFIRM PAYMENT (ADMIN)
====================== */
export const confirmPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Nếu đã PAID và tiền đã đủ -> Báo lỗi để Admin biết đơn này thực sự xong rồi
    if (booking.paymentStatus === "PAID" && booking.remainingAmount === 0) {
      return res.status(400).json({ message: "Booking already paid and cleared" });
    }

    // Cập nhật trạng thái và ÉP số tiền về trạng thái hoàn tất
    booking.paymentStatus = "PAID";
    booking.depositAmount = booking.totalPrice; // Ép tiền đã thu bằng tổng tiền
    booking.remainingAmount = 0;                 // Xóa nợ hoàn toàn
    booking.paidAt = new Date();
    booking.paidBy = req.user.id;
    booking.status = "confirmed";

    booking.paymentLogs.push({
      at: new Date(),
      by: req.user.id,
      action: "PAID",
      note: "Admin xác nhận thanh toán & chuẩn hóa dữ liệu tài chính",
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error("CONFIRM PAYMENT ERROR:", err);
    res.status(500).json({ message: "Confirm payment failed" });
  }
};
/* ======================
   FOLLOW UP BOOKINGS
====================== */
export const getFollowUpBookings = async (req, res) => {
  try {
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);

    const bookings = await Booking.find({
      contactStatus: "NEW",
      createdAt: { $lte: yesterday },
    }).populate("user hotel room");

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: "Fetch follow-up failed" });
  }
};
export const markBookingPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    // Nếu status là PAID nhưng tiền vẫn nợ (lỗi logic cũ) -> Cho phép chạy tiếp để thu nốt tiền
    if (booking.paymentStatus === "PAID" && (booking.depositAmount >= booking.totalPrice)) {
        return res.status(400).json({ message: "Đơn hàng này đã hoàn tất thanh toán." });
    }

    // Lấy amount từ body, nếu không có thì mặc định là thu nốt số tiền còn lại
    const amountToPay = req.body.amount ? Number(req.body.amount) : (booking.totalPrice - booking.depositAmount);

    // Cập nhật số tiền thực tế
    booking.depositAmount = (booking.depositAmount || 0) + amountToPay;
    
    // Kiểm tra để set status cuối cùng
    if (booking.depositAmount >= booking.totalPrice) {
      booking.paymentStatus = "PAID";
      booking.depositAmount = booking.totalPrice; // Tránh sai số
      booking.remainingAmount = 0;
      booking.status = "confirmed";
    } else {
      booking.paymentStatus = "DEPOSITED";
      booking.remainingAmount = booking.totalPrice - booking.depositAmount;
      booking.status = "confirmed";
    }

    booking.paidAt = new Date();
    booking.paidBy = req.user.id;

    booking.paymentLogs.push({
      at: new Date(),
      by: req.user.id,
      action: booking.paymentStatus === "PAID" ? "PAID" : "DEPOSITED", // Dùng Enum chuẩn
      note: req.body.note || `Admin thu tiền mặt: ${amountToPay.toLocaleString()}đ`,
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error("PAY BOOKING ERROR:", err);
    res.status(500).json({ message: "Payment update failed" });
  }
};
export const markNoShow = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });

    // Chỉ cho phép chuyển sang No-show từ trạng thái pending hoặc confirmed
    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({ message: "Không thể đánh dấu No-show cho đơn hàng này" });
    }

    booking.status = "no_show";
    
    booking.paymentLogs.push({
      at: new Date(),
      by: req.user.id,
      action: "CANCELLED", // Hoặc "DATA_CLEANUP" tùy bạn, dùng CANCELLED là chuẩn nhất
      note: "Admin đánh dấu khách không đến (No-show). Giữ tiền cọc."
    });

    await booking.save();
    res.json({ success: true, message: "Đã đánh dấu khách không đến", data: booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};