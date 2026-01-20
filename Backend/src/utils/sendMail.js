import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

transporter.verify((err) => {
  if (err) console.error("❌ Mail error:", err);
  else console.log("✅ Mail service ready");
});

export const sendMail = async ({ to, subject, html }) => {
  return transporter.sendMail({
    from: `"Coffee Stay Support" <${process.env.EMAIL_USER}>`,
    to,
    subject,
    html,
  });
};

// Hàm helper để gửi mail xác thực (Dùng SERVER_URL từ .env)
export const sendVerificationEmail = async (email, token) => {
  // Link này sẽ trỏ về Backend để xử lý logic verify
  const verifyUrl = `${process.env.SERVER_URL}/api/auth/verify-email?token=${token}`;

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e7e5e4; border-radius: 10px;">
      <h2 style="color: #8B6F4E;">Chào mừng bạn đến với Coffee Stay!</h2>
      <p>Cảm ơn bạn đã đăng ký. Vui lòng nhấn vào nút bên dưới để xác thực tài khoản của mình:</p>
      <a href="${verifyUrl}" 
         style="display: inline-block; padding: 12px 24px; background-color: #8B6F4E; color: white; text-decoration: none; border-radius: 5px; font-weight: bold; margin: 20px 0;">
        Xác thực tài khoản
      </a>
      <p style="font-size: 12px; color: #666;">Nếu nút trên không hoạt động, bạn có thể copy link này: <br/> ${verifyUrl}</p>
      <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
      <p style="font-size: 12px; color: #999;">Link này sẽ hết hạn trong vòng 24 giờ.</p>
    </div>
  `;

  return sendMail({ to: email, subject: "Xác thực tài khoản Coffee Stay", html });
};