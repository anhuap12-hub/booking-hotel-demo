import mongoose from "mongoose";

/**
 * ======================
 * Photo Schema
 * ======================
 */
const photoSchema = new mongoose.Schema(
  {
    url: {
      type: String,
      required: true,
      trim: true,
    },
    public_id: {
      type: String,
      required: true,
    },
  },
  { _id: false }
);

/**
 * ======================
 * Cancellation Policy Schema
 * ======================
 * Dùng cho booking + refund sau này
 */
const cancellationPolicySchema = new mongoose.Schema(
  {
    freeCancelBeforeHours: {
      type: Number,
      default: 24, // miễn phí huỷ trước 24h
      min: 0,
    },
    refundPercent: {
      type: Number,
      default: 100, // hoàn 100%
      min: 0,
      max: 100,
    },
  },
  { _id: false }
);

/**
 * ======================
 * Room Schema
 * ======================
 */
const roomSchema = new mongoose.Schema(
  {
    // ======================
    // Basic Info
    // ======================
    name: {
      type: String,
      required: true,
      trim: true,
    },

    type: {
      type: String,
      enum: ["single", "double", "suite"],
      required: true,
    },

    // Giá cơ bản / đêm (KHÔNG phải giá booking cuối)
    price: {
      type: Number,
      required: true,
      min: 0,
    },

    maxPeople: {
      type: Number,
      required: true,
      min: 1,
    },
    discount: {
    type: Number,
    min: 0,
    max: 100,
    default: null,
  },

    // ======================
    // Operational Status (KHÔNG dùng cho booking)
    // ======================
    status: {
      type: String,
      enum: ["active", "inactive", "maintenance"],
      default: "active",
    },

    // ======================
    // Description & Media
    // ======================
    desc: {
      type: String,
      default: "Phòng tiêu chuẩn với tiện nghi cơ bản",
      trim: true,
    },

    photos: {
      type: [photoSchema],
      default: [],
    },

    amenities: {
      type: [String],
      default: [],
    },

    // ======================
    // Cancellation Policy
    // ======================
    cancellationPolicy: {
      type: cancellationPolicySchema,
      default: () => ({}),
    },

    // ======================
    // Relations
    // ======================
    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },
  },
  { timestamps: true }
);

/**
 * ======================
 * Indexes
 * ======================
 */
roomSchema.index({ hotel: 1, status: 1 });
roomSchema.index({ price: 1 });
roomSchema.index({ type: 1 });

export default mongoose.model("Room", roomSchema);
