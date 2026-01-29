import express from "express";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.js";
import uploadImage from "../middleware/uploadImage.js";
import { uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

/**
 * @route   POST /api/upload/batch
 * @desc    Dùng chung cho tất cả các trường hợp upload nhiều ảnh (Add/Edit Hotel & Room)
 */
router.post(
  "/batch",
  protect,
  adminOnly,
  uploadImage.array("photos", 10), // Tăng lên 10 để thoải mái cho Hotel
  uploadFile
);

/**
 * @route   POST /api/upload/single
 * @desc    Dùng cho các trường hợp 1 ảnh duy nhất (Avatar, Thumbnail...)
 */
router.post(
  "/single",
  protect,
  uploadImage.single("photo"), 
  uploadFile
);

export default router;