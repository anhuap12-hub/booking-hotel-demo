// src/controllers/chat.controller.js
import { classifyIntent, generalReply, formatRecommendationReply } from "../config/openaiService.js";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    // Tăng tính ổn định bằng cách trim và lowercase
    const lowerMsg = message.toLowerCase().trim();
    
    // Gọi AI phân loại intent
    let intent;
    try {
      intent = await classifyIntent(message);
    } catch (err) {
      console.error("OpenAI Classify Error:", err);
      intent = "general"; // Fail-safe: nếu AI lỗi, coi như chat thông thường
    }

    let reply = "";

    if (intent === "database") {
      // 1. Xử lý tìm Khách sạn theo Thành phố
      if (lowerMsg.includes("khách sạn") || lowerMsg.includes("ở")) {
        const cityMatch = message.match(/(?:ở|tại)\s+([a-zA-ZÀ-ỹ\s]+)/i);
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
            reply = `Tiếc quá, hệ thống hiện chưa có đối tác khách sạn nào tại ${city}. Bạn có muốn tìm ở khu vực lân cận không?`;
          }
        }
      } 
      
      // 2. Xử lý tìm Phòng (Nếu reply vẫn trống)
      if (!reply && lowerMsg.includes("phòng")) {
        const rooms = await Room.find({ status: "active" }).limit(3).populate("hotel");
        if (rooms.length > 0) {
          reply = "Coffee Stay AI vừa tìm thấy một vài lựa chọn phòng trống dành cho bạn:\n" +
                  rooms.map(r => `- ${r.name} (${r.hotel?.name}): ${r.finalPrice.toLocaleString()} VNĐ`).join("\n");
        }
      }

      // 3. Xử lý Booking của tôi
      if (!reply && (lowerMsg.includes("đơn hàng") || lowerMsg.includes("booking") || lowerMsg.includes("đặt"))) {
        const bookings = await Booking.find({ user: req.user._id })
          .sort({ createdAt: -1 })
          .limit(2)
          .populate("hotel");

        if (bookings.length === 0) {
          reply = "Lịch sử của bạn đang trống. Hãy đặt ngay một phòng tại Coffee Stay để trải nghiệm nhé!";
        } else {
          reply = "Đây là thông tin đặt phòng gần đây của bạn:\n" +
                  bookings.map(b => `- ${b.hotel?.name}, ngày: ${new Date(b.checkIn).toLocaleDateString()}, trạng thái: ${b.status}`).join("\n");
        }
      }
    }

    // FINAL FALLBACK: Nếu không khớp database hoặc là intent "general"
    if (!reply) {
      reply = await generalReply(message);
    }

    return res.json({ success: true, reply });

  } catch (error) {
    console.error("Chat Controller Fatal Error:", error);
    // Trả về một câu trả lời thân thiện thay vì báo lỗi hệ thống cho khách hàng
    res.status(200).json({ 
      success: true, 
      reply: "Hệ thống AI đang bận xử lý dữ liệu một chút. Bạn có thể thử lại sau vài giây hoặc liên hệ nhân viên qua Zalo để được hỗ trợ tức thì nhé!" 
    });
  }
};