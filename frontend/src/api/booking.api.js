import instance from "./axios.js";

export const updateProfile = (data) =>
  instance.put("/users/profile", data);

// ================= BOOKINGS =================
export const createBooking = (data) =>
  instance.post("/bookings", data);

export const getMyBookings = () =>
  instance.get("/bookings/my");

export const cancelBooking = (id) =>
  instance.put(`/bookings/${id}/cancel`);

export const getAllBookings = () =>
  instance.get("/bookings/admin");

export const updateBookingStatus = (id, status) =>
  instance.put(`/bookings/${id}`, { status });

// --- THÊM HÀM NÀY ĐỂ CHECK THANH TOÁN ---
export const getBookingStatus = (id) => 
  instance.get(`/bookings/${id}/status`);

export const checkAvailability = (roomId, checkInDate, checkOutDate) => {
  const url = `/bookings/rooms/${roomId}/check-availability`;
  const data = { checkInDate, checkOutDate };

  // DEBUG LOG
  console.log("--- 🚀 API CALL: checkAvailability ---");
  console.log("📍 URL:", url);
  console.log("📦 Body:", data);

  return instance.post(url, data);
};
