// src/controllers/recommend.controller.js
import Booking from "../models/Booking.js";
import Hotel from "../models/Hotel.js";
import Review from "../models/Review.js";
import { formatRecommendationReply } from "../config/openaiService.js";

export const recommendHotels = async (req, res) => {
  try {
    const userId = req.user._id;

    // 1. Lấy lịch sử booking để phân tích sở thích (Thành phố + Tầm giá)
    const bookings = await Booking.find({ user: userId }).populate("hotel");

    let recommendations = [];
    let aiIntro = "";

    if (bookings.length > 0) {
      // Lấy danh sách các thành phố user đã đặt (không trùng lặp)
      const preferredCities = [...new Set(bookings.map(b => b.hotel.city))];
      
      // Tính toán tầm giá trung bình user thường đặt
      const avgPrice = bookings.reduce((sum, b) => sum + (b.hotel.cheapestPrice || 0), 0) / bookings.length;

      // CHIẾN THUẬT: Gợi ý khách sạn cùng thành phố HOẶC cùng tầm giá (+/- 20%)
      recommendations = await Hotel.find({
        status: "active",
        $or: [
          { city: { $in: preferredCities } },
          { cheapestPrice: { $gte: avgPrice * 0.8, $lte: avgPrice * 1.2 } }
        ],
        // Loại bỏ những khách sạn user ĐÃ ĐẶT để tăng tính khám phá
        _id: { $nin: bookings.map(b => b.hotel._id) }
      })
      .sort({ rating: -1, cheapestPrice: 1 })
      .limit(6);
    }

    // 2. FALLBACK: Nếu ít hơn 3 gợi ý hoặc user mới -> Lấy Top Trending (Review cao)
    if (recommendations.length < 3) {
      const topReviews = await Review.aggregate([
        { $group: { _id: "$hotelId", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
        { $sort: { avgRating: -1, count: -1 } },
        { $limit: 10 }
      ]);

      const topHotelIds = topReviews.map(r => r._id);
      const trendingHotels = await Hotel.find({
        _id: { $in: topHotelIds },
        status: "active"
      }).limit(6);
      
      // Kết hợp và loại bỏ trùng lặp
      recommendations = [...new Set([...recommendations, ...trendingHotels])].slice(0, 6);
    }

    // 3. TÍCH HỢP AI: Gọi OpenAI để viết lời dẫn giải thích lý do gợi ý
    // (Giúp báo cáo đồ án của bạn thuyết phục hơn về tính "Tích hợp AI")
    if (recommendations.length > 0) {
      aiIntro = await formatRecommendationReply(recommendations);
    }

    res.json({ 
      success: true, 
      intro: aiIntro, // Lời dẫn từ AI
      data: recommendations 
    });

  } catch (error) {
    console.error("Recommend error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};