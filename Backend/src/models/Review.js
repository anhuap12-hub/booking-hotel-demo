import mongoose from "mongoose";

const reviewSchema = new mongoose.Schema({
  hotelId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Hotel', 
    required: true 
  },
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  bookingId: { // Thêm trường này để liên kết với đơn đặt phòng thực tế
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Booking' 
  },
  rating: { type: Number, required: true, min: 0, max: 10 },
  comment: { type: String, required: true },
  
  roomName: { type: String, default: "Phòng Tiêu Chuẩn" }, 
  isVerified: { type: Boolean, default: true },
  stayDuration: { type: Number, default: 1 },   
  numberOfGuests: { type: Number, default: 2 },  
  stayMonth: { 
    type: String, 
    default: () => {
        const now = new Date();
        return `tháng ${now.getMonth() + 1}/${now.getFullYear()}`;
    }
  }
}, { timestamps: true });
reviewSchema.index({ bookingId: 1 }, { unique: true });

const Review = mongoose.models.Review || mongoose.model('Review', reviewSchema);
export default Review;