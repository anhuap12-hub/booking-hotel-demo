import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container, Stack, CircularProgress, Fade } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { verifyEmail } from "../../api/auth.api";

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    let isMounted = true;
    const token = searchParams.get("token");

    if (!token) {
      setStatus("invalid");
      return;
    }

    const handleVerify = async () => {
      try {
        await verifyEmail(token);
        if (isMounted) {
          setStatus("success");
          setTimeout(() => {
            if (isMounted) navigate("/login", { replace: true });
          }, 4000);
        }
      } catch (err) {
        if (isMounted) setStatus("error");
      }
    };

    handleVerify();
    return () => { isMounted = false; };
  }, [navigate, searchParams]);

  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <Stack spacing={4} alignItems="center" key="loading" component={motion.div} exit={{ opacity: 0 }}>
            <Box sx={{ position: 'relative', display: 'inline-flex' }}>
              <CircularProgress size={80} thickness={1.5} sx={{ color: "#C2A56D" }} />
              <Box sx={{ inset: 0, position: 'absolute', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Typography variant="caption" component="div" color="text.secondary" sx={{ fontWeight: 700 }}>
                  GO
                </Typography>
              </Box>
            </Box>
            <Typography variant="body1" sx={{ color: "#72716E", letterSpacing: 3, fontSize: "0.75rem", fontWeight: 700 }}>
              ĐANG XÁC THỰC DANH TÍNH
            </Typography>
          </Stack>
        );

      case "success":
        return (
          <Stack spacing={4} alignItems="center" key="success" component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <Box sx={{ 
              bgcolor: "rgba(194, 165, 109, 0.1)", 
              p: 3, 
              borderRadius: "50%", 
              display: 'flex',
              color: "#C2A56D" 
            }}>
              <CheckCircleOutlineIcon sx={{ fontSize: 60 }} />
            </Box>
            <Box textAlign="center">
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: { xs: "1.8rem", md: "2.2rem" }, fontWeight: 800, mb: 1, color: "#1C1B19" }}>
                Xác thực thành công
              </Typography>
              <Typography sx={{ color: "#72716E", maxWidth: 350, mx: "auto", lineHeight: 1.8 }}>
                Tài khoản của bạn đã sẵn sàng. Coffee Stay đang đưa bạn đến không gian nghỉ dưỡng...
              </Typography>
            </Box>
            <Button 
              onClick={() => navigate("/login")}
              sx={{ color: "#C2A56D", fontWeight: 800, textTransform: "uppercase", letterSpacing: 1, fontSize: "0.8rem" }}
            >
              Chuyển hướng ngay
            </Button>
          </Stack>
        );

      default:
        return (
          <Stack spacing={4} alignItems="center" key="error" component={motion.div} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <ErrorOutlineIcon sx={{ fontSize: 70, color: "#EF4444", opacity: 0.8 }} />
            <Box textAlign="center">
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, mb: 1, color: "#1C1B19" }}>
                Giao dịch bị gián đoạn
              </Typography>
              <Typography sx={{ color: "#72716E", maxWidth: 320, mx: "auto", lineHeight: 1.8 }}>
                Mã xác thực không còn hiệu lực. Đừng lo lắng, bạn có thể yêu cầu mã mới trong trang đăng ký.
              </Typography>
            </Box>
            <Button 
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ 
                bgcolor: "#1C1B19", 
                color: "#C2A56D", 
                borderRadius: "12px", 
                px: 5, 
                py: 1.5,
                fontWeight: 700,
                boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                "&:hover": { bgcolor: "#000" }
              }}
            >
              Quay lại Trang chủ
            </Button>
          </Stack>
        );
    }
  };

  return (
    <Box sx={{ 
      minHeight: "100vh", 
      display: "flex", 
      alignItems: "center", 
      justifyContent: "center",
      bgcolor: "#FDFDFD", // Sáng hơn để tạo cảm giác sạch sẽ
      position: "relative",
      overflow: "hidden"
    }}>
      {/* Họa tiết nền chìm sang trọng */}
      <Box sx={{ 
        position: "absolute", 
        top: -100, 
        right: -100, 
        width: 300, 
        height: 300, 
        borderRadius: "50%", 
        bgcolor: "rgba(194, 165, 109, 0.03)" 
      }} />

      <Container maxWidth="sm" sx={{ position: "relative", zIndex: 1 }}>
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </Container>
    </Box>
  );
}