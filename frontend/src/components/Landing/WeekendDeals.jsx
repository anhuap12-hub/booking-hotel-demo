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
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';

const MotionPaper = motion(Paper);

export default function WeekendDeals({ hotels = [] }) {
  const navigate = useNavigate();

  // COPY NGUYÊN LOGIC THOÁNG CỦA TRANG DEALS
  const displayHotels = [...hotels]
    .map(h => {
      // Tìm phòng có giá rẻ nhất (hoặc phòng đầu tiên) để làm giá gốc
      const baseRoom = h.rooms?.[0] || { price: 0, discount: 0 };
      
      // Tìm mức discount lớn nhất trong các phòng (giống trang Deals hiện Badge)
      const maxDiscount = h.rooms?.reduce((max, r) => Math.max(max, r.discount || 0), 0) || 0;

      return {
        ...h,
        originalPrice: baseRoom.price,
        // Tính giá sau giảm (Nếu trang Deals tính khác thì bạn chỉnh lại công thức này)
        finalPrice: Math.round(baseRoom.price * (1 - maxDiscount / 100)),
        discountPercent: maxDiscount
      };
    })
    // Sắp xếp thằng có giảm giá lên đầu để không bị trống Badge ở hàng đầu
    .sort((a, b) => b.discountPercent - a.discountPercent)
    .slice(0, 5);

  return (
    <Container maxWidth="lg" sx={{ mb: 12 }}>
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
          onClick={() => navigate('/deals')}
          sx={{ color: "#72716E", textTransform: "none", fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
        >
          Xem tất cả ưu đãi
        </Button>
      </Stack>

      <Grid container spacing={2.5}>
        {displayHotels.map((h, idx) => (
          <Grid item xs={12} sm={6} md={2.4} key={h._id}>
            <MotionPaper
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1 }}
              viewport={{ once: true }}
              onClick={() => navigate(`/hotels/${h._id}`)}
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
                  boxShadow: "0 25px 50px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box sx={{ position: "relative", pt: "100%", overflow: "hidden" }}>
                <Box
                  component="img"
                  src={h.photos?.[0]?.url || "https://via.placeholder.com/400x400"}
                  alt={h.name}
                  sx={{
                    position: "absolute",
                    top: 0, left: 0,
                    width: "100%", height: "100%",
                    objectFit: "cover",
                  }}
                />
                {/* Ép hiện Badge nếu discountPercent > 0 */}
                {h.discountPercent > 0 && (
                  <Chip 
                    label={`-${h.discountPercent}%`}
                    sx={{
                      position: "absolute", top: 12, right: 12,
                      bgcolor: "#E74C3C", color: "#fff",
                      fontWeight: 900, borderRadius: "6px",
                      fontSize: "0.7rem", height: "24px"
                    }}
                  />
                )}
              </Box>

              <Box sx={{ p: 2, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                <Typography variant="caption" sx={{ color: "#C2A56D", fontWeight: 700, textTransform: "uppercase", fontSize: "0.65rem" }}>
                  {h.city}
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: "0.95rem",
                    fontWeight: 700,
                    color: "#1C1B19",
                    mt: 0.5, mb: 1.5,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '2.6rem'
                  }}
                >
                  {h.name}
                </Typography>

                <Box sx={{ mt: 'auto' }}>
                  <Typography sx={{ fontSize: "0.65rem", color: "#72716E", fontWeight: 600 }}>GIÁ TỪ</Typography>
                  <Stack direction="row" spacing={1} alignItems="baseline">
                    <Typography sx={{ fontWeight: 800, color: "#1C1B19", fontSize: "1.05rem" }}>
                      {(h.finalPrice || 0).toLocaleString("vi-VN")}₫
                    </Typography>
                    {/* Hiển thị giá gốc gạch ngang giống trang Deals */}
                    {h.discountPercent > 0 && (
                      <Typography sx={{ fontSize: "0.7rem", textDecoration: "line-through", color: "#A8A7A1" }}>
                        {(h.originalPrice || 0).toLocaleString("vi-VN")}
                      </Typography>
                    )}
                  </Stack>
                </Box>
              </Box>
            </MotionPaper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}