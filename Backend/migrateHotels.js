import dotenv from "dotenv";
dotenv.config();

import connectDB from "./src/config/db.js";
import Hotel from "./src/models/Hotel.js";
import slugify from "slugify";

const normalize = (str = "") =>
  slugify(str, {
    lower: true,
    strict: true,
    locale: "vi",
  });

const migrateHotels = async () => {
  try {
    await connectDB();
    console.log("✅ MongoDB connected");

    const hotels = await Hotel.find();
    console.log(`🔍 Found ${hotels.length} hotels`);

    for (const hotel of hotels) {
      const name = hotel.name || "";
      const city = hotel.city || "";
      const address = hotel.address || "";

      hotel.citySlug = normalize(city);
      hotel.searchText = normalize(`${name} ${city} ${address}`);

      await hotel.save({ validateBeforeSave: false });
      console.log(`✅ Migrated: ${hotel.name}`);
    }

    console.log("🎉 MIGRATION COMPLETED");
    process.exit(0);
  } catch (err) {
    console.error("❌ Migration failed:", err);
    process.exit(1);
  }
};

migrateHotels();
