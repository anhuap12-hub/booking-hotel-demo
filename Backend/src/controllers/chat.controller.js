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
    const userName = req.user?.username || "Anh/Chị";
    const analysis = await classifyIntent(message);
    
    let replyText = "";
    let hotelData = [];

    if (analysis.intent === "database") {
      let query = { status: "active" };

      if (analysis.type) query.type = analysis.type;

      if (analysis.location) {
        const searchSlug = toSlug(analysis.location);
        query.$or = [
          { citySlug: { $regex: searchSlug, $options: "i" } },
          { searchText: { $regex: searchSlug, $options: "i" } }
        ];
      }

      if (analysis.maxPrice || analysis.minPrice) {
        query.cheapestPrice = {};
        if (analysis.maxPrice) query.cheapestPrice.$lte = analysis.maxPrice;
        if (analysis.minPrice) query.cheapestPrice.$gte = analysis.minPrice;
      }

      if (analysis.amenities && analysis.amenities.length > 0) {
        query.amenities = { $all: analysis.amenities.map(a => new RegExp(a, "i")) };
      }

      if (analysis.rating) {
        query.rating = { $gte: analysis.rating };
      }

      if (analysis.guests) {
        const eligibleRooms = await Room.find({ 
          maxPeople: { $gte: analysis.guests },
          status: "active" 
        }).select("hotel");
        
        const hotelIds = [...new Set(eligibleRooms.map(r => r.hotel))];
        query._id = { $in: hotelIds };
      }

      const hotels = await Hotel.find(query)
        .sort({ rating: -1, cheapestPrice: 1 })
        .limit(6);

      if (hotels.length > 0) {
        const count = hotels.length;
        const loc = analysis.location ? ` tại ${analysis.location}` : "";
        // Gọi tên người dùng trong phản hồi tìm kiếm
        replyText = `Dạ ${userName}, Coffee Stay đã tìm thấy ${count} chỗ nghỉ${loc} phù hợp với yêu cầu của mình. Mời mình tham khảo ạ:`;
        hotelData = hotels;
      } else {
        // Gọi tên người dùng khi không tìm thấy kết quả
        replyText = `Tiếc quá ${userName} ơi, hiện tại em chưa tìm thấy chỗ nghỉ nào khớp hoàn toàn với yêu cầu của mình. Bạn thử điều chỉnh lại khu vực hoặc khoảng giá xem sao nhé!`;
      }
    }

    // 4. Xử lý kiểm tra Đơn đặt phòng (Booking)
    const lowerMsg = message.toLowerCase();
    const isBookingQuery = lowerMsg.includes("đơn hàng") || lowerMsg.includes("booking") || lowerMsg.includes("lịch sử");
    
    if (!replyText && isBookingQuery) {
      const userId = req.user?._id || req.user?.id;
      if (!userId) {
        replyText = "Dạ, bạn vui lòng đăng nhập để hệ thống có thể kiểm tra lịch sử đặt phòng giúp mình nhé!";
      } else {
        const bookings = await Booking.find({ user: userId })
          .sort({ createdAt: -1 })
          .limit(3)
          .populate("hotel");

        if (bookings.length === 0) {
          replyText = `Dạ ${userName}, hiện tại mình chưa có đơn đặt phòng nào trên hệ thống Coffee Stay ạ.`;
        } else {
          replyText = `Chào ${userName}, đây là thông tin các yêu cầu đặt phòng gần nhất của mình:`;
        }
      }
    }

    // 5. Phản hồi chung (Tán gẫu/Chào hỏi) nếu không rơi vào các trường hợp trên
    if (!replyText) {
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
    // Lấy lại tên người dùng cho phần catch để đồng bộ
    const userName = req.user?.username || "Anh/Chị";
    res.json({ 
      success: true, 
      reply: `Dạ ${userName}, hệ thống AI đang bận một chút, mình vui lòng gửi lại tin nhắn sau ít giây nhé!`,
      hotels: [] 
    });
  }
};