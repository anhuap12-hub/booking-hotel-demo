import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import fetch from "node-fetch";
import Transaction from "../models/Transaction.js";

export const sepayWebhook = async (req, res) => {
  try {
    const { content, transferAmount, amount, referenceCode } = req.body;
    const finalAmount = transferAmount || amount || 0;

    // 1. Kiểm tra an toàn trước khi match
    if (!content) return res.status(200).json({ message: "No content" });

    const match = content.match(/DH([a-zA-Z0-9]{6,10})/i);
    const orderCode = match ? match[1] : null;

    if (!orderCode) return res.status(200).json({ message: "No DH code found" });

    // 2. Tìm kiếm đơn hàng UNPAID duy nhất
    const booking = await Booking.findOne({
      $expr: {
        $regexMatch: {
          input: { $toString: "$_id" },
          regex: orderCode + "$",
          options: "i"
        }
      },
      paymentStatus: "UNPAID" // Chỉ lấy đơn chưa thanh toán
    });

    if (!booking) {
      console.log(`Webhook: Không tìm thấy đơn UNPAID cho mã ${orderCode}`);
      return res.status(200).json({ message: "Booking not found or already paid" });
    }

    // 3. Thực hiện cập nhật an toàn
    booking.paymentStatus = "DEPOSITED";
    booking.depositAmount = finalAmount;
    booking.remainingAmount = Math.max(0, (booking.totalPrice || 0) - finalAmount);
    booking.status = "confirmed";
    booking.paidAt = new Date();
    
    // Đảm bảo logs là mảng
    if (!booking.paymentLogs) booking.paymentLogs = [];
    booking.paymentLogs.push({
      at: new Date(),
      action: "DEPOSITED",
      note: `Khách cọc qua SePay. Ref: ${referenceCode}`
    });

    await booking.save();

    // 4. Update phòng (bọc try-catch)
    if (booking.room) {
      try {
        await Room.findByIdAndUpdate(booking.room, { displayStatus: "booked" });
      } catch (err) { console.error("Room update error", err); }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("WEBHOOK ERROR:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

const sendBookingEmail = async (booking) => {
  if (!booking.guest?.email) return;

  const shortId = booking._id.toString().slice(-6).toUpperCase();

  const emailData = {
    sender: { name: "Coffee Stay", email: "anhuap12@gmail.com" },
    to: [{ email: booking.guest.email }],
    subject: `[Xác nhận] Thanh toán thành công đơn hàng DH${shortId}`,
    htmlContent: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: auto; border: 1px solid #ddd; padding: 20px; border-radius: 10px;">
        <h2 style="color: #1a73e8; text-align: center;">Thanh Toán Thành Công!</h2>
        <p>Xin chào <strong>${booking.guest.name}</strong>,</p>
        <p>Coffee Stay xác nhận đã nhận được tiền đặt cọc cho mã đơn hàng <strong>DH${shortId}</strong>.</p>
        
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 5px 0;"><strong>Phòng:</strong> ${booking.roomSnapshot?.name || "Phòng đã đặt"}</p>
          <p style="margin: 5px 0;"><strong>Ngày nhận phòng:</strong> ${new Date(booking.checkIn).toLocaleDateString('vi-VN')}</p>
          <p style="margin: 5px 0;"><strong>Số tiền đặt cọc:</strong> ${booking.depositAmount.toLocaleString()} VNĐ</p>
        </div>

        <p>Cảm ơn bạn đã lựa chọn dịch vụ của chúng tôi. Hẹn gặp bạn vào ngày nhận phòng!</p>
        <p style="font-size: 12px; color: #777;">(Đây là email tự động, vui lòng không phản hồi lại email này)</p>
      </div>
    `
  };

  const res = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json"
    },
    body: JSON.stringify(emailData)
  });

  if (!res.ok) {
    const errorDetail = await res.text();
    throw new Error(`Brevo Error: ${errorDetail}`);
  }
};