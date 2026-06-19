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

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"]
  });
  const yImage = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

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
    // GIỮ NGUYÊN HOÀN HẢO KHOẢNG CÁCH LỀ NGOÀI CỦA BẠN
    <Container maxWidth="lg" sx={{ mb: -12, mt: 1, position: "relative" }} ref={containerRef}>
      
      {/* HEADER SECTION */}
      <Stack direction="row" alignItems="center" spacing={1.5} sx={{ mb: 2.5 }}>
        <StarsIcon sx={{ color: "#006CE4", fontSize: 22 }} /> {/* Đổi icon sang xanh lam chuẩn Booking */}
        <Box>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.25rem", md: "1.35rem" },
              fontWeight: 700,
              color: "#1A1A1A",
              lineHeight: 1.2,
            }}
          >
            Ưu đãi
          </Typography>
        </Box>
      </Stack>

      {/* MAIN BANNER - Chuyển hoàn toàn sang tông nền sáng dịu mắt */}
      <MotionPaper
        initial={{ y: 30, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        elevation={0} // Bỏ bóng đổ đen nặng nề
        sx={{
          borderRadius: "12px",
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "#EBF3FF", // ĐÃ ĐỔI: Màu xanh nhạt dịu mát cao cấp, cực hợp nền trắng
          color: "#1A1A1A",   // ĐÃ ĐỔI: Chữ chuyển sang màu tối để dễ đọc
          position: "relative",
          border: "1px solid #D6E6FE", // Khung viền mảnh tinh tế
        }}
      >
        {/* LEFT: TEXT CONTENT */}
        <Box
          sx={{
            p: { xs: 4, md: 5 },
            flex: 1.3,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            position: "relative",
            zIndex: 2
          }}
        >
          {/* Tiêu đề trong Banner */}
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.5rem", md: "1.8rem" },
              fontWeight: 800,
              lineHeight: 1.2,
              mb: 1.5,
              color: "#1A1A1A"
            }}
          >
            Ưu đãi mùa du lịch{" "}
        
          </Typography>

          {loading ? (
            <Box sx={{ mb: 3 }}>
              <Skeleton sx={{ bgcolor: "rgba(0,0,0,0.06)", mb: 1 }} width="50%" height={16} />
              <Skeleton sx={{ bgcolor: "rgba(0,0,0,0.06)" }} width="65%" height={16} />
            </Box>
          ) : (
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: { xs: "0.875rem", md: "0.925rem" },
                lineHeight: 1.6,
                color: "#4A4A4A", // Màu xám đậm sắc nét, đọc lâu không mỏi mắt
                maxWidth: 440,
                mb: 4,
                fontWeight: 400
              }}
            >
              Tận hưởng kỳ nghỉ với ưu đãi giới hạn lên đến{" "}
              <Box 
                component="span" 
                sx={{ 
                  color: "#D4111E", // Đổi màu đỏ/cam nổi bật đặc trưng của nhãn giảm giá Booking
                  fontSize: "1rem", 
                  fontWeight: 700,
                  mx: 0.2 
                }}
              >
                {maxDiscount}%
              </Box>
              . Vi vu du lịch với các ưu đãi. An tâm nghỉ dưỡng.    
            </Typography>
          )}

          {/* Button - Chuyển sang nút xanh đậm tương phản cao */}
          <Button
            onClick={() => navigate("/deals")}
            endIcon={<ArrowForwardIcon />}
            component={motion.button}
            whileHover={{ gap: "12px" }}
            sx={{
              alignSelf: "flex-start",
              px: 4,
              py: 1.2,
              borderRadius: "6px",
              textTransform: "none",
              fontWeight: 600,
              fontSize: "0.875rem", 
              bgcolor: "#006CE4", // Xanh dương thương hiệu Booking nổi bật trên nền nhạt
              color: "#FFFFFF",
              transition: "0.4s cubic-bezier(0.16, 1, 0.3, 1)",
              "& .MuiButton-endIcon": { transition: "0.3s", fontSize: "16px" }, 
              "&:hover": {
                bgcolor: "#0053B3",
                color: "#FFFFFF",
                transform: "translateY(-2px)"
              },
            }}
          >
            Khám phá ưu đãi
          </Button>
        </Box>

        {/* RIGHT: IMAGE SECTION WITH PARALLAX */}
        <Box
          sx={{
            flex: 0.7,
            position: "relative",
            minHeight: { xs: 200, md: "auto" },
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
              height: "116%", 
              objectFit: "cover",
              filter: "brightness(1) contrast(1.1)", // Tăng độ sáng ảnh để tệp với nền mới
            }}
          />
          {/* Lớp phủ mờ Gradient hòa vào màu nền xanh nhạt bên trái */}
          <Box sx={{
            position: "absolute",
            top: 0, left: 0, width: "100%", height: "100%",
            background: {
              xs: "linear-gradient(to top, #EBF3FF 5%, transparent 10%)",
              md: "linear-gradient(to right, #EBF3FF 0%, transparent 10%)"
            }
          }} />
        </Box>
      </MotionPaper>
    </Container>
  );
}