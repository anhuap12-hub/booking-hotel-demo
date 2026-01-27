import React from "react";
import { Box, Typography, Stack } from "@mui/material";

export default function HeroBanner() {
  return (
    <Box sx={{ 
      position: "relative", 
      minHeight: { xs: "300px", md: "450px" }, // Giảm chiều cao một chút vì đã bỏ thanh search
      width: "100%", 
      display: "flex", 
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      bgcolor: "#1C1B19"
    }}>
      {/* BACKGROUND IMAGE WITH OVERLAY */}
      <Box sx={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)" 
        }
      }} />
      
      <Stack spacing={2} alignItems="center" sx={{ width: "100%", px: 2, zIndex: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: { xs: "2.2rem", md: "4rem" },
            color: "#fff",
            lineHeight: 1.2,
            mb: 1,
          }}>
            Tìm nơi dừng chân <Box component="span" sx={{ color: "#C2A56D" }}>hoàn hảo</Box>
          </Typography>
          <Typography sx={{ 
            color: "rgba(255,255,255,0.9)", 
            fontSize: { xs: "1rem", md: "1.2rem" },
            maxWidth: "600px",
            mx: "auto"
          }}>
            Khám phá không gian nghỉ dưỡng thượng lưu tại Coffee Stay
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}