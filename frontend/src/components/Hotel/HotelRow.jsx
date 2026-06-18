import React, { useMemo, memo } from "react";
import { Box, Typography, Paper, Stack, Button } from "@mui/material";
import { LocationOn, Star, ChevronRight, CheckCircleOutline } from "@mui/icons-material";

const BLUE = "#0056b3";

const HotelRow = memo(({ hotel, navigate }) => {
 const priceInfo = useMemo(() => {
  if (!hotel.rooms?.length) return null;
  
  // Tìm phòng có giá cuối cùng thấp nhất
  const cheapestRoom = hotel.rooms.reduce((min, cur) => {
    const curFinal = (cur.price || 0) * (1 - (cur.discount || 0) / 100);
    const minFinal = (min.price || 0) * (1 - (min.discount || 0) / 100);
    return curFinal < minFinal ? cur : min;
  }, hotel.rooms[0]);

  const final = Math.round(cheapestRoom.price * (1 - (cheapestRoom.discount || 0) / 100));
  
  return {
    original: cheapestRoom.price,
    final: final,
    hasDiscount: (cheapestRoom.discount || 0) > 0
  };
}, [hotel.rooms]);

  // Lấy câu đầu tiên của mô tả (cắt theo dấu chấm hoặc giới hạn ký tự)
  const firstDesc = useMemo(() => {
    if (!hotel.desc) return "";
    return hotel.desc.split(/[.!?]/)[0] + ".";
  }, [hotel.desc]);

  return (
    <Paper
      elevation={0}
      onClick={() => navigate(`/hotels/${hotel._id}`)}
      sx={{
        p: 1.5,
        mb: 2,
        borderRadius: "16px",
        display: "flex",
        alignItems: "stretch", // Chuyển sang stretch để các khối cao bằng nhau
        border: "1px solid #e0e0e0",
        flexDirection: { xs: "column", sm: "row" },
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": { borderColor: BLUE, boxShadow: "0 4px 12px rgba(0, 86, 179, 0.15)" },
      }}
    >
      {/* ẢNH */}
      <Box sx={{ width: { xs: "100%", sm: 200 }, height: 160, overflow: "hidden", borderRadius: "12px", flexShrink: 0 }}>
        <Box component="img" src={hotel.images?.[0] || hotel.photos?.[0]?.url} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Box>

      {/* NỘI DUNG */}
      <Box sx={{ flex: 1, px: 2, py: 0.5, display: "flex", flexDirection: "column", minWidth: 0, gap: 0.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#333", lineHeight: 1.2 }}>{hotel.name}</Typography>
          
          {hotel.rating && (
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

        {/* MÔ TẢ NGẮN (Câu đầu tiên) */}
        <Typography 
  variant="body2" 
  color="text.secondary" 
  sx={{ 
    fontSize: "0.8rem", 
    overflow: "hidden", 
    display: "-webkit-box", 
    WebkitLineClamp: 2, // Hiển thị đúng 2 dòng
    WebkitBoxOrient: "vertical",
    mb: 0.5,
    minHeight: "2.4em" // Giữ chiều cao tối thiểu cho 2 dòng kể cả khi desc ngắn
  }}
>
  {firstDesc}
</Typography>

        {/* Tiện ích */}
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
  );
});

export default HotelRow;