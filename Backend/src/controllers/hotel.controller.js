import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";

const normalize = (text = "") =>
  slugify(text, { lower: true, strict: true, locale: "vi" });

export const getAllHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, types, amenities, keyword, onlyDiscount, checkIn, checkOut } = req.query;
    const query = { status: "active" }; // Chỉ lấy hotel đang hoạt động

    // 1. Lọc theo Keyword (Tên, Thành phố, hoặc Loại hình)
    if (keyword) {
      query.$or = [
        { name: { $regex: keyword, $options: "i" } },
        { city: { $regex: keyword, $options: "i" } },
        { type: { $regex: keyword, $options: "i" } }
      ];
    }
    if (city) query.citySlug = city;
    if (types) query.type = { $in: types.split(",") };

    // 2. LOGIC LỌC PHÒNG TRỐNG (Nếu có ngày checkIn/checkOut)
    let unavailableRoomIds = [];
    if (checkIn && checkOut) {
      const bookedRooms = await Booking.find({
        status: { $ne: "cancelled" }, 
        $or: [
          { checkIn: { $lt: new Date(checkOut) }, checkOut: { $gt: new Date(checkIn) } }
        ]
      }).select("roomId");
      
      unavailableRoomIds = bookedRooms.map(b => b.roomId);
    }

    // 3. Truy vấn Hotel và Populate Room
    let hotels = await Hotel.find(query)
      .populate({ 
        path: "rooms", 
        match: checkIn && checkOut ? { _id: { $nin: unavailableRoomIds } } : {},
        select: "price discount name" 
      })
      .lean();
      const result = hotels.map((hotel) => {
      const availableRooms = hotel.rooms || [];
      const prices = availableRooms.map(r => r.price * (1 - (r.discount || 0) / 100));
      const minP = prices.length ? Math.min(...prices) : null;
      const maxD = availableRooms.reduce((max, r) => Math.max(max, r.discount || 0), 0);

      return { ...hotel, minPrice: minP, discount: maxD, roomCount: availableRooms.length };
    }).filter((hotel) => {
      if (checkIn && checkOut && hotel.roomCount === 0) return false;
      const okMin = minPrice ? hotel.minPrice >= Number(minPrice) : true;
      const okMax = maxPrice ? hotel.minPrice <= Number(maxPrice) : true;
      const okDiscount = onlyDiscount === "true" ? hotel.discount > 0 : true;
      
      return (hotel.minPrice !== null) && okMin && okMax && okDiscount;
    });

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate({ path: "rooms" })
      .lean();

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
    if (hotelData.city) hotelData.citySlug = normalize(hotelData.city);
    
    // Xử lý tọa độ từ FormData (bọc lại thành object)
    if (req.body['location[lat]'] && req.body['location[lng]']) {
      hotelData.location = {
        lat: Number(req.body['location[lat]']),
        lng: Number(req.body['location[lng]'])
      };
    }

    // Đồng bộ dùng 'photos' thay vì 'images'
    if (req.files?.length) {
      hotelData.photos = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    const newHotel = await Hotel.create(hotelData);
    res.status(201).json({ success: true, data: newHotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

    const updateData = { ...req.body };
    if (updateData.city) updateData.citySlug = normalize(updateData.city);

    // Xử lý tọa độ
    if (req.body['location[lat]'] && req.body['location[lng]']) {
      updateData.location = {
        lat: Number(req.body['location[lat]']),
        lng: Number(req.body['location[lng]'])
      };
    }

    // Quản lý ảnh: Nếu có ảnh mới, ta CỘNG DỒN (hoặc thay thế tùy bạn)
    if (req.files?.length) {
      const newPhotos = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
      // Ở đây tôi chọn ghi đè bằng ảnh mới để đúng logic AdminEdit thông thường
      updateData.photos = newPhotos; 
    }

    const updatedHotel = await Hotel.findByIdAndUpdate(
      req.params.id,
      { $set: updateData },
      { new: true, runValidators: true }
    );
    res.json({ success: true, data: updatedHotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

    await Promise.all(
      (hotel.photos || []).map(photo => cloudinary.uploader.destroy(photo.public_id))
    );

    await hotel.deleteOne();
    res.json({ success: true, message: "Hotel deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};