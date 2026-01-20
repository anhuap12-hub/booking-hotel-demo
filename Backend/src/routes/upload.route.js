import express from "express";
import { protect } from "../middleware/auth.js";
import { adminOnly } from "../middleware/role.js";
import uploadImage from "../middleware/uploadImage.js";
import { uploadFile } from "../controllers/upload.controller.js";

const router = express.Router();

// upload ảnh khách sạn
router.post(
  "/hotels/:id",
  protect,
  adminOnly,
  uploadImage.array("photos", 5),
  uploadFile
);

// upload ảnh phòng
router.post(
  "/rooms/:id",
  protect,
  adminOnly,
  uploadImage.array("photos", 5),
  uploadFile
);

// upload avatar user
router.post(
  "/users/:id/avatar",
  protect,
  uploadImage.single("avatar"),
  uploadFile
);

export default router;
