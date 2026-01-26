import { Box, Typography, Skeleton } from "@mui/material";

export default function HotelMap({ hotel }) {
  // 1. Chống crash khi dữ liệu chưa load xong hoặc thiếu location
  if (!hotel || !hotel.location) {
    return (
      <Box sx={{ width: "100%", mb: 4 }}>
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 1 }} />
        <Skeleton variant="rectangular" width="100%" height={320} sx={{ borderRadius: 3 }} />
      </Box>
    );
  }

  // 2. Lấy tọa độ từ object location
  const { lat, lng } = hotel.location;
  
  // URL chuẩn để nhúng Google Maps theo tọa độ (Đã sửa lỗi cú pháp {lat})
  // Sử dụng maps.google.com/maps với tham số q=lat,lng
  const mapUrl = `https://maps.google.com/maps?q=${lat},${lng}&z=15&output=embed`;

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.4rem",
          fontWeight: 500,
          color: "text.primary",
          mb: 0.5,
        }}
      >
        Vị trí & khu vực xung quanh
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          fontSize: 14.5,
          mb: 2,
        }}
      >
        {hotel.address}, {hotel.city}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 320,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <iframe
          title="hotel-map"
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter: "grayscale(0.1) contrast(1.02)",
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={mapUrl}
        />
      </Box>
    </Box>
  );
}