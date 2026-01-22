import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

export const sepayWebhook = async (req, res) => {
  try {
    const { content, transferAmount, referenceCode } = req.body;
    
    console.log("------------------------------------------");
    console.log(`🔔 NHẬN WEBHOOK SEPAY [${new Date().toLocaleString()}]`);
    console.log(`📝 Nội dung: "${content}"`);
    console.log(`💰 Số tiền: ${transferAmount}đ`);
    console.log(`🆔 Mã tham chiếu: ${referenceCode}`);

    // 1. Trích xuất mã DH
    const orderCode = content.match(/DH([a-zA-Z0-9]+)/)?.[1];
    if (!orderCode) {
      console.warn("⚠️ Webhook bỏ qua: Nội dung không chứa mã DH hợp lệ");
      return res.status(200).json({ message: "No DH code found" });
    }

    // 2. Tìm đơn hàng
    console.log(`🔍 Đang tìm đơn hàng có đuôi ID: ${orderCode}...`);
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
      console.error(`❌ KHÔNG TÌM THẤY đơn hàng: ${orderCode}`);
      return res.status(200).json({ message: "Booking not found" });
    }

    console.log(`✅ Khớp đơn: ${booking._id} | Trạng thái: ${booking.paymentStatus}`);

    // 3. Cập nhật trạng thái
    if (booking.paymentStatus !== "DEPOSITED" && booking.paymentStatus !== "PAID") {
      booking.paymentStatus = "DEPOSITED";
      booking.status = "confirmed";
      booking.paidAt = new Date();
      booking.expireAt = undefined;

      booking.paymentLogs.push({
        at: new Date(),
        action: "DEPOSITED", 
        note: `Thanh toán qua SePay thành công: ${transferAmount}đ. Mã tham chiếu: ${referenceCode}`
      });

      await booking.save();
      
      // Cập nhật trạng thái phòng sang 'booked'
      await Room.findByIdAndUpdate(booking.room, { displayStatus: "booked" });
      console.log(`🚀 Cập nhật DB thành công cho đơn: ${booking._id}`);

      // 4. Gửi email xác nhận
      console.log(`📧 Bắt đầu gửi email tới: ${booking.guest?.email}`);
      sendBookingEmail(booking)
        .then(() => console.log("✨ Kết quả: Email đã được gửi thành công!"))
        .catch(err => console.error("❌ Kết quả: Lỗi gửi mail ->", err.message));

    } else {
      console.log(`ℹ️ Đơn hàng đã được xác nhận trước đó. Không xử lý lại.`);
    }

    console.log("------------------------------------------");
    return res.status(200).json({ success: true });

  } catch (error) {
    console.error("💥 LỖI NGHIÊM TRỌNG WEBHOOK:", error);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// --- HÀM GỬI EMAIL (GIỮ NGUYÊN VÀ THÊM LOG) ---
const sendBookingEmail = async (booking) => {
  if (!booking.guest?.email) {
    console.log("⚠️ Bỏ qua gửi mail vì không có địa chỉ email khách.");
    return;
  }

  const data = {
    sender: { name: "Coffee Stay", email: "anhuap12@gmail.com" },
    to: [{ email: booking.guest.email }],
    subject: `Xác nhận đặt cọc thành công - DH${booking._id.toString().slice(-6).toUpperCase()}`,
    htmlContent: `
      <div style="font-family: sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px; max-width: 600px;">
        <h2 style="color: #2c3e50; text-align: center;">Xác Nhận Đặt Cọc Thành Công</h2>
        <p>Chào <strong>${booking.guest.name}</strong>,</p>
        <p>Coffee Stay đã nhận được tiền cọc cho phòng <strong>${booking.roomSnapshot?.name || 'phòng đã chọn'}</strong>.</p>
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