import { Grid, Stack, Typography, Box } from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";

export default function RoomAmenities({ amenities = [] }) {
  // 1. Kiểm tra nếu không có tiện nghi nào để tránh để trống UI quá mức
  if (!amenities || amenities.length === 0) {
    return (
      <Box sx={{ p: 2, bgcolor: "#fff3e0", borderRadius: 2, display: 'flex', alignItems: 'center', gap: 1.5 }}>
        <ErrorOutlineIcon sx={{ color: "#ed6c02" }} />
        <Typography color="text.secondary">Thông tin tiện nghi đang được cập nhật</Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={3}>
        Tiện nghi phòng
      </Typography>

      <Grid container spacing={3}>
        {amenities.map((item, idx) => (
          <Grid item xs={6} sm={4} key={idx}>
            <Stack direction="row" spacing={1.5} alignItems="center">
              {/* Icon container với màu sắc nhẹ nhàng hơn */}
              <Box 
                sx={{ 
                  display: 'flex',
                  bgcolor: "#F0F4F8", 
                  p: 0.8, 
                  borderRadius: "50%", // Bo tròn hẳn tạo cảm giác mềm mại
                  boxShadow: "0 2px 4px rgba(0,0,0,0.05)"
                }}
              >
                <CheckCircleIcon sx={{ color: "#388E3C", fontSize: 18 }} />
              </Box>
              
              <Typography 
                variant="body1" 
                fontWeight={500} 
                sx={{ 
                  color: "#455A64",
                  fontSize: "0.95rem",
                  textTransform: "capitalize" // Tự động viết hoa chữ cái đầu cho đẹp
                }}
              >
                {item}
              </Typography>
            </Stack>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}