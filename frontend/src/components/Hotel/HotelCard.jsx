import { Box, Typography, Chip, Button, Stack } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import { useNavigate } from "react-router-dom";
import { memo, useMemo } from "react";
import { motion } from "framer-motion";

const BLUE = "#0056b3"; // Màu xanh chủ đạo dịu mắt

function HotelCard({ hotel }) {
  const navigate = useNavigate();
  const image = hotel.photos?.[0]?.url || "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=400";

  const priceInfo = useMemo(() => {
    if (!hotel.rooms?.length) return { finalPrice: 0 };
    const cheapestRoom = hotel.rooms.reduce((min, cur) => (cur.price < min.price ? cur : min), hotel.rooms[0]);
    return { finalPrice: cheapestRoom.price * (1 - (cheapestRoom.discount || 0) / 100) };
  }, [hotel.rooms]);

  return (
    <motion.div whileHover={{ y: -3 }} transition={{ duration: 0.2 }}>
      <Box
        onClick={() => navigate(`/hotels/${hotel._id}`)}
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          borderRadius: "16px",
          overflow: "hidden",
          bgcolor: "#fff",
          border: "1px solid #e0e0e0",
          cursor: "pointer",
          boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
          height: { md: "180px" }, // Giảm chiều cao
          mb: 2,
        }}
      >
        {/* IMAGE SECTION */}
        <Box sx={{ width: { xs: "100%", md: "240px" }, height: { xs: "180px", md: "100%" } }}>
          <Box component="img" src={image} alt={hotel.name} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        </Box>

        {/* CONTENT SECTION */}
        <Box sx={{ p: 2, flex: 1, display: "flex", flexDirection: "column", justifyContent: "center" }}>
          <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
            <Typography variant="subtitle1" fontWeight={700} color="#333">{hotel.name}</Typography>
            <Chip label={hotel.type || "Khách sạn"} size="small" sx={{ fontSize: "9px", height: 20, bgcolor: "#eef2f7", color: BLUE }} />
          </Stack>
          
          <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
            <LocationOnIcon sx={{ fontSize: 14, color: BLUE }} />
            <Typography fontSize="0.75rem" color="text.secondary">{hotel.city}</Typography>
          </Stack>

          <Stack direction="row" spacing={1} flexWrap="wrap">
            {(hotel.amenities || []).slice(0, 3).map((a, i) => (
              <Typography key={i} fontSize="0.7rem" color="text.secondary" sx={{ bgcolor: "#f8f9fa", px: 1, py: 0.2, borderRadius: 1 }}>
                • {a}
              </Typography>
            ))}
          </Stack>
        </Box>

        {/* ACTION SECTION */}
        <Box sx={{ p: 2, minWidth: "180px", borderLeft: { md: "1px dashed #eee" }, display: "flex", flexDirection: "column", justifyContent: "space-between", alignItems: { md: "flex-end" } }}>
          {hotel.rating && (
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <Typography fontWeight={700} fontSize="0.8rem">Xuất sắc</Typography>
              <Box sx={{ bgcolor: BLUE, color: "#fff", px: 0.8, py: 0.2, borderRadius: "4px", fontSize: "0.8rem", fontWeight: 700 }}>
                {hotel.rating.toFixed(1)}
              </Box>
            </Stack>
          )}

          <Box textAlign={{ md: "right" }}>
            <Typography fontWeight={800} fontSize="1.1rem" color={BLUE}>{priceInfo.finalPrice.toLocaleString()}đ</Typography>
            <Button variant="contained" size="small" sx={{ mt: 1, bgcolor: BLUE, borderRadius: "6px", textTransform: "none", fontSize: "0.75rem" }}>
              Xem chi tiết
            </Button>
          </Box>
        </Box>
      </Box>
    </motion.div>
  );
}

export default memo(HotelCard);