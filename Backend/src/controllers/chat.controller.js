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
    
    let replyText = "";
    let hotelData = [];  

    if (intent === "database") {
      // 1. Trích xuất và chuẩn hóa Loại hình (Sửa lỗi homstay/homestay)
      const typeMatch = message.match(/(resort|khách sạn|hotel|villa|homestay|homstay)/i);
      let searchType = typeMatch ? typeMatch[1].toLowerCase() : null;
      
      const typeMapping = {
        "khách sạn": "hotel", "hotel": "hotel", "resort": "resort",
        "villa": "villa", "homestay": "homestay", "homstay": "homestay"
      };
      const dbType = typeMapping[searchType] || null;

      // 2. Trích xuất địa danh
      const locationMatch = message.match(/(?:ở|tại|khu vực)\s+([a-zA-ZÀ-ỹ\s]+)/i);
      const searchTerm = locationMatch ? locationMatch[1].trim() : null;

      // 3. MỚI: Lấy danh sách Amenities ĐỘNG từ database
      const dynamicAmenities = await Hotel.distinct("amenities");
      
      let foundAmenities = [];
      if (dynamicAmenities.length > 0) {
        dynamicAmenities.forEach(amenity => {
          // Nếu trong tin nhắn có chứa tên tiện ích (không phân biệt hoa thường)
          const regex = new RegExp(amenity, "i");
          if (regex.test(lowerMsg)) {
            foundAmenities.push(amenity);
          }
        });
      }

      // 4. Xây dựng Query tìm kiếm
      let query = { status: "active" };

      if (dbType) query.type = dbType;
      
      if (searchTerm) {
        const searchSlug = toSlug(searchTerm);
        query.$or = [
          { citySlug: { $regex: searchSlug, $options: "i" } },
          { searchText: { $regex: searchSlug, $options: "i" } }
        ];
      }

      // Tìm kiếm theo các tiện ích đã trích xuất được từ database
      if (foundAmenities.length > 0) {
        query.amenities = { $all: foundAmenities };
      }

      // 5. Thực hiện truy vấn (Lấy tối đa 6 Card)
      const hotels = await Hotel.find(query).limit(6);

      if (hotels.length > 0) {
        const typeText = searchType || "chỗ nghỉ";
        const locationText = searchTerm ? ` tại ${searchTerm}` : "";
        const amenityText = foundAmenities.length > 0 ? ` có ${foundAmenities.join(", ")}` : "";
        
        replyText = `Đây là danh sách ${typeText}${locationText}${amenityText} phù hợp nhất cho Anh/Chị:`;
        hotelData = hotels; 
      } else {
        const typeText = searchType || "chỗ nghỉ";
        const locationText = searchTerm ? ` ở ${searchTerm}` : "";
        const amenityText = foundAmenities.length > 0 ? ` có ${foundAmenities.join(", ")}` : "";
        
        replyText = `Dạ, hiện tại Coffee Stay chưa có ${typeText}${locationText}${amenityText}. Anh/Chị thử thay đổi yêu cầu xem sao nhé!`;
        hotelData = [];
      }
    }

    // --- Giữ nguyên logic xử lý Booking và Phản hồi chung của Anh ---
    if (!replyText && (lowerMsg.includes("đơn hàng") || lowerMsg.includes("booking"))) {
      if (!req.user?._id) {
        replyText = "Bạn vui lòng đăng nhập để mình kiểm tra lịch sử đặt phòng nhé!";
      } else {
        const bookings = await Booking.find({ user: req.user._id })
          .sort({ createdAt: -1 })
          .limit(3)
          .populate("hotel");
        replyText = bookings.length === 0 ? "Bạn chưa có đơn đặt phòng nào." : "Đây là các yêu cầu đặt phòng gần nhất của bạn:";
      }
    }

    if (!replyText) {
      replyText = await generalReply(message);
    }

    return res.json({ 
      success: true, 
      reply: replyText, 
      hotels: hotelData 
    });

  } catch (error) {
    console.error("Chat Error:", error);
    res.json({ success: true, reply: "Hệ thống AI đang bận một chút, Anh thử lại nhé!" });
  }
};