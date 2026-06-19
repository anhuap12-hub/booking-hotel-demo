import { Grid, Stack, Typography, Box } from "@mui/material";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const BLUE = "#0056b3";
const BORDER_COLOR = "#E2E8F0"; // Xám nhạt cho viền

export default function RoomAmenities({ amenities = [] }) {
  if (!amenities || amenities.length === 0) {
    return (
      <Box 
        sx={{ 
          p: 3, 
          bgcolor: "#F8FAFC", 
          borderRadius: "12px", 
          display: 'flex', 
          alignItems: 'center', 
          gap: 2,
          border: `1px solid ${BORDER_COLOR}`
        }}
      >
        <InfoOutlinedIcon sx={{ color: BLUE }} />
        <Typography sx={{ color: "#64748B", fontSize: "0.9rem", fontWeight: 500 }}>
          Dịch vụ và tiện nghi đang được cập nhật cho hạng phòng này.
        </Typography>
      </Box>
    );
  }

  return (
    <Box>
      <Typography 
        sx={{ 
          fontSize: "1.5rem",
          fontWeight: 700,
          color: "#0F172A",
          mb: 3,
          fontFamily: "'Playfair Display', serif"
        }}
      >
        Tiện nghi phòng
      </Typography>

      <Grid container spacing={2}>
        {amenities.map((item, idx) => (
          <Grid item xs={12} sm={6} md={4} key={idx}>
            <Stack 
              direction="row" 
              spacing={1.5} 
              alignItems="center"
              sx={{
                p: 1.5,
                borderRadius: "8px",
                border: `1px solid ${BLUE}`, // Thêm viền rõ ràng
                bgcolor: "#FFF",
                transition: "all 0.2s ease",
                "&:hover": {
                  borderColor: BLUE,
                  bgcolor: "#F0F7FF",
                }
              }}
            >
              <CheckCircleOutlineIcon 
                sx={{ 
                  color: BLUE, 
                  fontSize: 20 
                }} 
              />
              
              <Typography 
                sx={{ 
                  color: "#334155",
                  fontSize: "0.95rem",
                  fontWeight: 500,
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