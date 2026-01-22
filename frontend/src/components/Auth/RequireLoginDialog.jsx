import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";

// Tạo các bản Motion của MUI Components để dùng xuyên suốt
const MotionBox = motion(Box);
const MotionStack = motion(Stack);

// Component bọc Paper của Dialog để xử lý hiệu ứng nảy (Spring)
const MotionPaper = (props) => (
  <MotionBox
    initial={{ opacity: 0, scale: 0.9, y: 30 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.9, y: 30 }}
    transition={{ 
      type: "spring", 
      stiffness: 260, 
      damping: 20 
    }}
    sx={{ display: "flex", justifyContent: "center", width: '100%' }}
  >
    <Box {...props} />
  </MotionBox>
);

export default function RequireLoginDialog({ open, onClose, onLogin }) {
  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="xs"
          fullWidth
          // Làm mờ nền phía sau (Glassmorphism)
          BackdropProps={{
            sx: {
              backdropFilter: "blur(12px)",
              backgroundColor: "rgba(28, 27, 25, 0.6)",
            },
          }}
          PaperComponent={MotionPaper}
          PaperProps={{
            sx: {
              borderRadius: 8, // Bo góc lớn kiểu Modern App
              bgcolor: "#fff",
              backgroundImage: "none",
              overflow: "hidden",
              boxShadow: "0 32px 64px -12px rgba(0, 0, 0, 0.2)",
              mx: 2 // Đảm bảo không dính mép trên mobile
            },
          }}
        >
          <DialogContent sx={{ pt: 6, pb: 3 }}>
            <MotionStack spacing={4} alignItems="center" textAlign="center">
              
              {/* ICON CAFE NHẢY TỰ ĐỘNG */}
              <MotionBox
                animate={{ 
                  y: [0, -12, 0],
                  rotate: [0, 5, -5, 0]
                }}
                transition={{ 
                  duration: 4, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                sx={{
                  width: 80,
                  height: 80,
                  borderRadius: "28px",
                  bgcolor: "#F9F7F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 36,
                  border: "1px solid #F1EDE7",
                  boxShadow: "0 12px 24px rgba(0,0,0,0.04)",
                }}
              >
                ☕
              </MotionBox>

              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: { xs: "1.5rem", md: "1.75rem" },
                    fontWeight: 800,
                    color: "#1C1B19",
                    mb: 1.5,
                    lineHeight: 1.2
                  }}
                >
                  Đã đến lúc <br /> nghỉ ngơi
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#72716E",
                    lineHeight: 1.7,
                    maxWidth: "280px",
                    mx: "auto",
                    fontSize: "0.9rem"
                  }}
                >
                  Hãy đăng nhập để lưu lại những chỗ nghỉ tuyệt vời và nhận ưu đãi riêng cho bạn.
                </Typography>
              </Box>
            </MotionStack>
          </DialogContent>

          <DialogActions sx={{ flexDirection: "column", gap: 1, px: 4, pb: 6, pt: 1 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={onLogin}
              sx={{
                borderRadius: 4,
                bgcolor: "#C2A56D",
                color: "#fff",
                fontWeight: 700,
                py: 1.8,
                fontSize: "0.95rem",
                textTransform: "none",
                boxShadow: "0 8px 24px rgba(194, 165, 109, 0.25)",
                "&:hover": {
                  bgcolor: "#B0945D",
                  boxShadow: "0 12px 32px rgba(194, 165, 109, 0.35)",
                },
                transition: "all 0.2s ease-in-out",
              }}
            >
              Đăng nhập ngay
            </Button>

            <Button
              fullWidth
              onClick={onClose}
              sx={{
                color: "#9A9996",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.85rem",
                "&:hover": {
                  color: "#1C1B19",
                  bgcolor: "transparent",
                },
              }}
            >
              Để sau, tôi muốn xem thêm
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}