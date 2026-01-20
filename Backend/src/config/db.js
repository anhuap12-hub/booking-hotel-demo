import mongoose from "mongoose";

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATA_URL, {
      autoIndex: false,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`); // Thêm dòng này để debug
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
export default connectDB;