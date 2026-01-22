import { Box, Typography, IconButton, Stack } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef } from "react";
import HotelCard from "./HotelCard";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function HorizontalHotelRow({ city, hotels = [] }) {
  const scrollRef = useRef(null);

  if (!Array.isArray(hotels) || hotels.length === 0) return null;

  const CARD_WIDTH = 320; 
  const GAP = 24;

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -(CARD_WIDTH + GAP) : CARD_WIDTH + GAP,
      behavior: "smooth",
    });
  };

  const showArrow = hotels.length > 1;

  return (
    <Box sx={{ width: "100%", overflow: "visible", position: "relative" }}>
      {/* ===== HEADER ===== */}
      {city && (
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end", // Căn dòng theo chân chữ để sang trọng hơn
            justifyContent: "space-between",
            mb: 3,
            px: 0.5,
          }}
        >
          <Box>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                fontSize: "1.5rem",
                color: "#1C1B19",
              }}
            >
              {city}
            </Typography>
            <Box sx={{ width: 30, height: 2, bgcolor: "#C2A56D", mt: 0.5 }} />
          </Box>

          {showArrow && (
            <Stack direction="row" spacing={1.5}>
              <NavButton icon={<ChevronLeftIcon />} onClick={() => scroll("left")} />
              <NavButton icon={<ChevronRightIcon />} onClick={() => scroll("right")} />
            </Stack>
          )}
        </Box>
      )}

      {/* ===== SCROLL ROW ===== */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: `${GAP}px`,
          overflowX: "auto",
          overflowY: "visible",
          
          // Padding rộng ra để lộ shadow của HotelCard
          px: 1,
          pt: 1,
          pb: 6, 
          mx: -1,

          scrollbarWidth: "none",
          "&::-webkit-scrollbar": { display: "none" },
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {hotels.map((hotel, index) => (
          <MotionBox
            key={hotel._id || index}
            sx={{
              flex: "0 0 auto",
              width: CARD_WIDTH,
              scrollSnapAlign: "start",
            }}
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
          >
            <HotelCard hotel={hotel} /> 
          </MotionBox>
        ))}
      </Box>
    </Box>
  );
}

// Nút điều hướng custom
function NavButton({ icon, onClick }) {
  return (
    <IconButton 
      size="small" 
      onClick={onClick} 
      component={motion.button}
      whileHover={{ scale: 1.1, backgroundColor: "#1C1B19", color: "#fff" }}
      whileTap={{ scale: 0.9 }}
      sx={{ 
        bgcolor: "#fff", 
        color: "#1C1B19",
        boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
        border: "1px solid #F1F0EE",
        p: 1,
        transition: "0.2s"
      }}
    >
      {icon}
    </IconButton>
  );
}