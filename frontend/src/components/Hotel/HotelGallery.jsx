import { Grid, Box } from "@mui/material";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const FALLBACK_PEXELS = [
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
  "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
  "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
  "https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg",
  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
];

export default function HotelGallery({ photos }) {
  let images = FALLBACK_PEXELS;

  if (Array.isArray(photos) && photos.length > 0) {
    images = photos
      .map((p) => (typeof p === "string" ? p : p?.url))
      .filter(Boolean);
  }

  // Đảm bảo luôn có ít nhất 5 ảnh để fill đầy grid (re-use ảnh nếu thiếu)
  const displayImages = images.length < 5 
    ? [...images, ...FALLBACK_PEXELS].slice(0, 5) 
    : images.slice(0, 5);

  return (
    <Box sx={{ mb: 6, mt: 4 }}>
      <Grid container spacing={1.5}>
        {displayImages.map((src, i) => (
          <Grid 
            item 
            xs={12} 
            md={i === 0 ? 6 : 3} 
            key={i}
            sx={{ display: { xs: i > 0 ? "none" : "block", md: "block" } }}
          >
            <MotionBox
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ 
                duration: 0.7, 
                delay: i * 0.1,
                ease: [0.215, 0.61, 0.355, 1] 
              }}
              sx={{
                width: "100%",
                height: i === 0 ? { xs: 300, md: 450 } : 221,
                overflow: "hidden",
                borderRadius: i === 0 ? "24px 0 0 24px" : (i === 2 || i === 4 ? "0 24px 24px 0" : "0"),
                position: "relative",
                cursor: "pointer",
                bgcolor: "#f0f0f0"
              }}
            >
              <Box
                component="img"
                src={src}
                alt={`Hotel image ${i + 1}`}
                loading="lazy"
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  filter: "brightness(0.95)",
                  transition: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    filter: "brightness(1)",
                    transform: "scale(1.05)",
                  },
                }}
              />
              
              {/* Overlay nhẹ khi hover để tăng chiều sâu */}
              <Box
                sx={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  background: "linear-gradient(to bottom, rgba(0,0,0,0) 0%, rgba(0,0,0,0.2) 100%)",
                  opacity: 0,
                  transition: "opacity 0.3s",
                  "&:hover": { opacity: 1 }
                }}
              />

              {/* Nút "Xem thêm" giả lập ở ảnh cuối cùng */}
              {i === 4 && images.length > 5 && (
                <Box
                  sx={{
                    position: "absolute",
                    bottom: 20,
                    right: 20,
                    bgcolor: "rgba(255,255,255,0.9)",
                    px: 2,
                    py: 1,
                    borderRadius: "8px",
                    color: "#1C1B19",
                    fontWeight: 700,
                    fontSize: "0.8rem",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)"
                  }}
                >
                  +{images.length - 5} ảnh
                </Box>
              )}
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}