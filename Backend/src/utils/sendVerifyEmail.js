import fetch from "node-fetch";

export const sendVerifyEmail = async (to, verifyLink) => {
  const data = {
    sender: { name: "Coffee Stay", email: "anhuap12@gmail.com" }, 
    to: [{ email: to }],
    subject: "Xác thực tài khoản Coffee Stay",
    htmlContent: `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto;">
        <h2 style="color: #1976d2; text-align: center;">Xác thực tài khoản</h2>
        <p>Chào mừng bạn đến với Coffee Stay! Vui lòng nhấn vào nút bên dưới để xác thực tài khoản của mình:</p>
        <div style="text-align: center; margin: 30px 0;">
          <a href="${verifyLink}" style="background: #1976d2; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">Xác thực ngay</a>
        </div>
        <p style="font-size: 12px; color: #666;">Nếu nút trên không hoạt động, bạn có thể copy link sau: <br/> ${verifyLink}</p>
        <hr style="border: none; border-top: 1px solid #eee; margin-top: 20px;" />
        <p style="font-size: 12px; color: #999; text-align: center;">Đây là email tự động, vui lòng không phản hồi.</p>
      </div>
    `,
  };

  try {
    const response = await fetch("https://api.brevo.com/v3/smtp/email", {
      method: "POST",
      headers: {
        "accept": "application/json",
        "api-key": process.env.BREVO_API_KEY,
        "content-type": "application/json",
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Brevo API error: ${errorText}`);
    }

    return { success: true };
  } catch (error) {
    console.error("❌ [MAIL_ERROR]:", error.message);
    return { success: false, error: error.message };
  }
};