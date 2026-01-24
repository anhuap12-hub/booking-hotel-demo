import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Button, Skeleton, Grid, Container, Stack } from "@mui/material";
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

  const visibleHotels = useMemo(() => allHotelsData.slice(0, displayCount), [allHotelsData, displayCount]);

  const handleShowMore = () => {
    setBtnLoading(true);
    setTimeout(() => {
      setDisplayCount((prev) => prev + STEP);
      setBtnLoading(false);
    }, 600);
  };

  return (
    // Đặt background white và tăng padding để card có không gian "thở"
    <Box sx={{ bgcolor: "#FFFFFF", width: "100%" }}>
      <Container maxWidth="lg" sx={{ py: { xs: 6, md: 10 } }}>
        
        {/* HEADER - Tinh giản tối đa */}
        <Stack spacing={1} alignItems="center" textAlign="center" sx={{ mb: 8 }}>
          <Typography sx={{ color: "#C2A56D", fontSize: "0.7rem", fontWeight: 800, letterSpacing: "0.3em", textTransform: "uppercase" }}>
            Dành riêng cho bạn
          </Typography>
          <Typography variant="h4" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, color: "#1C1B19", fontSize: { xs: "1.6rem", md: "2.2rem" } }}>
            Tuyển chọn tinh túy
          </Typography>
          <Box sx={{ width: 30, height: 1.5, bgcolor: "#C2A56D", mt: 1 }} />
        </Stack>

        {/* LISTING AREA */}
        <Stack spacing={6} alignItems="center">
          {/* Tăng spacing lên 4 hoặc 5 để các Card cách xa nhau, tạo cảm giác nhỏ gọn hơn */}
          <Grid container spacing={4}>
            {loading && allHotelsData.length === 0 ? (
              [1, 2, 3].map((i) => (
                <Grid item xs={12} sm={6} md={4} key={i}>
                  <Skeleton variant="rectangular" height={250} sx={{ borderRadius: "12px" }} />
                </Grid>
              ))
            ) : (
              <AnimatePresence mode="popLayout">
                {visibleHotels.map((h, index) => (
                  <Grid item xs={12} sm={6} md={4} key={h._id}>
                    <MotionBox
                      layout
                      initial={{ opacity: 0, y: 15 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: (index % STEP) * 0.1 }}
                      sx={{ 
                        // ÉP KÍCH THƯỚC CARD TẠI ĐÂY
                        "& img": { 
                          aspectRatio: "16/10", // Ép ảnh về tỉ lệ chuẩn, không để ảnh dài lê thê
                          objectFit: "cover",
                          borderRadius: "12px 12px 0 0" 
                        },
                        "& .MuiPaper-root": {
                           boxShadow: "0 4px 20px rgba(0,0,0,0.05)", // Shadow nhẹ nhàng, không bị đen đặc
                           borderRadius: "12px",
                           overflow: "hidden"
                        }
                      }}
                    >
                      <HotelCard hotel={h} />
                    </MotionBox>
                  </Grid>
                ))}
              </AnimatePresence>
            )}
          </Grid>

          {/* BUTTON KHÁM PHÁ - Kiểu Minimalist */}
          {displayCount < allHotelsData.length && (
            <Button
              disabled={btnLoading}
              onClick={handleShowMore}
              sx={{
                color: "#1C1B19",
                px: 5,
                py: 1,
                fontSize: "0.75rem",
                fontWeight: 700,
                border: "1px solid #E0E0E0",
                borderRadius: "0px", // Hình vuông tối giản
                "&:hover": {
                  borderColor: "#1C1B19",
                  bgcolor: "transparent"
                }
              }}
            >
              {btnLoading ? "ĐANG TẢI..." : "XEM THÊM"}
            </Button>
          )}
        </Stack>
      </Container>
    </Box>
  );
}