import mongoose from "mongoose";
import initCronJobs from "../utils/cronJobs.js"; // Import đúng từ thư mục utils

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.DATA_URL, {
      autoIndex: false,
    });
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    
    // Kích hoạt Cron Job
    initCronJobs(); 
    
  } catch (err) {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  }
};
export default connectDB;