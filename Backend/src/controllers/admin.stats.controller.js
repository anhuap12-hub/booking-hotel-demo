import Booking from "../models/Booking.js";

export const getAdminStats = async (req, res) => {
  try {
    const total = await Booking.countDocuments();
    const newLeads = await Booking.countDocuments({ contactStatus: "NEW" });
    const contacted = await Booking.countDocuments({ contactStatus: "CONTACTED" });
    const confirmed = await Booking.countDocuments({ contactStatus: "CONFIRMED" });
    const closed = await Booking.countDocuments({ contactStatus: "CLOSED" });
    const cancelled = await Booking.countDocuments({ contactStatus: "CANCELLED" });

    const conversionRate = total
      ? Math.round((confirmed / total) * 100)
      : 0;

    res.json({
      total,
      newLeads,
      contacted,
      confirmed,
      closed,
      cancelled,
      conversionRate,
    });
  } catch (err) {
    res.status(500).json({ message: "Stats error" });
  }
};
