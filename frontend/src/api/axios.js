import axios from "axios";

const instance = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

// ================= REQUEST =================
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// ================= RESPONSE =================
instance.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (!error.response || !error.config) {
      return Promise.reject(error);
    }

    const originalRequest = error.config;

    // 🔐 Access token hết hạn → refresh
    if (
      error.response.status === 401 &&
      !originalRequest._retry &&
      !originalRequest.url.includes("/auth/refresh")
    ) {
      originalRequest._retry = true;

      try {
        // ⚠️ DÙNG axios thường, KHÔNG dùng instance
        const res = await axios.post(
          `${import.meta.env.VITE_API_URL.replace(/\/$/, "")}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = res.data.accessToken;
        if (!newToken) throw new Error("No access token");

        localStorage.setItem("accessToken", newToken);

        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return instance(originalRequest);
      } catch (refreshError) {
        localStorage.removeItem("accessToken");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);

export default instance;
