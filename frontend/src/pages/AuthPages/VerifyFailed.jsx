import React from "react";
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Container, 
  Zoom,
  Stack
} from "@mui/material";
import { useNavigate } from "react-router-dom";

// Icons
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import ReplayIcon from "@mui/icons-material/Replay";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";

export default function VerifyFailed() {
  const navigate = useNavigate();

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        bgcolor: "#fffafb", // Nền hơi ánh đỏ cực nhẹ cho lỗi
        px: 2,
      }}
    >
      <Container maxWidth="sm">
        <Zoom in={true}>
          <Paper
            elevation={0}
            sx={{
              p: { xs: 4, md: 6 },
              textAlign: "center",
              borderRadius: 6,
              border: "1px solid #fee2e2",
              boxShadow: "0 10px 40px rgba(220, 38, 38, 0.03)",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            {/* Error Icon */}
            <Box
              sx={{
                width: 80,
                height: 80,
                borderRadius: "50%",
                bgcolor: "#fef2f2",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mb: 3,
              }}
            >
              <ErrorOutlineIcon 
                sx={{ fontSize: 50, color: "#ef4444" }} 
              />
            </Box>

            <Typography 
              variant="h4" 
              fontWeight={800} 
              gutterBottom
              sx={{ color: "#1c1917", fontFamily: "Playfair Display, serif" }}
            >
              Xác thực thất bại
            </Typography>

            <Typography 
              variant="body1" 
              color="text.secondary" 
              sx={{ mb: 4, maxWidth: "90%", mx: "auto", lineHeight: 1.6 }}
            >
              Rất tiếc, đường dẫn xác thực của bạn không hợp lệ hoặc đã hết hạn sử dụng. 
              Vui lòng kiểm tra lại email hoặc yêu cầu gửi lại mã mới.
            </Typography>

            <Stack spacing={2} sx={{ width: "100%" }}>
              <Button
                fullWidth
                variant="contained"
                startIcon={<ReplayIcon />}
                onClick={() => navigate("/resend-verify")}
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
                Gửi lại email xác thực
              </Button>

              <Button
                fullWidth
                variant="outlined"
                startIcon={<SupportAgentIcon />}
                onClick={() => navigate("/")}
                sx={{
                  py: 1.5,
                  borderRadius: 3,
                  textTransform: "none",
                  fontWeight: 700,
                  borderColor: "#e7e5e4",
                  color: "text.primary",
                  "&:hover": { bgcolor: "#f5f5f4", borderColor: "#d6d3d1" }
                }}
              >
                Quay về trang chủ
              </Button>
            </Stack>

            <Typography variant="caption" color="text.secondary" sx={{ mt: 4 }}>
              Bạn gặp khó khăn? Liên hệ <strong>support@coffeestay.com</strong>
            </Typography>
          </Paper>
        </Zoom>
      </Container>
    </Box>
  );
}