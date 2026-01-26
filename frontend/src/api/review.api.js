import instance from "./axios";

/**
 * Lấy danh sách đánh giá của một khách sạn
 * @param {string} hotelId 
 */
export const getHotelReviews = (hotelId) => {
  return instance.get(`/reviews/${hotelId}`);
};

/**
 * Gửi đánh giá mới cho khách sạn
 * @param {Object} data - { hotelId, rating, comment }
 */
export const createReview = (data) => {
  return instance.post("/reviews", data);
};