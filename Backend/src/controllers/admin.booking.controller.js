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

    if (booking.paymentStatus === "PAID") {
      return res
        .status(400)
        .json({ message: "Booking already paid" });
    }

    booking.paymentStatus = "PAID";
    booking.paidAt = new Date();
    booking.paidBy = req.user.id;

    booking.paymentLogs.push({
      by: req.user.id,
      action: "PAID",
      note: "Admin xác nhận thanh toán",
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
    const { amount, note } = req.body; // Lấy số tiền Admin nhập từ Frontend
    const booking = await Booking.findById(req.params.id);

    if (!booking) return res.status(404).json({ message: "Booking not found" });
    if (booking.paymentStatus === "PAID") return res.status(400).json({ message: "Already paid" });

    // --- LOGIC QUAN TRỌNG TẠI ĐÂY ---
    // Nếu số tiền nhập vào < tổng tiền phòng => Trạng thái là ĐÃ CỌC (DEPOSITED)
    // Nếu số tiền >= tổng tiền phòng => Trạng thái là ĐÃ THANH TOÁN (PAID)
    
    const isFullPayment = amount >= booking.totalPrice;

    if (isFullPayment) {
      booking.paymentStatus = "PAID";
      booking.depositAmount = booking.totalPrice; // Đã trả đủ
      booking.remainingAmount = 0;
      booking.status = "confirmed"; // Xác nhận đơn luôn khi trả đủ
    } else {
      booking.paymentStatus = "DEPOSITED";
      booking.depositAmount = (booking.depositAmount || 0) + Number(amount); // Cộng dồn tiền cọc
      booking.remainingAmount = booking.totalPrice - booking.depositAmount;
      booking.status = "confirmed"; // Trả cọc cũng cho phép xác nhận đơn
    }

    booking.paidAt = new Date();
    booking.paidBy = req.user.id;

    booking.paymentLogs.push({
      at: new Date(),
      by: req.user.id,
      action: isFullPayment ? "PAID" : "DEPOSITED",
      note: note || (isFullPayment ? "Xác nhận thanh toán đủ" : `Xác nhận nhận cọc: ${amount.toLocaleString()}đ`),
    });

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error("PAY BOOKING ERROR:", err);
    res.status(500).json({ message: "Payment update failed" });
  }
};