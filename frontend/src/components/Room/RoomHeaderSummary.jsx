import { Box, Typography, Stack, Chip, Rating } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

export default function RoomHeaderSummary({ room }) {
  // Giữ nguyên logic lấy dữ liệu an toàn
  const hotelName = room?.hotel?.name || "Khách sạn";
  const address = room?.hotel?.address || room?.hotel?.city || "Đang cập nhật địa chỉ";

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "flex-end" }}
      spacing={2}
      sx={{ mt: 4, mb: 2 }} // Thêm margin bottom để tạo khoảng cách với Gallery
    >
      <Box>
        {/* Tên phòng - Đồng bộ Font Playfair Display */}
        <Typography
          variant="h3"
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 800,
            mb: 1.5,
            fontSize: { xs: "2rem", md: "2.8rem" },
            color: "#1C1B19", // Ebony
            lineHeight: 1.2
          }}
        >
          {room?.name}
        </Typography>

        <Stack direction="column" spacing={1.5}>
          {/* Địa chỉ với icon Gold */}
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnOutlinedIcon sx={{ fontSize: 20, color: "#C2A56D" }} />
            <Typography 
              variant="body1" 
              sx={{ 
                color: "#72716E", 
                fontWeight: 500,
                fontSize: { xs: "0.9rem", md: "1rem" }
              }}
            >
              {hotelName} — <span style={{ fontWeight: 400, color: "#A8A7A1" }}>{address}</span>
            </Typography>
          </Stack>
          
          {/* Rating Section */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Rating 
              value={5} 
              readOnly 
              size="small" 
              sx={{ 
                color: "#C2A56D", // Đổi màu sao sang Gold
                "& .MuiRating-iconEmpty": { color: "#EFE7DD" } 
              }} 
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: "#1C1B19", 
                  fontWeight: 700, 
                  bgcolor: "#F9F8F6", 
                  px: 1, 
                  borderRadius: "4px" 
                }}
              >
                5.0
              </Typography>
              <Typography variant="caption" sx={{ color: "#72716E", fontWeight: 500 }}>
                (Tuyệt vời — 128 đánh giá)
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Nhãn loại phòng - Chỉnh lại theo style Luxury Chip */}
      <Chip
        label={room?.type || "Standard"}
        sx={{ 
          fontWeight: 800, 
          textTransform: "uppercase",
          letterSpacing: 1.5,
          px: 2,
          py: 2.5,
          borderRadius: "12px",
          bgcolor: "#1C1B19", // Nền đen Ebony
          color: "#C2A56D",   // Chữ vàng Gold
          border: "1px solid #C2A56D",
          fontSize: "0.75rem",
          boxShadow: "0 4px 10px rgba(28,27,25,0.15)"
        }}
      />
    </Stack>
  );
}