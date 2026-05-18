import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

export const classifyIntent = async (message) => {
  try {
    if (!process.env.GEMINI_API_KEY) {
      console.error("Missing GEMINI_API_KEY");
      return "general";
    }

    const prompt = `Bạn là trợ lý phân loại ý định cho Coffee Stay. 
    Trả về 'database' nếu khách tìm phòng/khách sạn/đơn hàng. 
    Trả về 'general' nếu chào hỏi/tán gẫu. 
    Tin nhắn: "${message}"`;

    const result = await model.generateContent(prompt);
    const text = result.response.text().toLowerCase().replace(/[^a-z]/g, "").trim();
    
    return text.includes("database") ? "database" : "general";
  } catch (error) {
    console.error("Gemini Classify Error Details:", error);
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