// src/controllers/recommend.controller.js
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Review from "../models/Review.js";

export const recommendHotels = async (req, res) => {
  try {
    const userId = req.user._id;

    // Lấy lịch sử booking của user
    const bookings = await Booking.find({ user: userId }).populate("hotel");

    let preferredCities = [];
    if (bookings.length > 0) {
      preferredCities = bookings.map(b => b.hotel.city);
    }

    let hotels;
    if (preferredCities.length > 0) {
      // Gợi ý theo thành phố user từng đặt
      hotels = await Hotel.find({
        city: { $in: preferredCities },
        status: "active"
      })
        .sort({ rating: -1, cheapestPrice: 1 })
        .limit(10);
    } else {
      // Nếu user chưa có booking → fallback sang khách sạn nổi bật theo review
      const topReviews = await Review.aggregate([
        { $group: { _id: "$hotelId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
        { $sort: { avgRating: -1, count: -1 } },
        { $limit: 10 }
      ]);

      const hotelIds = topReviews.map(r => r._id);
      hotels = await Hotel.find({ _id: { $in: hotelIds }, status: "active" });
    }

    res.json({ success: true, data: hotels.slice(0, 10) });
  } catch (error) {
    console.error("Recommend error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
