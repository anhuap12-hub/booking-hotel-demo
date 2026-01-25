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
  rating: { type: Number, required: true, min: 0, max: 10 },
  comment: { type: String, required: true },
  
  // TRƯỜNG ĐÃ CÓ:
  roomName: { type: String, default: "Phòng Tiêu Chuẩn" }, 
  isVerified: { type: Boolean, default: true },

  // TRƯỜNG CẦN THÊM ĐỂ GIỐNG ẢNH BOOKING:
  stayDuration: { type: Number, default: 1 },    // Ví dụ: 6 đêm
  numberOfGuests: { type: Number, default: 2 },  // Ví dụ: 2 người (Cặp đôi)
  stayMonth: { type: String }                    // Ví dụ: "tháng 1/2026"
  
}, { timestamps: true });