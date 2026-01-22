import { Grid, Stack, Typography, Box } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function RoomAmenities({ amenities = [] }) {
  // 1. Kiểm tra nếu không có tiện nghi
  if (!amenities || amenities.length === 0) {
    return (
      <Box 
        sx={{ 
          p: 3, 
          bgcolor: "#F9F8F6", 
          borderRadius: "16px", 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          border: "1px dashed #D6C9B8"
        }}
      >
        <InfoOutlinedIcon sx={{ color: "#C2A56D" }} />
        <Typography sx={{ color: "#72716E", fontSize: "0.9rem", fontWeight: 500 }}>
          Dịch vụ và tiện nghi đang được cập nhật cho hạng phòng này.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography 
        sx={{ 
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#1C1B19",
          mb: 4,
          position: "relative",
          "&::after": {
            content: '""',
            position: "absolute",
            bottom: -8,
            left: 0,
            width: 40,
            height: 2,
            bgcolor: "#C2A56D"
          }
        }}
      >
        Tiện nghi phòng
      </Typography>

      <Grid container spacing={3}>
        {amenities.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Stack 
              direction="row" 
              spacing={2} 
              alignItems="center"
              sx={{
                p: 1.5,
                borderRadius: "12px",
                transition: "0.2s",
                "&:hover": {
                  bgcolor: "rgba(194, 165, 109, 0.05)",
                }
              }}
            >
              <CheckCircleOutlineIcon 
                sx={{ 
                  color: "#C2A56D", 
                  fontSize: 20,
                  opacity: 0.8 
                }} 
              />
              
              <Typography 
                sx={{ 
                  color: "#1C1B19",
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  letterSpacing: 0.2,
                  textTransform: "capitalize"
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