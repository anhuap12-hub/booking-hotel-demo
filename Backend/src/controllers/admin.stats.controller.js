import Booking from "../models/Booking.js";

export const getAdminStats = async (req, res) => {
  try {
    // 1. Đếm các trạng thái cơ bản
    const total = await Booking.countDocuments();
    const newLeads = await Booking.countDocuments({ contactStatus: "NEW" });
    const contacted = await Booking.countDocuments({ contactStatus: "CONTACTED" });
    const confirmed = await Booking.countDocuments({ contactStatus: "CONFIRMED" });
    const closed = await Booking.countDocuments({ contactStatus: "CLOSED" });
    const cancelled = await Booking.countDocuments({ contactStatus: "CANCELLED" });

    // 2. Tính toán tài chính (Tiền cọc và Doanh thu)
    // Chỉ tính những đơn đã cọc (DEPOSITED) hoặc đã thanh toán hết (PAID)
    const financialStats = await Booking.aggregate([
      {
        $match: {
          paymentStatus: { $in: ["PAID", "DEPOSITED"] }
        }
      },
      {
        $group: {
          _id: null,
          totalDeposited: { $sum: "$depositAmount" },
          totalRevenue: { $sum: "$totalPrice" }
        }
      }
    ]);

    const conversionRate = total ? Math.round((confirmed / total) * 100) : 0;

    // Trả về dữ liệu khớp hoàn toàn với yêu cầu của Frontend
    res.json({
      total,
      newLeads,
      contacted,
      confirmed,
      closed,
      cancelled,
      conversionRate,
      // Nếu không có đơn nào thanh toán thì trả về 0 thay vì null
      totalDeposited: financialStats[0]?.totalDeposited || 0,
      totalRevenue: financialStats[0]?.totalRevenue || 0,
    });
  } catch (err) {
    console.error("❌ Stats error:", err);
    res.status(500).json({ message: "Stats error" });
  }
};