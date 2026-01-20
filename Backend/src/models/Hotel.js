import mongoose from "mongoose";
import slugify from "slugify";

/* ================= HELPER ================= */
const toSlug = (str = "") =>
  slugify(str, {
    lower: true,
    strict: true,
    locale: "vi",
  });

/* ================= PHOTO ================= */
const photoSchema = new mongoose.Schema(
  {
    url: { type: String, required: true },
    public_id: { type: String, required: true },
  },
  { _id: false }
);

/* ================= HOTEL ================= */
const hotelSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    city: { type: String, required: true, trim: true },
    address: { type: String, required: true, trim: true },
    country: { type: String, default: "Vietnam" },

    citySlug: { type: String },
    searchText: { type: String },

    distance: String,
    location: {
      lat: Number,
      lng: Number,
    },
  

    photos: { type: [photoSchema], default: [] },

    desc: { type: String, required: true, trim: true },

    rating: { type: Number, min: 0, max: 10, default: 0 },
    reviews: { type: Number, default: 0 },

    amenities: { type: [String], default: [] },

    rooms: [{ type: mongoose.Schema.Types.ObjectId, ref: "Room" }],

    cheapestPrice: { type: Number, default: 0 },

    type: { type: String, default: "hotel" },

    status: {
      type: String,
      enum: ["active", "inactive"],
      default: "active",
    },

    checkInTime: { type: String, default: "14:00" },
    checkOutTime: { type: String, default: "12:00" },
  },
  { timestamps: true }
);

/* ================= PRE SAVE ================= */
hotelSchema.pre("save", function () {
  const parts = [];

  if (this.name) parts.push(this.name);
  if (this.city) parts.push(this.city);
  if (this.address) parts.push(this.address);

  if (this.city) {
    this.citySlug = toSlug(this.city);
  }

  this.searchText = toSlug(parts.join(" "));
});

/* ================= INDEX ================= */
hotelSchema.index({ citySlug: 1 });
hotelSchema.index({ searchText: 1 });
hotelSchema.index({ status: 1 });
hotelSchema.index({ rating: -1 });
hotelSchema.index({ cheapestPrice: 1 });

export default mongoose.model("Hotel", hotelSchema);
