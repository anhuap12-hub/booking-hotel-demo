import express from "express";
import { createReview, getHotelReviews } from "../controllers/review.controller.js";
import { protect } from "../middleware/auth.js"; 

const router = express.Router();

router.get("/:hotelId", getHotelReviews);
router.post("/",protect, createReview);

export default router;