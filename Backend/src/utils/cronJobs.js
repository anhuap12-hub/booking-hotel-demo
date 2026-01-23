import cron from "node-cron";
import Booking from "../models/Booking.js"; // Đảm bảo đường dẫn này đúng

const initCronJobs = () => {
  // Chạy mỗi 5 phút/lần
  cron.schedule("*/5 * * * *", async () => {
    try {
      const now = new Date();
      
      const result = await Booking.updateMany(
        {
          status: "pending",
          paymentStatus: "UNPAID",
          expireAt: { $lt: now }
        },
        {
          $set: { status: "cancelled" },
          $push: { 
            paymentLogs: { 
              at: now, 
              action: "SYSTEM_AUTO_CANCEL", 
              note: "Hệ thống tự động hủy đơn do quá hạn thanh toán đặt cọc." 
            } 
          }
        }
      );

      if (result.modifiedCount > 0) {
        console.log(`[CRON] 🕒 ${now.toLocaleString()}: Đã dọn dẹp ${result.modifiedCount} đơn hàng hết hạn.`);
      }
    } catch (error) {
      console.error("[CRON] ❌ Lỗi quét đơn hàng:", error);
    }
  });

  console.log("✅ Cron Job tự động hủy đơn đã được khởi tạo.");
};

export default initCronJobs;