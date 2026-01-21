import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";

/* ================== UTILS ================== */
const normalize = (text = "") =>
  slugify(text, { lower: true, strict: true, locale: "vi" });

/* ================== GET ALL HOTELS ================== */
export const getAllHotels = async (req, res) => {
  try {
    const {
      city,
      minPrice,
      maxPrice,
      types,
      amenities,
      keyword,
      onlyDiscount,
    } = req.query;

    const query = {};

    // 🔍 Keyword search
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    // 🌍 City (slug)
    if (city) {
      query.citySlug = city;
    }

    // 🏨 Types
    if (types) {
      query.type = { $in: types.split(",") };
    }

    // 🧰 Amenities
    if (amenities) {
      const amenityArr = Array.isArray(amenities)
        ? amenities
        : amenities.split(",");
      query.amenities = { $all: amenityArr };
    }

    // 📦 Query DB
    const hotels = await Hotel.find(query)
      .populate({
        path: "rooms",
        select: "price discount",
        options: { strictPopulate: false }, // ⭐ FIX CRASH
      })
      .lean();

    // 🧮 Price & discount calculation
    const result = hotels
      .map((hotel) => {
        let minP = null;
        let maxD = 0;

        if (Array.isArray(hotel.rooms)) {
          for (const r of hotel.rooms) {
            if (typeof r.price === "number") {
              minP = minP === null ? r.price : Math.min(minP, r.price);
            }
            if (typeof r.discount === "number") {
              maxD = Math.max(maxD, r.discount);
            }
          }
        }

        return {
          ...hotel,
          minPrice: minP,
          discount: maxD,
        };
      })
      .filter((hotel) => {
        if (hotel.minPrice === null) return false;

        const okMin = minPrice
          ? hotel.minPrice >= Number(minPrice)
          : true;

        const okMax = maxPrice
          ? hotel.minPrice <= Number(maxPrice)
          : true;

        const okDiscount =
          onlyDiscount === "true" ? hotel.discount > 0 : true;

        return okMin && okMax && okDiscount;
      });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("❌ getAllHotels error:", err);
    res.status(500).json({ success: false, message: err.message });
  }
};

/* ================== GET HOTEL BY ID ================== */
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate({
        path: "rooms",
        options: { strictPopulate: false },
      })
      .lean();

    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    let cheapestPrice = null;
    if (Array.isArray(hotel.rooms)) {
      for (const r of hotel.rooms) {
        if (typeof r.price === "number") {
          cheapestPrice =
            cheapestPrice === null
              ? r.price
              : Math.min(cheapestPrice, r.price);
        }
      }
    }

    res.json({
      success: true,
      data: { ...hotel, cheapestPrice },
    });
  } catch (error) {
    console.error("❌ getHotelById error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================== CREATE HOTEL ================== */
export const createHotel = async (req, res) => {
  try {
    const hotelData = req.body;
    const photos = [];

    // Slugs
    if (hotelData.city) {
      hotelData.citySlug = normalize(hotelData.city);
    }
    if (hotelData.name) {
      hotelData.name_normalized = normalize(hotelData.name);
    }

    // Upload images
    if (req.files?.length) {
      for (const file of req.files) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "hotels",
        });
        photos.push({
          url: upload.secure_url,
          public_id: upload.public_id,
        });
      }
    }

    hotelData.photos = photos;

    const newHotel = await Hotel.create(hotelData);
    res.status(201).json({ success: true, data: newHotel });
  } catch (error) {
    console.error("❌ createHotel error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================== UPDATE HOTEL ================== */
export const updateHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    // Update slugs
    if (req.body.city) {
      req.body.citySlug = normalize(req.body.city);
    }
    if (req.body.name) {
      req.body.name_normalized = normalize(req.body.name);
    }

    // Replace images
    if (req.files?.length) {
      for (const photo of hotel.photos || []) {
        await cloudinary.uploader.destroy(photo.public_id);
      }

      const newPhotos = [];
      for (const file of req.files) {
        const upload = await cloudinary.uploader.upload(file.path, {
          folder: "hotels",
        });
        newPhotos.push({
          url: upload.secure_url,
          public_id: upload.public_id,
        });
      }
      hotel.photos = newPhotos;
    }

    Object.assign(hotel, req.body);
    await hotel.save();

    res.json({ success: true, data: hotel });
  } catch (error) {
    console.error("❌ updateHotel error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

/* ================== DELETE HOTEL ================== */
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });
    }

    for (const photo of hotel.photos || []) {
      await cloudinary.uploader.destroy(photo.public_id);
    }

    await hotel.deleteOne();
    res.json({ success: true, message: "Hotel deleted" });
  } catch (error) {
    console.error("❌ deleteHotel error:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};
