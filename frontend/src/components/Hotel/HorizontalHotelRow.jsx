import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import Button from "@mui/material/Button"; 
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef } from "react";
import HotelCard from "./HotelCard";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionButton = motion(Button); // Tạo Button hỗ trợ hiệu ứng motion

export default function HorizontalHotelRow({ city, hotels = [] }) {
  const scrollRef = useRef(null);

  if (!Array.isArray(hotels) || hotels.length === 0) return null;

  const CARD_WIDTH = 320; 
  const GAP = 28; 

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -(CARD_WIDTH + GAP) : CARD_WIDTH + GAP,
      behavior: "smooth",
    });
  };

  const showArrow = hotels.length > 1;

  return (
    <Box sx={{ width: "100%", overflow: "visible", position: "relative", mb: 6 }}>
      {/* ===== HEADER ===== */}
      {city && (
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
                letterSpacing: "-0.01em",
                lineHeight: 1
              }}
            >
              {city}
            </Typography>
            <Box 
              sx={{ 
                width: 40, 
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
      )}

      {/* ===== SCROLL ROW ===== */}
      <Box
        ref={scrollRef}
        sx={{
          display: "flex",
          gap: `${GAP}px`,
          overflowX: "auto",
          overflowY: "visible",
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
            }}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-50px" }}
            transition={{ 
              delay: index * 0.1, 
              duration: 0.6,
              ease: [0.215, 0.61, 0.355, 1] 
            }}
          >
            <HotelCard hotel={hotel} /> 
          </MotionBox>
        ))}
      </Box>
    </Box>
  );
}


function NavButton({ icon, onClick }) {
  return (
    <MotionButton 
      onClick={onClick} 
      whileHover={{ backgroundColor: "#1C1B19", color: "#C2A56D" }}
      whileTap={{ scale: 0.95 }}
      sx={{ 
        minWidth: 40,
        width: 40,
        height: 40,
        borderRadius: "50%", 
        bgcolor: "transparent", 
        color: "#1C1B19",
        border: "1px solid #EAE8E4",
        p: 0,
        transition: "all 0.3s ease",
        "&:hover": {
            backgroundColor: "#1C1B19", // Đảm bảo hover hoạt động với Button
        }
      }}
    >
      {icon}
    </MotionButton>
  );
}