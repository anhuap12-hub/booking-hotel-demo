import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Button, Skeleton, Grid, Container } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import HotelCard from "../Hotel/HotelCard";
import { getAllHotels } from "../../api/hotel.api";
import { motion, AnimatePresence } from "framer-motion";

const STEP = 3;
const MotionBox = motion(Box);

export default function HotelSuggestion({ filters }) {
  const [allHotelsData, setAllHotelsData] = useState([]);
  const [displayCount, setDisplayCount] = useState(3);
  const [loading, setLoading] = useState(false);
  const [btnLoading, setBtnLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Giả sử limit 30 để có dữ liệu cho nút "Xem thêm"
        const res = await getAllHotels({ ...filters, limit: 30 });
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
    // Giả lập delay để tạo cảm giác hệ thống đang "tuyển chọn"
    setTimeout(() => {
      setDisplayCount((prev) => prev + STEP);
      setBtnLoading(false);
    }, 600);
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 }, mb: 12 }}>
      {/* SECTION HEADER */}
      <MotionBox 
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 8, textAlign: "center" }}
      >
        <Typography 
          sx={{ 
            color: "#C2A56D", 
            fontSize: "0.75rem", 
            fontWeight: 800, 
            letterSpacing: "0.3em", 
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
            color: "#1C1B19",
            fontSize: { xs: "2rem", md: "2.8rem" },
            mb: 3
          }}
        >
          Tuyển chọn tinh túy
        </Typography>
        <Box sx={{ width: 60, height: 2, bgcolor: "#1C1B19", mx: "auto", opacity: 0.1 }} />
      </MotionBox>

      {/* LOADING STATE */}
      {loading && allHotelsData.length === 0 ? (
        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton 
                variant="rectangular" 
                height={350} 
                sx={{ borderRadius: "24px", bgcolor: "#F8F7F5", mb: 2 }} 
              />
              <Skeleton variant="text" width="80%" sx={{ height: 30 }} />
              <Skeleton variant="text" width="40%" />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          <Grid container spacing={4}>
            <AnimatePresence mode="popLayout">
              {visibleHotels.map((h, index) => (
                <Grid item xs={12} sm={6} md={4} key={h._id}>
                  <MotionBox
                    layout
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95 }}
                    transition={{ 
                      duration: 0.6, 
                      delay: (index % STEP) * 0.15,
                      ease: [0.215, 0.61, 0.355, 1] 
                    }}
                  >
                    <HotelCard hotel={h} />
                  </MotionBox>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          {/* VIEW MORE BUTTON */}
          {displayCount < allHotelsData.length && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <Button
                disabled={btnLoading}
                onClick={handleShowMore}
                sx={{
                  color: "#1C1B19",
                  px: 6,
                  py: 1.5,
                  fontSize: "0.75rem",
                  fontWeight: 800,
                  letterSpacing: "0.2em",
                  textTransform: "uppercase",
                  border: "1px solid #1C1B19",
                  borderRadius: "100px",
                  transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    bgcolor: "#1C1B19",
                    color: "#C2A56D",
                    transform: "translateY(-3px)",
                    boxShadow: "0 10px 20px rgba(0,0,0,0.1)"
                  },
                  "&.Mui-disabled": {
                    border: "1px solid #EEE",
                    color: "#CCC"
                  }
                }}
              >
                {btnLoading ? "Đang sắp xếp..." : "Xem thêm trải nghiệm"}
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* EMPTY STATE - REDESIGNED */}
      {!loading && allHotelsData.length === 0 && (
        <MotionBox 
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          sx={{ 
            textAlign: "center", 
            py: 12, 
            border: "1px dashed #D4D3D0", 
            borderRadius: "40px",
            bgcolor: "#FAF9F7" 
          }}
        >
          <Typography 
            variant="h6" 
            sx={{ 
              fontFamily: "'Playfair Display', serif", 
              color: "#1C1B19", 
              mb: 1,
              fontWeight: 700 
            }}
          >
            Chưa tìm thấy lựa chọn phù hợp
          </Typography>
          <Typography variant="body2" sx={{ color: "#72716E", maxWidth: 400, mx: "auto" }}>
            Hãy thử điều chỉnh lại bộ lọc hoặc tìm kiếm theo một phong cách nghỉ dưỡng khác.
          </Typography>
        </MotionBox>
      )}
    </Container>
  );
}