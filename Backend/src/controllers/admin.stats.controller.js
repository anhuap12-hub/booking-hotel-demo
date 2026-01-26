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

    // 1. Thống kê số lượng đơn THEO KỲ LỌC (để tỉ lệ conversionRate chính xác)
    const [total, confirmed, cancelled, noShow] = await Promise.all([
      Booking.countDocuments(query),
      Booking.countDocuments({ ...query, status: "confirmed" }),
      Booking.countDocuments({ ...query, status: "cancelled" }),
      Booking.countDocuments({ ...query, status: "no_show" })
    ]);

    // 2. Lấy Transaction theo kỳ lọc
    const transactions = await Transaction.find(query)
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

    // 3. TỔNG DOANH THU: Nên là tổng thực thu (Gross Revenue) 
    // để khớp với ô "Tiền cọc" + "Tiền mặt" trên giao diện Admin của bạn.
    const totalRevenue = totalDeposited + totalCashCollected;
    const conversionRate = total ? Math.round((confirmed / total) * 100) : 0;

    res.json({
      success: true,
      data: {
        total, confirmed, cancelled, noShow, conversionRate,
        totalDeposited,
        totalCashCollected,
        totalRevenue, // Bây giờ ô này sẽ bằng tổng 2 ô kia cộng lại
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
    console.error("STATS_ERROR:", err);
    res.status(500).json({ message: "Lỗi lấy thống kê tài chính" });
  }
};