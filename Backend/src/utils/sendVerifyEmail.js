export const sendVerifyEmail = async (to, verifyLink) => {
  console.log(`🚀 Đang gửi mail qua API tới: ${to}...`);

  const data = {
    // Email này đã được bạn Verify thành công (tích xanh) trong hình image_b93d12.png
    sender: { name: "Coffee Stay", email: "anhuap12@gmail.com" }, 
    to: [{ email: to }],
    subject: "Xác thực tài khoản Coffee Stay",
    htmlContent: `
      <div style="font-family: Arial; padding: 20px; border: 1px solid #ddd; border-radius: 10px;">
        <h2 style="color: #1976d2;">Xác thực tài khoản</h2>
        <p>Chào mừng bạn! Vui lòng nhấn vào nút bên dưới để xác thực:</p>
        <a href="${verifyLink}" style="background: #1976d2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">Xác thực ngay</a>
      </div>
    `,
  };

  // Sử dụng fetch để gọi API của Brevo - Cực nhanh và không bị timeout
  fetch("https://api.brevo.com/v3/smtp/email", {
    method: "POST",
    headers: {
      "accept": "application/json",
      "api-key": process.env.BREVO_API_KEY,
      "content-type": "application/json",
    },
    body: JSON.stringify(data),
  })
  .then((response) => {
    if (response.ok) {
      console.log(`✅ [SUCCESS] API đã gửi mail tới ${to} thành công!`);
    } else {
      console.error("❌ [API ERROR]:", response.statusText);
    }
  })
  .catch((error) => {
    console.error("❌ [FETCH ERROR]:", error.message);
  });
};