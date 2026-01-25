import dotenv from "dotenv";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import connectDB from "../config/db.js";

dotenv.config();

const cleanupPaidBookings = async () => {
  try {
    await connectDB();

    // Tìm đơn bị lệch: PAID nhưng depositAmount < totalPrice
    const faultyBookings = await Booking.find({
      paymentStatus: "PAID",
      $expr: { $lt: ["$depositAmount", "$totalPrice"] }
    });

    console.log(`🔍 Phát hiện ${faultyBookings.length} đơn hàng cần xử lý...`);

    if (faultyBookings.length === 0) {
      console.log("✅ Dữ liệu đã sạch.");
      process.exit(0);
    }

    for (const b of faultyBookings) {
      const oldAmount = b.depositAmount || 0;
      const thirtyPercent = Math.round(b.totalPrice * 0.3);

      // Nếu tiền đã thu xấp xỉ 30% -> Đưa về DEPOSITED để Admin thu nốt 70%
      if (Math.abs(oldAmount - thirtyPercent) < 2000) { 
        b.paymentStatus = "DEPOSITED";
        b.remainingAmount = b.totalPrice - b.depositAmount;
        b.paymentLogs.push({
          at: new Date(),
          action: "DATA_CLEANUP", // Dùng Enum mới ở đây
          note: `Auto-fix: Trả về DEPOSITED vì thực tế mới chỉ cọc 30%`
        });
        console.log(`🔸 Booking ${b._id}: Đã đưa về trạng thái ĐÃ CỌC`);
      } 
      // Nếu tiền đã thu gần đủ 100% -> Ép cho đủ luôn
      else {
        b.depositAmount = b.totalPrice;
        b.remainingAmount = 0;
        b.paymentStatus = "PAID";
        b.paymentLogs.push({
          at: new Date(),
          action: "DATA_CLEANUP", // Dùng Enum mới ở đây
          note: `Auto-fix: Đồng bộ đủ 100% tiền.`
        });
        console.log(`🔹 Booking ${b._id}: Đã ép về trạng thái ĐÃ THANH TOÁN ĐỦ`);
      }

      await b.save();
    }

    console.log("🎉 Cleanup hoàn tất!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup thất bại:", err);
    process.exit(1);
  }
};

cleanupPaidBookings();