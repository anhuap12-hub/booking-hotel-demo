import { Resend } from 'resend';

// Sử dụng API Key từ môi trường Render
const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerifyEmail = async (to, verifyLink) => {
  console.log("🚀 Resend đang gửi mail tới:", to);
  
  try {
    await resend.emails.send({
      from: 'onboarding@resend.dev', // Để mặc định như này để test
      to: to,
      subject: 'Xác thực tài khoản BookingHotel',
      html: `
        <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #eee; padding: 20px; border-radius: 10px;">
          <h2 style="color: #1976d2; text-align: center;">Xác Thực Email</h2>
          <p>Chào bạn, vui lòng nhấn vào nút bên dưới để hoàn tất đăng ký tài khoản tại BookingHotel:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}" style="background-color: #1976d2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">
              Xác Thực Ngay
            </a>
          </div>
          <p style="font-size: 12px; color: #777;">Liên kết này sẽ hết hạn sau 30 phút.</p>
        </div>
      `
    });
    console.log("✅ RESEND: Đã gửi mail thành công!");
  } catch (error) {
    console.error("❌ RESEND ERROR:", error.message);
  }
};