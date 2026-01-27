import Booking from "../models/Booking.js"; 
import Review from "../models/Review.js";
import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";

export const createReview = async (req, res) => {
  try {
    const { hotelId, rating, comment, bookingId } = req.body;
    const userId = req.user.id;

    if (!rating || rating < 1 || rating > 10) {
      return res.status(400).json({ success: false, message: "Điểm đánh giá phải từ 1 đến 10." });
    }

    let booking;
    if (bookingId) {
      booking = await Booking.findOne({ 
        _id: bookingId, 
        user: userId, 
        status: { $in: ["confirmed", "completed"] }
      });
    } else {
      booking = await Booking.findOne({ 
        user: userId, 
        hotel: hotelId, 
        status: { $in: ["confirmed", "completed"] },
        paymentStatus: { $in: ["PAID", "DEPOSITED"] } 
      }).sort({ createdAt: -1 });
    }

    if (!booking) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn chưa có đơn đặt phòng hợp lệ tại khách sạn này để để lại đánh giá." 
      });
    }

    const finalBookingId = booking._id;

    const alreadyReviewed = await Review.findOne({ bookingId: finalBookingId });
    if (alreadyReviewed) {
      return res.status(400).json({ success: false, message: "Bạn đã đánh giá kỳ nghỉ này rồi." });
    }

    const checkInDate = new Date(booking.checkIn);
    const stayMonthLabel = `tháng ${checkInDate.getMonth() + 1}/${checkInDate.getFullYear()}`;

    const newReview = await Review.create({
      hotelId,
      userId,
      bookingId: finalBookingId, 
      rating,
      comment,
      roomName: booking.roomSnapshot?.name || "Phòng đã đặt",
      stayDuration: booking.nights,
      numberOfGuests: booking.guestsCount,
      stayMonth: stayMonthLabel,
      isVerified: true
    });

    const stats = await Review.aggregate([
      { $match: { hotelId: new mongoose.Types.ObjectId(hotelId) } },
      { $group: { 
          _id: '$hotelId', 
          avgRating: { $avg: '$rating' }, 
          count: { $sum: 1 } 
        } 
      }
    ]);

    if (stats.length > 0) {
      await Hotel.findByIdAndUpdate(hotelId, {
        rating: Number(stats[0].avgRating.toFixed(1)),
        reviews: stats[0].count
      });
    }

    const populatedReview = await Review.findById(newReview._id).populate('userId', 'name avatar');
    res.status(201).json({ success: true, data: populatedReview });
    
  } catch (error) {
    console.error("Review Error:", error);
    res.status(500).json({ success: false, message: "Đã xảy ra lỗi khi gửi đánh giá." });
  }
};

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