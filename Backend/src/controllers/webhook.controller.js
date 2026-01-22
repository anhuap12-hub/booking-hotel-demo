import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import fetch from "node-fetch";

export const sepayWebhook = async (req, res) => {
  try {
    console.log("📦 SEPAY DATA:", JSON.stringify(req.body));

    const { content, transferAmount, amount, referenceCode } = req.body;
    const finalAmount = transferAmount || amount;

    // 1. Regex tối ưu: Tìm chữ DH sau đó lấy 6-10 ký tự mã đơn
    // Nó sẽ bỏ qua chữ "SEVQR " ở đầu và chỉ tập trung vào mã DH
    const match = content.match(/DH([a-zA-Z0-9]{6,10})/i);
    const orderCode = match ? match[1] : null;

    if (!orderCode) {
      console.warn("⚠️ Bỏ qua: Nội dung không có mã DH (Content: " + content + ")");
      return res.status(200).json({ message: "No DH code found" });
    }

    // 2. Tìm đơn hàng có ID kết thúc bằng orderCode
    const booking = await Booking.findOne({
      $expr: {
        $regexMatch: {
          input: { $toString: "$_id" },
          regex: orderCode.toLowerCase() + "$",
          options: "i"
        }
      }
    });

    if (!booking) {
      console.error(`❌ Không tìm thấy đơn hàng: ${orderCode}`);
      return res.status(200).json({ message: "Booking not found" });
    }

    // 3. Xử lý thanh toán nếu trạng thái là UNPAID
    if (booking.paymentStatus === "UNPAID") {
      booking.paymentStatus = "PAID";
      booking.status = "confirmed";
      booking.paidAt = new Date();
      
      booking.paymentLogs.push({
        at: new Date(),
        action: "PAID_VIA_SEPAY",
        note: `Đã nhận ${finalAmount.toLocaleString()}đ. Ref: ${referenceCode}`
      });

      await booking.save();

      // Cập nhật trạng thái phòng thành 'booked'
      if (booking.room) {
        await Room.findByIdAndUpdate(booking.room, { displayStatus: "booked" });
      }
      
      console.log(`✅ Đã xác nhận đơn hàng: ${booking._id}`);

      // 4. GỬI EMAIL THÔNG BÁO (Bọc trong try-catch để không làm treo Webhook)
      try {
        await sendBookingEmail(booking);
        console.log("📧 Email xác nhận đã được gửi.");
      } catch (emailErr) {
        console.error("⚠️ Lỗi gửi email:", emailErr.message);
      }
    }

    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("💥 Lỗi Webhook:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- HÀM GỬI EMAIL ---
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