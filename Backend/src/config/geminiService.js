import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-flash-lite-latest" });

export const classifyIntent = async (message) => {
  try {
    const prompt = `
      Bạn là bộ não phân tích ý định khách hàng cho hệ thống Coffee Stay. 
      Nhiệm vụ: Phân tích tin nhắn và trả về JSON chuẩn.

      Các trường thông tin cần trích xuất:
      - intent: "database" (nếu tìm phòng/khách sạn/xem đơn hàng) hoặc "general" (nếu chào hỏi/tán gẫu).
      - location: Địa danh khách muốn đi (ví dụ: "Hà Nội", "Đà Lạt").
      - type: Loại hình ("hotel", "resort", "villa", "homestay").
      - maxPrice: Giá tối đa khách có thể trả (số).
      - minPrice: Giá tối thiểu (số).
      - amenities: Mảng các tiện nghi khách cần (ví dụ: ["Wifi", "Hồ bơi", "Điều hòa"]).
      - guests: Số lượng người (số).
      - rating: Mức đánh giá tối thiểu từ 1-10 (số).

      Tin nhắn: "${message}"

      CHỈ TRẢ VỀ JSON, KHÔNG GIẢI THÍCH. 
      Ví dụ: {"intent": "database", "location": "Hà Nội", "maxPrice": 2000000, "amenities": ["Hồ bơi"]}
    `;

    const result = await model.generateContent(prompt);
    const text = result.response.text().trim();
    
    // Tìm và trích xuất JSON trong trường hợp AI trả về kèm markdown
    const jsonMatch = text.match(/\{.*\}/s);
    return jsonMatch ? JSON.parse(jsonMatch[0]) : { intent: "general" };
  } catch (error) {
    console.error("Gemini Parse Error:", error);
    return { intent: "general" };
  }
};

export const generalReply = async (message, userName = "Anh/Chị") => {
  try {
    const prompt = `Bạn là Coffee Stay Concierge. Hãy trả lời thân thiện khách hàng tên là ${userName}. 
    Trả lời ngắn gọn, lịch sự (tối đa 2 câu): "${message}"`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return "Chào bạn, mình là trợ lý Coffee Stay. Rất vui được hỗ trợ bạn!";
  }
};

export const formatRecommendationReply = async (hotels) => {
  try {
    // Sửa prompt để AI chỉ viết câu dẫn dắt, không liệt kê chi tiết
    const prompt = `Tôi đã tìm thấy ${hotels.length} khách sạn phù hợp. Hãy viết MỘT câu dẫn dắt ngắn gọn, hào hứng (tối đa 20 từ) để giới thiệu danh sách bên dưới cho khách. Không liệt kê tên khách sạn trong câu này.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return "Đây là những lựa chọn tuyệt vời nhất dành cho bạn:";
  }
};