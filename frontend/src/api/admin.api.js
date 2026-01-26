import instance from "./axios";

/* ========= BOOKINGS (Quản lý đặt phòng) ========= */
export const getAdminBookings = (params) =>
  instance.get("/admin/bookings", { params });

export const getFollowUpBookings = () =>
  instance.get("/admin/bookings/follow-up");

export const updateContactStatus = (id, data) =>
  instance.put(`/admin/bookings/${id}/action`, data);

export const markBookingPaid = (id, note = "") =>
  instance.put(`/admin/bookings/${id}/pay`, { note });

export const markNoShow = (id) => 
  instance.patch(`/admin/bookings/${id}/no-show`);

export const cancelBookingByAdmin = (id) => 
  instance.put(`/admin/bookings/${id}/cancel`);

export const confirmRefunded = (id, data = {}) => 
  instance.put(`/admin/bookings/${id}/confirm-refund`, data);

/* ========= ROOMS & MAP (Sơ đồ phòng) ========= */
export const getAdminRoomMap = (params) => 
  instance.get("/admin/room-map", { params });

export const updateRoomStatus = (id, status) => 
  instance.put(`/admin/rooms-status/${id}`, { status });

/* ========= USERS (Quản lý người dùng) ========= */
export const getAllUsers = () => 
  instance.get("/admin/users");

export const getUserById = (id) => 
  instance.get(`/admin/users/${id}`);

export const updateUserByAdmin = (id, data) => 
  instance.put(`/admin/users/${id}`, data);

export const updateUserRole = (id, role) => 
  instance.patch(`/admin/users/${id}/role`, { role });

export const deleteUser = (id) => 
  instance.delete(`/admin/users/${id}`);

/* ========= DASHBOARD & STATS (Thống kê) ========= */
export const getAdminStats = (startDate, endDate) => {
  return instance.get("/admin/stats", {
    params: { startDate, endDate }
  });
};