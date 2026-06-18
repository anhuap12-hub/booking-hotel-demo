import { Box } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const FALLBACK_PEXELS = [
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
  "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
  "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
  "https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg",
  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
  "https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg",
];

export default function HotelGallery({ photos }) {
  let images = photos && photos.length > 0 
    ? photos.map((p) => (typeof p === "string" ? p : p?.url)).filter(Boolean)
    : FALLBACK_PEXELS;

  const displayImages = images.slice(0, 6);

  return (
    // Thêm mx: "auto" để căn giữa, và giới hạn maxWidth="lg" để bằng với các section khác
    <Box sx={{ mb: 4, mt: 2, maxWidth: "lg", mx: "auto", px: { xs: 2, md: 0 } }}>
      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          gap: "12px",
        }}
      >
        {displayImages.map((src, i) => (
          <MotionBox
            key={i}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: i * 0.05 }}
            sx={{
              width: "100%",
              // Thay đổi aspectRatio từ 16/10 thành 16/9 hoặc 3/2 để ảnh trông thanh thoát, ít chiếm diện tích chiều dọc hơn
              aspectRatio: "16 / 9", 
              overflow: "hidden",
              borderRadius: "12px",
              cursor: "pointer",
              bgcolor: "#f0f0f0",
              position: "relative",
            }}
          >
            <Box
              component="img"
              src={src}
              alt={`Hotel gallery ${i + 1}`}
              loading="lazy"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.4s ease",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />
          </MotionBox>
        ))}
      </Box>
    </Box>
  );
}