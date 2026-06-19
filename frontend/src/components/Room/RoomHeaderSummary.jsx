import { Box, Typography, Stack, Chip, Rating } from "@mui/material";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

const BLUE = "#0056b3";
const SOFT_GRAY = "#F8FAFC";
const TEXT_PRIMARY = "#0F172A";
const TEXT_SECONDARY = "#64748B";

export default function RoomHeaderSummary({ room }) {
  const hotelName = room?.hotel?.name || "Khách sạn";
  const address = room?.hotel?.address || room?.hotel?.city || "Đang cập nhật địa chỉ";

  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      justifyContent="space-between"
      alignItems={{ xs: "flex-start", sm: "flex-end" }}
      spacing={2}
      sx={{ mt: 4, mb: 3 }}
    >
      <Box>
        {/* Tên phòng */}
        <Typography
          variant="h3"
          sx={{
            fontWeight: 800,
            mb: 1.5,
            fontSize: { xs: "2rem", md: "1.5rem" },
            color: TEXT_PRIMARY,
            lineHeight: 1.2
          }}
        >
          {room?.name}
        </Typography>

        <Stack direction="column" spacing={1.5}>
          {/* Địa chỉ */}
          <Stack direction="row" spacing={1} alignItems="center">
            <LocationOnOutlinedIcon sx={{ fontSize: 20, color: BLUE }} />
            <Typography 
              variant="body1" 
              sx={{ color: TEXT_SECONDARY, fontWeight: 500 }}
            >
              {hotelName} — <span style={{ fontWeight: 400, color: "#94A3B8" }}>{address}</span>
            </Typography>
          </Stack>
          
          {/* Rating Section */}
          <Stack direction="row" spacing={1.5} alignItems="center">
            <Rating 
              value={5} 
              readOnly 
              size="small" 
              sx={{ color: "#F59E0B" }} // Vẫn giữ màu vàng cho sao để tạo độ tương phản tốt
            />
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
              <Typography 
                variant="subtitle2" 
                sx={{ 
                  color: BLUE, 
                  fontWeight: 700, 
                  bgcolor: "#EFF6FF", 
                  px: 1, py: 0.5,
                  borderRadius: "6px" 
                }}
              >
                5.0
              </Typography>
              <Typography variant="caption" sx={{ color: TEXT_SECONDARY, fontWeight: 500 }}>
                (Tuyệt vời — 128 đánh giá)
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </Box>

      {/* Nhãn loại phòng */}
      <Chip
        label={room?.type || "Standard"}
        sx={{ 
          fontWeight: 700, 
          textTransform: "uppercase",
          letterSpacing: 1,
          px: 2,
          borderRadius: "8px",
          bgcolor: BLUE, 
          color: "#FFF",
          fontSize: "0.75rem",
        }}
      />
    </Stack>
  );
}