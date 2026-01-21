import instance from "./axios";

export const getRoomsByHotel = (hotelId) =>
  instance.get(`/rooms/hotel/${hotelId}`);

export const getRoomById = (id) =>
  instance.get(`/rooms/${id}`);

export const createRoom = (hotelId, data) =>
  instance.post(`/rooms/by-hotel/${hotelId}`, data);

export const updateRoom = (id, data) =>
  instance.put(`/rooms/${id}`, data);

export const deleteRoom = (id) =>
  instance.delete(`/rooms/${id}`);

export const getRoomBookedDates = (roomId) =>
  instance.get(`/rooms/${roomId}/booked-dates`);

export const getAvailableRooms = (checkIn, checkOut, hotelId) =>
  instance.get("/rooms/available", {
    params: { checkIn, checkOut, hotelId },
  });
export const getRoomDetail = (id) => instance.get(`/rooms/${id}`);