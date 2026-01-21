import nodemailer from "nodemailer";

export const sendVerifyEmail = async (to, verifyLink) => {
  // Cấu hình SMTP sử dụng thông tin từ Dashboard Brevo của bạn
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, // Port 587 yêu cầu secure là false
    auth: {
      // Sử dụng Login và Password chuyên dụng từ hình ảnh cấu hình của bạn
      user: process.env.BREVO_USER || "a091db001@smtp-brevo.com", 
      pass: process.env.BREVO_PASS || "Nq9LMbAfaWRk80UD",
    },
  });

  // Thông báo ngay lập tức để giảm thời gian chờ console log
  console.log(`🚀 Khởi tạo gửi mail tới: ${to}...`);

  // Gửi mail mà không dùng 'await' để Backend phản hồi ngay lập tức cho Frontend
  transporter.sendMail({
    from: `"Coffee Stay" <anhuap12@gmail.com>`, // Email đã Verified thành công
    to: to,
    subject: "Xác thực tài khoản Coffee Stay",
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; border: 1px solid #e0e0e0; border-radius: 8px; padding: 20px;">
        <h2 style="color: #2c3e50; text-align: center;">Chào mừng bạn đến với Coffee Stay!</h2>
        <p style="font-size: 16px; color: #555;">Cảm ơn bạn đã đăng ký. Để bắt đầu sử dụng dịch vụ, vui lòng xác thực tài khoản của bạn bằng cách nhấn vào nút bên dưới:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" style="background-color: #3498db; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; font-weight: bold;">Xác thực tài khoản</a>
        </div>
        <p style="font-size: 12px; color: #999; text-align: center;">Nếu nút trên không hoạt động, bạn có thể copy link này: <br/> ${verifyLink}</p>
      </div>
    `,
  })
  .then(() => {
    console.log(`✅ [SUCCESS] Mail đã gửi tới ${to} thành công!`);
  })
  .catch((error) => {
    console.error(`❌ [ERROR] Lỗi gửi mail: ${error.message}`);
  });
};