import instance from "./axios";

// Lấy danh sách phòng theo Hotel
export const getRoomsByHotel = (hotelId) =>
  instance.get(`/rooms/hotel/${hotelId}`);

// Lấy chi tiết phòng (Dùng chung cho cả Admin và Client)
export const getRoomById = (id) =>
  instance.get(`/rooms/${id}`);

// Tạo phòng mới gắn với Hotel
export const createRoom = (hotelId, data) =>
  instance.post(`/rooms/by-hotel/${hotelId}`, data);

// Cập nhật phòng (Đây là nơi gây lỗi 500 nếu payload sai)
export const updateRoom = (id, data) =>
  instance.put(`/rooms/${id}`, data);

// Xóa phòng
export const deleteRoom = (id) =>
  instance.delete(`/rooms/${id}`);

// Lấy các ngày đã được đặt của phòng
export const getRoomBookedDates = (roomId) =>
  instance.get(`/rooms/${roomId}/booked-dates`);

// Tìm phòng trống
export const getAvailableRooms = (checkIn, checkOut, hotelId) =>
  instance.get("/rooms/available", {
    params: { checkIn, checkOut, hotelId },
  });