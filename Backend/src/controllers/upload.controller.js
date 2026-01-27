import { v2 as cloudinary } from "cloudinary";

export const uploadFile = async (req, res) => {
  try {
    const files = req.files || (req.file ? [req.file] : []);

    if (files.length === 0) {
      return res.status(400).json({ success: false, message: "No file uploaded" });
    }

    const uploaded = files.map((file) => ({
      url: file.path,
      public_id: file.filename,
    }));

    res.status(200).json({
      success: true,
      message: "Upload success",
      data: uploaded, 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};