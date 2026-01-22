import { useState, useEffect, useMemo } from "react";
import { Box, Typography, Button, Skeleton, Grid } from "@mui/material";
import AddIcon from '@mui/icons-material/Add';
import HotelCard from "../Hotel/HotelCard";
import { getAllHotels } from "../../api/hotel.api";
import { motion, AnimatePresence } from "framer-motion";

const STEP = 3;

// Định nghĩa MotionBox để dùng xuyên suốt
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
    setTimeout(() => {
      setDisplayCount((prev) => prev + STEP);
      setBtnLoading(false);
    }, 600);
  };

  return (
    <Box sx={{ mt: 10, mb: 12, width: "100%" }}>
      {/* SECTION HEADER với hiệu ứng trượt nhẹ */}
      <MotionBox 
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        sx={{ mb: 8, textAlign: "center" }}
      >
        <Typography 
          variant="h4" 
          sx={{ 
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            color: "#1C1B19",
            mb: 2,
            letterSpacing: "-0.02em"
          }}
        >
          Gợi ý dành riêng cho bạn
        </Typography>
        <Box 
          sx={{ 
            width: 40, 
            height: 2, 
            bgcolor: "#C2A56D", 
            mx: "auto"
          }} 
        />
      </MotionBox>

      {loading && allHotelsData.length === 0 ? (
        <Grid container spacing={4}>
          {[1, 2, 3].map((item) => (
            <Grid item xs={12} sm={6} md={4} key={item}>
              <Skeleton variant="rectangular" height={300} sx={{ borderRadius: "20px", mb: 2 }} />
              <Skeleton variant="text" width="60%" />
              <Skeleton variant="text" width="40%" />
            </Grid>
          ))}
        </Grid>
      ) : (
        <Box>
          <Grid container spacing={5}>
            <AnimatePresence mode="popLayout">
              {visibleHotels.map((h, index) => (
                <Grid item xs={12} sm={6} md={4} key={h._id}>
                  {/* Mỗi HotelCard sẽ có hiệu ứng xuất hiện tuần tự (Stagger) */}
                  <MotionBox
                    layout // Tự động tính toán lại vị trí khi danh sách thay đổi
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ 
                      duration: 0.5, 
                      delay: (index % STEP) * 0.1, // Tạo hiệu ứng gợn sóng khi hiện thêm
                      ease: [0.43, 0.13, 0.23, 0.96] 
                    }}
                  >
                    <HotelCard hotel={h} />
                  </MotionBox>
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>

          {/* NÚT XEM THÊM VỚI MOTION */}
          {displayCount < allHotelsData.length && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 10 }}>
              <MotionBox
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant="text"
                  disabled={btnLoading}
                  onClick={handleShowMore}
                  startIcon={!btnLoading && <AddIcon />}
                  sx={{
                    color: "#1C1B19",
                    px: 4,
                    py: 1,
                    fontSize: "0.85rem",
                    fontWeight: 700,
                    letterSpacing: "0.2em",
                    textTransform: "uppercase",
                    borderBottom: "1px solid #C2A56D",
                    borderRadius: 0,
                    "&:hover": {
                      bgcolor: "transparent",
                      borderBottomColor: "#1C1B19",
                    }
                  }}
                >
                  {btnLoading ? "Đang sắp xếp..." : "Xem thêm trải nghiệm"}
                </Button>
              </MotionBox>
            </Box>
          )}
        </Box>
      )}

      {/* EMPTY STATE */}
      {!loading && allHotelsData.length === 0 && (
        <MotionBox 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          sx={{ 
            textAlign: "center", 
            py: 15, 
            border: "1px solid #F1F0EE", 
            borderRadius: "30px",
            bgcolor: "#fff" 
          }}
        >
          <Typography sx={{ color: "#72716E", fontStyle: "italic" }}>
            Hiện chưa có lựa chọn nào phù hợp. Vui lòng thay đổi bộ lọc.
          </Typography>
        </MotionBox>
      )}
    </Box>
  );
}