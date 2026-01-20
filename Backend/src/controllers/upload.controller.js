import { v2 as cloudinary } from "cloudinary";

export const uploadFile = async (req, res) => {
  try {
    if (!req.files && !req.file) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const files = req.files || [req.file];
    const uploaded = [];

    for (const file of files) {
      const result = await cloudinary.uploader.upload(file.path, { folder: "uploads" });
      uploaded.push({
        url: result.secure_url,
        public_id: result.public_id,
      });
    }

    res.status(200).json({
      success: true,
      message: "Upload success",
      files: uploaded,
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
