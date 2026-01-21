import nodemailer from "nodemailer";

export const sendVerifyEmail = async (to, verifyLink) => {
  const transporter = nodemailer.createTransport({
    host: "smtp-relay.brevo.com",
    port: 587,
    secure: false, 
    auth: {
      user: process.env.BREVO_USER,
      pass: process.env.BREVO_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Booking Hotel" <${process.env.BREVO_USER}>`, 
      to: to, // Giờ bạn có thể gửi tới bất kỳ email nào
      subject: "Xác thực tài khoản của bạn",
      html: `<p>Nhấn vào link để xác thực: <a href="${verifyLink}">${verifyLink}</a></p>`,
    });
    console.log("✅ THÀNH CÔNG: Mail đã được gửi qua Brevo!");
  } catch (error) {
    console.error("❌ LỖI GỬI MAIL:", error.message);
  }
};