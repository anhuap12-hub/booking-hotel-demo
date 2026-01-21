import nodemailer from "nodemailer";

export const sendVerifyEmail = async (to, verifyLink) => {
  // Cấu hình transporter tối ưu cho Gmail trên môi trường Cloud (như Render)
  const transporter = nodemailer.createTransport({
    service: "gmail", // Ưu tiên sử dụng service 'gmail' để Nodemailer tự cấu hình host/port
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    // Thêm các tùy chọn này để tăng tính ổn định
    tls: {
      // Cho phép gửi mail ngay cả khi chứng chỉ SSL/TLS không khớp hoàn toàn (tránh lỗi CONN)
      rejectUnauthorized: false 
    },
    connectionTimeout: 10000, // 10 giây sẽ dừng kết nối nếu không phản hồi
    greetingTimeout: 5000,
    socketTimeout: 15000,
  });

  console.log("📨 Đang chuẩn bị gửi mail tới:", to);

  try {
    const info = await transporter.sendMail({
      from: `"Booking Hotel" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Xác thực tài khoản của bạn",
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6; max-width: 500px; margin: 0 auto; border: 1px solid #e0e0e0; padding: 20px; border-radius: 10px;">
          <h2 style="color: #1976d2; text-align: center;">Chào mừng bạn đến với Booking Hotel!</h2>
          <p>Cảm ơn bạn đã đăng ký. Để hoàn tất quy trình, vui lòng nhấn vào nút bên dưới để xác thực email:</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${verifyLink}"
               style="display: inline-block; padding: 12px 24px; background-color: #1976d2; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold;">
               Xác Thực Email
            </a>
          </div>
          <p style="font-size: 13px; color: #666;">
            Lưu ý: Liên kết này sẽ hết hạn sau <b>30 phút</b>. Nếu bạn không thực hiện yêu cầu này, vui lòng bỏ qua email.
          </p>
          <hr style="border: 0; border-top: 1px solid #eee; margin: 20px 0;" />
          <p style="font-size: 12px; color: #999; text-align: center;">Đây là email tự động, vui lòng không phản hồi.</p>
        </div>
      `,
    });
    console.log("✅ Mail gửi thành công:", info.messageId);
  } catch (error) {
    // Không ném lỗi (throw error) ở đây nếu bạn muốn luồng Register bên ngoài tiếp tục chạy
    console.error("❌ LỖI GỬI EMAIL THỰC TẾ:", error.message);
    // Tùy chọn: Có thể ném lỗi nếu bạn thực sự bắt buộc phải gửi được mail mới cho đăng ký
    // throw new Error("Failed to send verification email"); 
  }
};