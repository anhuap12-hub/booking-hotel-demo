import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";

const normalize = (text = "") =>
  slugify(text, { lower: true, strict: true, locale: "vi" });

export const getAllHotels = async (req, res) => {
  try {
    const { city, minPrice, maxPrice, types, amenities, keyword, onlyDiscount } = req.query;
    const query = {};

    if (keyword) query.name = { $regex: keyword, $options: "i" };
    if (city) query.citySlug = city;
    if (types) query.type = { $in: types.split(",") };
    if (amenities) {
      const amenityArr = Array.isArray(amenities) ? amenities : amenities.split(",");
      query.amenities = { $all: amenityArr };
    }

    const hotels = await Hotel.find(query)
      .populate({ path: "rooms", select: "price discount" })
      .lean();

    const result = hotels.map((hotel) => {
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
      return { ...hotel, minPrice: minP, discount: maxD };
    }).filter((hotel) => {
      if (hotel.minPrice === null) return false;
      const okMin = minPrice ? hotel.minPrice >= Number(minPrice) : true;
      const okMax = maxPrice ? hotel.minPrice <= Number(maxPrice) : true;
      const okDiscount = onlyDiscount === "true" ? hotel.discount > 0 : true;
      return okMin && okMax && okDiscount;
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

    if (req.files?.length) {
      await Promise.all(
        (hotel.photos || []).map(photo => 
          photo.public_id ? cloudinary.uploader.destroy(photo.public_id) : Promise.resolve()
        )
      );
      updateData.photos = req.files.map(file => ({
        url: file.path,
        public_id: file.filename
      }));
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