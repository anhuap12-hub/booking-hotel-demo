import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

export const sepayWebhook = async (req, res) => {
  try {
    const { content, transferAmount } = req.body;
    console.log(`📩 Webhook nhận: ${content} - ${transferAmount}đ`);

    // 1. Sửa Regex để lấy đủ ký tự chữ cái (không chỉ a-f)
    const orderCode = content.match(/DH([a-zA-Z0-9]+)/)?.[1];
    if (!orderCode) {
      console.log("⚠️ Nội dung không chứa mã DH hợp lệ");
      return res.status(200).json({ message: "No DH code" });
    }

    // 2. Tìm Booking
    const booking = await Booking.findOne({
      $expr: {
        $regexMatch: {
          input: { $toString: "$_id" },
          regex: orderCode + "$",
          options: "i"
        }
      }
    });

    if (!booking) {
      console.log("❌ Không tìm thấy đơn hàng:", orderCode);
      return res.status(200).json({ message: "Not found" });
    }

    // 3. Cập nhật trạng thái
    if (booking.paymentStatus !== "DEPOSITED") {
      booking.paymentStatus = "DEPOSITED";
      booking.status = "confirmed";
      booking.paidAt = new Date();
      booking.expireAt = undefined; // Gỡ bỏ TTL (không xóa đơn)

      booking.paymentLogs.push({
        at: new Date(),
        action: "DEPOSITED", 
        note: `Thanh toán SePay thành công: ${transferAmount}đ`
      });

      await booking.save();
      
      // Cập nhật trạng thái phòng sang 'booked'
      await Room.findByIdAndUpdate(booking.room, { displayStatus: "booked" });

      // 4. GỌI HÀM GỬI EMAIL (Quan trọng)
      sendBookingEmail(booking).catch(err => console.error("❌ Lỗi gửi mail:", err));

      console.log("✅ Xác nhận thành công đơn:", booking._id);
    }

    res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ SePay Webhook Error:", error);
    res.status(500).send("Internal Server Error");
  }
};

const sendBookingEmail = async (booking) => {
  if (!booking.guest?.email) return;

  const data = {
    sender: { name: "Coffee Stay", email: "anhuap12@gmail.com" },
    to: [{ email: booking.guest.email }],
    subject: `Xác nhận đặt cọc thành công - DH${booking._id.toString().slice(-6).toUpperCase()}`,
    htmlContent: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
        <h2 style="color: #2c3e50; text-align: center;">Xác Nhận Đặt Cọc Thành Công</h2>
        <p>Chào <strong>${booking.guest.name}</strong>,</p>
        <p>Coffee Stay đã nhận được tiền cọc cho phòng <strong>${booking.roomSnapshot.name}</strong>.</p>
        <div style="background: #f9f9f9; padding: 15px; border-radius: 5px; margin: 20px 0;">
          <p><strong>Mã đơn:</strong> DH${booking._id.toString().slice(-6).toUpperCase()}</p>
          <p><strong>Ngày nhận phòng:</strong> ${new Date(booking.checkIn).toLocaleDateString('vi-VN')}</p>
          <p><strong>Số tiền đã cọc:</strong> ${booking.depositAmount.toLocaleString()}đ</p>
        </div>
        <p>Hẹn gặp bạn sớm!</p>
      </div>
    `,
  };

  const response = await fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`Brevo API Error: ${errText}`);
  }
};