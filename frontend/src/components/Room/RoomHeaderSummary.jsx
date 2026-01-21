import { Box, Typography, Stack, Chip, Rating } from "@mui/material";
import LocationOnIcon from "@mui/icons-material/LocationOn";

export default function RoomHeaderSummary({ room }) {
  // Lấy dữ liệu an toàn từ Backend (đã populate hotel)
  const hotelName = room?.hotel?.name || "Khách sạn";
  const address = room?.hotel?.address || room?.hotel?.city || "Đang cập nhật địa chỉ";

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }} // Mobile xếp dọc, Desktop xếp ngang
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "flex-end" }}
      spacing={2}
      mt={4}
    >
      <Box>
        {/* Tên phòng - Font chữ sang trọng */}
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            mb: 1,
            fontSize: { xs: "1.8rem", md: "2.5rem" }, // Responsive font size
            color: "#1A1A1A"
          }}
        >
          {room?.name}
        </Typography>

        {/* Thông tin địa chỉ và Rating giả lập (hoặc lấy từ hotel) */}
        <Stack direction="column" spacing={1}>
          <Stack direction="row" spacing={0.5} alignItems="center" color="text.secondary">
            <LocationOnIcon sx={{ fontSize: 18, color: "primary.main" }} />
            <Typography variant="body1" fontWeight={500}>
              {hotelName} — <span style={{ fontWeight: 400 }}>{address}</span>
            </Typography>
          </Stack>
          
          {/* Thêm Rating để giao diện trông "booking" hơn */}
          <Stack direction="row" spacing={1} alignItems="center">
            <Rating value={5} readOnly size="small" />
            <Typography variant="caption" color="text.secondary" sx={{ pt: 0.3 }}>
              (Tuyệt vời - 5/5)
            </Typography>
          </Stack>
        </Stack>
      </Box>

      {/* Nhãn loại phòng với Style cao cấp */}
      <Chip
        label={room?.type || "Standard"}
        color="primary"
        sx={{ 
          fontWeight: 700, 
          textTransform: "uppercase",
          letterSpacing: 1,
          px: 1,
          borderRadius: "8px",
          bgcolor: "primary.light",
          color: "primary.dark",
          border: "none"
        }}
      />
    </Stack>
  );
}