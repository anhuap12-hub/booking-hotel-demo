import { Box, Button } from "@mui/material";
import { motion } from "framer-motion";
import { useState } from "react";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

const MotionBox = motion(Box);
const BLUE = "#0056b3";

export default function RoomGallery({ photos = [] }) {
  const [open, setOpen] = useState(false);

  // Xử lý dữ liệu: đảm bảo luôn có mảng để map
  const images = Array.isArray(photos) && photos.length > 0 
    ? photos.map((p) => (typeof p === "string" ? p : p?.url)).filter(Boolean)
    : [];

  const displayImages = images.slice(0, 6);
  const slides = images.map((url) => ({ src: url }));

  // Nếu không có ảnh, không render gì hoặc render fallback tùy bạn
  if (images.length === 0) return null;

  return (
    <Box sx={{ mb: 4, mt: 2 }}>
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
            onClick={() => setOpen(true)}
            sx={{
              width: "100%",
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
              alt={`Room gallery ${i + 1}`}
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
            {/* Overlay cho ảnh cuối nếu có nhiều hơn 6 ảnh */}
            {i === 5 && images.length > 6 && (
              <Box sx={{
                position: "absolute", inset: 0, bgcolor: "rgba(0,0,0,0.5)",
                display: "flex", alignItems: "center", justifyContent: "center"
              }}>
                <span style={{ color: '#fff', fontWeight: 700 }}>+{images.length - 6}</span>
              </Box>
            )}
          </MotionBox>
        ))}
      </Box>
      <Lightbox open={open} close={() => setOpen(false)} slides={slides} />
    </Box>
  );
}