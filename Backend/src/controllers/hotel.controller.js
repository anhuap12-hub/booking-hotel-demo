import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
import Booking from "../models/Booking.js"; 

// 1. Cấu hình Cloudinary
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const normalize = (text = "") =>
  slugify(text, { lower: true, strict: true, locale: "vi" });

// XÓA THAM SỐ NEXT Ở TẤT CẢ CÁC HÀM
export const getAllHotels = async (req, res) => {
  try {
    const { 
      city, minPrice, maxPrice, types, amenities, 
      keyword, onlyDiscount, checkIn, checkOut 
    } = req.query;

    const query = { status: "active" };

    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { city: { $regex: keyword, $options: "i" } },
        { type: { $regex: keyword, $options: "i" } }
      ];
    }
    if (city) query.citySlug = city;
    if (types) query.type = { $in: types.split(",") };
    if (amenities) query.amenities = { $all: amenities.split(",") };

    let unavailableRoomIds = [];
    if (checkIn && checkOut) {
      const bookedRooms = await Booking.find({
        status: { $ne: "cancelled" },
        $or: [
          {
            checkIn: { $lt: new Date(checkOut) },
            checkOut: { $gt: new Date(checkIn) }
          }
        ]
      }).select("roomId");
      
      unavailableRoomIds = bookedRooms.map(b => b.roomId);
    }

    let hotels = await Hotel.find(query)
      .populate({ 
        path: "rooms", 
        match: checkIn && checkOut ? { _id: { $nin: unavailableRoomIds } } : {},
        select: "price discount name" 
      })
      .lean();

    const result = hotels.map((hotel) => {
      const availableRooms = hotel.rooms || [];
      const roomDetails = availableRooms.map(r => ({
        ...r,
        finalPrice: r.price * (1 - (r.discount || 0) / 100)
      }));

      const prices = roomDetails.map(r => r.finalPrice);
      const minP = prices.length ? Math.min(...prices) : null;
      const maxD = roomDetails.reduce((max, r) => Math.max(max, r.discount || 0), 0);

      return { 
        ...hotel, 
        minPrice: minP, 
        maxDiscount: maxD, 
        availableRoomCount: availableRooms.length 
      };
    }).filter((hotel) => {
      if (checkIn && checkOut && hotel.availableRoomCount === 0) return false;
      if (hotel.minPrice === null) return false;
      const okMin = minPrice ? hotel.minPrice >= Number(minPrice) : true;
      const okMax = maxPrice ? hotel.minPrice <= Number(maxPrice) : true;
      const okDiscount = onlyDiscount === "true" ? hotel.maxDiscount > 0 : true;
      return okMin && okMax && okDiscount;
    });

    res.json({ success: true, count: result.length, data: result });
  } catch (err) {
    // TRẢ VỀ LỖI TRỰC TIẾP, KHÔNG DÙNG NEXT
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id).populate({ path: "rooms" }).lean();
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

    let cheapestPrice = null;
    if (Array.isArray(hotel.rooms)) {
      for (const r of hotel.rooms) {
        if (typeof r.price === "number") {
          cheapestPrice = cheapestPrice === null ? r.price : Math.min(cheapestPrice, r.price);
        }
      }
    }
    res.json({ success: true, data: { ...hotel, cheapestPrice } });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const createHotel = async (req, res) => {
  try {
    const hotelData = { ...req.body };
    
    // Tự động tạo slug cho thành phố
    if (hotelData.city) hotelData.citySlug = normalize(hotelData.city);
    
    // Chuẩn hóa tọa độ từ JSON payload
    if (req.body.location && typeof req.body.location === 'object') {
      hotelData.location = {
        lat: Number(req.body.location.lat) || 0,
        lng: Number(req.body.location.lng) || 0
      };
    }

    const newHotel = await Hotel.create(hotelData);
    res.status(201).json({ success: true, data: newHotel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi tạo khách sạn: " + error.message });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Không tìm thấy khách sạn" });

    const updateData = { ...req.body };
    if (updateData.city) updateData.citySlug = normalize(updateData.city);

    // Xử lý dọn dẹp ảnh cũ trên Cloudinary nếu danh sách ảnh thay đổi
    if (req.body.photos && Array.isArray(req.body.photos)) {
      const photosToDelete = hotel.photos.filter(
        (oldPhoto) => !req.body.photos.find((p) => p.public_id === oldPhoto.public_id)
      );

      if (photosToDelete.length > 0) {
        await Promise.all(
          photosToDelete.map((photo) => cloudinary.uploader.destroy(photo.public_id))
        );
      }
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({ success: true, data: updatedHotel });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi cập nhật: " + error.message });
  }
};

export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Không tìm thấy khách sạn" });

    // Xóa toàn bộ ảnh trên Cloudinary trước khi xóa DB
    if (hotel.photos?.length > 0) {
      await Promise.all(
        hotel.photos.map(photo => cloudinary.uploader.destroy(photo.public_id))
      );
    }

    await hotel.deleteOne();
    res.json({ success: true, message: "Đã xóa khách sạn thành công" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Lỗi khi xóa: " + error.message });
  }
};