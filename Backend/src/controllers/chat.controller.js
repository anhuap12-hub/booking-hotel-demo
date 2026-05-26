import { classifyIntent, generalReply } from "../config/geminiService.js";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";
import Room from "../models/Room.js";
import slugify from "slugify";

const toSlug = (str = "") => slugify(str, { lower: true, strict: true, locale: "vi" });

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    // 1. Dùng AI phân tích ý định và bóc tách thực thể (NER)
    // classifyIntent bây giờ sẽ trả về 1 Object JSON chứa các criteria
    const analysis = await classifyIntent(message);
    
    let replyText = "";
    let hotelData = [];

    // 2. Xử lý truy vấn Database dựa trên phân tích của AI
    if (analysis.intent === "database") {
      let query = { status: "active" };

      // Lọc theo Loại hình (Hotel, Resort, Homestay...)
      if (analysis.type) query.type = analysis.type;

      // Lọc theo Địa điểm
      if (analysis.location) {
        const searchSlug = toSlug(analysis.location);
        query.$or = [
          { citySlug: { $regex: searchSlug, $options: "i" } },
          { searchText: { $regex: searchSlug, $options: "i" } }
        ];
      }

      // Lọc theo Khoảng giá (CheapestPrice trên Hotel)
      if (analysis.maxPrice || analysis.minPrice) {
        query.cheapestPrice = {};
        if (analysis.maxPrice) query.cheapestPrice.$lte = analysis.maxPrice;
        if (analysis.minPrice) query.cheapestPrice.$gte = analysis.minPrice;
      }

      // Lọc theo Tiện nghi (Amenities) - Dùng $in để linh hoạt hơn
      if (analysis.amenities && analysis.amenities.length > 0) {
        query.amenities = { $in: analysis.amenities.map(a => new RegExp(a, "i")) };
      }

      // Lọc theo Đánh giá (Rating)
      if (analysis.rating) {
        query.rating = { $gte: analysis.rating };
      }

      // Lọc theo Số lượng khách (Kết nối sang Model Room)
      if (analysis.guests) {
        const eligibleRooms = await Room.find({ 
          maxPeople: { $gte: analysis.guests },
          status: "active" 
        }).select("hotel");
        
        const hotelIds = [...new Set(eligibleRooms.map(r => r.hotel))];
        query._id = { $in: hotelIds };
      }

      // Thực hiện tìm kiếm khách sạn
      const hotels = await Hotel.find(query)
        .sort({ rating: -1, cheapestPrice: 1 })
        .limit(6);

      if (hotels.length > 0) {
        // Tạo câu trả lời thông minh dựa trên kết quả tìm thấy
        const count = hotels.length;
        const loc = analysis.location ? ` tại ${analysis.location}` : "";
        replyText = `Dạ, Coffee Stay tìm thấy ${count} chỗ nghỉ${loc} phù hợp với yêu cầu của Anh/Chị. Mời Anh/Chị tham khảo ạ:`;
        hotelData = hotels;
      } else {
        replyText = `Tiếc quá, hiện tại em chưa tìm thấy chỗ nghỉ nào khớp hoàn toàn với yêu cầu của Anh/Chị. Anh/Chị thử điều chỉnh lại khu vực hoặc khoảng giá xem sao nhé!`;
      }
    }

    // 3. Xử lý kiểm tra Đơn đặt phòng (Booking)
    const lowerMsg = message.toLowerCase();
    if (!replyText && (lowerMsg.includes("đơn hàng") || lowerMsg.includes("booking") || lowerMsg.includes("lịch sử"))) {
      const userId = req.user?._id || req.user?.id;
      if (!userId) {
        replyText = "Anh/Chị vui lòng đăng nhập để hệ thống có thể kiểm tra lịch sử đặt phòng nhé!";
      } else {
        const bookings = await Booking.find({ user: userId })
          .sort({ createdAt: -1 })
          .limit(3)
          .populate("hotel");

        if (bookings.length === 0) {
          replyText = "Dạ, hiện tại Anh/Chị chưa có đơn đặt phòng nào trên hệ thống Coffee Stay ạ.";
        } else {
          replyText = "Đây là thông tin các yêu cầu đặt phòng gần nhất của Anh/Chị:";
        }
      }
    }

    // 4. Phản hồi chung (Tán gẫu/Chào hỏi) nếu không rơi vào các trường hợp trên
   if (!replyText) {
  const userName = req.user?.username || "Anh/Chị"; 
  replyText = await generalReply(message, userName); 
}

    return res.json({ 
      success: true, 
      reply: replyText, 
      hotels: hotelData,
      debug_analysis: analysis 
    });

  } catch (error) {
    console.error("Chat Error:", error);
    res.json({ 
      success: true, 
      reply: "Dạ, hệ thống AI đang bận, Anh/Chị vui lòng gửi lại tin nhắn sau ít giây nhé!",
      hotels: [] 
    });
  }
};