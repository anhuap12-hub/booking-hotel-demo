import instance from "./axios.js";

export const getAllHotels = (params = {}) => {
  const formattedParams = { ...params };
  
  // Chuyển mảng thành chuỗi phân cách bằng dấu phẩy
  if (Array.isArray(formattedParams.amenities)) {
    formattedParams.amenities = formattedParams.amenities.join(",");
  }
  if (Array.isArray(formattedParams.types)) {
    formattedParams.types = formattedParams.types.join(",");
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

