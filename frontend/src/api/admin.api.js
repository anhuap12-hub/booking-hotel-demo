import instance from "./axios";

// Lấy danh sách đơn đặt phòng
export const getAdminBookings = (params) =>
  instance.get("/admin/bookings", { params });

// Cập nhật trạng thái liên hệ (Ví dụ: Đã gọi điện, Đã nhắn tin...)
export const updateContactStatus = (id, data) =>
  instance.put(`/admin/bookings/${id}/action`, data);

// Thống kê doanh thu, số lượng đơn
export const getAdminStats = (startDate, endDate) => {
  return instance.get("/admin/stats", {
    params: { startDate, endDate }
  });
};

// Lấy các đơn cần theo dõi (quá hạn cọc, sắp check-in...)
export const getFollowUpBookings = () =>
  instance.get("/admin/bookings/follow-up");

// Xác nhận khách đã trả tiền (thanh toán tại quầy hoặc chuyển khoản)
export const markBookingPaid = (id, note = "") =>
  instance.put(`/admin/bookings/${id}/pay`, { note });

// Đánh dấu khách không đến (No-show) - KHỚP VỚI ROUTE PATCH
export const markNoShow = (id) => 
  instance.patch(`/admin/bookings/${id}/no-show`);

// Sơ đồ phòng thực tế
export const getAdminRoomMap = (params) => 
  instance.get("/admin/room-map", { params });

// Cập nhật trạng thái phòng (Trống, Đang dọn, Bảo trì...)
export const updateRoomStatus = (id, status) => 
  instance.put(`/admin/rooms-status/${id}`, { status });

// XÁC NHẬN HOÀN TIỀN
export const confirmRefunded = (id, data = {}) => 
  instance.put(`/admin/bookings/${id}/confirm-refund`, data);


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