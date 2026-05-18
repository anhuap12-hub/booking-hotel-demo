import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const classifyIntent = async (message) => {
  try {
    const prompt = `Bạn là trợ lý phân loại ý định người dùng cho hệ thống đặt phòng Coffee Stay.
    Chỉ trả về DUY NHẤT một trong hai từ sau (không dấu câu, không viết hoa):
    - 'database': Nếu khách muốn tìm khách sạn, phòng, xem đơn hàng/booking, giá cả.
    - 'general': Nếu khách chào hỏi, hỏi về chính sách hoặc tán gẫu.
    Tin nhắn: "${message}"`;

    const result = await model.generateContent(prompt);
    // Xử lý để lấy text sạch, loại bỏ dấu sao hoặc khoảng trắng thừa
    const text = result.response.text().toLowerCase().replace(/[^a-z]/g, "").trim();
    return text.includes("database") ? "database" : "general";
  } catch (error) {
    console.error("Gemini Classify Error:", error);
    return "general"; 
  }
};

export const generalReply = async (message) => {
  try {
    const prompt = `Bạn là Coffee Stay Concierge, trợ lý ảo thân thiện. Trả lời ngắn gọn, lịch sự tin nhắn này (tối đa 2 câu): "${message}"`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return "Chào bạn, mình là trợ lý Coffee Stay. Rất vui được hỗ trợ bạn!";
  }
};

export const formatRecommendationReply = async (rooms) => {
  try {
    const prompt = `Viết 1 câu dẫn dắt hào hứng giới thiệu danh sách phòng/khách sạn này cho khách: ${JSON.stringify(rooms)}.`;
    const result = await model.generateContent(prompt);
    return result.response.text().trim();
  } catch (error) {
    return "Dưới đây là một số lựa chọn tuyệt vời dành cho bạn:";
  }
};