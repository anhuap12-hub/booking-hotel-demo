import mongoose from "mongoose";

/**
 * ======================
 * Guest Snapshot
 * ======================
 */
const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
  },
  { _id: false }
);

/**
 * ======================
 * Room Snapshot
 * ======================
 */
const roomSnapshotSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    pricePerNight: {
      type: Number,
      required: true,
      min: 0,
    },
    maxPeople: Number,
    cancellationPolicy: {
      freeCancelBeforeHours: { type: Number, default: 0 },
      refundPercent: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

/**
 * ======================
 * Booking Schema
 * ======================
 */
const bookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },

    hotel: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Hotel",
      required: true,
      index: true,
    },

    room: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Room",
      required: true,
      index: true,
    },

    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },

    guest: { type: guestSchema, required: true },

    guestsCount: {
      type: Number,
      required: true,
      min: 1,
    },

    roomSnapshot: {
      type: roomSnapshotSchema,
      required: true,
    },

    contactStatus: {
      type: String,
      enum: ["NEW", "CALLED", "NO_RESPONSE", "INTERESTED", "CLOSED"],
      default: "NEW",
      index: true,
    },

    adminNote: {
      type: String,
      trim: true,
    },

    contactedAt: Date,

    contactLogs: [
      {
        at: { type: Date, default: Date.now },
        by: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },
        note: String,
        result: {
          type: String,
          enum: ["CALLED", "NO_RESPONSE", "CONFIRMED", "CANCELLED"],
        },
      },
    ],

    nights: {
      type: Number,
      required: true,
      min: 1,
    },

    totalPrice: {
      type: Number,
      required: true,
      min: 0,
    },

    // --- CẬP NHẬT: Thêm thông tin đặt cọc ---
    depositAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    remainingAmount: {
      type: Number,
      default: 0,
      min: 0,
    },
    // ---------------------------------------

    currency: {
      type: String,
      default: "VND",
    },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired", "no_show"],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      // CẬP NHẬT: Thêm trạng thái DEPOSITED
      enum: ["UNPAID", "DEPOSITED", "PAID", "REFUNDED"],
      default: "UNPAID",
      index: true,
    },

    paidAt: Date,

    paidBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    paymentLogs: [
      {
        at: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        // CẬP NHẬT: Cho phép lưu log đặt cọc
        action: { type: String, enum: ["DEPOSITED", "PAID", "REFUNDED"] },
        note: String,
      },
    ],

    cancelledAt: Date,
    cancelReason: String,
  },
  { timestamps: true }
);

/**
 * ======================
 * Index
 * ======================
 */
bookingSchema.index({
  room: 1,
  checkIn: 1,
  checkOut: 1,
  status: 1,
});
bookingSchema.index({
  paymentStatus: 1,
  status: 1,
  createdAt: -1,
});

/**
 * ======================
 * Validation
 * ======================
 */
bookingSchema.pre("validate", function () {
  if (this.contactStatus) {
    this.contactStatus = this.contactStatus.toUpperCase();
  }

  if (this.checkIn >= this.checkOut) {
    this.invalidate("checkOut", "checkOut must be after checkIn");
  }

  if (this.paymentStatus) {
    this.paymentStatus = this.paymentStatus.toUpperCase();
  }
});

export default mongoose.model("Booking", bookingSchema);