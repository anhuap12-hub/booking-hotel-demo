import instance from "./axios";

// ================= AUTH =================
export const registerApi = (data) =>
  instance.post("/auth/register", data);

export const loginApi = (data) =>
  instance.post("/auth/login", data);

export const logout = () =>
  instance.post("/auth/logout");

export const getProfile = () =>
  instance.get("/auth/profile");

// ================= EMAIL VERIFY =================
export const verifyEmail = (token) =>
  instance.get(`/auth/verify-email?token=${token}`);

export const resendVerifyEmail = () =>
  instance.post("/auth/resend-verify");

