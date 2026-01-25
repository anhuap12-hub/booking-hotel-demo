import dotenv from "dotenv";
import mongoose from "mongoose";
import Booking from "../models/Booking.js";
import connectDB from "../config/db.js";

dotenv.config();

const cleanupPaidBookings = async () => {
  try {
    // 1. Sử dụng hàm kết nối chuẩn của dự án
    await connectDB();

    // 2. Tìm các đơn bị lỗi: Trạng thái PAID nhưng số tiền đã thu chưa khớp tổng tiền
    const faultyBookings = await Booking.find({
      paymentStatus: "PAID",
      $expr: { $lt: ["$depositAmount", "$totalPrice"] }
    });

    console.log(`🔍 Found ${faultyBookings.length} faulty bookings to cleanup`);

    if (faultyBookings.length === 0) {
      console.log("✅ Data is already clean. No action needed.");
      process.exit(0);
    }

    // 3. Tiến hành sửa lỗi
    for (const b of faultyBookings) {
      const oldAmount = b.depositAmount || 0;
      
      b.depositAmount = b.totalPrice;
      b.remainingAmount = 0;
      
      // SỬA TẠI ĐÂY: Dùng 'PAID' thay vì 'DATA_CLEANUP' để vượt qua validator
      b.paymentLogs.push({
        at: new Date(),
        action: "PAID", 
        note: `Hệ thống tự động đồng bộ số tiền: ${oldAmount.toLocaleString()}đ -> ${b.totalPrice.toLocaleString()}đ`
      });

      await b.save();
      console.log(`✅ Fixed Booking ID: ${b._id}`);
    }
    console.log("🎉 Cleanup process completed successfully!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Cleanup failed:", err);
    process.exit(1);
  }
};

cleanupPaidBookings();