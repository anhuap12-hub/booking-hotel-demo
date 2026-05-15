import { classifyIntent, generalReply, formatRecommendationReply } from "../config/openaiService.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    const intent = await classifyIntent(message);
    let reply;

    if (intent === "database") {
      const lowerMsg = message.toLowerCase();

      // 1. Xử lý tìm Khách sạn (Dùng Regex linh hoạt hơn)
      if (lowerMsg.includes("khách sạn") || lowerMsg.includes("ở")) {
        // Trích xuất tên thành phố bỏ dấu câu cuối câu
        const cityMatch = message.match(/(?:ở|tại)\s+([a-zA-ZÀ-ỹ\s]+)/i);
        const city = cityMatch ? cityMatch[1].replace(/[?.,!]/g, "").trim() : null;

        if (city) {
          const hotels = await Hotel.find({ 
            city: { $regex: city, $options: "i" }, // Tìm kiếm không phân biệt hoa thường
            status: "active" 
          }).limit(3);

          if (hotels.length > 0) {
            // Dùng hàm bổ trợ để AI viết câu trả lời dựa trên list hotels
            reply = await formatRecommendationReply(hotels);
            reply += "\n" + hotels.map(h => `- ${h.name}: ${h.cheapestPrice.toLocaleString()} VNĐ`).join("\n");
          } else {
            reply = `Tiếc quá, mình chưa tìm thấy khách sạn nào tại ${city}. Bạn thử khu vực khác nhé?`;
          }
        }
      } 
      
      // 2. Xử lý tìm Phòng
      else if (lowerMsg.includes("phòng")) {
        const rooms = await Room.find({ status: "active" }).limit(3).populate("hotel");
        reply = "Dưới đây là một số phòng trống 'hot' nhất hiện nay:\n" +
                rooms.map(r => `- ${r.name} (${r.hotel?.name}): ${r.finalPrice.toLocaleString()} VNĐ`).join("\n");
      }

      // 3. Xử lý Booking của tôi
      else if (lowerMsg.includes("đơn hàng") || lowerMsg.includes("booking") || lowerMsg.includes("đặt")) {
        const bookings = await Booking.find({ user: req.user._id })
          .sort({ createdAt: -1 })
          .limit(2)
          .populate("hotel");

        if (bookings.length === 0) {
          reply = "Bạn hiện chưa có lịch đặt phòng nào trên hệ thống Coffee Stay.";
        } else {
          reply = "Lịch sử đặt phòng gần nhất của bạn đây:\n" +
                  bookings.map(b => `- ${b.hotel?.name}, ngày: ${new Date(b.checkIn).toLocaleDateString()}, trạng thái: ${b.status}`).join("\n");
        }
      }

      // Fallback nếu không khớp case nào trong database
      if (!reply) {
        reply = await generalReply(message);
      }
    } else {
      // Intent là general
      reply = await generalReply(message);
    }

    res.json({ success: true, reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};