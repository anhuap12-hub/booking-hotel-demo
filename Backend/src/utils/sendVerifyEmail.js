import nodemailer from "nodemailer";

export const sendVerifyEmail = async (to, verifyLink) => {
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465, // Đổi từ 587 thành 465
    secure: true, // Port 465 bắt buộc phải là true
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
    tls: {
      rejectUnauthorized: false
    }
  });

  console.log("📨 Thử gửi mail qua cổng 465...");

  try {
    const info = await transporter.sendMail({
      from: `"Booking Hotel" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Xác thực tài khoản",
      html: `<p>Nhấn vào đây để xác thực: <a href="${verifyLink}">${verifyLink}</a></p>`,
    });
    console.log("✅ EMAIL ĐÃ GỬI THÀNH CÔNG qua cổng 465!");
  } catch (error) {
    console.error("❌ VẪN LỖI GỬI MAIL:", error.message);
  }
};