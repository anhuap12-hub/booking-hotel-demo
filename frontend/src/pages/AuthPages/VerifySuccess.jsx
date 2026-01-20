import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  Zoom 
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Icons
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import HomeIcon from "@mui/icons-material/Home";
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
        bgcolor: "#faf9f6", // Màu nền kem nhẹ của Coffee Stay
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
              borderRadius: 6,
              border: "1px solid #e7e5e4",
              boxShadow: "0 10px 40px rgba(0,0,0,0.04)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Success Icon với hiệu ứng xanh SM hoặc Gold tùy bạn chọn */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#ecfdf5",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <CheckCircleOutlineIcon 
                sx={{ fontSize: 50, color: "#10b981" }} 
              />
            </Box>

            <Typography 
              variant="h4" 
              fontWeight={800} 
              gutterBottom
              sx={{ color: "#1c1917", fontFamily: "Playfair Display, serif" }}
            >
              Xác thực thành công!
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 5, maxWidth: "80%", mx: "auto", lineHeight: 1.6 }}
            >
              🎉 Chúc mừng! Email của bạn đã được kích hoạt thành công. 
              Giờ đây bạn đã có thể tận hưởng toàn bộ dịch vụ tại Coffee Stay.
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
                startIcon={<HomeIcon />}
                onClick={() => navigate("/")}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#d4a373",
                  color: "#d4a373",
                  "&:hover": { borderColor: "#bc8a5f", bgcolor: "#faf9f6" }
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
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#3a342b",
                  color: "#fff",
                  "&:hover": { bgcolor: "#2a251f" }
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