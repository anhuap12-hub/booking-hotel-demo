import { Box, Typography, IconButton, Stack } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef } from "react";
import HotelCard from "./HotelCard";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function HotelCarousel({ city, hotels = [] }) {
  const scrollRef = useRef(null);

  // CARD_WIDTH 300px là tỷ lệ vàng cho các hàng ngang (Carousel)
  const CARD_WIDTH = 300; 
  const GAP = 28; 

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
    <Box mb={10} sx={{ width: "100%", overflow: "visible" }}>
      {/* HEADER: Tên thành phố và nút điều hướng */}
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-end",
          justifyContent: "space-between",
          mb: 4,
          px: 0.5,
        }}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: { xs: "1.4rem", md: "1.8rem" },
              color: "#1C1B19",
              lineHeight: 1,
              letterSpacing: "-0.01em"
            }}
          >
            {city}
          </Typography>
          <Box 
            sx={{ 
              width: 32, 
              height: 3, 
              bgcolor: "#C2A56D", 
              mt: 1.5,
              borderRadius: "2px" 
            }} 
          />
        </Box>

        {showArrow && (
          <Stack direction="row" spacing={1}>
            <NavButton icon={<ChevronLeftIcon fontSize="small" />} onClick={() => scroll("left")} />
            <NavButton icon={<ChevronRightIcon fontSize="small" />} onClick={() => scroll("right")} />
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
          pb: 6, // Tăng nhẹ để shadow của HotelCard bay bổng hơn
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
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-20px" }}
            transition={{
              delay: i * 0.08,
              duration: 0.7,
              ease: [0.22, 1, 0.36, 1], // Cubic-bezier mượt hơn
            }}
          >
            {/* Truyền compact={true} để Card tối giản, phù hợp hàng ngang */}
            <HotelCard hotel={hotel} compact={true} />
          </MotionBox>
        ))}
      </Box>
    </Box>
  );
}

// Tách riêng NavButton để code sạch hơn và dễ quản lý style Ebony & Gold
function NavButton({ icon, onClick }) {
  return (
    <IconButton
      size="small"
      onClick={onClick}
      component={motion.button}
      whileHover={{ scale: 1.05, backgroundColor: "#1C1B19", color: "#C2A56D" }}
      whileTap={{ scale: 0.95 }}
      sx={{
        bgcolor: "transparent",
        color: "#1C1B19",
        border: "1px solid #EAE8E4",
        p: 1.2,
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
           borderColor: "#1C1B19"
        }
      }}
    >
      {icon}
    </IconButton>
  );
}