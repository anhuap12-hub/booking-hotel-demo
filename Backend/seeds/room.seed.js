// backend/seeds/hotel.seed.js
import "dotenv/config";
import connectDB from "../src/config/db.js";
import Hotel from "../src/models/Hotel.js";

const seedDeals = async () => {
  try {
    await connectDB();

    const hotels = await Hotel.find();
    if (!hotels.length) {
      console.log("⚠️ No hotels found");
      process.exit(0);
    }

    const updates = hotels.map((h) => {
      const isDeal = Math.random() < 0.35; // 35% có deal
      const discount = isDeal
        ? Math.floor(Math.random() * 30) + 10 // 10–40%
        : 0;

      return Hotel.updateOne(
        { _id: h._id },
        { discount, isDeal }
      );
    });

    await Promise.all(updates);

    console.log("🔥 Seed DEALS thành công");
    process.exit(0);
  } catch (err) {
    console.error("❌ Seed failed:", err);
    process.exit(1);
  }
};

seedDeals();
