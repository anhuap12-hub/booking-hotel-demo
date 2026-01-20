import dotenv from "dotenv";
import path from "path";
import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

import connectDB from "./src/config/db.js";

import userRoutes from "./src/routes/user.route.js";
import testRoutes from "./src/routes/test.route.js";
import authRoutes from "./src/routes/auth.route.js";
import hotelRoutes from "./src/routes/hotel.route.js";
import roomRoutes from "./src/routes/room.route.js";
import uploadRoutes from "./src/routes/upload.route.js";
import bookingRoutes from "./src/routes/booking.route.js";
import adminRoutes from "./src/routes/admin.route.js";


dotenv.config();

const app = express();

/* ===================== MIDDLEWARE ===================== */
app.use(express.json());
app.use(cookieParser());

/* ===================== CORS (FIXED) ===================== */
const allowedOrigins = process.env.CLIENT_URL
  .split(",")
  .map((o) => o.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // cho phép request không có origin (Postman, server-to-server)
      if (!origin) return callback(null, true);

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(null, false);
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


/* ===================== STATIC ===================== */
app.use("/uploads", express.static(path.join(process.cwd(), "uploads")));
app.use(express.static(path.join(process.cwd(), "public")));

/* ===================== START ===================== */
const PORT = process.env.PORT || 8000;
app.listen(PORT,"0.0.0.0", () => {
  console.log(`✅ Server running on port ${PORT}`);
});
