import { Box, Typography, Stack, Container, IconButton } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { motion } from "framer-motion";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { useRef } from "react";

const MotionBox = motion(Box);
const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

// Font chữ chuẩn hệ thống của Booking.com
const bookingFont = "'Inter', sans-serif";

export default function PropertiesByType({ properties = [] }) {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();
  const scrollRef = useRef(null);

  const handleGlobalNavigate = (params = {}) => {
    updateSearch({
      city: "", types: [], rating: null, amenities: [], priceRange: null, ...params,
    });
    navigate("/hotels");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scroll = (direction) => {
    const { current } = scrollRef;
    const scrollAmount = current.offsetWidth * 0.8;
    current.scrollBy({
      left: direction === "left" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: -18, mb: 8, position: "relative" }}>
      {/* HEADER SECTION - Font chữ tinh gọn */}
      <Stack sx={{ mb: 4 }}>
        <Typography sx={{ 
            fontFamily: bookingFont, 
            fontSize: "24px", 
            fontWeight: 700, 
            color: "#1A1A1A" 
        }}>
          Phong cách Lưu trú
        </Typography>
      </Stack>

      {/* CAROUSEL CONTAINER */}
      <Box sx={{ position: "relative" }}>
        <IconButton 
          onClick={() => scroll("left")}
          sx={{ position: "absolute", left: -20, top: "40%", zIndex: 10, bgcolor: "white", boxShadow: 2, "&:hover": { bgcolor: "#f8f8f8" } }}
        >
          <ChevronLeftIcon />
        </IconButton>

        <IconButton 
          onClick={() => scroll("right")}
          sx={{ position: "absolute", right: -20, top: "40%", zIndex: 10, bgcolor: "white", boxShadow: 2, "&:hover": { bgcolor: "#f8f8f8" } }}
        >
          <ChevronRightIcon />
        </IconButton>

        <Stack
          ref={scrollRef}
          direction="row"
          spacing={2}
          sx={{
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            pb: 2,
            px: 1
          }}
        >
          {properties.map((p, idx) => (
  <MotionBox
    key={idx}
    whileHover={{ y: -4 }}
    onClick={() => handleGlobalNavigate({ types: [p.name] })} 
    sx={{
      flex: "0 0 auto",
      width: 260,
      height: 260,
      borderRadius: "8px",
      overflow: "hidden",
      cursor: "pointer",
      position: "relative",
      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
    }}
  >

              {/* Ảnh: Nếu nguồn ảnh hỗ trợ resize, hãy thêm params ví dụ: p.img + "?w=600&q=90" */}
              <Box
                component="img"
                src={p.img}
                alt={p.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  imageRendering: "crisp-edges", // Giúp ảnh hiển thị sắc nét hơn trên màn hình độ phân giải cao
                }}
              />
              <Box sx={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)", zIndex: 1 }} />
              
              <Box sx={{ position: "absolute", bottom: 0, left: 0, p: 2, zIndex: 2, color: "#fff" }}>
                <Typography sx={{ 
                    fontFamily: bookingFont, 
                    fontWeight: 700, 
                    fontSize: "18px", 
                    lineHeight: 1.2,
                    mb: 0.5 
                }}>
                  {cap(p.name)}
                </Typography>
                <Typography sx={{ 
                    fontFamily: bookingFont, 
                    fontSize: "14px", 
                    fontWeight: 400,
                    opacity: 0.9 
                }}>
                  {p.count} chỗ nghỉ
                </Typography>
              </Box>
            </MotionBox>
          ))}
        </Stack>
      </Box>
    </Container>
  );
}