import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import nodemailer from "nodemailer";

export const sepayWebhook = async (req, res) => {
  try {
    const { content, transferAmount, gateway } = req.body;
    console.log(`📩 Nhận Webhook SePay: ${content} - ${transferAmount}đ`);

    // 1. Lấy mã đơn hàng từ nội dung (Regex lấy phần chữ/số sau "DH")
    const orderCode = content.match(/DH([a-fA-F0-9]+)/)?.[1]; 
    if (!orderCode) {
      return res.status(200).json({ message: "Nội dung không chứa mã đơn DH..." });
    }

    // 2. Tìm đơn hàng: Hỗ trợ cả ID đầy đủ hoặc 6 ký tự cuối
    // Dùng regex để tìm document có ID kết thúc ($) bằng orderCode
    const booking = await Booking.findOne({
      _id: { $regex: new RegExp(orderCode + "$", "i") }
    });

    if (!booking) {
      console.log(`❌ Không tìm thấy đơn hàng cho mã: ${orderCode}`);
      return res.status(200).json({ message: "Đơn hàng không tồn tại" });
    }

    // 3. Kiểm tra trạng thái tránh xử lý trùng
    const currentStatus = booking.paymentStatus.toUpperCase();
    if (currentStatus === "DEPOSITED" || currentStatus === "PAID") {
      return res.status(200).json({ message: "Đơn hàng đã được xử lý từ trước" });
    }

    // 4. KIỂM TRA SỐ TIỀN (Chấp nhận tiền cọc thật HOẶC 2,000đ để bạn test)
    const isTestPayment = Number(transferAmount) === 2000;
    const isCorrectDeposit = transferAmount >= (booking.depositAmount - 100);

    if (isTestPayment || isCorrectDeposit) {
      // Cập nhật trạng thái Booking
      booking.paymentStatus = "DEPOSITED"; 
      booking.status = "confirmed";        
      booking.paidAt = new Date();
      booking.expireAt = undefined; // QUAN TRỌNG: Gỡ bỏ tự động xóa đơn sau 30p

      booking.paymentLogs.push({
        at: new Date(),
        action: "DEPOSITED",
        note: `Thanh toán qua SePay (${gateway}). Nhận: ${transferAmount.toLocaleString()}đ. ${isTestPayment ? "(Giao dịch Test)" : ""}`
      });
      
      await booking.save();
      
      // Cập nhật trạng thái hiển thị của phòng
      await Room.findByIdAndUpdate(booking.room, { displayStatus: "booked" });

      // Gửi email thông báo (Chạy ngầm không đợi)
      sendBookingEmail(booking).catch(err => console.error("❌ Email Error:", err));

      console.log(`✅ Xác nhận thành công đơn: ${booking._id}`);
    } else {
      console.log(`⚠️ Số tiền không khớp. Cần cọc: ${booking.depositAmount}, Nhận: ${transferAmount}`);
    }

    // Luôn trả về 200 để SePay không gửi lại webhook
    res.status(200).json({ success: true });

  } catch (error) {
    console.error("❌ SePay Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

/**
 * Hàm gửi Email thông báo
 */
const sendBookingEmail = async (booking) => {
  if (!booking.guest?.email) return;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: `"Coffee Stay" <${process.env.EMAIL_USER}>`,
    to: booking.guest.email,
    subject: `Xác nhận đặt cọc thành công - Đơn hàng DH${booking._id.toString().slice(-6).toUpperCase()}`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
        <h2 style="color: #2c3e50; text-align: center;">Xác Nhận Đặt Cọc Thành Công</h2>
        <p>Chào <strong>${booking.guest.name}</strong>,</p>
        <p>Coffee Stay đã nhận được khoản thanh toán cọc cho đơn hàng của bạn.</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px;">
          <p><strong>Phòng:</strong> ${booking.roomSnapshot.name}</p>
          <p><strong>Ngày nhận phòng:</strong> ${new Date(booking.checkIn).toLocaleDateString('vi-VN')}</p>
          <p><strong>Ngày trả phòng:</strong> ${new Date(booking.checkOut).toLocaleDateString('vi-VN')}</p>
          <p><strong>Số tiền đã cọc:</strong> ${booking.depositAmount.toLocaleString()}đ</p>
          <p><strong>Số tiền cần thanh toán khi check-in:</strong> ${booking.remainingAmount.toLocaleString()}đ</p>
        </div>
        <p style="margin-top: 20px;">Hẹn gặp bạn sớm tại Coffee Stay!</p>
      </div>
    `
  };

  return transporter.sendMail(mailOptions);
};