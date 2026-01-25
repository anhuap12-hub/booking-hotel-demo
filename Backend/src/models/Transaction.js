import mongoose from "mongoose";

const transactionSchema = new mongoose.Schema(
  {
    bookingId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Booking",
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    type: {
      type: String,
      enum: ["INFLOW", "OUTFLOW"], // INFLOW: Thu vào (Cọc/Thanh toán), OUTFLOW: Chi ra (Refund)
      required: true,
    },
    method: {
      type: String,
      enum: ["BANK_TRANSFER", "CASH"], // BANK_TRANSFER: Chuyển khoản (SePay), CASH: Tiền mặt tại quầy
      required: true,
    },
    description: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default mongoose.model("Transaction", transactionSchema);