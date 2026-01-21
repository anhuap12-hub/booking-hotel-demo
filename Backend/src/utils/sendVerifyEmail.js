import nodemailer from "nodemailer";

export const sendVerifyEmail = async (to, verifyLink) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 465, // Chuyển sang cổng 465
    secure: true, // Phải để là true khi dùng cổng 465
    auth: {
      user: process.env.BREVO_USER || "a091db001@smtp-brevo.com",
      pass: process.env.BREVO_PASS || "Nq9LMbAfaWRk80UD",
    },
    // Thêm timeout để tránh chờ đợi quá lâu nếu có lỗi mạng
    connectionTimeout: 10000, 
  });

  console.log(`🚀 Đang cố gắng gửi mail tới: ${to} qua Port 465...`);

  // Chạy ngầm để không làm treo server
  transporter.sendMail({
    from: `"Coffee Stay" <anhuap12@gmail.com>`,
    to: to,
    subject: "Xác thực tài khoản Coffee Stay",
    html: `
      <div style="font-family: Arial; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #1976d2;">Chào mừng bạn!</h2>
        <p>Vui lòng xác thực tài khoản của bạn tại đây:</p>
        <a href="${verifyLink}" style="background: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Xác thực ngay</a>
      </div>
    `,
  })
  .then(() => {
    console.log(`✅ [SUCCESS] Mail đã gửi tới ${to} thành công!`);
  })
  .catch((error) => {
    console.error(`❌ [ERROR] Lỗi gửi mail vẫn bị: ${error.message}`);
  });
};