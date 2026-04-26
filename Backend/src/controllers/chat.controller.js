// src/controllers/chat.controller.js
import OpenAI from "openai";
import Hotel from "../models/Hotel.js";
import Room from "../models/Room.js";
import Booking from "../models/Booking.js";

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export const chatWithAI = async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ success: false, message: "Message is required" });
    }

    // Bước 1: Phân loại intent bằng AI
    const intentResponse = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "Bạn là AI hỗ trợ đặt phòng khách sạn. Phân loại câu hỏi thành 'general' hoặc 'database'." },
        { role: "user", content: message },
      ],
    });

    const intent = intentResponse.choices[0].message.content.toLowerCase();
    let reply;

    // Bước 2: Nếu intent là database → truy vấn MongoDB
    if (intent.includes("database")) {
      if (message.toLowerCase().includes("khách sạn ở")) {
        // Lấy city từ câu hỏi
        const city = message.split("ở")[1]?.trim();
        const hotels = await Hotel.find({ city, status: "active" }).limit(5);

        if (!hotels || hotels.length === 0) {
          reply = `Xin lỗi, hiện chưa có khách sạn nào ở ${city}.`;
        } else {
          reply = `Các khách sạn ở ${city}:\n` +
            hotels.map(h => `- ${h.name}, giá từ ${h.cheapestPrice} ${h.currency || "VND"}`).join("\n");
        }
      } else if (message.toLowerCase().includes("phòng")) {
        const rooms = await Room.find({ status: "active" }).limit(5);
        reply = "Một số phòng hiện có:\n" +
          rooms.map(r => `- ${r.name}, loại ${r.type}, giá ${r.finalPrice} VND`).join("\n");
      } else if (message.toLowerCase().includes("booking")) {
        const bookings = await Booking.find({ user: req.user._id })
          .limit(3)
          .populate("hotel room");

        reply = bookings.length === 0
          ? "Bạn chưa có booking nào."
          : "Các booking gần đây của bạn:\n" +
            bookings.map(b => `- ${b.hotel.name}, phòng ${b.roomSnapshot.name}, từ ${b.checkIn.toDateString()} đến ${b.checkOut.toDateString()}, trạng thái: ${b.status}`).join("\n");
      } else {
        reply = "Tôi chưa hiểu rõ yêu cầu, bạn có thể nói cụ thể hơn về khách sạn, phòng hoặc booking.";
      }
    } else {
      // Bước 3: Nếu intent là general → trả lời bằng AI
      const response = await client.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          { role: "system", content: "Bạn là chatbot hỗ trợ khách hàng về khách sạn và du lịch." },
          { role: "user", content: message },
        ],
      });
      reply = response.choices[0].message.content;
    }

    res.json({ success: true, reply });
  } catch (error) {
    console.error("Chat error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};
