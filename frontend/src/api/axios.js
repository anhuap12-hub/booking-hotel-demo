import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true, 
  headers: {
    "Content-Type": "application/json",
  },
});

// ================= 1. REQUEST INTERCEPTOR =================
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
  (response) => response, 
  async (error) => {
    const originalRequest = error.config;

    // TRƯỜNG HỢP 1: Lỗi 401 (Hết hạn Access Token)
    // Phải kiểm tra thêm !originalRequest._retry để tránh lặp vô tận
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Gọi API refresh dùng axios bản gốc để tránh request interceptor ở trên
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {}, 
          { withCredentials: true } // Quan trọng để gửi kèm Refresh Token trong Cookie
        );

        // Kiểm tra cấu trúc data trả về từ Backend (auth.controller.js trả về { accessToken })
        const { accessToken } = res.data;

        if (accessToken) {
          localStorage.setItem("accessToken", accessToken);
          
          // Cập nhật header cho các request sau này của instance
          instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
          
          // Cập nhật header cho CHÍNH request đang bị lỗi hiện tại
          originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
          
          // Thực hiện lại request ban đầu với token mới
          return instance(originalRequest);
        }
      } catch (refreshError) {
        // Nếu vào đây nghĩa là Refresh Token cũng đã hết hạn hoặc không hợp lệ
        console.error("Refresh token expired or invalid:", refreshError);
        
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        
        if (window.location.pathname !== "/login") {
          window.location.href = "/login?expired=true";
        }
        return Promise.reject(refreshError);
      }
    }

    // TRƯỜNG HỢP 2: Lỗi 403 (Forbidden - Sai quyền Admin)
    if (error.response?.status === 403) {
      console.error("Quyền truy cập bị từ chối!");
    }

    return Promise.reject(error);
  }
);

export default instance;