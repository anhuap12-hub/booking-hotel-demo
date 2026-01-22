import { Container, Typography, Paper, Box, Button, Skeleton, Stack } from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getAllHotels } from "../../api/hotel.api";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarsIcon from '@mui/icons-material/Stars';

const MotionPaper = motion(Paper);

export default function DealsSection() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getAllHotels()
      .then(res => setHotels(res.data?.data || []))
      .catch(err => console.error("Deals Error:", err))
      .finally(() => setLoading(false));
  }, []);

  const maxDiscount = useMemo(() => {
    if (!hotels.length) return 0;
    return hotels.reduce((max, hotel) => {
      const discountedRooms = hotel.rooms?.filter(r => typeof r.discount === "number" && r.discount > 0) || [];
      if (!discountedRooms.length) return max;
      return Math.max(max, ...discountedRooms.map(r => r.discount));
    }, 0);
  }, [hotels]);

  // Nếu không có deal nào, ẩn toàn bộ section này
  if (!loading && maxDiscount === 0) return null;

  return (
    <Container maxWidth="lg" sx={{ mb: 15, mt: 5 }}>
      {/* HEADER SECTION */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 5 }}>
        <StarsIcon sx={{ color: "#C2A56D", fontSize: 32 }} />
        <Box>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: 26, md: 34 },
              fontWeight: 800,
              color: "#1C1B19",
              lineHeight: 1,
            }}
          >
            Đặc quyền thành viên
          </Typography>
          <Box sx={{ width: 60, height: 3, bgcolor: "#C2A56D", mt: 1, borderRadius: 1 }} />
        </Box>
      </Stack>

      <MotionPaper
        initial={{ y: 60, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        sx={{
          borderRadius: "32px", // Bo góc cực đại tạo sự mềm mại sang trọng
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "#1C1B19", // Màu Ebony chủ đạo
          color: "#F1F0EE",
          boxShadow: "0 40px 80px -20px rgba(0,0,0,0.4)",
          position: "relative",
          border: "1px solid rgba(194, 165, 109, 0.15)"
        }}
      >
        {/* LỚP DECOR PHÁT SÁNG NHẸ */}
        <Box sx={{
          position: "absolute", top: -100, left: -100, width: 300, height: 300,
          borderRadius: "50%", background: "radial-gradient(circle, rgba(194,165,109,0.08) 0%, rgba(28,27,25,0) 70%)",
          zIndex: 1
        }} />

        {/* LEFT: TEXT CONTENT */}
        <Box
          sx={{
            p: { xs: 5, md: 10 },
            flex: 1.2,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 2
          }}
        >
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: 36, md: 52 },
              fontWeight: 900,
              lineHeight: 1.1,
              mb: 3,
              letterSpacing: "-0.02em"
            }}
          >
            Nghệ thuật <br /> 
            <Box component="span" sx={{ color: "#C2A56D", fontStyle: "italic" }}>Sống chậm</Box>
          </Typography>

          {loading ? (
            <Box sx={{ mb: 4 }}>
              <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.1)", mb: 1 }} width="80%" height={24} />
              <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.1)" }} width="60%" height={24} />
            </Box>
          ) : (
            <Typography
              sx={{
                fontSize: { xs: 16, md: 18 },
                lineHeight: 1.8,
                color: "rgba(241,240,238,0.7)",
                maxWidth: 500,
                mb: 5
              }}
            >
              Tận hưởng kỳ nghỉ trong mơ với ưu đãi giới hạn lên đến <b style={{ color: "#C2A56D", fontSize: "1.4rem" }}>{maxDiscount}%</b>. 
              Mỗi không gian tại Coffee Stay là một lời mời gọi trở về với sự tĩnh lặng nội tại.
            </Typography>
          )}

          <Button
            onClick={() => navigate("/deals")}
            endIcon={<ArrowForwardIcon />}
            component={motion.button}
            whileHover={{ x: 10 }}
            sx={{
              alignSelf: "flex-start",
              px: 6,
              py: 2,
              borderRadius: "12px",
              textTransform: "none",
              fontWeight: 800,
              fontSize: 17,
              bgcolor: "#C2A56D",
              color: "#1C1B19",
              boxShadow: "0 20px 40px rgba(194,165,109,0.2)",
              transition: "0.4s",
              "&:hover": {
                bgcolor: "#D4BC8E",
                boxShadow: "0 25px 50px rgba(194,165,109,0.3)",
              },
            }}
          >
            Khám phá ưu đãi
          </Button>
        </Box>

        {/* RIGHT: IMAGE SECTION */}
        <Box
          sx={{
            flex: 0.9,
            position: "relative",
            minHeight: { xs: 350, md: "auto" },
            overflow: "hidden"
          }}
        >
          <Box
            component="img"
            src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="luxury-stay"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
              filter: "brightness(0.8)",
              transition: "transform 3s ease",
              "&:hover": { transform: "scale(1.15)" }
            }}
          />
          {/* Overlay hòa trộn ảnh vào nền tối bên trái và dưới */}
          <Box sx={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            background: {
              xs: "linear-gradient(to top, #1C1B19 0%, transparent 50%)",
              md: "linear-gradient(to right, #1C1B19 0%, transparent 40%)"
            }
          }} />
        </Box>
      </MotionPaper>
    </Container>
  );
}