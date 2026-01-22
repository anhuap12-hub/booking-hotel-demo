import {
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

export default function BookingSideBar({ hotel }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: "24px",
        border: "1px solid rgba(194, 165, 109, 0.2)", // Viền Gold mảnh
        boxShadow: "0 20px 40px rgba(28,27,25,0.06)",
        position: "sticky",
        top: 100, // Cố định khi scroll
        bgcolor: "#FFF",
      }}
    >
      {/* Price Section */}
      <Box sx={{ mb: 3 }}>
        <Typography 
          variant="body2" 
          sx={{ color: "#72716E", fontWeight: 600, mb: 0.5, textTransform: "uppercase", letterSpacing: 1 }}
        >
          Giá chỉ từ
        </Typography>
        <Stack direction="row" alignItems="baseline" spacing={0.5}>
          <Typography 
            sx={{ 
              fontSize: 28, 
              fontWeight: 800, 
              color: "#1C1B19",
              fontFamily: "'Playfair Display', serif" 
            }}
          >
            {hotel.cheapestPrice?.toLocaleString() || "—"} ₫
          </Typography>
          <Typography
            fontSize={15}
            color="#A8A7A1"
            fontWeight={400}
          >
            / đêm
          </Typography>
        </Stack>
      </Box>

      <Divider sx={{ mb: 3, borderColor: "rgba(194, 165, 109, 0.1)" }} />

      {/* Date Selection */}
      <Stack spacing={2.5}>
        <TextField
          label="Ngày nhận phòng"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={textFieldStyle}
        />
        <TextField
          label="Ngày trả phòng"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
          sx={textFieldStyle}
        />
      </Stack>

      {/* Summary Info (Tạo cảm giác chuyên nghiệp) */}
      <Stack spacing={1.5} mt={3} mb={3}>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="#72716E">Thời gian lưu trú</Typography>
          <Typography variant="body2" fontWeight={600}>-- đêm</Typography>
        </Stack>
        <Stack direction="row" justifyContent="space-between">
          <Typography variant="body2" color="#72716E">Phí dịch vụ</Typography>
          <Typography variant="body2" fontWeight={600}>Miễn phí</Typography>
        </Stack>
      </Stack>

      {/* Luxury CTA Button */}
      <Button
        fullWidth
        size="large"
        variant="contained"
        sx={{
          py: 2,
          borderRadius: "12px",
          bgcolor: "#1C1B19", // Ebony
          color: "#C2A56D",   // Gold
          fontWeight: 700,
          fontSize: "1rem",
          textTransform: "none",
          boxShadow: "0 10px 20px rgba(28,27,25,0.15)",
          "&:hover": {
            bgcolor: "#333230",
            transform: "translateY(-2px)",
            boxShadow: "0 15px 30px rgba(28,27,25,0.2)",
          },
          transition: "all 0.3s ease",
        }}
      >
        Kiểm tra phòng trống
      </Button>

      {/* Reassurance Label */}
      <Stack direction="row" justifyContent="center" alignItems="center" spacing={1} mt={2.5}>
        <InfoOutlinedIcon sx={{ fontSize: 16, color: "#A8A7A1" }} />
        <Typography
          fontSize={13}
          color="#A8A7A1"
          fontWeight={500}
        >
          Bạn chưa bị trừ tiền lúc này
        </Typography>
      </Stack>
    </Paper>
  );
}

// Custom Style cho TextField đồng bộ Ebony & Gold
const textFieldStyle = {
  "& .MuiOutlinedInput-root": {
    borderRadius: "12px",
    backgroundColor: "#F9F8F6",
    "& fieldset": { borderColor: "transparent" },
    "&Hover fieldset": { borderColor: "rgba(194, 165, 109, 0.5)" },
    "&.Mui-focused fieldset": { borderColor: "#C2A56D" },
  },
  "& .MuiInputLabel-root": {
    color: "#72716E",
    fontWeight: 500,
    "&.Mui-focused": { color: "#C2A56D" }
  }
};