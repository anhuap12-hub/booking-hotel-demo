import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  Zoom,
  Avatar
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Icons
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import LoginIcon from "@mui/icons-material/Login";

export default function VerifySuccess() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F9F8F6", // Nền kem đặc trưng
        backgroundImage: "radial-gradient(circle at 2px 2px, rgba(194, 165, 109, 0.05) 1px, transparent 0)",
        backgroundSize: "40px 40px",
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Zoom in={true} style={{ transitionDelay: "200ms" }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: "center",
              borderRadius: "32px",
              border: "1px solid rgba(194, 165, 109, 0.2)",
              boxShadow: "0 20px 60px rgba(28,27,25,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "#FFF"
            }}
          >
            {/* Success Icon - Emerald & Gold mix */}
            <Avatar
              sx={{
                width: 90,
                height: 90,
                bgcolor: "rgba(16, 185, 129, 0.08)", // Xanh lục cực nhạt
                mb: 4,
                border: "2px dashed #10b981",
              }}
            >
              <CheckCircleOutlineIcon 
                sx={{ fontSize: 50, color: "#10b981" }} 
              />
            </Avatar>

            <Typography 
              variant="h4" 
              sx={{ 
                color: "#1C1B19", 
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                mb: 2,
                letterSpacing: "-0.5px"
              }}
            >
              Xác thực thành công!
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 5, 
                maxWidth: "85%", 
                mx: "auto", 
                lineHeight: 1.8,
                color: "#72716E"
              }}
            >
              Chúc mừng bạn! Email đã được kích hoạt thành công. 
              Giờ đây, hành trình trải nghiệm những không gian lưu trú tinh tế tại 
              <strong style={{ color: "#C2A56D" }}> Coffee Stay</strong> đã sẵn sàng dành cho bạn.
            </Typography>

            <Box 
              sx={{ 
                display: "flex", 
                gap: 2, 
                flexDirection: { xs: "column", sm: "row" },
                width: "100%" 
              }}
            >
              <Button
                fullWidth
                variant="outlined"
                startIcon={<HomeOutlinedIcon />}
                onClick={() => navigate("/")}
                sx={{
                  py: 1.8,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#EFE7DD",
                  color: "#1C1B19",
                  "&:hover": { 
                    borderColor: "#C2A56D",
                    bgcolor: "rgba(194, 165, 109, 0.05)" 
                  }
                }}
              >
                Về Trang chủ
              </Button>

              <Button
                fullWidth
                variant="contained"
                startIcon={<LoginIcon />}
                onClick={() => navigate("/login")}
                sx={{
                  py: 1.8,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#1C1B19", // Ebony
                  color: "#C2A56D",   // Gold
                  boxShadow: "0 10px 20px rgba(28,27,25,0.15)",
                  "&:hover": { 
                    bgcolor: "#333230",
                    transform: "translateY(-2px)" 
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Đăng nhập ngay
              </Button>
            </Box>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}