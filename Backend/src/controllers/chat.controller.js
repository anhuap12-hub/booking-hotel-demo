// src/controllers/chat.controller.js
import { classifyIntent, generalReply, formatRecommendationReply } from "../config/geminiService.js";
import Hotel from "../models/Hotel.js";
import Booking from "../models/Booking.js"; // Đừng quên dòng này
import slugify from "slugify";

const toSlug = (str = "") => slugify(str, { lower: true, strict: true, locale: "vi" });

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) return res.status(400).json({ success: false, message: "Message is required" });

    const lowerMsg = message.toLowerCase().trim();
    const intent = await classifyIntent(message);
    let reply = "";

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
        }).limit(3);

        if (hotels.length > 0) {
          const aiIntro = await formatRecommendationReply(hotels);
          const hotelDetails = hotels.map(h => 
            `- ${h.name} (${h.city}): Giá từ ${h.cheapestPrice.toLocaleString()} VNĐ. Đánh giá: ${h.rating}/10 ⭐`
          ).join("\n");
          reply = `${aiIntro}\n${hotelDetails}`;
        } else {
          reply = `Tiếc quá, Coffee Stay chưa có dữ liệu khách sạn tại "${searchTerm}". Bạn thử tìm khu vực khác nhé?`;
        }
      }

      // B. XỬ LÝ BOOKING (Kiểm tra kỹ req.user từ auth.js)
      if (!reply && (lowerMsg.includes("đơn hàng") || lowerMsg.includes("booking") || lowerMsg.includes("lịch sử"))) {
        if (!req.user || !req.user._id) {
          reply = "Bạn vui lòng đăng nhập để mình kiểm tra lịch sử đặt phòng giúp bạn nhé!";
        } else {
          const bookings = await Booking.find({ user: req.user._id })
            .sort({ createdAt: -1 })
            .limit(3)
            .populate("hotel");

          if (bookings.length === 0) {
            reply = "Bạn chưa có đơn đặt phòng nào. Hãy khám phá các khách sạn tuyệt vời của Coffee Stay nhé!";
          } else {
            const list = bookings.map(b => `- ${b.hotel?.name || "Khách sạn"}, Ngày: ${new Date(b.checkIn).toLocaleDateString()}, Trạng thái: ${b.status}`).join("\n");
            reply = `Đây là các yêu cầu đặt phòng gần nhất của bạn:\n${list}`;
          }
        }
      }
    }

    // C. PHẢN HỒI CHUNG (Dùng Gemini)
    if (!reply) {
      reply = await generalReply(message);
    }

    return res.json({ success: true, reply });
  } catch (error) {
    console.error("Chat Error:", error);
    res.json({ success: true, reply: "Hệ thống AI đang bảo trì nhẹ, bạn thử lại sau giây lát nhé!" });
  }
};