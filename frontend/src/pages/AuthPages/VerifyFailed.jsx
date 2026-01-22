import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  Zoom,
  Stack,
  Avatar
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Icons
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";

export default function VerifyFailed() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#F9F8F6", // Nền kem đồng bộ hệ thống
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Zoom in={true} style={{ transitionDelay: '200ms' }}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: "center",
              borderRadius: "32px",
              border: "1px solid rgba(194, 165, 109, 0.2)", // Viền Gold mảnh
              boxShadow: "0 20px 60px rgba(28,27,25,0.06)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              bgcolor: "#FFF"
            }}
          >
            {/* Error Icon - Tinh chỉnh màu đỏ đất sang trọng */}
            <Avatar
              sx={{
                width: 80,
                height: 80,
                bgcolor: "rgba(239, 68, 68, 0.08)",
                mb: 3,
                border: "1px solid rgba(239, 68, 68, 0.2)"
              }}
            >
              <ErrorOutlineIcon 
                sx={{ fontSize: 45, color: "#ef4444" }} 
              />
            </Avatar>

            <Typography 
              variant="h4" 
              sx={{ 
                color: "#1C1B19", 
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                mb: 2
              }}
            >
              Liên kết hết hiệu lực
            </Typography>

            <Typography 
              variant="body1" 
              sx={{ 
                mb: 4, 
                maxWidth: "90%", 
                mx: "auto", 
                lineHeight: 1.8,
                color: "#72716E" 
              }}
            >
              Rất tiếc, đường dẫn xác thực của bạn không hợp lệ hoặc đã hết hạn. 
              Vui lòng yêu cầu một mã mới để hoàn tất việc đăng ký tài khoản tại <strong style={{color: "#1C1B19"}}>Coffee Stay</strong>.
            </Typography>

            <Stack spacing={2} sx={{ width: "100%" }}>
              {/* Nút chính - Ebony & Gold */}
              <Button
                fullWidth
                variant="contained"
                startIcon={<ReplayIcon />}
                onClick={() => navigate("/resend-verify")}
                sx={{
                  py: 1.8,
                  borderRadius: "12px",
                  textTransform: "none",
                  fontWeight: 700,
                  bgcolor: "#1C1B19",
                  color: "#C2A56D",
                  boxShadow: "0 10px 20px rgba(28,27,25,0.15)",
                  "&:hover": { 
                    bgcolor: "#333230",
                    transform: "translateY(-1px)" 
                  },
                  transition: "all 0.3s ease"
                }}
              >
                Gửi lại email xác thực
              </Button>

              {/* Nút phụ - Outlined nhã nhặn */}
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
                Quay về trang chủ
              </Button>
            </Stack>

            <Typography variant="caption" sx={{ mt: 4, color: "#A8A7A1" }}>
              Cần hỗ trợ ngay? Hãy gửi mail tới <strong style={{color: "#C2A56D"}}>support@coffeestay.com</strong>
            </Typography>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}