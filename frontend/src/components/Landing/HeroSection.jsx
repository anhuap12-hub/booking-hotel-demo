import { Box, Container, Typography, Button } from "@mui/material";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const MotionBox = motion(Box);

export default function HeroSection() {
  return (
    <MotionBox
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      sx={{
        position: "relative",
        height: { xs: 380, md: 460 },
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      {/* IMAGE ONLY */}
      <Box
        sx={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "url('https://images.pexels.com/photos/2067628/pexels-photo-2067628.jpeg?auto=compress&cs=tinysrgb&w=1600')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <Container maxWidth="xl" sx={{ position: "relative", zIndex: 1 }}>
        <Box maxWidth={640}>
          <Typography
            sx={{
              fontFamily: `"Playfair Display", serif`,
              fontSize: { xs: 34, md: 48 },
              fontWeight: 600,
              color: "#ffffff",
              mb: 1.5,
              lineHeight: 1.15,
              textShadow: "0 6px 20px rgba(0,0,0,0.35)",
            }}
          >
            Một nơi để chậm lại
          </Typography>

          <Typography
            sx={{
              fontSize: 16,
              color: "rgba(255,255,255,0.9)",
              mb: 3,
              maxWidth: 520,
              lineHeight: 1.6,
              textShadow: "0 4px 16px rgba(0,0,0,0.35)",
            }}
          >
            Khám phá những không gian lưu trú mang phong vị riêng, yên tĩnh và đầy
            cảm hứng.
          </Typography>

          <Button
            component={Link}
            to="/home"
            sx={{
              px: 4,
              py: 1.3,
              borderRadius: 999,
              textTransform: "none",
              fontSize: 15,
              fontWeight: 500,
              bgcolor: "#c2a56d",
              color: "#1c1b19",
              "&:hover": { bgcolor: "#d3b57a" },
            }}
          >
            Khám phá chỗ nghỉ
          </Button>
        </Box>
      </Container>
    </MotionBox>
  );
}
