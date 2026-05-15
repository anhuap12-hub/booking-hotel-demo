// src/controllers/recommend.controller.js
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Review from "../models/Review.js";
import { formatRecommendationReply } from "../config/openaiService.js";

export const recommendHotels = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ user: userId }).populate("hotel");

    let recommendations = [];
    let aiIntro = "";

    // 1. Gợi ý dựa trên lịch sử
    if (bookings.length > 0) {
      const preferredCities = [...new Set(bookings.filter(b => b.hotel).map(b => b.hotel.city))];
      const avgPrice = bookings.reduce((sum, b) => sum + (b.hotel?.cheapestPrice || 0), 0) / bookings.length;

      recommendations = await Hotel.find({
        status: "active",
        $or: [
          { city: { $in: preferredCities } },
          { cheapestPrice: { $gte: avgPrice * 0.8, $lte: avgPrice * 1.2 } }
        ],
        _id: { $nin: bookings.map(b => b.hotel?._id).filter(Boolean) }
      })
      .populate("rooms")
      .sort({ rating: -1, cheapestPrice: 1 })
      .limit(6);
    }

    // 2. FALLBACK: Nếu ít hơn 3 gợi ý hoặc user mới -> Lấy Top Trending
    if (recommendations.length < 3) {
      const topReviews = await Review.aggregate([
        { $group: { _id: "$hotelId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
        { $sort: { avgRating: -1, count: -1 } },
        { $limit: 10 }
      ]);

      const topHotelIds = topReviews.map(r => r._id);
      
      const trendingHotels = await Hotel.find({
        _id: { $in: topHotelIds, $nin: recommendations.map(r => r._id) }, // Không lấy lại cái đã có
        status: "active"
      })
      .populate("rooms")
      .limit(6 - recommendations.length); // Chỉ lấy đủ số lượng còn thiếu
      
      recommendations = [...recommendations, ...trendingHotels];
    }

    // 3. TÍCH HỢP AI: Thêm bọc try-catch riêng cho AI để nếu AI lỗi, data hotel vẫn trả về được
    if (recommendations.length > 0) {
      try {
        aiIntro = await formatRecommendationReply(recommendations);
      } catch (aiErr) {
        console.error("AI Service Error:", aiErr);
        aiIntro = "Dựa trên sở thích của bạn, chúng tôi tìm thấy những không gian rất phù hợp.";
      }
    }

    res.json({ 
      success: true, 
      intro: aiIntro,
      data: recommendations 
    });

  } catch (error) {
    console.error("Recommend error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};