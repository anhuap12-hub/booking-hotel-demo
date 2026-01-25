import Booking from "../models/Booking.js";
import Transaction from "../models/Transaction.js";
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

/* ======================
   CONFIRM PAYMENT (ADMIN)
====================== */
export const confirmPayment = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    if (booking.paymentStatus === "PAID" && booking.remainingAmount === 0) {
      return res.status(400).json({ message: "Booking already paid and cleared" });
    }

    const amountToCollect = booking.totalPrice - (booking.depositAmount || 0);

    // GHI GIAO DỊCH NẾU CÓ THU THÊM TIỀN
    if (amountToCollect > 0) {
      await Transaction.create({
        bookingId: booking._id,
        amount: amountToCollect,
        type: "INFLOW",
        method: "CASH",
        description: `Admin xác nhận thanh toán đủ đơn #${booking._id.toString().slice(-6).toUpperCase()}`
      });
    }

    booking.paymentStatus = "PAID";
    booking.depositAmount = booking.totalPrice;
    booking.remainingAmount = 0;
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
    res.status(500).json({ message: "Confirm payment failed" });
  }
};

// 2. THU TIỀN MẶT (Cập nhật số tiền thực tế)
export const markBookingPaid = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });
    
    if (booking.paymentStatus === "PAID" && (booking.depositAmount >= booking.totalPrice)) {
        return res.status(400).json({ message: "Đơn hàng này đã hoàn tất thanh toán." });
    }

    const amountToPay = req.body.amount ? Number(req.body.amount) : (booking.totalPrice - booking.depositAmount);

    // TẠO GIAO DỊCH THU TIỀN MẶT
    await Transaction.create({
      bookingId: booking._id,
      amount: amountToPay,
      type: "INFLOW",
      method: "CASH",
      description: `Thu tiền mặt: ${amountToPay.toLocaleString()}đ`
    });

    booking.depositAmount = (booking.depositAmount || 0) + amountToPay;
    
    if (booking.depositAmount >= booking.totalPrice) {
      booking.paymentStatus = "PAID";
      booking.depositAmount = booking.totalPrice;
      booking.remainingAmount = 0;
    } else {
      booking.paymentStatus = "DEPOSITED";
      booking.remainingAmount = booking.totalPrice - booking.depositAmount;
    }

    booking.status = "confirmed";
    booking.paidAt = new Date();
    booking.paidBy = req.user.id;

    booking.paymentLogs.push({
      at: new Date(),
      by: req.user.id,
      action: booking.paymentStatus === "PAID" ? "PAID" : "DEPOSITED",
      note: req.body.note || `Admin thu tiền mặt: ${amountToPay.toLocaleString()}đ`,
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    res.status(500).json({ message: "Payment update failed" });
  }
};

// 3. ĐÁNH DẤU KHÁCH KHÔNG ĐẾN (Giữ nguyên tiền, không tạo Transaction mới vì không phát sinh dòng tiền)
export const markNoShow = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Không tìm thấy đơn đặt phòng" });

    if (!["pending", "confirmed"].includes(booking.status)) {
      return res.status(400).json({ message: "Không thể đánh dấu No-show cho đơn hàng này" });
    }

    booking.status = "no_show";
    booking.paymentLogs.push({
      at: new Date(),
      by: req.user.id,
      action: "CANCELLED",
      note: "Admin đánh dấu khách không đến (No-show). Giữ tiền cọc."
    });

    await booking.save();
    res.json({ success: true, message: "Đã đánh dấu khách không đến", data: booking });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};