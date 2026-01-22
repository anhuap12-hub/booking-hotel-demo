import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { Box, Typography, Button, Container, Stack, CircularProgress } from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import { verifyEmail } from "../../api/auth.api";

const MotionBox = motion(Box);
const MotionStack = motion(Stack);

export default function VerifyEmail() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState("loading");

  useEffect(() => {
    const token = searchParams.get("token");
    if (!token) {
      setStatus("invalid");
      return;
    }

    let timer;
    // Lưu ý: Sửa lại cách gọi API cho đúng chuẩn (giả sử verifyEmail nhận token trực tiếp)
    verifyEmail(token)
      .then(() => {
        setStatus("success");
        timer = setTimeout(() => {
          navigate("/login", { replace: true });
        }, 3500);
      })
      .catch(() => {
        setStatus("error");
      });

    return () => timer && clearTimeout(timer);
  }, [navigate, searchParams]);

  // Cấu hình giao diện dựa trên trạng thái
  const renderContent = () => {
    switch (status) {
      case "loading":
        return (
          <MotionStack spacing={3} alignItems="center" key="loading">
            <CircularProgress sx={{ color: "#C2A56D" }} size={50} thickness={2} />
            <Typography variant="body1" sx={{ color: "#72716E", letterSpacing: 1 }}>
              ĐANG XÁC THỰC TÀI KHOẢN...
            </Typography>
          </MotionStack>
        );

      case "success":
        return (
          <MotionStack spacing={3} alignItems="center" key="success"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
          >
            <MotionBox
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 0.5 }}
              sx={{ color: "#C2A56D" }}
            >
              <CheckCircleOutlineIcon sx={{ fontSize: 80 }} />
            </MotionBox>
            <Box textAlign="center">
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "2rem", fontWeight: 800, mb: 1 }}>
                Xác thực thành công
              </Typography>
              <Typography sx={{ color: "#72716E", mb: 4 }}>
                Chào mừng bạn đến với Coffee Stay. Hệ thống đang chuyển hướng bạn về trang đăng nhập...
              </Typography>
            </Box>
            <Button 
              onClick={() => navigate("/login")}
              sx={{ color: "#C2A56D", fontWeight: 700, textTransform: "none" }}
            >
              Chuyển hướng ngay
            </Button>
          </MotionStack>
        );

      default:
        return (
          <MotionStack spacing={3} alignItems="center" key="error"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <ErrorOutlineIcon sx={{ fontSize: 80, color: "#EF4444" }} />
            <Box textAlign="center">
              <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.8rem", fontWeight: 800, mb: 1 }}>
                Xác thực thất bại
              </Typography>
              <Typography sx={{ color: "#72716E", mb: 4 }}>
                Mã xác nhận không hợp lệ hoặc đã hết hạn. Vui lòng kiểm tra lại email của bạn.
              </Typography>
            </Box>
            <Button 
              variant="contained"
              onClick={() => navigate("/")}
              sx={{ 
                bgcolor: "#1C1B19", 
                color: "#fff", 
                borderRadius: 99, 
                px: 4, 
                py: 1.2,
                "&:hover": { bgcolor: "#333" }
              }}
            >
              Quay lại trang chủ
            </Button>
          </MotionStack>
        );
    }
  };

  return (
    <Box 
      sx={{ 
        minHeight: "100vh", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "center",
        bgcolor: "#F9F7F2", // Màu nền nhẹ đặc trưng của boutique hotel
        px: 2
      }}
    >
      <Container maxWidth="sm">
        <AnimatePresence mode="wait">
          {renderContent()}
        </AnimatePresence>
      </Container>
    </Box>
  );
}