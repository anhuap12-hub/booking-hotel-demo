import nodemailer from "nodemailer";

export const sendVerifyEmail = async (to, verifyLink) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      from: `"Coffee Stay" <${process.env.EMAIL_USER}>`,
      to: to,
      subject: "Xác thực tài  khoản Coffee Stay",
      html: `
        <div style="padding: 20px; border: 1px solid #ddd; border-radius: 8px;">
          <h2 style="color: #333;">Chào mừng bạn đến với Coffee Stay!</h2>
          <p>Bạn nhận được mail này vì đã dùng email này để đăng ký test hệ thống.</p>
          <p>Vui lòng nhấn vào link bên dưới để xác thực:</p>
          <a href="${verifyLink}" style="color: blue;">${verifyLink}</a>
        </div>
      `,
    });
    console.log("✅ Đã gửi mail thành công từ chính Gmail cá nhân!");
  } catch (error) {
    console.error("❌ Lỗi gửi mail qua Gmail:", error.message);
  }
};