import mongoose from "mongoose";
import dotenv from "dotenv";
import Hotel from "./models/Hotel.js";
import Room from "./models/Room.js";

dotenv.config({ path: "../.env" });

function cleanText(text) {
  if (!text) return "";
  return text.replace(/\u00A0/g, " ");
}

// Hàm duyệt object nhưng bỏ qua _id, ObjectId, Date, Number
function deepClean(obj) {
  if (Array.isArray(obj)) {
    return obj.map(deepClean);
  } else if (typeof obj === "object" && obj !== null) {
    // Nếu là ObjectId hoặc Date thì giữ nguyên
    if (obj instanceof mongoose.Types.ObjectId || obj instanceof Date) {
      return obj;
    }
    const newObj = {};
    for (const key of Object.keys(obj)) {
      if (key === "_id") {
        newObj[key] = obj[key]; // giữ nguyên _id
      } else {
        newObj[key] = deepClean(obj[key]);
      }
    }
    return newObj;
  } else if (typeof obj === "string") {
    return cleanText(obj);
  }
  return obj;
}

async function run() {
  try {
    await mongoose.connect(process.env.DATA_URL);

    const hotels = await Hotel.find();
    for (const hotel of hotels) {
      const cleaned = deepClean(hotel.toObject());
      // chỉ update các field string, không đụng _id
      for (const key of Object.keys(cleaned)) {
        if (key !== "_id") {
          hotel[key] = cleaned[key];
        }
      }
      await hotel.save();
      console.log(`Hotel ${hotel._id} đã được làm sạch`);
    }

    const rooms = await Room.find();
    for (const room of rooms) {
      const cleaned = deepClean(room.toObject());
      for (const key of Object.keys(cleaned)) {
        if (key !== "_id") {
          room[key] = cleaned[key];
        }
      }
      await room.save();
      console.log(`Room ${room._id} đã được làm sạch`);
    }

    console.log("✅ Đã làm sạch toàn bộ dữ liệu thành công!");
    process.exit();
  } catch (err) {
    console.error("❌ Lỗi:", err.message);
    process.exit(1);
  }
}

run();
