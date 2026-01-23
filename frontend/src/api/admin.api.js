import instance from "./axios";

// Lấy danh sách đơn đặt phòng
export const getAdminBookings = (params) =>
  instance.get("/admin/bookings", { params });

// Cập nhật trạng thái liên hệ (Ví dụ: Đã gọi điện, Đã nhắn tin...)
export const updateContactStatus = (id, data) =>
  instance.put(`/admin/bookings/${id}/action`, data);

// Thống kê doanh thu, số lượng đơn
export const getAdminStats = () =>
  instance.get("/admin/stats");

// Lấy các đơn cần theo dõi (quá hạn cọc, sắp check-in...)
export const getFollowUpBookings = () =>
  instance.get("/admin/bookings/follow-up");

// Xác nhận khách đã trả tiền (thanh toán tại quầy hoặc chuyển khoản)
export const markBookingPaid = (id, note = "") =>
  instance.put(`/admin/bookings/${id}/pay`, { note }); // Gửi kèm note nếu có

// Sơ đồ phòng thực tế
export const getAdminRoomMap = (params) => 
  instance.get("/admin/room-map", { params });

// Cập nhật trạng thái phòng (Trống, Đang dọn, Bảo trì...)
export const updateRoomStatus = (id, status) => 
  instance.put(`/admin/rooms-status/${id}`, { status });

// XÁC NHẬN HOÀN TIỀN: Quan trọng để khớp với logic refund
export const confirmRefunded = (id, data = {}) => 
  instance.put(`/admin/bookings/${id}/confirm-refund`, data);