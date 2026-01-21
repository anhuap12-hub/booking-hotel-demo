import dotenv from "dotenv";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import Room from "../models/Room.js";
import connectDB from "../config/db.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
dotenv.config({ path: path.join(__dirname, "../../.env") });

const seedRoomData = async () => {
  try {
    await connectDB();

    const rooms = await Room.find({});
    console.log(`🔍 Tìm thấy ${rooms.length} phòng. Đang bắt đầu cập nhật chuyên sâu...`);

    // Nội dung mô tả dài 6-7 dòng
    const longDesc = `Chào mừng bạn đến với không gian nghỉ dưỡng lý tưởng, nơi sự sang trọng gặp gỡ sự thoải mái tuyệt đối. 
Căn phòng được thiết kế theo phong cách hiện đại với gam màu tinh tế, tận dụng tối đa ánh sáng tự nhiên qua hệ thống cửa kính lớn từ trần đến sàn. 
Nội thất được tuyển chọn kỹ lưỡng từ các thương hiệu cao cấp, kết hợp hài hòa giữa chất liệu gỗ tự nhiên và đá cẩm thạch sang trọng. 
Du khách sẽ được tận hưởng giấc ngủ sâu trên chiếc giường King-size êm ái với bộ chăn ga cotton 100% tiêu chuẩn khách sạn 5 sao. 
Phòng tắm hiện đại được trang bị bồn tắm nằm cao cấp, vòi sen áp lực lớn và bộ sản phẩm chăm sóc cơ thể cao cấp giúp bạn thư giãn sau ngày dài. 
Ngoài ra, khu vực làm việc yên tĩnh và ban công riêng biệt hướng nhìn ra cảnh quan tuyệt đẹp sẽ mang lại trải nghiệm nghỉ dưỡng không thể quên. 
Dù bạn đi công tác hay du lịch, căn phòng này chính là ngôi nhà thứ hai hoàn hảo dành cho bạn trong suốt kỳ lưu trú.`;

    // Trộn ngẫu nhiên danh sách các phòng để chọn ra 5 phòng may mắn có discount
    const shuffledRooms = [...rooms].sort(() => 0.5 - Math.random());
    const discountRoomIds = shuffledRooms.slice(0, 5).map(r => r._id.toString());

    for (const room of rooms) {
      // Logic Discount: Chỉ set nếu ID nằm trong danh sách 5 phòng đã chọn
      const isDiscounted = discountRoomIds.includes(room._id.toString());
      const discount = isDiscounted 
        ? [10, 15, 20, 25, 30, 40][Math.floor(Math.random() * 6)] 
        : null;

      const updateData = {
        $set: {
          discount: discount,
          status: "active", // Rất quan trọng để nút Đặt phòng không bị mờ
          desc: longDesc,
          cancellationPolicy: {
            freeCancelBeforeHours: 24,
            refundPercent: 100
          }
        }
      };

      // Cập nhật ảnh mẫu nếu đang rỗng
      if (!room.photos || room.photos.length === 0) {
        updateData.$set.photos = [
          { url: "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg", public_id: "seed/r1" },
          { url: "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg", public_id: "seed/r2" },
          { url: "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg", public_id: "seed/r3" },
          { url: "https://images.pexels.com/photos/279746/pexels-photo-279746.jpeg", public_id: "seed/r4" }
        ];
      }

      // Cập nhật tiện nghi nếu đang rỗng
      if (!room.amenities || room.amenities.length === 0) {
        updateData.$set.amenities = [
          "Wifi tốc độ cao", "Điều hòa trung tâm", "Máy pha cà phê Ý", 
          "Ban công panorama", "Bồn tắm nằm", "Smart Tivi 55 inch", "Két sắt an toàn"
        ];
      }

      await Room.findByIdAndUpdate(room._id, updateData);
      console.log(`✅ ${isDiscounted ? '🎁 [DISCOUNT]' : '🏠 [NORMAL]'} Room: ${room.name} ${isDiscounted ? `(${discount}%)` : ''}`);
    }

    console.log("🎉 Xong! Đã tạo 5 phòng có discount và đồng bộ toàn bộ dữ liệu.");
    process.exit(0);
  } catch (err) {
    console.error("❌ Lỗi Seed:", err);
    process.exit(1);
  }
};

seedRoomData();