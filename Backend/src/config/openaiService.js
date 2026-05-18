// backend/src/config/openaiService.js
import OpenAI from "openai";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const classifyIntent = async (message) => {
  try {
    const intentResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: `Bạn là trợ lý phân loại ý định cho hệ thống Coffee Stay. 
          Chỉ trả về DUY NHẤT 1 từ: 'database' hoặc 'general'.
          - 'database': Tìm khách sạn, tìm phòng, xem đơn hàng/booking, giá cả.
          - 'general': Chào hỏi, chính sách, hoặc tán gẫu.` 
        },
        { role: "user", content: message },
      ],
      temperature: 0, 
      max_tokens: 5, // Giới hạn token để AI không trả lời dài dòng
    });

    const content = intentResponse.choices[0].message.content.toLowerCase();
    // Sử dụng .includes để an toàn hơn so với việc so sánh tuyệt đối ===
    return content.includes("database") ? "database" : "general";
  } catch (error) {
    console.error("OpenAI Classify Error:", error);
    return "general"; 
  }
};

export const generalReply = async (message) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "Bạn là Coffee Stay Concierge. Trả lời ngắn gọn, thân thiện. Nếu khách hỏi về việc tìm phòng mà bạn không có dữ liệu, hãy bảo khách cung cấp tên thành phố." 
        },
        { role: "user", content: message },
      ],
      temperature: 0.7, 
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI General Reply Error:", error);
    return "Hệ thống đang bận một chút, bạn thử lại sau vài giây nhé!";
  }
};

export const formatRecommendationReply = async (data) => {
  try {
    // Chỉ gửi những field cần thiết để tiết kiệm token và tránh lỗi payload quá lớn
    const simplifiedData = data.map(item => ({
      name: item.name,
      price: item.cheapestPrice || item.finalPrice,
      city: item.city
    }));

    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "Bạn là trợ lý khách sạn. Hãy viết 1 câu dẫn dắt tự nhiên, hào hứng để giới thiệu danh sách kết quả tìm kiếm bên dưới." 
        },
        { role: "user", content: `Dữ liệu: ${JSON.stringify(simplifiedData)}` },
      ],
      max_tokens: 100,
    });
    return response.choices[0].message.content;
  } catch (error) {
    return "Tuyệt vời! Tôi đã tìm thấy một vài lựa chọn rất phù hợp với yêu cầu của bạn:";
  }
};