import { classifyIntent, generalReply, formatRecommendationReply } from "../config/geminiService.js";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js";
import slugify from "slugify";

const toSlug = (str = "") => slugify(str, { lower: true, strict: true, locale: "vi" });

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    const lowerMsg = message.toLowerCase().trim();
    const intent = await classifyIntent(message);
    
    let replyText = ""; // Chứa lời nhắn của AI
    let hotelData = []; // Chứa danh sách object khách sạn để hiện List

    if (intent === "database") {
      // A. TÌM THEO ĐỊA DANH
      const locationMatch = message.match(/(?:ở|tại|khu vực|khách sạn)\s+([a-zA-ZÀ-ỹ\s]+)/i);
      const searchTerm = locationMatch ? locationMatch[1].trim() : null;

      if (searchTerm) {
        const searchSlug = toSlug(searchTerm);
        const hotels = await Hotel.find({
          status: "active",
          $or: [
            { citySlug: { $regex: searchSlug, $options: "i" } },
            { searchText: { $regex: searchSlug, $options: "i" } }
          ]
        }).limit(5);

        if (hotels.length > 0) {
          // Lấy câu dẫn từ Gemini
          replyText = await formatRecommendationReply(hotels);
          // Gán dữ liệu khách sạn vào mảng để Frontend vẽ Card
          hotelData = hotels; 
        } else {
          replyText = `Tiếc quá, Coffee Stay chưa có dữ liệu khách sạn tại "${searchTerm}". Bạn thử tìm khu vực khác nhé?`;
        }
      }

      // B. XỬ LÝ BOOKING (Nếu không tìm địa danh)
      if (!replyText && (lowerMsg.includes("đơn hàng") || lowerMsg.includes("booking"))) {
        if (!req.user?._id) {
          replyText = "Bạn vui lòng đăng nhập để mình kiểm tra lịch sử đặt phòng nhé!";
        } else {
          const bookings = await Booking.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate("hotel");

          if (bookings.length === 0) {
            replyText = "Bạn chưa có đơn đặt phòng nào trên hệ thống.";
          } else {
            replyText = "Đây là các yêu cầu đặt phòng gần nhất của bạn:";
            // Phần này có thể tùy biến trả về danh sách booking nếu bạn muốn làm Card cho Booking
          }
        }
      }
    }

    // C. PHẢN HỒI CHUNG
    if (!replyText) {
      replyText = await generalReply(message);
    }

    // QUAN TRỌNG: Trả về Object gồm cả chữ và mảng dữ liệu
    return res.json({ 
      success: true, 
      reply: replyText, 
      hotels: hotelData 
    });

  } catch (error) {
    console.error("Chat Error:", error);
    res.json({ success: true, reply: "Hệ thống AI đang gặp chút gián đoạn." });
  }
};