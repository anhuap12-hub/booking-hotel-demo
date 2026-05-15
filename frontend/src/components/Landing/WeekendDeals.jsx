import {
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  Stack,
  Chip,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useMemo } from "react";
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const MotionPaper = motion(Paper);

export default function WeekendDeals({ hotels = [] }) {
  const navigate = useNavigate();

  // Logic lấy deal tốt nhất - Đồng bộ với trang Deals của bạn
  const getBestDeal = (rooms) => {
    if (!Array.isArray(rooms) || rooms.length === 0) return null;

    const discountedRooms = rooms.filter((r) => (Number(r.discount) || 0) > 0);
    
    // Nếu không có phòng giảm giá, mục này sẽ bị ẩn (chuẩn logic Deals)
    if (discountedRooms.length === 0) return null;

    // Tìm phòng có giá sau giảm thấp nhất (Best Offer)
    const bestRoom = discountedRooms.reduce((best, cur) => {
      const curFinal = cur.price * (1 - cur.discount / 100);
      const bestFinal = best.price * (1 - best.discount / 100);
      return curFinal < bestFinal ? cur : best;
    }, discountedRooms[0]);

    return {
      originalPrice: bestRoom.price,
      finalPrice: Math.round(bestRoom.price * (1 - bestRoom.discount / 100)),
      discount: bestRoom.discount,
    };
  };

  // Lọc và chuẩn bị danh sách khách sạn có deal (giống cách bạn làm ở trang Deals)
  const hotelDeals = useMemo(() => {
    return hotels
      .map(h => ({ ...h, deal: getBestDeal(h.rooms) }))
      .filter(h => h.deal !== null) // Chỉ giữ lại khách sạn có giảm giá
      .slice(0, 4); // Lấy 4 cái hấp dẫn nhất cho trang chủ
  }, [hotels]);

  return (
    <Container maxWidth="lg" sx={{ mb: 12 }}>
      {/* HEADER */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 4 }}>
        <Box>
          <Stack direction="row" spacing={1} alignItems="center" mb={1}>
             <LocalFireDepartmentIcon sx={{ color: "#C2A56D" }} />
             <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 2, color: "#C2A56D" }}>
                Hot Deals
             </Typography>
          </Stack>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: 28, md: 36 },
              fontWeight: 800,
              color: "#1C1B19",
            }}
          >
            Ưu đãi cuối tuần
          </Typography>
        </Box>
        <Button 
          onClick={() => navigate('/deals')} // Chuyển hướng sang trang chuyên biệt bạn vừa gửi
          sx={{ color: "#72716E", textTransform: "none", fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
        >
          Xem tất cả ưu đãi
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {hotelDeals.map((h, idx) => (
          <Grid item xs={12} sm={6} md={3} key={h._id}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              sx={{
                borderRadius: "20px",
                overflow: "hidden",
                bgcolor: "#FFF",
                border: "1px solid #F1F0EE",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                cursor: "pointer",
                "&:hover": {
                  transform: "translateY(-10px)",
                  boxShadow: "0 30px 60px rgba(28,27,25,0.12)",
                },
              }}
              onClick={() => navigate(`/hotels/${h._id}`)}
            >
              {/* IMAGE BOX */}
              <Box sx={{ position: "relative", pt: "75%", overflow: "hidden" }}>
                <Box
                  component="img"
                  src={h.photos?.[0]?.url || "https://via.placeholder.com/400x300"}
                  alt={h.name}
                  sx={{
                    position: "absolute",
                    top: 0, left: 0,
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                  }}
                />
                <Chip 
                  label={`-${h.deal.discount}%`}
                  sx={{
                    position: "absolute", top: 16, right: 16,
                    bgcolor: "#E74C3C", color: "#fff",
                    fontWeight: 800, borderRadius: "8px",
                    fontSize: "0.75rem"
                  }}
                />
              </Box>

              {/* CONTENT */}
              <Box sx={{ p: 2.5, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ color: "#C2A56D", fontWeight: 700, textTransform: "uppercase" }}>
                  {h.city}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "1.1rem",
                    fontWeight: 700,
                    color: "#1C1B19",
                    mt: 0.5, mb: 2,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '3rem'
                  }}
                >
                  {h.name}
                </Typography>

                <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
                  <Box>
                     <Typography sx={{ fontSize: "0.75rem", color: "#72716E", fontWeight: 600 }}>GIÁ TỪ</Typography>
                     <Stack direction="row" spacing={1} alignItems="baseline">
                        <Typography sx={{ fontWeight: 800, color: "#1C1B19", fontSize: "1.1rem" }}>
                           {h.deal.finalPrice.toLocaleString("vi-VN")}₫
                        </Typography>
                        <Typography sx={{ fontSize: "0.75rem", textDecoration: "line-through", color: "#A8A7A1" }}>
                           {h.deal.originalPrice.toLocaleString("vi-VN")}
                        </Typography>
                     </Stack>
                  </Box>
                  
                  <Button
                    variant="contained"
                    sx={{
                      minWidth: 40, width: 40, height: 40, borderRadius: "10px",
                      bgcolor: "#1C1B19", color: "#C2A56D",
                      "&:hover": { bgcolor: "#C2A56D", color: "#1C1B19" }
                    }}
                  >
                    →
                  </Button>
                </Stack>
              </Box>
            </MotionPaper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}