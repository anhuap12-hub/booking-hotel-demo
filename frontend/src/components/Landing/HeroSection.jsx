import { Box, Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import CoffeeIcon from '@mui/icons-material/LocalCafe'; // 👈 Sửa từ LocalCoffee thành LocalCafe

const MotionBox = motion(Box);

// Cấu hình chuyển động nhẹ nhàng, sang trọng
const jumpAnimation = {
  y: [0, -15, 0],
  transition: {
    duration: 3,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function HeroSection() {
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
      sx={{
        position: "relative",
        height: { xs: 500, md: 650 }, // Tăng chiều cao một chút cho thoáng
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        bgcolor: "#1c1b19", 
      }}
    >
      {/* BACKGROUND IMAGE WITH PREMIUM OVERLAY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.pexels.com/photos/2067628/pexels-photo-2067628.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          "&::after": { // Lớp phủ gradient tạo chiều sâu
            content: '""',
            position: "absolute",
            inset: 0,
            background: "linear-gradient(to right, rgba(28,27,25,0.9) 20%, rgba(28,27,25,0.3) 100%)",
          }
        }}
      />

      {/* --- FLOATING ELEMENTS (LUXURY STYLE) --- */}
      <MotionBox
        animate={jumpAnimation}
        sx={{
          position: "absolute",
          right: "12%",
          top: "25%",
          zIndex: 2,
          color: "rgba(194,165,109,0.3)", // Làm mờ để tạo nét tinh tế
          display: { xs: "none", md: "block" }
        }}
      >
        <HomeIcon sx={{ fontSize: 120 }} />
      </MotionBox>

      <MotionBox
        animate={{
          y: [0, 10, 0],
          opacity: [0.4, 0.7, 0.4],
          transition: { duration: 4, repeat: Infinity }
        }}
        sx={{
          position: "absolute",
          right: "20%",
          bottom: "15%",
          zIndex: 2,
          color: "rgba(194,165,109,0.2)",
          display: { xs: "none", md: "block" }
        }}
      >
        <CoffeeIcon sx={{ fontSize: 80 }} />
      </MotionBox>

      {/* --- MAIN CONTENT --- */}
      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 3 }}>
        <Box maxWidth={700}>
          <motion.div
            initial={{ x: -60, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 1 }}
          >
            <Typography
              sx={{
                fontFamily: `"Playfair Display", serif`,
                fontSize: { xs: 42, md: 72 }, // Font lớn hơn cho đẳng cấp
                fontWeight: 900,
                color: "#ffffff",
                mb: 2,
                lineHeight: 1.1,
              }}
            >
              Nơi bình yên <br /> 
              <span style={{ 
                color: "#c2a56d",
                textShadow: "0 0 20px rgba(194,165,109,0.3)" 
              }}>gọi tên bạn</span>
            </Typography>

            <Typography
              sx={{
                fontSize: { xs: 16, md: 20 },
                color: "rgba(255,255,255,0.7)",
                mb: 5,
                maxWidth: 520,
                lineHeight: 1.8,
                letterSpacing: "0.5px"
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
                  px: 6,
                  py: 2,
                  borderRadius: "12px", // Bo góc vuông vắn hơn một chút
                  textTransform: "uppercase",
                  fontSize: 14,
                  letterSpacing: "2px",
                  fontWeight: 800,
                  bgcolor: "#c2a56d",
                  color: "#1c1b19",
                  "&:hover": { 
                    bgcolor: "#fff", 
                    color: "#1c1b19",
                    transform: "translateY(-3px)" 
                  },
                  transition: "all 0.4s"
                }}
              >
                Khám phá ngay
              </Button>
            </Stack>
          </motion.div>
        </Box>
      </Container>
    </MotionBox>
  );
}