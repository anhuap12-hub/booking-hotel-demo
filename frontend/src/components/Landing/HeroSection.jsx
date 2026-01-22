import { Box, Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import HomeIcon from '@mui/icons-material/Home';
import CoffeeIcon from '@mui/icons-material/LocalCoffee';

const MotionBox = motion(Box);

// Cấu hình chuyển động nhảy cho Icon
const jumpAnimation = {
  y: [0, -20, 0],
  rotate: [0, -10, 10, 0],
  transition: {
    duration: 2,
    repeat: Infinity,
    ease: "easeInOut"
  }
};

export default function HeroSection() {
  return (
    <MotionBox
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
      sx={{
        position: "relative",
        height: { xs: 450, md: 550 },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
        bgcolor: "#1c1b19", // Nền tối để nổi bật icon
      }}
    >
      {/* BACKGROUND IMAGE WITH OVERLAY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage: "url('https://images.pexels.com/photos/2067628/pexels-photo-2067628.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
          opacity: 0.6,
        }}
      />

      {/* --- CARTOON ELEMENTS --- */}
      {/* Ngôi nhà nhảy ở góc phải trên */}
      <MotionBox
        animate={jumpAnimation}
        sx={{
          position: "absolute",
          right: "15%",
          top: "20%",
          zIndex: 2,
          color: "#c2a56d",
          display: { xs: "none", md: "block" }
        }}
      >
        <HomeIcon sx={{ fontSize: 80, filter: "drop-shadow(0 10px 15px rgba(0,0,0,0.5))" }} />
      </MotionBox>

      {/* Tách cà phê nhảy ở góc phải dưới */}
      <MotionBox
        animate={{
          y: [0, -15, 0],
          scale: [1, 1.1, 1],
          transition: { duration: 2.5, repeat: Infinity, delay: 0.5 }
        }}
        sx={{
          position: "absolute",
          right: "10%",
          bottom: "20%",
          zIndex: 2,
          color: "#fff",
          display: { xs: "none", md: "block" }
        }}
      >
        <CoffeeIcon sx={{ fontSize: 60, opacity: 0.8 }} />
      </MotionBox>
      {/* ------------------------- */}

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 3 }}>
        <Box maxWidth={640}>
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.8 }}
          >
            <Typography
              sx={{
                fontFamily: `"Playfair Display", serif`,
                fontSize: { xs: 40, md: 60 },
                fontWeight: 800,
                color: "#ffffff",
                mb: 2,
                lineHeight: 1.1,
                textShadow: "2px 4px 10px rgba(0,0,0,0.5)",
              }}
            >
              Nơi bình yên <br /> 
              <span style={{ color: "#c2a56d" }}>gọi tên bạn</span>
            </Typography>

            <Typography
              sx={{
                fontSize: 18,
                color: "rgba(255,255,255,0.9)",
                mb: 4,
                maxWidth: 480,
                lineHeight: 1.6,
              }}
            >
              Khám phá những không gian lưu trú mang phong vị riêng, 
              đầy cảm hứng tại <b>Coffee Stay</b>.
            </Typography>

            <Button
              component={Link}
              to="/home"
              variant="contained"
              sx={{
                px: 5,
                py: 2,
                borderRadius: 999,
                textTransform: "none",
                fontSize: 16,
                fontWeight: 700,
                bgcolor: "#c2a56d",
                color: "#1c1b19",
                boxShadow: "0 10px 20px rgba(194,165,109,0.4)",
                "&:hover": { bgcolor: "#d3b57a", transform: "scale(1.05)" },
                transition: "all 0.3s"
              }}
            >
              Bắt đầu hành trình
            </Button>
          </motion.div>
        </Box>
      </Container>
    </MotionBox>
  );
}