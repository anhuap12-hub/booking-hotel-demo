import mongoose from "mongoose";

const guestSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    email: { type: String, trim: true, lowercase: true },
  },
  { _id: false }
);

const roomSnapshotSchema = new mongoose.Schema(
  {
    name: String,
    type: String,
    pricePerNight: { type: Number, required: true, min: 0 },
    
    maxPeople: Number,
    cancellationPolicy: {
      freeCancelBeforeHours: { type: Number, default: 0 },
      refundPercent: { type: Number, default: 0 },
    },
  },
  { _id: false }
);

const bookingSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    hotel: { type: mongoose.Schema.Types.ObjectId, ref: "Hotel", required: true, index: true },
    room: { type: mongoose.Schema.Types.ObjectId, ref: "Room", required: true, index: true },
    checkIn: { type: Date, required: true },
    checkOut: { type: Date, required: true },
    guest: { type: guestSchema, required: true },
    guestsCount: { type: Number, required: true, min: 1 },
    roomSnapshot: { type: roomSnapshotSchema, required: true },
    
    // --- TTL INDEX: Tự động xóa đơn PENDING + UNPAID sau 30 phút ---
    // Nếu bạn set giá trị cho trường này, MongoDB sẽ tự xóa document khi đến giờ
    expireAt: { type: Date, index: true },

    contactStatus: {
      type: String,
      enum: ["NEW", "CALLED", "NO_RESPONSE", "INTERESTED", "CLOSED"],
      default: "NEW",
      index: true,
    },
    adminNote: { type: String, trim: true },
    contactedAt: Date,
    contactLogs: [
      {
        at: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        note: String,
        result: { type: String, enum: ["CALLED", "NO_RESPONSE", "CONFIRMED", "CANCELLED"] },
      },
    ],

    nights: { type: Number, required: true, min: 1 },
    totalPrice: { type: Number, required: true, min: 0 },
    depositAmount: { type: Number, default: 0, min: 0 },
    remainingAmount: { type: Number, default: 0, min: 0 },
    currency: { type: String, default: "VND" },

    status: {
      type: String,
      enum: ["pending", "confirmed", "cancelled", "expired", "no_show", "completed"],
      default: "pending",
      index: true,
    },

    paymentStatus: {
      type: String,
      enum: ["UNPAID", "DEPOSITED", "PAID", "REFUNDED","REFUND_PENDING"],
      default: "UNPAID",
      index: true,
    },

    paidAt: Date,
    paidBy: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    paymentLogs: [
      {
        at: { type: Date, default: Date.now },
        by: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        action: { type: String, enum: ["CREATED","DEPOSITED", "PAID", "REFUNDED","CANCELLED","SYSTEM_AUTO_CANCEL","DATA_CLEANUP"] },
        note: String,
      },
    ],
    refundInfo: {
    bankName: String,
    accountNumber: String,
    accountHolder: String,
    reason: String,
    requestedAt: Date,
    processedAt: Date,
    amount: Number // Số tiền admin thực tế sẽ hoàn
  },
    cancelledAt: Date,
    cancelReason: String,
  },
  { timestamps: true,
    toJSON: { virtuals: true }, 
    toObject: { virtuals: true }
   }
);

// Indexes và Validation giữ nguyên như cũ của bạn...
bookingSchema.index({ room: 1, checkIn: 1, checkOut: 1, status: 1 });
bookingSchema.index({ paymentStatus: 1, status: 1, createdAt: -1 });

bookingSchema.pre("validate", function () {
  if (this.contactStatus) this.contactStatus = this.contactStatus.toUpperCase();
  if (this.status) this.status = this.status.toLowerCase();
  if (this.paymentStatus) this.paymentStatus = this.paymentStatus.toUpperCase();

  if (this.checkIn >= this.checkOut) {
    this.invalidate("checkOut", "Ngày trả phòng phải sau ngày nhận phòng");
  }
  // Không cần gọi next(), Mongoose tự chạy tiếp
});

// Tính toán số tiền khách SẼ nhận được nếu hủy ngay lúc này
bookingSchema.virtual('potentialRefundAmount').get(function() {
  const validPaymentStatus = ['DEPOSITED', 'PAID'];
  const invalidBookingStatus = ['cancelled', 'expired', 'no_show'];
  
  if (!validPaymentStatus.includes(this.paymentStatus) || invalidBookingStatus.includes(this.status)) {
    return 0;
  }

  const now = new Date();
  const checkIn = new Date(this.checkIn);
  const hoursUntilCheckIn = (checkIn - now) / (1000 * 60 * 60);

  const policy = this.roomSnapshot?.cancellationPolicy;
  if (!policy) return 0;

  // SỬA TẠI ĐÂY: Sử dụng trực tiếp depositAmount vì đây là số tiền thực tế hệ thống đã ghi nhận thu được
  const amountPaid = this.depositAmount || 0;

  if (hoursUntilCheckIn >= policy.freeCancelBeforeHours) {
    return Math.round((amountPaid * (policy.refundPercent || 0)) / 100);
  }

  return 0;
});


export default mongoose.model("Booking", bookingSchema);