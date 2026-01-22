import { Box, Typography, IconButton, Stack } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef } from "react";
import HotelCard from "./HotelCard";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function HotelCarousel({ city, hotels = [] }) {
  const scrollRef = useRef(null);

  // Điều chỉnh kích thước chuẩn để Card trông cân đối khi đi theo hàng ngang
  const CARD_WIDTH = 300; 
  const GAP = 24; 

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -(CARD_WIDTH + GAP) : CARD_WIDTH + GAP,
      behavior: "smooth",
    });
  };

  if (!hotels || hotels.length === 0) return null;

  const showArrow = hotels.length > 1;

  return (
    <Box mb={8} sx={{ width: "100%", overflow: "visible" }}>
      {/* HEADER: Tên thành phố và nút điều hướng */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
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
              lineHeight: 1.2
            }}
          >
            {city}
          </Typography>
          <Box sx={{ width: 40, height: 2, bgcolor: "#C2A56D", mt: 1 }} />
        </Box>

        {showArrow && (
          <Stack direction="row" spacing={1.5}>
            <IconButton
              size="small"
              onClick={() => scroll("left")}
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{
                bgcolor: "#fff",
                color: "#1C1B19",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid #F1F0EE",
                "&:hover": { bgcolor: "#1C1B19", color: "#C2A56D", borderColor: "#1C1B19" },
                transition: "0.2s"
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => scroll("right")}
              component={motion.button}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              sx={{
                bgcolor: "#fff",
                color: "#1C1B19",
                boxShadow: "0 4px 12px rgba(0,0,0,0.05)",
                border: "1px solid #F1F0EE",
                "&:hover": { bgcolor: "#1C1B19", color: "#C2A56D", borderColor: "#1C1B19" },
                transition: "0.2s"
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Stack>
        )}
      </Box>

      {/* SCROLL CONTAINER */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: `${GAP}px`,
          overflowX: "auto",
          overflowY: "visible",
          px: 1, 
          pt: 1,
          pb: 5, // Để khoảng trống cho Shadow không bị cắt
          mx: -1, 
          scrollbarWidth: "none", 
          "&::-webkit-scrollbar": { display: "none" }, 
          scrollSnapType: "x mandatory",
          WebkitOverflowScrolling: "touch",
        }}
      >
        {hotels.map((hotel, i) => (
          <MotionBox
            key={hotel._id || i}
            sx={{
              flex: "0 0 auto",
              width: CARD_WIDTH,
              scrollSnapAlign: "start",
            }}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{
              delay: i * 0.1,
              duration: 0.5,
              ease: "easeOut",
            }}
          >
            {/* Sử dụng HotelCard đã nâng cấp, compact=true giúp card gọn gàng hơn trong slider */}
            <HotelCard hotel={hotel} compact={true} />
          </MotionBox>
        ))}
      </Box>
    </Box>
  );
}