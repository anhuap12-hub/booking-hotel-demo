import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import fetch from "node-fetch";
import Transaction from "../models/Transaction.js";

export const sepayWebhook = async (req, res) => {
  try {
    const { content, transferAmount, amount, referenceCode } = req.body;
    const finalAmount = transferAmount || amount;

    const match = content.match(/DH([a-zA-Z0-9]{6,10})/i);
    const orderCode = match ? match[1] : null;

    if (!orderCode) return res.status(200).json({ message: "No DH code found" });

    const booking = await Booking.findOne({
      $expr: {
        $regexMatch: {
          input: { $toString: "$_id" },
          regex: orderCode.toLowerCase() + "$",
          options: "i"
        }
      }
    });

    if (!booking) return res.status(200).json({ message: "Booking not found" });

    if (booking.paymentStatus === "UNPAID") {
      await Transaction.create({
        bookingId: booking._id,
        amount: finalAmount,
        type: "INFLOW",
        method: "BANK_TRANSFER",
        description: `Khách cọc qua SePay. Ref: ${referenceCode}`
      });

      booking.paymentStatus = "DEPOSITED";
      booking.depositAmount = finalAmount;
      booking.remainingAmount = booking.totalPrice - finalAmount;
      booking.status = "confirmed";
      booking.paidAt = new Date();
      
      booking.paymentLogs.push({
        at: new Date(),
        action: "DEPOSITED",
        note: `Đã nhận cọc ${finalAmount.toLocaleString()}đ qua SePay.`
      });

      await booking.save();

      if (booking.room) {
        await Room.findByIdAndUpdate(booking.room, { displayStatus: "booked" });
      }

      try {
        await sendBookingEmail(booking);
      } catch (e) {
        console.error("📧 Email error:", e.message);
      }
    }

    return res.status(200).json({ success: true });
  } catch (error) {
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