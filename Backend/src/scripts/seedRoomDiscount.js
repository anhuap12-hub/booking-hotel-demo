import dotenv from "dotenv";
import mongoose from "mongoose";
import Room from "../models/Room.js";
import connectDB from "../config/db.js";

dotenv.config();

const seedRoomDiscount = async () => {
  try {
    await connectDB();

    const rooms = await Room.find(
      {
        $or: [
          { discount: { $exists: false } },
          { discount: 0 },
        ],
      },
      { _id: 1 } // chỉ lấy id
    );

    console.log(`🔍 Found ${rooms.length} rooms to seed discount`);

    for (const room of rooms) {
      const discount =
        Math.floor(Math.random() * 4) * 10 + 10; // 10–40%

      await Room.updateOne(
        { _id: room._id },
        { $set: { discount } }
      );

      console.log(
        `✅ Room ${room._id} → discount ${discount}%`
      );
    }

    console.log("🎉 Seed discount completed!");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
};

seedRoomDiscount();
