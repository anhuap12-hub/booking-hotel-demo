import { useEffect, useState, useRef } from "react";
import {
  Box, Typography, Button, CircularProgress, Paper, Stack, Chip, Container
} from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarsIcon from '@mui/icons-material/Stars';
import { getRecommendations } from "../../api/recommend.api.js";
import { useNavigate } from "react-router-dom";

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

export default function Recommendation() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const yImage = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRecommendations();
        setHotels(res.data.data || []);
      } catch (err) {
        console.error("Error fetching recommendations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const getBestPriceInfo = (rooms) => {
    if (!Array.isArray(rooms) || rooms.length === 0) return null;
    return rooms.reduce((best, current) => {
      const cFinal = (Number(current.price) || 0) * (1 - (Number(current.discount) || 0) / 100);
      const bFinal = (Number(best.price) || 0) * (1 - (Number(best.discount) || 0) / 100);
      return cFinal < bFinal ? current : best;
    }, rooms[0]);
  };

  if (loading) return (
    <Box textAlign="center" py={10}><CircularProgress sx={{ color: "#C2A56D" }} /></Box>
  );

  if (hotels.length === 0) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }} ref={containerRef}>
      {/* HEADER: ĐÃ CHỈNH ICON NGANG HÀNG */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 4 }}>
        <SmartToyIcon sx={{ color: "#C2A56D", fontSize: 28 }} />
        <Box>
          <Typography sx={{ textTransform: "uppercase", fontSize: "0.65rem", fontWeight: 800, letterSpacing: "0.3em", color: "#C2A56D" }}>
            AI Personalized
          </Typography>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 24, md: 30 }, fontWeight: 900, color: "#1C1B19", mt: -0.5 }}>
            Đề xuất dành riêng cho bạn
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={4}>
        {hotels.map((hotel, index) => {
          const bestRoom = getBestPriceInfo(hotel.rooms);
          const discount = Number(bestRoom?.discount) || 0;
          const finalPrice = (Number(bestRoom?.price) || 0) * (1 - discount / 100);

          return (
            <MotionPaper
              key={hotel._id}
              initial={{ y: 30, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              sx={{
                borderRadius: "24px",
                overflow: "hidden",
                display: "flex",
                flexDirection: { xs: "column", md: index % 2 === 0 ? "row" : "row-reverse" },
                bgcolor: "#1C1B19",
                color: "#F1F0EE",
                boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                minHeight: { md: 300 }, // THU NHỎ CHIỀU CAO CARD
                border: "1px solid rgba(194, 165, 109, 0.1)",
              }}
            >
              {/* CONTENT SECTION */}
              <Box sx={{ p: { xs: 3, md: 5 }, flex: 1.2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 1.5 }}>
                  <LocationOnIcon sx={{ fontSize: 16, color: "#C2A56D" }} />
                  <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: "0.1em", textTransform: "uppercase", color: "rgba(241,240,238,0.7)" }}>
                    {hotel.city}
                  </Typography>
                  <Chip 
                    icon={<StarsIcon sx={{ fontSize: "12px !important", color: "#1C1B19 !important" }} />}
                    label={hotel.rating || "5.0"} 
                    size="small"
                    sx={{ bgcolor: "#C2A56D", color: "#1C1B19", fontWeight: 800, height: 20, fontSize: 10 }}
                  />
                </Stack>

                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 24, md: 32 }, fontWeight: 900, mb: 1, lineHeight: 1.2 }}>
                  {hotel.name}
                </Typography>

                {/* MÔ TẢ THỰC TẾ CỦA KHÁCH SẠN (Giới hạn 3 dòng) */}
                <Typography sx={{ 
                  fontSize: "0.875rem", 
                  color: "rgba(241,240,238,0.5)", 
                  mb: 3, 
                  fontWeight: 300,
                  display: "-webkit-box",
                  WebkitLineClamp: 3,
                  WebkitBoxOrient: "vertical",
                  overflow: "hidden",
                  lineHeight: 1.6
                }}>
                  {hotel.description || "Khám phá không gian nghỉ dưỡng sang trọng với dịch vụ đẳng cấp và tầm nhìn tuyệt đẹp tại điểm đến lý tưởng này."}
                </Typography>

                <Stack direction="row" alignItems="center" spacing={3} sx={{ mb: 3 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#C2A56D", fontSize: "0.65rem", fontWeight: 700, display: "block" }}>GIÁ TỪ</Typography>
                    <Typography variant="h5" fontWeight={900}>
                      {finalPrice > 0 ? `${Math.round(finalPrice).toLocaleString("vi-VN")} ₫` : "Liên hệ"}
                    </Typography>
                  </Box>
                  {discount > 0 && (
                    <Chip label={`-${discount}%`} size="small" sx={{ bgcolor: "#E74C3C", color: "#fff", fontWeight: 900, borderRadius: "6px" }} />
                  )}
                </Stack>

                <Button
                  onClick={() => navigate(`/hotels/${hotel._id}`)}
                  endIcon={<ArrowForwardIcon sx={{ fontSize: 18 }} />}
                  sx={{
                    alignSelf: "flex-start",
                    px: 4, py: 1,
                    borderRadius: "100px",
                    bgcolor: "#C2A56D",
                    color: "#1C1B19",
                    fontWeight: 800,
                    fontSize: "0.8rem",
                    "&:hover": { bgcolor: "#fff", transform: "translateX(5px)" },
                    transition: "0.3s"
                  }}
                >
                  Xem chi tiết
                </Button>
              </Box>

              {/* IMAGE SECTION */}
              <Box sx={{ flex: 0.9, position: "relative", overflow: "hidden", minHeight: { xs: 220, md: "auto" } }}>
                <MotionBox
                  component="img"
                  style={{ y: yImage }}
                  src={hotel.photos?.[0]?.url || "https://via.placeholder.com/600x400"}
                  sx={{
                    width: "100%",
                    height: "120%",
                    objectFit: "cover",
                    filter: "brightness(0.7)",
                  }}
                />
                <Box sx={{
                  position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
                  background: {
                    xs: "linear-gradient(to top, #1C1B19 5%, transparent 60%)",
                    md: index % 2 === 0 
                      ? "linear-gradient(to right, #1C1B19 0%, transparent 50%)" 
                      : "linear-gradient(to left, #1C1B19 0%, transparent 50%)"
                  }
                }} />
              </Box>
            </MotionPaper>
          );
        })}
      </Stack>
    </Container>
  );
}