import instance from "./axios.js";

// ================= USER PROFILE =================
export const updateProfile = (data) =>
  instance.put("/users/profile", data);

// ================= BOOKINGS (Dành cho Khách hàng) =================

// Tạo đơn đặt phòng mới
export const createBooking = (data) =>
  instance.post("/bookings", data);

// Lấy danh sách đơn của tôi
export const getMyBookings = () =>
  instance.get("/bookings/my");

// Hủy đơn (Khi chưa thanh toán hoặc theo chính sách)
export const cancelBooking = (id) =>
  instance.put(`/bookings/${id}/cancel`);

// Lấy chi tiết 1 đơn đặt phòng
export const getBookingById = (id) => 
  instance.get(`/bookings/${id}`);

// Kiểm tra trạng thái thanh toán
export const getBookingStatus = (id) => 
  instance.get(`/bookings/${id}/status`);

// Gửi yêu cầu HOÀN TIỀN (Kèm thông tin ngân hàng trong 'data')
export const requestRefund = (id, data) => 
  instance.put(`/bookings/${id}/request-refund`, data);

// Kiểm tra phòng trống
export const checkAvailability = (roomId, checkInDate, checkOutDate) => {
  const url = `/bookings/rooms/${roomId}/check-availability`;
  const data = { checkInDate, checkOutDate };
  
  // Bạn có thể giữ hoặc xóa debug log tùy ý
  return instance.post(url, data);
};

// ================= ADMIN BOOKINGS (Nếu dùng chung file) =================
// Lưu ý: Nếu đã có file api admin riêng thì có thể cân nhắc tách phần này ra
export const getAllBookings = () =>
  instance.get("/bookings/admin");

export const updateBookingStatus = (id, status) =>
  instance.put(`/bookings/${id}`, { status });