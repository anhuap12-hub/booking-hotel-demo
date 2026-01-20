import express from "express";
import {
  getAllHotels,
  getHotelById,
  createHotel,
  deleteHotel,
  updateHotel,
} from "../controllers/hotel.controller.js";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.js";
import uploadImage from "../middleware/uploadImage.js";

const router = express.Router();

router.post("/", protect, adminOnly, uploadImage.array("images", 10), createHotel);
router.get("/", getAllHotels);
router.get("/:id", getHotelById);
router.put("/:id", protect, adminOnly, uploadImage.array("images", 10), updateHotel);
router.delete("/:id", protect, adminOnly, deleteHotel);
router.get("/deals", async (req, res) => {
  try {
    const deals = await Hotel.find({
      isDeal: true,
      discount: { $gte: 10 },
    })
      .sort({ discount: -1 })
      .limit(20);

    res.json({
      success: true,
      data: deals,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "Không thể lấy deals",
    });
  }
});
export default router;
