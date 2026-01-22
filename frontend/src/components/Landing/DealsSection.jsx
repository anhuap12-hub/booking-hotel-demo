import { Container, Typography, Paper, Box, Button, Skeleton, Stack } from "@mui/material";
import { motion, useScroll, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useRef, useState } from "react";
import { getAllHotels } from "../../api/hotel.api";
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import StarsIcon from '@mui/icons-material/Stars';

const MotionPaper = motion(Paper);
const MotionBox = motion(Box);

export default function DealsSection() {
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hiệu ứng Parallax nhẹ cho ảnh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const yImage = useTransform(scrollYProgress, [0, 1], ["-10%", "10%"]);

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

  if (!loading && maxDiscount === 0) return null;

  return (
    <Container maxWidth="lg" sx={{ mb: { xs: 10, md: 15 }, mt: 5 }} ref={containerRef}>
      {/* HEADER SECTION */}
      <Stack direction="row" alignItems="center" spacing={2} sx={{ mb: 6 }}>
        <StarsIcon sx={{ color: "#C2A56D", fontSize: 32 }} />
        <Box>
          <Typography
            sx={{
              textTransform: "uppercase",
              fontSize: "0.7rem",
              fontWeight: 800,
              letterSpacing: "0.4em",
              color: "#C2A56D",
              mb: 0.5
            }}
          >
            Exclusive Benefits
          </Typography>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: 28, md: 36 },
              fontWeight: 900,
              color: "#1C1B19",
              lineHeight: 1,
            }}
          >
            Đặc quyền thành viên
          </Typography>
        </Box>
      </Stack>

      <MotionPaper
        initial={{ y: 50, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        sx={{
          borderRadius: "40px",
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "#1C1B19", 
          color: "#F1F0EE",
          boxShadow: "0 60px 100px -30px rgba(0,0,0,0.5)",
          position: "relative",
          border: "1px solid rgba(194, 165, 109, 0.2)",
        }}
      >
        {/* LEFT: TEXT CONTENT */}
        <Box
          sx={{
            p: { xs: 6, md: 10 },
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
              fontSize: { xs: 40, md: 56 },
              fontWeight: 900,
              lineHeight: 1.05,
              mb: 3,
              letterSpacing: "-0.03em"
            }}
          >
            Nghệ thuật <br /> 
            <Box component="span" sx={{ color: "#C2A56D", fontStyle: "italic", fontWeight: 400 }}>Sống chậm</Box>
          </Typography>

          {loading ? (
            <Box sx={{ mb: 4 }}>
              <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.05)", mb: 1 }} width="85%" height={24} />
              <Skeleton sx={{ bgcolor: "rgba(255,255,255,0.05)" }} width="65%" height={24} />
            </Box>
          ) : (
            <Typography
              sx={{
                fontSize: { xs: 17, md: 19 },
                lineHeight: 1.8,
                color: "rgba(241,240,238,0.6)",
                maxWidth: 480,
                mb: 6,
                fontWeight: 300
              }}
            >
              Tận hưởng kỳ nghỉ thượng lưu với ưu đãi giới hạn lên đến{" "}
              <Box 
                component="span" 
                sx={{ 
                  color: "#C2A56D", 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: "1.8rem", 
                  fontWeight: 900,
                  mx: 0.5 
                }}
              >
                {maxDiscount}%
              </Box>. 
              Nơi mỗi khoảnh khắc đều được trân trọng như một tác phẩm nghệ thuật.
            </Typography>
          )}

          <Button
            onClick={() => navigate("/deals")}
            endIcon={<ArrowForwardIcon />}
            component={motion.button}
            whileHover={{ gap: "20px" }}
            sx={{
              alignSelf: "flex-start",
              px: 6,
              py: 2.2,
              borderRadius: "100px",
              textTransform: "uppercase",
              letterSpacing: "0.2em",
              fontWeight: 800,
              fontSize: 13,
              bgcolor: "#C2A56D",
              color: "#1C1B19",
              transition: "0.5s cubic-bezier(0.16, 1, 0.3, 1)",
              "& .MuiButton-endIcon": { transition: "0.3s" },
              "&:hover": {
                bgcolor: "#fff",
                color: "#1C1B19",
                transform: "translateY(-5px)"
              },
            }}
          >
            Khám phá ưu đãi
          </Button>
        </Box>

        {/* RIGHT: IMAGE SECTION WITH PARALLAX */}
        <Box
          sx={{
            flex: 0.8,
            position: "relative",
            minHeight: { xs: 400, md: "auto" },
            overflow: "hidden"
          }}
        >
          <MotionBox
            component="img"
            style={{ y: yImage }}
            src="https://images.pexels.com/photos/338504/pexels-photo-338504.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="luxury-resort"
            sx={{
              width: "100%",
              height: "120%", // Cao hơn container để có không gian chạy parallax
              objectFit: "cover",
              filter: "brightness(0.7) contrast(1.1)",
            }}
          />
          {/* Subtle Overlay */}
          <Box sx={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            background: {
              xs: "linear-gradient(to top, #1C1B19 5%, transparent 60%)",
              md: "linear-gradient(to right, #1C1B19 0%, transparent 50%)"
            }
          }} />
        </Box>
      </MotionPaper>
    </Container>
  );
}