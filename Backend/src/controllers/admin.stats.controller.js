import Transaction from "../models/Transaction.js";
import Booking from "../models/Booking.js";

export const getAdminStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    let query = {};

    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    const [total, confirmed, cancelled, noShow, transactions] = await Promise.all([
      Booking.countDocuments(query),
      Booking.countDocuments({ ...query, status: "confirmed" }),
      Booking.countDocuments({ ...query, status: "cancelled" }),
      Booking.countDocuments({ ...query, status: "no_show" }),
      Transaction.find(query)
        .populate({ path: 'bookingId', select: 'guest' })
        .sort({ createdAt: -1 })
    ]);

    let totalDeposited = 0;      
    let totalCashCollected = 0;  
    let totalRefunded = 0;       

    transactions.forEach(t => {
      const method = (t.method || "").toUpperCase();
      const amount = Number(t.amount) || 0;

      if (t.type === "INFLOW") {
        if (method === "CASH") {
          totalCashCollected += amount;
        } else {
          totalDeposited += amount;
        }
      } else if (t.type === "OUTFLOW") {
        totalRefunded += amount;
      }
    });

    const totalRevenue = totalDeposited + totalCashCollected;
    const conversionRate = total ? Math.round((confirmed / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total, confirmed, cancelled, noShow, conversionRate,
        totalDeposited,
        totalCashCollected,
        totalRevenue,
        totalRefunded,
        paymentHistory: transactions.map(t => ({
          createdAt: t.createdAt,
          bookingId: t.bookingId?._id,
          type: t.type,
          method: t.method,
          amount: t.amount,
          guestName: t.bookingId?.guest?.name || "Khách vãng lai"
        }))
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, message: "Lỗi lấy thống kê tài chính" });
  }
};