import dotenv from "dotenv";
dotenv.config();
import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import connectDB from "./src/config/db.js";
import webhookRoutes from "./src/routes/webhook.route.js";
import userRoutes from "./src/routes/user.route.js";
import testRoutes from "./src/routes/test.route.js";
import authRoutes from "./src/routes/auth.route.js";
import hotelRoutes from "./src/routes/hotel.route.js";
import roomRoutes from "./src/routes/room.route.js";
import uploadRoutes from "./src/routes/upload.route.js";
import bookingRoutes from "./src/routes/booking.route.js";
import adminRoutes from "./src/routes/admin.route.js";
import reviewRoutes from "./src/routes/review.route.js";
const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(express.json());
app.use(cookieParser());

app.use("/api/webhooks", webhookRoutes);
/* ===================== CORS (FIXED) ===================== */
const allowedOrigins = process.env.CLIENT_URL
  .split(",")
  .map(o => o.trim().replace(/\/$/, ""));

app.use(
  cors({
    origin: function (origin, callback) {
      // cho phép Postman / server-to-server
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      console.log("CORS blocked for origin:", origin);
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
/* ===================== DB ===================== */
connectDB();

/* ===================== ROUTES ===================== */

app.use("/api/admin", adminRoutes);
app.use("/api/tests", testRoutes);
app.use("/api/rooms", roomRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/users", userRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/bookings", bookingRoutes);
app.use("/api/reviews", reviewRoutes);

/* ===================== STATIC ===================== */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.static(path.join(process.cwd(), "public")));

/* ===================== START ===================== */
const PORT = process.env.PORT || 8000;
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  res.status(statusCode).json({ success: false, message });
});
app.listen(PORT, "0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
  console.log(`🌍 Allowed Origins:`, allowedOrigins); // Log để kiểm tra xem đã đọc đúng chưa
});
