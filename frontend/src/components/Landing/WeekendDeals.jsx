import { Container, Grid, Typography, Box, Stack, IconButton, Rating } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LocalFireDepartmentIcon from '@mui/icons-material/LocalFireDepartment';
import { useMemo } from "react";

const MotionBox = motion(Box);

export default function WeekendDeals({ hotels = [] }) {
  const navigate = useNavigate();

  const displayHotels = useMemo(() => {
    return hotels
      .map((hotel) => {
        if (!hotel.rooms || hotel.rooms.length === 0) return null;
        const discountedRooms = hotel.rooms.filter((r) => r.discount > 0);
        if (discountedRooms.length === 0) return null;

        const bestRoom = discountedRooms.reduce((min, cur) => {
          const curFinal = cur.price * (1 - cur.discount / 100);
          const minFinal = min.price * (1 - min.discount / 100);
          return curFinal < minFinal ? cur : min;
        }, discountedRooms[0]);

        return {
          ...hotel,
          originalPrice: bestRoom.price,
          finalPrice: Math.round(bestRoom.price * (1 - bestRoom.discount / 100)),
          discountPercent: Math.max(...discountedRooms.map((r) => r.discount)),
          // Giả định dữ liệu trả về có rating
          rating: hotel.rating || 8.5, 
          stars: hotel.stars || 4
        };
      })
      .filter(Boolean)
      .slice(0, 4);
  }, [hotels]);

  return (
    <Container maxWidth="lg" sx={{ mt: -22, mb: 8 }}>
      <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 3 }}>
        <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: "#1A1A1A" }}>
          Ưu đãi cuối tuần
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {displayHotels.map((h, idx) => (
          <Grid item xs={12} sm={6} md={3} key={h._id}>
            <MotionBox
              whileHover={{ y: -5 }}
              onClick={() => navigate(`/hotels/${h._id}`)}
              sx={{
                border: "1px solid #E7E7E7",
                borderRadius: "8px",
                overflow: "hidden",
                display: "flex", flexDirection: "column",
                height: "100%",
                cursor: "pointer",
                bgcolor: "#FFF"
              }}
            >
              {/* IMAGE SECTION */}
              <Box sx={{ position: "relative", pt: "65%" }}>
                <Box
                  component="img"
                  src={h.photos?.[0]?.url || "https://via.placeholder.com/400x300"}
                  alt={h.name}
                  sx={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", objectFit: "cover" }}
                />
              </Box>

              {/* CONTENT SECTION */}
              <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', flexGrow: 1 }}>
                {/* Header: Type, Stars, Genius */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                  <Typography sx={{ fontSize: "0.75rem", color: "#595959" }}>{h.type || "Khách sạn"}</Typography>
                  <Rating value={h.stars} readOnly size="small" sx={{ color: "#F7B733" }} />
                </Stack>

                {/* Title */}
                <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#000000", mb: 0.2 }}>
                  {h.name}
                </Typography>

                {/* City */}
                <Typography sx={{ fontSize: "0.85rem", color: "#262626", mb: 1 }}>
                  {h.city}
                </Typography>

                {/* Review */}
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 2 }}>
                  <Box sx={{ bgcolor: "#003580", color: "#fff", px: 0.8, py: 0.2, fontWeight: 700, borderRadius: "4px 4px 4px 0", fontSize: "0.9rem" }}>
                    {h.rating}
                  </Box>
                  <Typography sx={{ fontSize: "0.85rem", fontWeight: 600 }}>Tuyệt vời</Typography>
                </Stack>

                {/* Pricing - Footer */}
<Box sx={{ mt: 'auto', textAlign: 'right', pt: 1.5, borderTop: "1px solid #F1F0EE" }}>
  {/* Chữ "Bắt đầu từ" để bên trên */}
  <Typography sx={{ fontSize: "0.75rem", color: "#595959", mb: 0.2 }}>
    Bắt đầu từ
  </Typography>
  
  {/* Giá gốc và giá giảm trên cùng một dòng */}
  <Stack direction="row" spacing={1} justifyContent="flex-end" alignItems="baseline">
    <Typography sx={{ fontSize: "0.9rem", color: "#D12727", textDecoration: "line-through" }}>
      {h.originalPrice.toLocaleString("vi-VN")}₫
    </Typography>
    <Typography sx={{ fontWeight: 700, fontSize: "1.1rem", color: "#1A1A1A" }}>
      {h.finalPrice.toLocaleString("vi-VN")}₫
    </Typography>
  </Stack>
</Box>
              </Box>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}