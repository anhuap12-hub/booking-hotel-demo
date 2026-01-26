import instance from "./axios.js";

/* ========= USER PROFILE (Thông tin cá nhân) ========= */
export const updateProfile = (data) =>
  instance.put("/users/profile", data);

/* ========= CLIENT BOOKINGS (Dành cho khách hàng) ========= */
export const checkAvailability = (roomId, checkInDate, checkOutDate) => {
  return instance.post(`/bookings/rooms/${roomId}/check-availability`, { 
    checkInDate, 
    checkOutDate 
  });
};

export const createBooking = (data) =>
  instance.post("/bookings", data);

export const getMyBookings = () =>
  instance.get("/bookings/my");

export const getBookingById = (id) => 
  instance.get(`/bookings/${id}`);

export const getBookingStatus = (id) => 
  instance.get(`/bookings/${id}/status`);

export const cancelBooking = (id) =>
  instance.put(`/bookings/${id}/cancel`);

export const requestRefund = (id, data) => 
  instance.put(`/bookings/${id}/request-refund`, data);

/* ========= ADMIN BOOKINGS (Quản lý đặt phòng - Admin) ========= */
export const getAllBookings = () =>
  instance.get("/bookings/admin");

export const updateBookingStatus = (id, status) =>
  instance.put(`/bookings/${id}`, { status });