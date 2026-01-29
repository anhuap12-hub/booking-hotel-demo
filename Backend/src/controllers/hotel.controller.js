import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
import Booking from "../models/Booking.js"; 

// 1. Cấu hình Cloudinary để các hàm destroy/upload hoạt động
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
});

const normalize = (text = "") =>
  slugify(text, { lower: true, strict: true, locale: "vi" });

export const getAllHotels = async (req, res, next) => {
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
    next(err); // Sửa lỗi next is not a function
  }
};

export const getHotelById = async (req, res, next) => {
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
    next(error);
  }
};

export const createHotel = async (req, res, next) => {
  try {
    const hotelData = { ...req.body };
    if (hotelData.city) hotelData.citySlug = normalize(hotelData.city);
    
    // Fix logic nhận location từ JSON (Frontend gửi trực tiếp object)
    if (req.body.location && typeof req.body.location === 'object') {
      hotelData.location = {
        lat: Number(req.body.location.lat),
        lng: Number(req.body.location.lng)
      };
    } else if (req.body['location[lat]'] && req.body['location[lng]']) {
      hotelData.location = {
        lat: Number(req.body['location[lat]']),
        lng: Number(req.body['location[lng]'])
      };
    }

    // Xử lý ảnh nếu gửi qua Multer (FormData)
    if (req.files?.length) {
      hotelData.photos = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
    }

    const newHotel = await Hotel.create(hotelData);
    res.status(201).json({ success: true, data: newHotel });
  } catch (error) {
    next(error);
  }
};

export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

    const updateData = { ...req.body };
    if (updateData.city) updateData.citySlug = normalize(updateData.city);

    // Đồng bộ xử lý location JSON
    if (req.body.location && typeof req.body.location === 'object') {
        updateData.location = {
          lat: Number(req.body.location.lat),
          lng: Number(req.body.location.lng)
        };
    } else if (req.body['location[lat]'] && req.body['location[lng]']) {
      updateData.location = {
        lat: Number(req.body['location[lat]']),
        lng: Number(req.body['location[lng]'])
      };
    }

    // Xóa ảnh trên Cloudinary nếu ảnh không còn trong danh sách mới
    if (req.body.photos) {
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
    next(error);
  }
};

export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) return res.status(404).json({ success: false, message: "Hotel not found" });

    // Xóa tất cả ảnh liên quan trên Cloudinary trước khi xóa Hotel
    if (hotel.photos?.length > 0) {
      await Promise.all(
        hotel.photos.map(photo => cloudinary.uploader.destroy(photo.public_id))
      );
    }

    await hotel.deleteOne();
    res.json({ success: true, message: "Hotel deleted" });
  } catch (error) {
    next(error);
  }
};