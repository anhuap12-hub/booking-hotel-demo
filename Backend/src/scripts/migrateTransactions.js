import Transaction from "../models/Transaction.js";
import Booking from "../models/Booking.js";
import connectDB from "../config/db.js";
import dotenv from "dotenv";
dotenv.config();

const migrate = async () => {
  await connectDB();
  const bookings = await Booking.find({ paymentStatus: { $in: ["PAID", "DEPOSITED"] } });
  
  console.log(`🚀 Đang chuyển đổi ${bookings.length} đơn hàng sang giao dịch...`);
  
  for (const b of bookings) {
    // Kiểm tra xem đã có transaction cho booking này chưa để tránh trùng
    const exists = await Transaction.findOne({ bookingId: b._id });
    if (!exists && b.depositAmount > 0) {
      await Transaction.create({
        bookingId: b._id,
        amount: b.depositAmount,
        type: "INFLOW",
        method: b.depositAmount === b.totalPrice ? "CASH" : "BANK_TRANSFER",
        description: "Dữ liệu chuyển đổi từ hệ thống cũ",
        createdAt: b.paidAt || b.createdAt
      });
    }
  }
  console.log("✅ Hoàn thành! Dashboard của bạn đã có dữ liệu.");
  process.exit();
};
migrate();