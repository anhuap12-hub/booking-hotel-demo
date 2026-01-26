// controllers/review.controller.js
import Booking from "../models/Booking.js"; 
import Review from "../models/Review.js"; // Chữ R phải viết hoa đúng như trong thư mục models
import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";

export const createReview = async (req, res) => {
  try {
    const { hotelId, rating, comment, bookingId } = req.body;
    const userId = req.user.id;

    // 1. Tìm Booking thật dựa trên schema của bạn
    const booking = await Booking.findOne({ 
      _id: bookingId, 
      user: userId, // Kiểm tra đúng chủ nhân booking
      status: "completed" // Thường thì ở xong (completed) mới cho review
    });

    if (!booking) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn cần hoàn thành kỳ nghỉ để có thể để lại đánh giá." 
      });
    }
    const alreadyReviewed = await Review.findOne({ bookingId }); // Giả sử bạn lưu thêm field bookingId vào Review
if (alreadyReviewed) {
  return res.status(400).json({ 
    success: false, 
    message: "Bạn đã để lại đánh giá cho kỳ nghỉ này rồi." 
  });
}

    // 2. Trích xuất dữ liệu từ Booking Schema của bạn
    const checkInDate = new Date(booking.checkIn);
    const stayMonthLabel = `tháng ${checkInDate.getMonth() + 1}/${checkInDate.getFullYear()}`;

    // 3. Tạo Review với dữ liệu "Sạch"
    const newReview = await Review.create({
  hotelId,
  userId,
  bookingId, 
  rating,
  comment,
  roomName: booking.roomSnapshot?.name || "Phòng đã đặt",
  stayDuration: booking.nights,
  numberOfGuests: booking.guestsCount,
  stayMonth: stayMonthLabel,
  isVerified: true
});


    // 4. Đồng bộ điểm Hotel (Aggregation - Giữ nguyên logic cũ của bạn)
    const stats = await Review.aggregate([
      { $match: { hotelId: new mongoose.Types.ObjectId(hotelId) } },
      { $group: { _id: '$hotelId', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
    ]);

    if (stats.length > 0) {
      await Hotel.findByIdAndUpdate(hotelId, {
        rating: Number(stats[0].avgRating.toFixed(1)),
        reviews: stats[0].count
      });
    }

    // 5. Populate thông tin User trả về cho Frontend
    const populatedReview = await Review.findById(newReview._id).populate('userId', 'name avatar');

    res.status(201).json({ success: true, data: populatedReview });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
// Thêm hàm này vào cuối file src/controllers/review.controller.js
export const getHotelReviews = async (req, res) => {
  try {
    const { hotelId } = req.params;
    const reviews = await Review.find({ hotelId })
      .populate('userId', 'name avatar')
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: reviews });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};