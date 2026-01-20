// utils/sendVerifyEmail.js
import nodemailer from "nodemailer";

export const sendVerifyEmail = async (to, verifyLink) => {
  const transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST || "smtp.gmail.com",
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
console.log("ENV CHECK:", {
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASS: !!process.env.EMAIL_PASS,
});
  try {
    await transporter.sendMail({
      from: `"Booking Hotel" <${process.env.EMAIL_USER}>`,
      to,
      subject: "Verify your email",
      html: `
        <div style="font-family: Arial; line-height:1.6">
          <h2>Verify your email</h2>
          <p>Click the button below to verify your email:</p>
          <a href="${verifyLink}"
             style="display:inline-block;padding:10px 16px;
                    background:#1976d2;color:#fff;
                    text-decoration:none;border-radius:6px">
             Verify Email
          </a>
          <p style="margin-top:16px;font-size:13px;color:#666">
            This link will expire in 30 minutes.
          </p>
        </div>
      `,
    });
  } catch (error) {
    console.error("❌ SEND VERIFY EMAIL ERROR:", error);
    throw new Error("Failed to send verification email");
  }
};
