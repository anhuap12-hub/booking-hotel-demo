import React, { useMemo, memo } from "react";
import { Box, Typography, Paper, Stack, Button } from "@mui/material";
import { LocationOn, Star } from "@mui/icons-material";

// Dùng memo để ngăn Component vẽ lại khi không cần thiết
const HotelRow = memo(({ hotel, navigate }) => {
  const priceInfo = useMemo(() => {
    if (!hotel.rooms?.length) return null;
    return hotel.rooms
      .map((r) => ({
        curr: (r.price || 0) * (1 - (r.discount || 0) / 100),
      }))
      .sort((a, b) => a.curr - b.curr)[0];
  }, [hotel.rooms]);

  return (
    <Paper
      elevation={0}
      onClick={() => navigate(`/hotels/${hotel._id}`)}
      sx={{
        p: 0, mb: 4, borderRadius: "24px", display: "flex", overflow: "hidden",
        border: "1px solid rgba(194, 165, 109, 0.2)",
        flexDirection: { xs: "column", sm: "row" },
        transition: "all 0.4s ease",
        cursor: 'pointer',
        "&:hover": { 
            transform: "translateY(-4px)", 
            borderColor: "#C2A56D", 
            boxShadow: "0 20px 40px rgba(28, 27, 25, 0.08)" 
        },
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: 240, md: 280 }, height: { xs: 220, sm: "auto" }, overflow: "hidden" }}>
        <Box 
          component="img" 
          src={hotel.photos?.[0]?.url || "https://via.placeholder.com/400x300"} 
          sx={{ width: "100%", height: "100%", objectFit: "cover" }} 
        />
      </Box>
      <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>
          {hotel.name}
        </Typography>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Star sx={{ fontSize: 18, color: "#C2A56D" }} />
            <Typography fontWeight={800}>{hotel.rating || "Mới"}</Typography>
          </Stack>
          <Typography variant="body2" color="#A8A7A1">
            <LocationOn sx={{ fontSize: 16 }} /> {hotel.city}
          </Typography>
        </Stack>
        <Typography 
          variant="body2" 
          color="#72716E" 
          sx={{ mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}
        >
          {hotel.desc}
        </Typography>
        <Box sx={{ mt: "auto", pt: 2, borderTop: "1px dashed rgba(194, 165, 109, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" fontWeight={900}>
            {priceInfo ? `${Math.round(priceInfo.curr).toLocaleString()}₫` : "Liên hệ"}
            <Typography component="span" variant="caption">/đêm</Typography>
          </Typography>
          <Button variant="contained" sx={{ bgcolor: "#1C1B19", color: "#C2A56D", borderRadius: "10px", textTransform: 'none' }}>
            Chi tiết
          </Button>
        </Box>
      </Box>
    </Paper>
  );
});

export default HotelRow;