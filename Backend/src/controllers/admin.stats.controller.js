import Transaction from "../models/Transaction.js";
import Booking from "../models/Booking.js";

export const getAdminStats = async (req, res) => {
  try {
    const { startDate, endDate } = req.query;
    
    // Tạo filter mặc định (lấy tất cả nếu không có ngày)
    let transactionQuery = {};

    // Nếu có truyền ngày, thiết lập điều kiện lọc từ 00:00:00 ngày bắt đầu đến 23:59:59 ngày kết thúc
    if (startDate && endDate) {
      transactionQuery.createdAt = {
        $gte: new Date(new Date(startDate).setHours(0, 0, 0, 0)),
        $lte: new Date(new Date(endDate).setHours(23, 59, 59, 999)),
      };
    }

    // 1. Thống kê số lượng đơn (Thường lấy tổng thể hoặc theo cùng kỳ lọc)
    const total = await Booking.countDocuments();
    const confirmed = await Booking.countDocuments({ status: "confirmed" });
    const cancelled = await Booking.countDocuments({ status: "cancelled" });
    const noShow = await Booking.countDocuments({ status: "no_show" });

    // 2. Lấy dữ liệu từ bảng Transaction theo filter ngày
    const transactions = await Transaction.find(transactionQuery)
      .populate({
        path: 'bookingId',
        select: 'guest roomSnapshot' 
      })
      .sort({ createdAt: -1 });

    let totalDeposited = 0;      
    let totalCashCollected = 0;  
    let totalRefunded = 0;       

    transactions.forEach(t => {
      if (t.type === "INFLOW") {
        if (t.method === "BANK_TRANSFER") totalDeposited += t.amount;
        if (t.method === "CASH") totalCashCollected += t.amount;
      } else if (t.type === "OUTFLOW") {
        totalRefunded += t.amount;
      }
    });

    const totalRevenue = (totalDeposited + totalCashCollected) - totalRefunded;
    const conversionRate = total ? Math.round((confirmed / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total,
        confirmed,
        cancelled,
        noShow,
        conversionRate,
        totalDeposited,
        totalCashCollected,
        totalRevenue,
        totalRefunded,
        // Khi đã lọc, chúng ta trả về toàn bộ danh sách đã lọc để hiển thị/xuất Excel
        paymentHistory: transactions.map(t => ({
          createdAt: t.createdAt,
          bookingId: t.bookingId?._id,
          type: t.type,
          method: t.method,
          amount: t.amount,
          guestName: t.bookingId?.guest?.name
        }))
      }
    });
  } catch (err) {
    console.error("STATS_ERROR:", err);
    res.status(500).json({ message: "Lỗi lấy thống kê tài chính" });
  }
};