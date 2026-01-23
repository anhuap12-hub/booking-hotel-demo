import React from "react";
import {
  Card, CardContent, Typography, Box, Chip, Stack, Button, useTheme, useMediaQuery
} from "@mui/material";
import { 
  CalendarToday, Hotel, ChevronRight
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionCard = motion(Card);

export default function BookingCard({ booking, onView }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!booking) return null;

  const { status, paymentStatus, totalPrice, expireAt, roomSnapshot, room } = booking;
  
  const isExpired = status === 'pending' && 
                    paymentStatus === 'UNPAID' && 
                    expireAt && new Date(expireAt) < new Date();

  // 1. Badge thanh toán (Giữ nguyên map cũ nhưng thêm fallback an toàn)
  const getPaymentBadge = (ps) => {
    const s = ps?.toUpperCase();
    const map = {
      'PAID': { label: "Đã thanh toán", color: "#10b981", bgcolor: "rgba(16, 185, 129, 0.1)" },
      'DEPOSITED': { label: "Đã cọc 30%", color: "#0288d1", bgcolor: "rgba(2, 136, 209, 0.1)" },
      'REFUND_PENDING': { label: "Chờ hoàn tiền", color: "#f57c00", bgcolor: "rgba(245, 124, 0, 0.1)" },
      'REFUNDED': { label: "Đã hoàn trả", color: "#7b1fa2", bgcolor: "rgba(123, 31, 162, 0.1)" }
    };
    return map[s] || { label: "Chờ cọc", color: "#C2A56D", bgcolor: "rgba(194, 165, 109, 0.1)" };
  };

  const payInfo = getPaymentBadge(paymentStatus);

  // 2. LOGIC FIX: Tag trạng thái chính (Ưu tiên hiển thị Cọc)
  const getStatusTag = () => {
    if (isExpired) return { text: "Hết hạn", bg: "#ef4444" };
    if (paymentStatus === 'REFUNDED') return { text: "Đã kết thúc", bg: "#7b1fa2" };
    if (status === 'cancelled') return { text: "Đã hủy", bg: "#94a3b8" };
    
    // Nếu khách mới cọc 30%, hiện màu xanh dương để phân biệt với "Thành công" (đã trả hết)
    if (paymentStatus === 'DEPOSITED') return { text: "Đã đặt cọc", bg: "#0288d1" };
    
    // Chỉ hiện "Thành công" khi trạng thái là confirmed VÀ đã trả đủ tiền (PAID)
    if (status === 'confirmed' && paymentStatus === 'PAID') return { text: "Thành công", bg: "#1C1B19" };
    
    return { text: "Sắp tới", bg: "#C2A56D" };
  };

  const tagInfo = getStatusTag();

  return (
    <MotionCard 
      layout
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      sx={{ 
        mb: 3, borderRadius: "20px", border: '1px solid #EAE9E2',
        bgcolor: '#fff', position: 'relative', overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 2 : 3}>
          
          <Box sx={{ 
            width: isMobile ? "100%" : 160, 
            height: isMobile ? 180 : 160, 
            borderRadius: "16px", overflow: "hidden", flexShrink: 0, position: 'relative'
          }}>
            <img 
              src={roomSnapshot?.image || room?.photos?.[0]?.url || "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"} 
              alt="room" 
              style={{ width: "100%", height: "100%", objectFit: "cover" }} 
            />
            <Box sx={{ 
              position: 'absolute', top: 12, left: 12, bgcolor: tagInfo.bg, color: "#fff",
              px: 1.2, py: 0.4, borderRadius: "6px", fontSize: 9, fontWeight: 900, textTransform: 'uppercase',
              boxShadow: '0 4px 10px rgba(0,0,0,0.2)'
            }}>
              {tagInfo.text}
            </Box>
          </Box>

          <Box flex={1} display="flex" flexDirection="column">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
              <Box sx={{ maxWidth: '70%' }}>
                <Typography sx={{ 
                  fontSize: isMobile ? "1.1rem" : "1.25rem", fontWeight: 800, 
                  color: "#1C1B19", fontFamily: "'Playfair Display', serif",
                  lineHeight: 1.2, mb: 0.5
                }}>
                  {roomSnapshot?.hotelName || "Hotel Name"}
                </Typography>
                <Typography variant="caption" sx={{ color: "#72716E", fontWeight: 600, display: 'flex', alignItems: 'center' }}>
                  <Hotel sx={{ fontSize: 14, mr: 0.5, color: '#C2A56D' }} /> {roomSnapshot?.name || "Room Type"}
                </Typography>
              </Box>
              <Chip label={payInfo.label} size="small" sx={{ bgcolor: payInfo.bgcolor, color: payInfo.color, fontWeight: 800, fontSize: 9 }} />
            </Stack>

            <Box sx={{ bgcolor: "#F9F8F6", p: 1.5, borderRadius: "12px", my: isMobile ? 1.5 : 2 }}>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <CalendarToday sx={{ fontSize: 14, color: '#C2A56D' }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1C1B19' }}>
                  {new Date(booking.checkIn).toLocaleDateString("vi-VN")} - {new Date(booking.checkOut).toLocaleDateString("vi-VN")}
                </Typography>
              </Stack>
            </Box>

            <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems={isMobile ? "stretch" : "center"} spacing={2} mt="auto">
              <Box>
                <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 700, textTransform: "uppercase", fontSize: 9 }}>Tổng thanh toán</Typography>
                <Typography sx={{ fontSize: "1.3rem", fontWeight: 900, color: "#1C1B19", lineHeight: 1 }}>
                  {Number(totalPrice || 0).toLocaleString("vi-VN")} <span style={{ fontSize: 12, fontWeight: 700 }}>VND</span>
                </Typography>
              </Box>

              <Stack direction="row" spacing={1}>
                {paymentStatus === 'UNPAID' && !isExpired && (
                  <Button 
                    variant="contained" fullWidth={isMobile}
                    onClick={() => {
                      const roomId = room?._id || room || roomSnapshot?._id;
                      navigate(`/checkout/${roomId}`, { state: booking });
                    }}
                    sx={{ bgcolor: "#C2A56D", color: "#fff", borderRadius: "10px", fontWeight: 700, textTransform: 'none', px: 3 }}
                  >
                    Thanh toán
                  </Button>
                )}
                <Button 
                  variant="contained" fullWidth={isMobile}
                  onClick={() => onView(booking)}
                  endIcon={!isMobile && <ChevronRight />}
                  sx={{ 
                    bgcolor: "#1C1B19", color: "#C2A56D", borderRadius: "10px", 
                    fontWeight: 700, textTransform: 'none', px: 3, whiteSpace: 'nowrap'
                  }}
                >
                  Chi tiết
                </Button>
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </MotionCard>
  );
}