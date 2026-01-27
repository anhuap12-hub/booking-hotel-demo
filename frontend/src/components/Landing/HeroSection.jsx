import { Box, Container, Typography, Button, Stack } from "@mui/material";
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import CoffeeIcon from '@mui/icons-material/LocalCafe';
import { keyframes } from "@mui/system";

// Định nghĩa keyframes bằng CSS thuần thông qua MUI
const float = keyframes`
  0% { transform: translateY(0px); }
  50% { transform: translateY(-15px); }
  100% { transform: translateY(0px); }
`;

const fadeIn = keyframes`
  from { opacity: 0; transform: translateX(-30px); }
  to { opacity: 1; transform: translateX(0); }
`;

export default function HeroSection() {
  return (
    <Box
      sx={{
        position: "relative",
        height: { xs: 500, md: 650 },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        bgcolor: "#1c1b19",
        animation: "fadeIn 1.2s ease-out"
      }}
    >
      {/* BACKGROUND */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.pexels.com/photos/2067628/pexels-photo-2067628.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::after": {
            content: '""',
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(28,27,25,0.9) 20%, rgba(28,27,25,0.3) 100%)",
          }
        }}
      />

      {/* FLOATING ELEMENTS - Dùng CSS Animation thay cho Motion */}
      <Box
        sx={{
          position: "absolute",
          right: "12%",
          top: "25%",
          zIndex: 2,
          color: "rgba(194,165,109,0.3)",
          display: { xs: "none", md: "block" },
          animation: `${float} 3s ease-in-out infinite`
        }}
      >
        <HomeIcon sx={{ fontSize: 120 }} />
      </Box>

      {/* MAIN CONTENT */}
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 3 }}>
        <Box 
          maxWidth={700}
          sx={{ animation: `${fadeIn} 1s ease-out both`, animationDelay: "0.4s" }}
        >
          <Typography
            sx={{
              fontFamily: `"Playfair Display", serif`,
              fontSize: { xs: 42, md: 72 },
              fontWeight: 900,
              color: "#ffffff",
              mb: 2,
              lineHeight: 1.1,
            }}
          >
            Nơi bình yên <br /> 
            <Box component="span" sx={{ 
              color: "#c2a56d",
              textShadow: "0 0 20px rgba(194,165,109,0.3)" 
            }}>gọi tên bạn</Box>
          </Typography>

          <Typography
            sx={{
              fontSize: { xs: 16, md: 20 },
              color: "rgba(255,255,255,0.7)",
              mb: 5,
              maxWidth: 520,
              lineHeight: 1.8,
            }}
          >
            Trải nghiệm những không gian lưu trú tinh tuyển, nơi mỗi tách cà phê 
            và mỗi góc nhỏ đều mang đậm phong vị thượng lưu tại <b>Coffee Stay</b>.
          </Typography>

          <Stack direction="row" spacing={2}>
            <Button
              component={Link}
              to="/hotels"
              variant="contained"
              sx={{
                px: 6, py: 2,
                borderRadius: "12px",
                textTransform: "uppercase",
                fontWeight: 800,
                bgcolor: "#c2a56d",
                color: "#1c1b19",
                "&:hover": { 
                  bgcolor: "#fff", 
                  transform: "translateY(-3px)" 
                },
                transition: "all 0.4s"
              }}
            >
              Khám phá ngay
            </Button>
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}