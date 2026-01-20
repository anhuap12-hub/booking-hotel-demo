// models/EmailVerifyToken.js
import mongoose from "mongoose";

const emailVerifyTokenSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    token: {
      type: String,
      required: true,
      unique: true,
      index: true,
    },

    expiresAt: {
      type: Date,
      required: true,
      index: { expires: 0 }, // 🔥 TTL index – Mongo tự xoá khi hết hạn
    },
  },
  { timestamps: true }
);

export default mongoose.model("EmailVerifyToken", emailVerifyTokenSchema);
