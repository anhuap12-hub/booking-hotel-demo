import {
  Container,
  Grid,
  Typography,
  Button,
  Paper,
  Box,
  Stack,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function WeekendDeals({ hotels = [] }) {
  const navigate = useNavigate();

  // ================= PRICE LOGIC (CHUẨN DEAL) =================
  const getBestPrice = (rooms) => {
    if (!Array.isArray(rooms) || rooms.length === 0) return null;

    // 1️⃣ Phòng có discount
    const discountedRooms = rooms.filter(
      (r) => typeof r.discount === "number" && r.discount > 0
    );

    if (discountedRooms.length) {
      const bestRoom = discountedRooms.reduce((best, cur) => {
        const curFinal = cur.price * (1 - cur.discount / 100);
        const bestFinal = best.price * (1 - best.discount / 100);
        return curFinal < bestFinal ? cur : best;
      }, discountedRooms[0]);

      return {
        price: bestRoom.price,
        finalPrice: Math.round(
          bestRoom.price * (1 - bestRoom.discount / 100)
        ),
        discount: bestRoom.discount,
      };
    }

    // 2️⃣ Không có discount → lấy phòng rẻ nhất
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
    <Container maxWidth="xl" sx={{ mb: 10 }}>
      <Box mb={3}>
        <Typography
          sx={{
            fontFamily: "Playfair Display, serif",
            fontSize: 24,
            fontWeight: 600,
            color: "#2b2a28",
          }}
        >
          Ưu đãi cuối tuần
        </Typography>
        <Typography sx={{ fontSize: 14, color: "rgba(0,0,0,0.55)" }}>
          Nghỉ dưỡng ngắn ngày với phong cách tinh tế
        </Typography>
      </Box>

      <Grid container spacing={4}>
        {hotels.map((h) => {
          const priceInfo = getBestPrice(h.rooms);

          return (
            <Grid item xs={12} sm={6} md={3} key={h._id}>
              <Paper
                elevation={0}
                sx={{
                  borderRadius: 3,
                  overflow: "hidden",
                  bgcolor: "#f5f4f2",
                  boxShadow: "0 12px 30px rgba(0,0,0,0.15)",
                  transition: "all .35s ease",
                  "&:hover": {
                    transform: "translateY(-6px)",
                    boxShadow: "0 20px 45px rgba(0,0,0,0.25)",
                  },
                }}
              >
                {/* IMAGE */}
                <Box sx={{ width: "100%", height: 220, overflow: "hidden" }}>
                  <img
                    src={
                      h.photos?.[0]?.url ||
                      "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg"
                    }
                    alt={h.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      filter: "brightness(0.9)",
                      transition: "transform .6s ease",
                    }}
                  />
                </Box>

                {/* CONTENT */}
                <Box sx={{ p: 2 }}>
                  <Typography
                    noWrap
                    sx={{
                      fontFamily: "Playfair Display, serif",
                      fontSize: 16,
                      fontWeight: 600,
                      color: "#1f1f1f",
                    }}
                  >
                    {h.name}
                  </Typography>

                  <Typography
                    sx={{
                      fontSize: 13,
                      color: "rgba(0,0,0,0.55)",
                      mb: 0.5,
                    }}
                  >
                    {h.city}
                  </Typography>

                  {/* PRICE */}
                  {priceInfo ? (
                    <Stack direction="row" spacing={1} alignItems="baseline">
                      <Typography
                        sx={{
                          fontSize: 15,
                          fontWeight: 700,
                          color: priceInfo.discount ? "#b91c1c" : "#5a3e2b",
                        }}
                      >
                        {`Từ ${priceInfo.finalPrice.toLocaleString("vi-VN")} ₫`}
                      </Typography>

                      {priceInfo.discount > 0 && (
                        <Typography
                          sx={{
                            fontSize: 12,
                            textDecoration: "line-through",
                            color: "rgba(0,0,0,0.5)",
                          }}
                        >
                          {priceInfo.price.toLocaleString("vi-VN")} ₫
                        </Typography>
                      )}
                    </Stack>
                  ) : (
                    <Typography>Liên hệ</Typography>
                  )}

                  <Button
                    fullWidth
                    onClick={() => navigate(`/hotels/${h._id}`)}
                    sx={{
                      mt: 1.5,
                      bgcolor: "#2b2a28",
                      color: "#f5f4f2",
                      fontSize: 13,
                      borderRadius: 2,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#1f1f1f",
                      },
                    }}
                  >
                    Xem ưu đãi
                  </Button>
                </Box>
              </Paper>
            </Grid>
          );
        })}
      </Grid>
    </Container>
  );
}
