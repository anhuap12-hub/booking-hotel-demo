import { useEffect, useState, useRef } from "react";
import {
  Box, Typography, Button, CircularProgress, Paper, Avatar, Stack, Chip, Container
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
  const [aiIntro, setAiIntro] = useState("");
  const [loading, setLoading] = useState(true);
  const containerRef = useRef(null);

  // Hiệu ứng Parallax cho ảnh giống Deals Section
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const yImage = useTransform(scrollYProgress, [0, 1], ["-15%", "15%"]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRecommendations();
        setHotels(res.data.data || []);
        setAiIntro(res.data.intro || "");
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
    <Container maxWidth="lg" sx={{ py: 10 }} ref={containerRef}>
      {/* HEADER GIỐNG DEALS SECTION */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
        <SmartToyIcon sx={{ color: "#C2A56D", fontSize: 32 }} />
        <Box>
          <Typography sx={{ textTransform: "uppercase", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.4em", color: "#C2A56D", mb: 0.5 }}>
            AI Personalized
          </Typography>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 28, md: 36 }, fontWeight: 900, color: "#1C1B19" }}>
            Đề xuất dành riêng cho bạn
          </Typography>
        </Box>
      </Stack>

      <Stack spacing={6}>
        {hotels.map((hotel, index) => {
          const bestRoom = getBestPriceInfo(hotel.rooms);
          const discount = Number(bestRoom?.discount) || 0;
          const finalPrice = (Number(bestRoom?.price) || 0) * (1 - discount / 100);

          return (
            <MotionPaper
              key={hotel._id}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.8, delay: index * 0.1 }}
              sx={{
                borderRadius: "40px",
                overflow: "hidden",
                display: "flex",
                flexDirection: { xs: "column", md: index % 2 === 0 ? "row" : "row-reverse" }, // Đảo chiều xen kẽ cho đẹp
                bgcolor: "#1C1B19",
                color: "#F1F0EE",
                boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4)",
                minHeight: { md: 450 }, // To hơn Deals Section
                border: "1px solid rgba(194, 165, 109, 0.1)",
              }}
            >
              {/* LEFT: CONTENT (Chiếm 55%) */}
              <Box sx={{ p: { xs: 4, md: 8 }, flex: 1.2, display: "flex", flexDirection: "column", justifyContent: "center" }}>
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mb: 2, color: "#C2A56D" }}>
                  <LocationOnIcon sx={{ fontSize: 18 }} />
                  <Typography variant="caption" fontWeight={700} sx={{ letterSpacing: "0.2em", textTransform: "uppercase" }}>
                    {hotel.city}
                  </Typography>
                  <Chip 
                    icon={<StarsIcon sx={{ fontSize: "14px !important", color: "#1C1B19 !important" }} />}
                    label={hotel.rating || "5.0"} 
                    size="small"
                    sx={{ bgcolor: "#C2A56D", color: "#1C1B19", fontWeight: 800, ml: 2 }}
                  />
                </Stack>

                <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: 32, md: 48 }, fontWeight: 900, mb: 2, lineHeight: 1.2 }}>
                  {hotel.name}
                </Typography>

                <Typography sx={{ fontSize: "1rem", color: "rgba(241,240,238,0.6)", mb: 4, fontWeight: 300, fontStyle: "italic" }}>
                  "{aiIntro || "Một không gian hoàn hảo được AI lựa chọn dựa trên phong cách của bạn."}"
                </Typography>

                <Stack direction="row" alignItems="center" spacing={4} sx={{ mb: 5 }}>
                  <Box>
                    <Typography variant="caption" sx={{ color: "#C2A56D", letterSpacing: "0.1em", display: "block", mb: 0.5 }}>GIÁ ƯU ĐÃI TỪ</Typography>
                    <Typography variant="h4" fontWeight={900}>
                      {finalPrice > 0 ? `${Math.round(finalPrice).toLocaleString("vi-VN")} ₫` : "Liên hệ"}
                    </Typography>
                  </Box>
                  {discount > 0 && (
                    <Box sx={{ px: 2, py: 1, bgcolor: "rgba(231, 76, 60, 0.2)", color: "#E74C3C", borderRadius: "12px", border: "1px solid #E74C3C" }}>
                      <Typography fontWeight={900}>-{discount}%</Typography>
                    </Box>
                  )}
                </Stack>

                <Button
                  onClick={() => navigate(`/hotels/${hotel._id}`)}
                  endIcon={<ArrowForwardIcon />}
                  sx={{
                    alignSelf: "flex-start",
                    px: 5, py: 2,
                    borderRadius: "100px",
                    bgcolor: "#C2A56D",
                    color: "#1C1B19",
                    fontWeight: 800,
                    "&:hover": { bgcolor: "#fff", transform: "translateY(-3px)" },
                    transition: "0.4s"
                  }}
                >
                  Đặt phòng ngay
                </Button>
              </Box>

              {/* RIGHT: IMAGE WITH PARALLAX (Chiếm 45%) */}
              <Box sx={{ flex: 0.8, position: "relative", overflow: "hidden", minHeight: { xs: 300, md: "auto" } }}>
                <MotionBox
                  component="img"
                  style={{ y: yImage }}
                  src={hotel.photos?.[0]?.url || "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg"}
                  sx={{
                    width: "100%",
                    height: "130%",
                    objectFit: "cover",
                    filter: "brightness(0.8)",
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