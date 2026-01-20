import Booking from "../models/Booking.js";
import Room from "../models/Room.js";

/**
 * ==============================
 * CREATE BOOKING (USER)
 * ==============================
 */
export const createBooking = async (req, res) => {
  try {
    console.log("📥 CREATE BOOKING BODY:", req.body);
    console.log("👤 USER:", req.user);

    const { room, checkIn, checkOut, guest, guestsCount } = req.body;

    if (!req.user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    if (!room || !checkIn || !checkOut || !guest || !guestsCount) {
      return res.status(400).json({ message: "Missing booking data" });
    }

    if (!guest.name || !guest.phone) {
      return res.status(400).json({ message: "Guest info invalid" });
    }

    const roomExists = await Room.findById(room).populate("hotel");
    if (!roomExists) {
      return res.status(404).json({ message: "Room not found" });
    }

    if (!roomExists.hotel?._id) {
      return res.status(400).json({ message: "Room missing hotel" });
    }

    if (guestsCount > roomExists.maxPeople) {
      return res
        .status(400)
        .json({ message: "Guests exceed room capacity" });
    }

    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);

    if (checkInDate >= checkOutDate) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const nights = Math.ceil(
      (checkOutDate - checkInDate) / (1000 * 60 * 60 * 24)
    );

    if (nights < 1) {
      return res.status(400).json({ message: "At least 1 night required" });
    }

    const pricePerNight =
      roomExists.price ?? roomExists.pricePerNight;

    if (!pricePerNight) {
      return res.status(400).json({ message: "Room price missing" });
    }

    // ❗ Check trùng lịch
    const conflict = await Booking.findOne({
      room,
      status: { $nin: ["cancelled"] },
      checkIn: { $lt: checkOutDate },
      checkOut: { $gt: checkInDate },
    });

    if (conflict) {
      return res.status(400).json({ message: "Room already booked" });
    }

    const booking = await Booking.create({
      user: req.user.id,
      hotel: roomExists.hotel._id,
      room: roomExists._id,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guest,
      guestsCount,
      roomSnapshot: {
        name: roomExists.name,
        type: roomExists.type,
        pricePerNight,
        maxPeople: roomExists.maxPeople,
        cancellationPolicy: roomExists.cancellationPolicy,
      },
      nights,
      totalPrice: pricePerNight * nights,
      status: "pending", // ✅ CSKH xử lý
      contactStatus: "new",
    });

    console.log("✅ BOOKING CREATED:", booking._id);

    return res.status(201).json({
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ CREATE BOOKING ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ==============================
 * CANCEL BOOKING (USER / ADMIN)
 * ==============================
 */
export const cancelBooking = async (req, res) => {
  try {
    console.log("❌ CANCEL BOOKING:", req.params.id);

    const booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    if (
      booking.user.toString() !== req.user.id &&
      req.user.role !== "admin"
    ) {
      return res.status(403).json({ message: "Not authorized" });
    }

    if (booking.status === "cancelled") {
      return res
        .status(400)
        .json({ message: "Booking already cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    console.log("✅ BOOKING CANCELLED:", booking._id);

    return res.json({
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ CANCEL BOOKING ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ==============================
 * GET MY BOOKINGS (USER)
 * ==============================
 */
export const getUserBookings = async (req, res) => {
  try {
    console.log("📦 GET USER BOOKINGS:", req.user.id);

    let bookings = await Booking.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .populate({
        path: "room",
        select: "name type price photos maxPeople",
      })
      .populate({
        path: "hotel",
        select: "name city address photos rating",
      });

    // 🔥 lọc booking lỗi
    bookings = bookings.filter(
      (b) => b.room !== null && b.hotel !== null
    );

    return res.json(bookings);
  } catch (error) {
    console.error("❌ GET USER BOOKINGS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ==============================
 * ADMIN: GET ALL BOOKINGS
 * ==============================
 */
export const getAllBookings = async (req, res) => {
  try {
    console.log("📊 ADMIN GET ALL BOOKINGS");

    const filter = {};
    if (req.query.status) {
      filter.status = req.query.status;
    }

    const bookings = await Booking.find(filter)
      .sort({ createdAt: -1 })
      .populate("room", "name type price")
      .populate("hotel", "name city")
      .populate("user", "username email");

    return res.json(bookings);
  } catch (error) {
    console.error("❌ GET ALL BOOKINGS ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

/**
 * ==============================
 * ADMIN: UPDATE BOOKING STATUS
 * ==============================
 */
export const updateBooking = async (req, res) => {
  try {
    console.log("✏️ UPDATE BOOKING:", req.params.id, req.body);

    const { status } = req.body;
    const allowedStatus = ["pending", "confirmed", "cancelled"];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const booking = await Booking.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    console.log("✅ BOOKING UPDATED:", booking._id, status);

    return res.json({
      message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.error("❌ UPDATE BOOKING ERROR:", error);
    return res.status(500).json({ message: error.message });
  }
};

