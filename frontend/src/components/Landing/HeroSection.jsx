import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import BeachAccessIcon from '@mui/icons-material/BeachAccess'; // Đổi icon sang chủ đề biển
import { keyframes } from "@mui/system";

const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-10px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
`;

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 380, md: 450 },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        bgcolor: "#003580", // Màu xanh dương chủ đạo của Booking.com
        animation: "fadeIn 1.2s ease-out"
      }}
    >
      {/* BACKGROUND - Ảnh biển */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.pexels.com/photos/1266810/pexels-photo-1266810.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            // Gradient xanh dương nhẹ phủ lên ảnh để tạo sự đồng bộ
            background: "linear-gradient(to right, rgba(0, 53, 128, 0.85) 30%, rgba(0, 53, 128, 0.3) 100%)",
          }
        }}
      />

      {/* FLOATING ELEMENT - Icon biển */}
      <Box
        sx={{
          position: "absolute",
          right: "10%",
          top: "20%",
          zIndex: 2,
          color: "rgba(255, 255, 255, 0.15)",
          display: { xs: "none", md: "block" },
          animation: `${float} 4s ease-in-out infinite`
        }}
      >
        <BeachAccessIcon sx={{ fontSize: 120 }} />
      </Box>

      {/* MAIN CONTENT */}
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 3 }}>
        <Box 
          maxWidth={600}
          sx={{ 
            animation: `${fadeIn} 1s ease-out both`, 
            animationDelay: "0.3s",
            pl: { xs: 1, md: 4 }
          }}
        >
          <Typography
            sx={{
              fontFamily: `"Playfair Display", serif`,
              fontSize: { xs: "2rem", md: "3rem" },
              fontWeight: 900,
              color: "#ffffff",
              mb: 1.5,
              lineHeight: 1.2,
            }}
          >
            Nơi dừng chân <br /> 
            <Box component="span" sx={{ color: "#febb02" }}> {/* Màu vàng CTA của Booking */}
              mà bạn mong muốn
            </Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: "0.9rem", md: "1rem" },
              color: "rgba(255,255,255,0.9)",
              mb: 3.5,
              maxWidth: 480,
              lineHeight: 1.6,
            }}
          >
            Khám phá những resort ven biển và hotel sang trọng cùng  <b>Coffee Stay</b>.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              to="/hotels"
              variant="contained"
              sx={{
                px: 4, py: 1.2,
                borderRadius: "4px", // Bo góc nhẹ đặc trưng Booking
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: 700,
                bgcolor: "#febb02", // Màu vàng thương hiệu
                color: "#003580", // Chữ xanh dương
                "&:hover": { 
                  bgcolor: "#e5a800", 
                  transform: "translateY(-2px)" 
                },
                transition: "all 0.3s"
              }}
            >
              Tìm kiếm khách sạn ngay
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}