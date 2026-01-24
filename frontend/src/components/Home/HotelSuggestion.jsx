import { useState, useEffect, useRef } from "react";
import { Box, Typography, Button, Skeleton, Stack, Container } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HotelCard from "../Hotel/HotelCard";
import { getAllHotels } from "../../api/hotel.api";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function HotelSuggestion({ filters }) {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(false);
  const scrollRef = useRef(null);

  // Kích thước card cố định để tính toán scroll
  const CARD_WIDTH = 340; 
  const GAP = 24;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const res = await getAllHotels({ ...filters, limit: 10 }); // Lấy khoảng 10 cái để cuộn cho sướng
        setHotels(res.data?.data || []);
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const scroll = (dir) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollBy({
      left: dir === "left" ? -(CARD_WIDTH + GAP) : CARD_WIDTH + GAP,
      behavior: "smooth",
    });
  };

  return (
    <Box sx={{ bgcolor: "#FFFFFF", width: "100%", py: { xs: 4, md: 8 }, overflow: "hidden" }}>
      <Container maxWidth="xl">
        
        {/* HEADER VÀ ĐIỀU HƯỚNG */}
        <Box sx={{ 
          display: "flex", 
          alignItems: "flex-end", 
          justifyContent: "space-between", 
          mb: 6,
          px: 1 
        }}>
          <Stack spacing={1}>
            <Typography sx={{ color: "#C2A56D", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>
              Dành riêng cho bạn
            </Typography>
            <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, color: "#1C1B19", fontSize: { xs: "1.6rem", md: "2.2rem" } }}>
              Tuyển chọn tinh túy
            </Typography>
            <Box sx={{ width: 40, height: 2, bgcolor: "#C2A56D", mt: 1 }} />
          </Stack>

          {/* Nút điều hướng giống hệt City Section */}
          <Stack direction="row" spacing={1.5}>
            <NavButton icon={<ChevronLeftIcon />} onClick={() => scroll("left")} />
            <NavButton icon={<ChevronRightIcon />} onClick={() => scroll("right")} />
          </Stack>
        </Box>

        {/* SCROLLABLE AREA */}
        <Box
          ref={scrollRef}
          sx={{
            display: "flex",
            gap: `${GAP}px`,
            overflowX: "auto",
            scrollbarWidth: "none",
            "&::-webkit-scrollbar": { display: "none" },
            px: 1,
            pb: 4, // Tránh bóng đổ bị cắt
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
          }}
        >
          {loading ? (
            // Skeleton khi đang load
            [1, 2, 3, 4].map((i) => (
              <Box key={i} sx={{ minWidth: CARD_WIDTH }}>
                <Skeleton variant="rectangular" height={350} sx={{ borderRadius: "16px" }} />
              </Box>
            ))
          ) : (
            hotels.map((h, index) => (
              <MotionBox
                key={h._id}
                sx={{
                  flex: "0 0 auto",
                  width: CARD_WIDTH,
                  scrollSnapAlign: "start",
                }}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
              >
                <HotelCard hotel={h} />
              </MotionBox>
            ))
          )}
        </Box>
      </Container>
    </Box>
  );
}

// Re-use NavButton style
function NavButton({ icon, onClick }) {
  return (
    <MotionButton 
      onClick={onClick} 
      whileHover={{ scale: 1.1, backgroundColor: "#1C1B19", color: "#C2A56D" }}
      whileTap={{ scale: 0.9 }}
      sx={{ 
        minWidth: 45, width: 45, height: 45, borderRadius: "50%", 
        border: "1px solid #EAE8E4", color: "#1C1B19", p: 0,
        transition: "all 0.3s ease"
      }}
    >
      {icon}
    </MotionButton>
  );
}