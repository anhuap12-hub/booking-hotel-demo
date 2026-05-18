// src/controllers/chat.controller.js
import { classifyIntent, generalReply, formatRecommendationReply } from "../config/geminiService.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    const lowerMsg = message.toLowerCase().trim();
    
    // 1. Phân loại ý định
    let intent;
    try {
      intent = await classifyIntent(message);
    } catch (err) {
      console.error("Gemini Classify Error:", err);
      intent = "general";
    }

    let reply = "";

    // 2. Xử lý logic Database
    if (intent === "database") {
      
      // A. TÌM KHÁCH SẠN THEO THÀNH PHỐ
      if (lowerMsg.includes("khách sạn") || lowerMsg.includes("ở") || lowerMsg.includes("tại")) {
        const cityMatch = message.match(/(?:ở|tại|khu vực)\s+([a-zA-ZÀ-ỹ\s]+)/i);
        const city = cityMatch ? cityMatch[1].replace(/[?.,!]/g, "").trim() : null;

        if (city) {
          const hotels = await Hotel.find({ 
            city: { $regex: city, $options: "i" },
            status: "active" 
          }).limit(3);

          if (hotels.length > 0) {
            const aiFormatted = await formatRecommendationReply(hotels);
            const hotelList = hotels.map(h => `- ${h.name}: ${h.cheapestPrice.toLocaleString()} VNĐ`).join("\n");
            reply = `${aiFormatted}\n${hotelList}`;
          } else {
            reply = `Tiếc quá, Coffee Stay hiện chưa có đối tác khách sạn nào tại ${city}. Bạn có muốn tìm ở thành phố khác không?`;
          }
        }
      } 
      
      // B. TÌM PHÒNG TRỐNG (Nếu chưa tìm thấy khách sạn)
      if (!reply && lowerMsg.includes("phòng")) {
        const rooms = await Room.find({ status: "active" }).limit(3).populate("hotel");
        if (rooms.length > 0) {
          reply = "Mình tìm thấy một vài phòng còn trống rất đẹp dành cho bạn:\n" +
                  rooms.map(r => `- ${r.name} (${r.hotel?.name}): ${r.finalPrice.toLocaleString()} VNĐ`).join("\n");
        }
      }

      // C. KIỂM TRA ĐƠN HÀNG (BOOKING)
      if (!reply && (lowerMsg.includes("đơn hàng") || lowerMsg.includes("booking") || lowerMsg.includes("đặt"))) {
        if (!req.user) {
          reply = "Bạn vui lòng đăng nhập tài khoản để mình hỗ trợ kiểm tra lịch sử đặt phòng nhé!";
        } else {
          const bookings = await Booking.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate("hotel");

          if (bookings.length === 0) {
            reply = "Bạn chưa có đơn đặt phòng nào trên hệ thống. Hãy chọn cho mình một chuyến đi ngay nhé!";
          } else {
            reply = "Đây là các yêu cầu đặt phòng gần nhất của bạn:\n" +
                    bookings.map(b => `- ${b.hotel?.name}, Ngày: ${new Date(b.checkIn).toLocaleDateString()}, Trạng thái: ${b.status}`).join("\n");
          }
        }
      }
    }

    // 3. FALLBACK: Nếu không khớp database hoặc là intent "general"
    if (!reply) {
      reply = await generalReply(message);
    }

    return res.json({ success: true, reply });

  } catch (error) {
    console.error("Chat Controller Fatal Error:", error);
    res.status(200).json({ 
      success: true, 
      reply: "Coffee Stay AI đang gặp một chút gián đoạn. Bạn có thể thử lại sau vài giây hoặc chat qua Zalo nhé!" 
    });
  }
};