import axios from "axios";

const instance = axios.create({
  // Lấy từ .env (đảm bảo VITE_API_URL=https://booking-hotel-demo.onrender.com/api)
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, // Quan trọng để gửi/nhận cookie từ Render
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= 1. REQUEST INTERCEPTOR =================
// Tự động thêm Access Token vào header của mọi yêu cầu
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ================= 2. RESPONSE INTERCEPTOR =================
instance.interceptors.response.use(
  (response) => response, // Trả về data nếu request thành công
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu lỗi 401 (Hết hạn token) và chưa thử refresh lần nào
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh token
        // Lưu ý: Dùng axios (gốc) thay vì instance để tránh bị dính interceptor request
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data;

        // Lưu token mới và thực hiện lại request cũ
        localStorage.setItem("accessToken", accessToken);
        instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        
        return instance(originalRequest);
      } catch (refreshError) {
        // Nếu refresh token cũng lỗi (hết hạn cả refresh token) -> Đăng xuất
        console.error("Refresh token expired. Logging out...");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        
        // Chỉ chuyển hướng nếu không phải đang ở trang login để tránh lặp vô tận
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // Nếu là lỗi khác (500, 404, CORS) thì trả về lỗi để Frontend xử lý
    return Promise.reject(error);
  }
);

export default instance;