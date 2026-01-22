import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Button, Skeleton, Grid, Container } from "@mui/material";
import HotelCard from "../Hotel/HotelCard";
import { getAllHotels } from "../../api/hotel.api";
import { motion, AnimatePresence } from "framer-motion";

const STEP = 3; // Mỗi lần ấn hiện thêm 3 cái
const MAX_HOME_DISPLAY = 6; // Giới hạn trang Home chỉ nên hiện tối đa 6 cái cho đẹp
const MotionBox = motion(Box);

export default function HotelSuggestion({ filters }) {
  const [allHotelsData, setAllHotelsData] = useState([]);
  const [displayCount, setDisplayCount] = useState(3); // Mặc định hiện 3 cái đầu
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy dữ liệu với limit vừa đủ cho trang Home
        const res = await getAllHotels({ ...filters, limit: 12 });
        setAllHotelsData(res.data?.data || []);
        setDisplayCount(3); 
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  const visibleHotels = useMemo(() => {
    return allHotelsData.slice(0, displayCount);
  }, [allHotelsData, displayCount]);

  const handleShowMore = () => {
    setBtnLoading(true);
    // Giả lập delay 600ms để tạo hiệu ứng "Luxury Loading"
    setTimeout(() => {
      setDisplayCount((prev) => prev + STEP);
      setBtnLoading(false);
    }, 600);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 4, md: 6 }, mb: 8 }}>
      {/* SECTION HEADER */}
      <MotionBox 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 6, textAlign: "center" }}
      >
        <Typography 
          sx={{ 
            color: "#C2A56D", 
            fontSize: "0.7rem", 
            fontWeight: 800, 
            letterSpacing: "0.4em", 
            textTransform: "uppercase",
            mb: 1
          }}
        >
          Dành riêng cho bạn
        </Typography>
        <Typography 
          variant="h3" 
          sx={{ 
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            color: "#FFFFFF", // Đổi sang trắng vì Component này thường nằm trong Box đen ở Home
            fontSize: { xs: "1.8rem", md: "2.5rem" },
            mb: 2
          }}
        >
          Tuyển chọn tinh túy
        </Typography>
        <Box sx={{ width: 40, height: 2, bgcolor: "#C2A56D", mx: "auto" }} />
      </MotionBox>

      {/* LOADING STATE */}
      {loading && allHotelsData.length === 0 ? (
        <Grid container spacing={3}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton 
                variant="rectangular" 
                height={300} 
                sx={{ borderRadius: "20px", bgcolor: "rgba(255,255,255,0.05)", mb: 2 }} 
              />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          <Grid container spacing={3}>
            <AnimatePresence mode="popLayout">
              {visibleHotels.map((h, index) => (
                <Grid item xs={12} sm={6} md={4} key={h._id}>
                  <MotionBox
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: (index % STEP) * 0.1 }}
                  >
                    <HotelCard hotel={h} />
                  </MotionBox>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          {/* VIEW MORE BUTTON - Chỉ hiện nếu còn dữ liệu để xem */}
          {displayCount < allHotelsData.length && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 6 }}>
              <Button
                disabled={btnLoading}
                onClick={handleShowMore}
                sx={{
                  color: "#C2A56D", // Màu vàng đồng cho sang
                  px: 5,
                  py: 1.2,
                  fontSize: "0.7rem",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  border: "1px solid #C2A56D",
                  borderRadius: "100px",
                  transition: "all 0.4s",
                  "&:hover": {
                    bgcolor: "#C2A56D",
                    color: "#1C1B19",
                    transform: "translateY(-2px)"
                  },
                  "&.Mui-disabled": {
                    border: "1px solid #444",
                    color: "#666"
                  }
                }}
              >
                {btnLoading ? "Đang chuẩn bị..." : "Khám phá thêm"}
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* EMPTY STATE */}
      {!loading && allHotelsData.length === 0 && (
        <Typography sx={{ color: "rgba(255,255,255,0.5)", textAlign: "center", py: 5 }}>
          Đang cập nhật những không gian mới...
        </Typography>
      )}
    </Container>
  );
}