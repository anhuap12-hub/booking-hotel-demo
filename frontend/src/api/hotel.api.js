import instance from "./axios.js";

export const getAllHotels = (params = {}) => {
  const formattedParams = { ...params };

  // Chuẩn hóa mảng cho Backend dễ xử lý (MongoDB $all/$in)
  if (Array.isArray(formattedParams.amenities)) {
    formattedParams.amenities = formattedParams.amenities.join(",");
  }
  if (Array.isArray(formattedParams.types)) {
    formattedParams.types = formattedParams.types.join(",");
  }

  // Đảm bảo nếu có ngày thì định dạng về YYYY-MM-DD
  if (formattedParams.checkIn) {
    formattedParams.checkIn = new Date(formattedParams.checkIn).toISOString().split('T')[0];
  }
  if (formattedParams.checkOut) {
    formattedParams.checkOut = new Date(formattedParams.checkOut).toISOString().split('T')[0];
  }

  return instance.get("/hotels", { params: formattedParams });
};
export const getHotelById = (id) =>
  instance.get(`/hotels/${id}`);
export const getHotelDetail = (id) => instance.get(`/hotels/${id}`);
// ================= ADMIN HOTELS =================
export const createHotel = (data) =>
  instance.post("/admin/hotels", data);

export const updateHotel = (id, data) =>
  instance.put(`/admin/hotels/${id}`, data);

export const deleteHotel = (id) =>
  instance.delete(`/admin/hotels/${id}`);

export const getDealHotels = () =>
  instance.get("/hotels/deals");

