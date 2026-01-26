import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
      index: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["INFLOW", "OUTFLOW"], 
      required: true,
    },
    method: {
      type: String,
      enum: ["BANK_TRANSFER", "CASH"], 
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

transactionSchema.index({ createdAt: -1 });

export default mongoose.model("Transaction", transactionSchema);