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
    const booking = await Booking.findById(req.params.id);
    if (!booking)
      return res.status(404).json({ message: "Booking not found" });

    if (booking.paymentStatus === "PAID")
      return res.status(400).json({ message: "Already paid" });

    booking.paymentStatus = "PAID";
    booking.paidAt = new Date();
    booking.paidBy = req.user.id;

    booking.paymentLogs.push({
      by: req.user.id,
      action: "PAID",
      note: req.body.note || "Admin xác nhận thanh toán",
    });

    booking.status = "confirmed";

    await booking.save();
    res.json(booking);
  } catch (err) {
    console.error("PAY BOOKING ERROR:", err);
    res.status(500).json({ message: "Payment update failed" });
  }
};