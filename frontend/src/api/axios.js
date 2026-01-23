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
    // Luôn lấy token mới nhất từ LocalStorage trước mỗi request
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
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const { accessToken } = res.data;
        localStorage.setItem("accessToken", accessToken);
        
        // Cập nhật lại header cho cả instance và request hiện tại
        instance.defaults.headers.common["Authorization"] = `Bearer ${accessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${accessToken}`;
        
        return instance(originalRequest);
      } catch (refreshError) {
        localStorage.clear(); // Xóa sạch để đảm bảo an toàn
        if (window.location.pathname !== "/login") {
          window.location.href = "/login";
        }
        return Promise.reject(refreshError);
      }
    }

    // TRƯỜNG HỢP 2: Lỗi 403 (Forbidden - Sai quyền Admin)
    if (error.response?.status === 403) {
      console.error("Quyền truy cập bị từ chối!");
      // Bạn có thể không cần redirect, nhưng nên báo lỗi cụ thể ở Dashboard
    }

    return Promise.reject(error);
  }
);

export default instance;