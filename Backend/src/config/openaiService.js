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
          content: `Bạn là trợ lý phân loại ý định người dùng cho hệ thống đặt phòng khách sạn.
          Chỉ trả về DUY NHẤT một trong hai từ sau (không kèm dấu câu):
          - 'database': Nếu khách hỏi về tìm khách sạn, tìm phòng, xem đơn hàng (booking), giá cả, hoặc yêu cầu gợi ý phòng.
          - 'general': Nếu khách chào hỏi, hỏi về chính sách chung, hoặc các câu hỏi tán gẫu không liên quan đến dữ liệu hệ thống.` 
        },
        { role: "user", content: message },
      ],
      temperature: 0, 
    });

    return intentResponse.choices[0].message.content.toLowerCase().trim();
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
          content: "Bạn là Coffee Stay Concierge, trợ lý ảo thân thiện của ứng dụng đặt phòng khách sạn Coffee Stay. Hãy trả lời ngắn gọn, lịch sự và chuyên nghiệp." 
        },
        { role: "user", content: message },
      ],
      temperature: 0.7, 
    });

    return response.choices[0].message.content;
  } catch (error) {
    console.error("OpenAI General Reply Error:", error);
    return "Xin lỗi, tôi đang gặp một chút vấn đề về kết nối. Bạn có thể thử lại sau giây lát?";
  }
};

export const formatRecommendationReply = async (rooms) => {
  try {
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { 
          role: "system", 
          content: "Dựa trên danh sách phòng từ hệ thống, hãy viết 1 câu dẫn dắt ngắn gọn (tối đa 2 câu) để giới thiệu các lựa chọn tốt nhất cho khách hàng." 
        },
        { role: "user", content: `Danh sách phòng: ${JSON.stringify(rooms)}` },
      ],
    });
    return response.choices[0].message.content;
  } catch (error) {
    return "Dưới đây là một số lựa chọn phòng phù hợp nhất dành cho bạn:";
  }
};