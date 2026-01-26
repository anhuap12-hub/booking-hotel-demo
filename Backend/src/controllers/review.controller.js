import Booking from "../models/Booking.js"; 
import Review from "../models/Review.js";
import Hotel from "../models/Hotel.js";
import mongoose from "mongoose";

export const createReview = async (req, res) => {
  try {
    const { hotelId, rating, comment, bookingId } = req.body;
    const userId = req.user.id;

    const booking = await Booking.findOne({ 
      _id: bookingId, 
      user: userId, 
      status: "completed" 
    });

    if (!booking) {
      return res.status(403).json({ 
        success: false, 
        message: "Bạn cần hoàn thành kỳ nghỉ để có thể để lại đánh giá." 
      });
    }

    const alreadyReviewed = await Review.findOne({ bookingId });
    if (alreadyReviewed) {
      return res.status(400).json({ 
        success: false, 
        message: "Bạn đã để lại đánh giá cho kỳ nghỉ này rồi." 
      });
    }

    const checkInDate = new Date(booking.checkIn);
    const stayMonthLabel = `tháng ${checkInDate.getMonth() + 1}/${checkInDate.getFullYear()}`;

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

    const populatedReview = await Review.findById(newReview._id).populate('userId', 'name avatar');

    res.status(201).json({ success: true, data: populatedReview });
    
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
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