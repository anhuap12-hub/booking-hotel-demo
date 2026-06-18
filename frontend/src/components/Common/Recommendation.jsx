import React, { useEffect, useState } from "react";
import { Box, Typography, Paper, Stack, Button, CircularProgress, Container } from "@mui/material";
import { LocationOn, Star, ChevronRight, CheckCircleOutline } from "@mui/icons-material";
import { motion } from "framer-motion";
import { getRecommendations } from "../../api/recommend.api.js";
import { useNavigate } from "react-router-dom";

const BLUE = "#0056b3";

export default function Recommendation() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  // Hàm tính toán giá thuần túy (không dùng Hook)
  const getPriceInfo = (rooms) => {
    if (!rooms?.length) return null;
    const cheapestRoom = rooms.reduce((min, cur) => {
      const curFinal = (cur.price || 0) * (1 - (cur.discount || 0) / 100);
      const minFinal = (min.price || 0) * (1 - (min.discount || 0) / 100);
      return curFinal < minFinal ? cur : min;
    }, rooms[0]);

    const final = Math.round(cheapestRoom.price * (1 - (cheapestRoom.discount || 0) / 100));
    return {
      original: cheapestRoom.price,
      final: final,
      hasDiscount: (cheapestRoom.discount || 0) > 0
    };
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRecommendations();
        setHotels(res.data.data || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return <Box textAlign="center" py={4}><CircularProgress /></Box>;

  return (
    <Container 
  maxWidth={false} // Thử tắt maxWidth mặc định
  disableGutters // Loại bỏ padding mặc định nếu cần
  sx={{ 
    maxWidth: "1150px", // Đặt một giá trị cố định giống với các section khác
    mx: "auto",        // Căn giữa tuyệt đối
    py: 4 
  }}
>
      <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Đề xuất dành riêng cho bạn</Typography>

      <Stack spacing={2}>
        {hotels.map((hotel) => {
          // Gọi hàm tính toán bình thường tại đây, không vi phạm quy tắc Hook
          const priceInfo = getPriceInfo(hotel.rooms);

          return (
            <motion.div key={hotel._id} initial={{ opacity: 0 }} whileInView={{ opacity: 1 }}>
              <Paper
                elevation={0}
                onClick={() => navigate(`/hotels/${hotel._id}`)}
                sx={{
                  p: 1.5,
                  mb: 2,
                  borderRadius: "16px",
                  display: "flex",
                  alignItems: "stretch",
                  border: "1px solid #e0e0e0",
                  flexDirection: { xs: "column", sm: "row" },
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                  "&:hover": { borderColor: BLUE, boxShadow: "0 4px 12px rgba(0, 86, 179, 0.15)" },
                }}
              >
                {/* ẢNH */}
                <Box sx={{ width: { xs: "100%", sm: 200 }, height: 160, overflow: "hidden", borderRadius: "12px", flexShrink: 0 }}>
                  <Box component="img" src={hotel.photos?.[0]?.url} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
                </Box>

                {/* NỘI DUNG */}
                <Box sx={{ flex: 1, px: 2, py: 0.5, display: "flex", flexDirection: "column", minWidth: 0, gap: 0.5 }}>
                  <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                    <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#333", lineHeight: 1.2 }}>{hotel.name}</Typography>
                    {hotel.rating > 0 && (
                      <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#fff9c4", px: 1, py: 0.2, borderRadius: "6px", border: "1px solid #fbc02d", ml: 1, flexShrink: 0 }}>
                        <Star sx={{ fontSize: 13, color: "#fbc02d", mr: 0.3 }} />
                        <Typography fontSize={11} fontWeight={700} color="#856404">{hotel.rating.toFixed(1)}</Typography>
                      </Box>
                    )}
                  </Box>

                  <Stack direction="row" alignItems="center" spacing={0.5}>
                    <LocationOn sx={{ fontSize: 13, color: "text.secondary" }} />
                    <Typography variant="caption" color="text.secondary">{hotel.city}</Typography>
                  </Stack>

                  <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", overflow: "hidden", WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", minHeight: "2.4em" }}>
                    {hotel.desc ? hotel.desc.split(/[.!?]/)[0] + "." : ""}
                  </Typography>

                  <Stack direction="row" spacing={1.5} sx={{ mt: 0.5 }}>
                    {(hotel.amenities || []).slice(0, 3).map((item, i) => (
                      <Stack key={i} direction="row" alignItems="center" spacing={0.3}>
                        <CheckCircleOutline sx={{ fontSize: 12, color: BLUE }} />
                        <Typography fontSize={11} color="text.secondary">{item}</Typography>
                      </Stack>
                    ))}
                  </Stack>

                  <Box sx={{ mt: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px solid #eee" }}>
                    <Box>
                      {priceInfo?.hasDiscount && (
                        <Typography variant="caption" sx={{ color: "text.secondary", textDecoration: "line-through", mr: 1, display: "block", fontSize: "0.75rem" }}>
                          {priceInfo.original.toLocaleString()}₫
                        </Typography>
                      )}
                      <Typography variant="h6" fontWeight={800} color="#000" sx={{ lineHeight: 1 }}>
                        {priceInfo ? `${priceInfo.final.toLocaleString()}₫` : "Liên hệ"}
                        <Typography component="span" variant="caption" sx={{ ml: 0.5, color: "text.secondary" }}>/đêm</Typography>
                      </Typography>
                    </Box>
                    <Button variant="contained" endIcon={<ChevronRight />} sx={{ bgcolor: BLUE, borderRadius: 2, textTransform: "none", fontSize: "0.75rem", py: 0.5 }}>
                      Chi tiết
                    </Button>
                  </Box>
                </Box>
              </Paper>
            </motion.div>
          );
        })}
      </Stack>
    </Container>
  );
}