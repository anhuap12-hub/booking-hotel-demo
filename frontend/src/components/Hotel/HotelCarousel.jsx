import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef } from "react";
import HotelCard from "./HotelCard";
import MotionBox from "../Common/MotionBox";

export default function HotelCarousel({ city, hotels = [] }) {
  const scrollRef = useRef(null);

  const CARD_WIDTH = 280; 
  const GAP = 20; 

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -(CARD_WIDTH + GAP) : CARD_WIDTH + GAP,
      behavior: "smooth",
    });
  };

  // Nếu không có khách sạn nào, không hiển thị gì cả
  if (!hotels || hotels.length === 0) return null;

  const showArrow = hotels.length > 1;

  return (
    <Box mb={6} sx={{ width: "100%", overflow: "visible" }}>
      {/* HEADER */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          mb: 2,
          px: 0.5,
        }}
      >
        <Typography
          sx={{
            fontFamily: "Playfair Display, serif",
            fontWeight: 700,
            fontSize: "1.5rem",
            color: "#3a342b",
          }}
        >
          {city}
        </Typography>

        {showArrow && (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              onClick={() => scroll("left")}
              sx={{
                bgcolor: "white",
                boxShadow: 2,
                "&:hover": { bgcolor: "#d4a373", color: "white" },
              }}
            >
              <ChevronLeftIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => scroll("right")}
              sx={{
                bgcolor: "white",
                boxShadow: 2,
                "&:hover": { bgcolor: "#d4a373", color: "white" },
              }}
            >
              <ChevronRightIcon fontSize="small" />
            </IconButton>
          </Box>
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
          py: 2, 
          m: -1, 
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
              p: 0.5, 
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{
              delay: i * 0.05,
              duration: 0.4,
              ease: "easeOut",
            }}
          >
            {/* Truyền prop compact để HotelCard biết hiển thị kiểu nhỏ gọn trong slider */}
            <HotelCard hotel={hotel} compact />
          </MotionBox>
        ))}
      </Box>
    </Box>
  );
}