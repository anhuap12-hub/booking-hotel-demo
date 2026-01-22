import React, { forwardRef } from "react";
import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { motion, AnimatePresence } from "framer-motion";
import CoffeeIcon from '@mui/icons-material/LocalCafe';

// Tối ưu Motion Paper để tránh lỗi Ref và Render
const MotionPaper = forwardRef((props, ref) => (
  <Box
    ref={ref}
    component={motion.div}
    initial={{ opacity: 0, scale: 0.95, y: 20 }}
    animate={{ opacity: 1, scale: 1, y: 0 }}
    exit={{ opacity: 0, scale: 0.95, y: 20 }}
    transition={{ type: "spring", damping: 25, stiffness: 300 }}
    {...props}
  />
));

export default function RequireLoginDialog({ open, onClose, onLogin }) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  return (
    <AnimatePresence>
      {open && (
        <Dialog
          open={open}
          onClose={onClose}
          maxWidth="xs"
          scroll="body"
          // Chống hiện tượng "giật" màn hình khi mở dialog
          disableScrollLock={false}
          BackdropProps={{
            sx: {
              backdropFilter: "blur(8px)",
              backgroundColor: "rgba(28, 27, 25, 0.7)",
            },
          }}
          PaperComponent={MotionPaper}
          PaperProps={{
            sx: {
              borderRadius: isMobile ? "24px" : "32px",
              bgcolor: "#fff",
              backgroundImage: "none",
              overflow: "hidden",
              boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
              m: 2, // Đảm bảo an toàn trên mobile
            },
          }}
        >
          <DialogContent sx={{ pt: 5, pb: 2, px: { xs: 3, md: 5 } }}>
            <Stack spacing={3} alignItems="center" textAlign="center">
              
              {/* ICON CAFE SANG TRỌNG */}
              <Box
                component={motion.div}
                animate={{ 
                  y: [0, -8, 0],
                }}
                transition={{ 
                  duration: 3, 
                  repeat: Infinity, 
                  ease: "easeInOut" 
                }}
                sx={{
                  width: 70,
                  height: 70,
                  borderRadius: "20px",
                  bgcolor: "#F9F7F2",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  border: "1px solid rgba(194, 165, 109, 0.3)",
                  color: "#C2A56D",
                  boxShadow: "0 10px 20px rgba(194, 165, 109, 0.1)",
                }}
              >
                <CoffeeIcon sx={{ fontSize: 32 }} />
              </Box>

              <Box>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontSize: { xs: "1.4rem", md: "1.6rem" },
                    fontWeight: 800,
                    color: "#1C1B19",
                    mb: 1,
                    lineHeight: 1.3
                  }}
                >
                  Lời mời từ <br /> Coffee Stay
                </Typography>
                <Typography
                  variant="body2"
                  sx={{
                    color: "#72716E",
                    lineHeight: 1.6,
                    fontSize: "0.9rem",
                    px: 1
                  }}
                >
                  Đăng nhập để nhận đặc quyền thành viên và lưu giữ những hành trình đầy cảm hứng của riêng bạn.
                </Typography>
              </Box>
            </Stack>
          </DialogContent>

          <DialogActions sx={{ flexDirection: "column", gap: 1.5, px: { xs: 3, md: 5 }, pb: 5 }}>
            <Button
              fullWidth
              variant="contained"
              onClick={onLogin}
              sx={{
                borderRadius: "14px",
                bgcolor: "#1C1B19",
                color: "#C2A56D",
                fontWeight: 700,
                py: 1.8,
                fontSize: "0.9rem",
                textTransform: "none",
                "&:hover": {
                  bgcolor: "#C2A56D",
                  color: "#1C1B19",
                },
                transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
            >
              Đăng nhập ngay
            </Button>

            <Button
              fullWidth
              onClick={onClose}
              sx={{
                color: "#A8A7A1",
                textTransform: "none",
                fontWeight: 600,
                fontSize: "0.8rem",
                "&:hover": {
                  color: "#1C1B19",
                  bgcolor: "transparent",
                  textDecoration: "underline"
                },
              }}
            >
              Khám phá thêm một lát nữa
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </AnimatePresence>
  );
}