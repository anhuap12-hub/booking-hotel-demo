import mongoose from "mongoose";

const photoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true, trim: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

const cancellationPolicySchema = new mongoose.Schema(
  {
    freeCancelBeforeHours: { type: Number, default: 24, min: 0 },
    refundPercent: { type: Number, default: 100, min: 0, max: 100 },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    type: { 
      type: String, 
      enum: ["single", "double", "suite"], 
      required: true,
      lowercase: true 
    },
    price: { type: Number, required: true, min: 0 },
    maxPeople: { type: Number, required: true, min: 1 },
    discount: { type: Number, min: 0, max: 100, default: 0 },
    status: { 
      type: String, 
      enum: ["active", "inactive", "maintenance"], 
      default: "active" 
    },
    desc: { type: String, default: "Phòng tiêu chuẩn với tiện nghi cơ bản", trim: true },
    photos: { type: [photoSchema], default: [] },
    amenities: { type: [String], default: [] },
    cancellationPolicy: {
      type: cancellationPolicySchema,
      default: () => ({}),
    },
    hotel: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: "Hotel", 
      required: true, 
      index: true 
    },
  },
  { 
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  }
);

roomSchema.virtual("finalPrice").get(function () {
  if (!this.discount) return this.price;
  return Math.round(this.price * (1 - this.discount / 100));
});

roomSchema.index({ hotel: 1, status: 1 });
roomSchema.index({ price: 1 });
roomSchema.index({ type: 1 });

export default mongoose.model("Room", roomSchema);