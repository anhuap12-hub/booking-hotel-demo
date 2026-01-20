import mongoose  from "mongoose";

const connectDB = async () => {
try {
   await mongoose.connect(process.env.DATA_URL, {
      autoIndex: false, // tránh tạo index runtime khi deploy
    });
}catch (err) {
    console.error("MongoDB connection failed:", err.message);
    process.exit(1);
}

};
export default connectDB;