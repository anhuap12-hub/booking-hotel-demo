import { Box, Typography, IconButton } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef } from "react";

import HotelCard from "./HotelCard";
import MotionBox from "../Common/MotionBox";

export default function HorizontalHotelRow({ city, hotels = [] }) {
  const scrollRef = useRef(null);

  if (!Array.isArray(hotels) || hotels.length === 0) {
    return null;
  }

  // 1. TĂNG KÍCH THƯỚC: 320px là chuẩn để hiện đủ info như trong ảnh bạn gửi
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
    <Box sx={{ width: "100%", overflow: "visible" }}>
      {/* ===== HEADER (Chỉ hiện nếu có tên thành phố) ===== */}
      {city && (
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
              fontWeight: 600,
              fontSize: "1.25rem",
            }}
          >
            {city}
          </Typography>

          {showArrow && (
            <Box sx={{ display: "flex", gap: 1 }}>
              {/* Nút điều hướng giữ nguyên */}
              <IconButton size="small" onClick={() => scroll("left")} sx={{ bgcolor: "background.paper", boxShadow: 1 }}>
                <ChevronLeftIcon fontSize="small" />
              </IconButton>
              <IconButton size="small" onClick={() => scroll("right")} sx={{ bgcolor: "background.paper", boxShadow: 1 }}>
                <ChevronRightIcon fontSize="small" />
              </IconButton>
            </Box>
          )}
        </Box>
      )}

      {/* ===== SCROLL ROW - FIX HIỂN THỊ INFO ===== */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: `${GAP}px`,
          overflowX: "auto",
          overflowY: "visible", // Quan trọng: Để không bị cắt shadow phía dưới
          
          // Thêm padding dưới để tránh cắt mất phần giá tiền/nút bấm của Card
          px: 1,
          pt: 1,
          pb: 4, 
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
              // Loại bỏ bớt padding nội bộ để card rộng rãi hơn
              p: 0.2, 
            }}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05, duration: 0.4 }}
          >
            {/* 2. BỎ COMPACT: Để HotelCard hiển thị đầy đủ thông tin gốc */}
            <HotelCard hotel={hotel} /> 
          </MotionBox>
        ))}
      </Box>
    </Box>
  );
}