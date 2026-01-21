import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

export const sepayWebhook = async (req, res) => {
  try {
    // SePay gửi dữ liệu qua body
    const { content, transferAmount, transactionDate, gateway } = req.body;

    // 1. Tách mã đơn hàng từ nội dung chuyển khoản (Regex lấy ID sau chuỗi "DH")
    const bookingId = content.match(/DH([a-fA-F0-9]{24})/)?.[1]; 
    if (!bookingId) {
      return res.status(200).json({ message: "Nội dung không chứa mã đơn DH..." });
    }

    // 2. Tìm đơn hàng trong Database
    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(200).json({ message: "Đơn hàng không tồn tại" });
    }

    // Kiểm tra trạng thái: Nếu đã cọc (DEPOSITED) hoặc đã trả hết (PAID) thì không xử lý lại
    // Chú ý: .toUpperCase() để đồng bộ với tiền xử lý trong Schema
    const currentStatus = booking.paymentStatus.toUpperCase();
    if (currentStatus === "DEPOSITED" || currentStatus === "PAID") {
      return res.status(200).json({ message: "Đơn hàng đã được xử lý trước đó" });
    }

    // 3. KIỂM TRA SỐ TIỀN CỌC
    // Cho phép sai số nhỏ (ví dụ 100đ) để tránh lỗi làm tròn tiền
    if (transferAmount >= (booking.depositAmount - 100)) {
      
      booking.paymentStatus = "DEPOSITED"; // Trạng thái: Đã đặt cọc
      booking.status = "confirmed";        // Trạng thái đơn: Đã xác nhận giữ chỗ
      booking.paidAt = new Date();
      
      // Lưu lịch sử thanh toán vào logs
      booking.paymentLogs.push({
        at: new Date(),
        action: "DEPOSITED",
        note: `Thanh toán cọc tự động qua SePay (${gateway}). Số tiền: ${transferAmount.toLocaleString()}đ`
      });
      
      await booking.save();
      
      // 4. CẬP NHẬT SƠ ĐỒ PHÒNG
      // Cập nhật trạng thái hiển thị của phòng để Admin Map nhảy màu CAM
      await Room.findByIdAndUpdate(booking.room, { 
        displayStatus: "booked" 
      });

      console.log(`✅ [SePay] Xác nhận đặt cọc thành công đơn: ${bookingId}`);
    } else {
      console.log(`⚠️ [SePay] Số tiền không đủ. Yêu cầu cọc: ${booking.depositAmount}, Nhận: ${transferAmount}`);
    }

    // SePay yêu cầu phản hồi HTTP 200 để xác nhận đã nhận webhook thành công
    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ SePay Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
};