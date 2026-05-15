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

  // Logic lấy giá tốt nhất từ mảng rooms
  const getBestPrice = (rooms) => {
    if (!Array.isArray(rooms) || rooms.length === 0) return null;

    // Ưu tiên tìm các phòng đang có discount
    const discountedRooms = rooms.filter(
      (r) => typeof r.discount === "number" && r.discount > 0
    );

    // Nếu có phòng giảm giá, chọn phòng có giá sau giảm (finalPrice) thấp nhất
    if (discountedRooms.length) {
      const bestRoom = discountedRooms.reduce((best, cur) => {
        const curFinal = cur.price * (1 - cur.discount / 100);
        const bestFinal = best.price * (1 - best.discount / 100);
        return curFinal < bestFinal ? cur : best;
      }, discountedRooms[0]);

      return {
        price: bestRoom.price,
        finalPrice: Math.round(bestRoom.price * (1 - bestRoom.discount / 100)),
        discount: bestRoom.discount,
      };
    }

    // Nếu không có phòng nào giảm giá, lấy phòng rẻ nhất bình thường
    const cheapestRoom = rooms.reduce((min, cur) =>
      cur.price < min.price ? cur : min
    , rooms[0]);

    return {
      price: cheapestRoom.price,
      finalPrice: cheapestRoom.price,
      discount: 0,
    };
  };

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
          onClick={() => navigate('/hotels')}
          sx={{ color: "#72716E", textTransform: "none", fontWeight: 600, display: { xs: 'none', sm: 'block' } }}
        >
          Xem tất cả khách sạn
        </Button>
      </Stack>

      <Grid container spacing={3}>
        {hotels.slice(0, 4).map((h, idx) => {
          const priceInfo = getBestPrice(h.rooms);

          return (
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
                  height: "100%", // Cho các card cao bằng nhau
                  display: "flex",
                  flexDirection: "column",
                  transition: "0.4s cubic-bezier(0.4, 0, 0.2, 1)",
                  "&:hover": {
                    transform: "translateY(-10px)",
                    boxShadow: "0 30px 60px rgba(28,27,25,0.12)",
                  },
                }}
              >
                {/* IMAGE BOX - Cố định tỉ lệ 3:4 hoặc 1:1 cho Weekend Deals */}
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
                      transition: "0.6s",
                    }}
                  />
                  {priceInfo?.discount > 0 && (
                    <Chip 
                      label={`-${priceInfo.discount}%`}
                      sx={{
                        position: "absolute", top: 16, right: 16,
                        bgcolor: "#E74C3C", color: "#fff", // Đổi sang đỏ để nhấn mạnh deal
                        fontWeight: 800, borderRadius: "8px",
                        fontSize: "0.75rem"
                      }}
                    />
                  )}
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
                      height: '3rem' // Cố định chiều cao tiêu đề
                    }}
                  >
                    {h.name}
                  </Typography>

                  <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 'auto' }}>
                    <Box>
                       <Typography sx={{ fontSize: "0.75rem", color: "#72716E", fontWeight: 600 }}>GIÁ TỪ</Typography>
                       <Stack direction="row" spacing={1} alignItems="baseline">
                          <Typography sx={{ fontWeight: 800, color: "#1C1B19", fontSize: "1.1rem" }}>
                             {priceInfo?.finalPrice.toLocaleString("vi-VN")}₫
                          </Typography>
                          {priceInfo?.discount > 0 && (
                            <Typography sx={{ fontSize: "0.75rem", textDecoration: "line-through", color: "#A8A7A1" }}>
                               {priceInfo.price.toLocaleString("vi-VN")}
                            </Typography>
                          )}
                       </Stack>
                    </Box>
                    
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/hotels/${h._id}`)}
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
          );
        })}
      </Grid>
    </Container>
  );
}