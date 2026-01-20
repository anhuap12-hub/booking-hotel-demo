import Hotel from "../models/Hotel.js";
import { v2 as cloudinary } from "cloudinary";
import slugify from "slugify";
const normalize = (text = "") =>
  slugify(text, { lower: true, strict: true, locale: "vi" });

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

    let query = {};

    // 1️⃣ Keyword
    if (keyword) {
      query.name = { $regex: keyword, $options: "i" };
    }

    // 2️⃣ City (DÙNG citySlug)
    if (city) {
      query.citySlug = city;   // ✅ FIX
    }

    // 3️⃣ Types
    if (types) {
      query.type = { $in: types.split(",") };
    }

    // 4️⃣ Amenities
    if (amenities) {
      const amenityArray = Array.isArray(amenities)
        ? amenities
        : amenities.split(",");
      query.amenities = { $all: amenityArray };
    }

    // Query DB
    const hotels = await Hotel.find(query)
      .populate({ path: "rooms", select: "price discount" })
      .lean();

    // 5️⃣ Price + discount logic
    const result = hotels
      .map(hotel => {
        let minP = Infinity;
        let maxD = 0;

        hotel.rooms?.forEach(r => {
          if (r.price < minP) minP = r.price;
          if (r.discount > maxD) maxD = r.discount;
        });

        return {
          ...hotel,
          minPrice: minP === Infinity ? null : minP,
          discount: maxD,
        };
      })
      .filter(hotel => {
        const matchesMinPrice = minPrice
          ? hotel.minPrice >= Number(minPrice)
          : true;

        const matchesMaxPrice = maxPrice
          ? hotel.minPrice <= Number(maxPrice)
          : true;

        const matchesDiscount =
          onlyDiscount === "true" ? hotel.discount > 0 : true;

        return matchesMinPrice && matchesMaxPrice && matchesDiscount;
      });

    res.json({ success: true, data: result });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ================== GET HOTEL BY ID ==================
export const getHotelById = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id)
      .populate("rooms")
      .select(
        "name city citySlug address desc distance rating photos reviews rooms type location amenities"
      );

    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });

    const cheapestPrice =
      hotel.rooms && hotel.rooms.length > 0
        ? Math.min(...hotel.rooms.map((r) => r.price))
        : null;

    res.json({
      success: true,
      data: { ...hotel.toObject(), cheapestPrice },
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================== CREATE HOTEL ==================
export const createHotel = async (req, res) => {
  try {
    const hotelData = req.body;
    const photos = [];

    // ✅ TẠO citySlug TẠI ĐÂY
    if (hotelData.city) {
      hotelData.citySlug = normalize(hotelData.city);
    }
    if (hotelData.name) {
  hotelData.name_normalized = normalize(hotelData.name);
}
    if (req.files && req.files.length > 0) {
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "hotels",
        });
        photos.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
    }

    hotelData.photos = photos;
    const newHotel = await Hotel.create(hotelData);

    res.status(201).json({ success: true, data: newHotel });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// ================== UPDATE HOTEL ==================
export const updateHotel = async (req, res) => {
  try {
    const { id } = req.params;
    const hotel = await Hotel.findById(id);

    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });

    // 🔁 Update citySlug nếu đổi city
    if (req.body.city) {
      req.body.citySlug = normalize(req.body.city);
    }
    if (req.body.name) {
  req.body.name_normalized = normalize(req.body.name);
}

    if (req.files && req.files.length > 0) {
      for (const photo of hotel.photos) {
        await cloudinary.uploader.destroy(photo.public_id);
      }

      const newPhotos = [];
      for (const file of req.files) {
        const result = await cloudinary.uploader.upload(file.path, {
          folder: "hotels",
        });
        newPhotos.push({
          url: result.secure_url,
          public_id: result.public_id,
        });
      }
      hotel.photos = newPhotos;
    }

    Object.assign(hotel, req.body);
    await hotel.save();

    res.json({ success: true, data: hotel });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// ================== DELETE HOTEL ==================
export const deleteHotel = async (req, res) => {
  try {
    const hotel = await Hotel.findById(req.params.id);

    if (!hotel)
      return res
        .status(404)
        .json({ success: false, message: "Hotel not found" });

    for (const photo of hotel.photos) {
      await cloudinary.uploader.destroy(photo.public_id);
    }

    await hotel.deleteOne();
    res.json({ success: true, message: "Hotel deleted" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
