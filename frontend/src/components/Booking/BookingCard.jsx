import React from "react";
import {
  Card, CardContent, Typography, Box, Chip, Stack, Button, useTheme, useMediaQuery
} from "@mui/material";
import { 
  CalendarToday, Hotel, ChevronRight, PaymentsOutlined
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

const MotionCard = motion(Card);

export default function BookingCard({ booking, onView }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  if (!booking) return null;

  const { status, paymentStatus, totalPrice, depositAmount, expireAt, roomSnapshot, room } = booking;
  
  // Kiểm tra hết hạn (An toàn hơn với fallback)
  const isExpired = status === 'pending' && 
                    paymentStatus === 'UNPAID' && 
                    expireAt && new Date(expireAt) < new Date();

  // 1. Badge Thanh toán (Tăng tính trực quan)
  const getPaymentBadge = (ps) => {
    const s = ps?.toUpperCase();
    const map = {
      'PAID': { label: "Đã trả đủ", color: "#10b981", bgcolor: "rgba(16, 185, 129, 0.1)" },
      'DEPOSITED': { label: "Đã cọc 30%", color: "#0288d1", bgcolor: "rgba(2, 136, 209, 0.1)" },
      'REFUND_PENDING': { label: "Chờ hoàn tiền", color: "#f57c00", bgcolor: "rgba(245, 124, 0, 0.1)" },
      'REFUNDED': { label: "Đã hoàn tiền", color: "#7b1fa2", bgcolor: "rgba(123, 31, 162, 0.1)" }
    };
    return map[s] || { label: "Chưa thanh toán", color: "#C2A56D", bgcolor: "rgba(194, 165, 109, 0.1)" };
  };

  const payInfo = getPaymentBadge(paymentStatus);

  // 2. Status Tag (Logic phân cấp rõ ràng)
  const getStatusTag = () => {
    if (status === 'cancelled' || isExpired) return { text: "Đã hủy/Hết hạn", bg: "#ef4444" };
    if (paymentStatus === 'REFUNDED') return { text: "Đã hoàn tiền", bg: "#7b1fa2" };
    if (paymentStatus === 'DEPOSITED') return { text: "Đã giữ chỗ", bg: "#0288d1" };
    if (status === 'confirmed' && paymentStatus === 'PAID') return { text: "Thành công", bg: "#1C1B19" };
    return { text: "Chờ xử lý", bg: "#C2A56D" };
  };

  const tagInfo = getStatusTag();

  return (
    <MotionCard 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      sx={{ 
        mb: 3, borderRadius: "20px", border: '1px solid #EAE9E2',
        bgcolor: '#fff', position: 'relative', overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
      }}
    >
      <CardContent sx={{ p: isMobile ? 2 : 3 }}>
        <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 2 : 3}>
          
          {/* Ảnh và Tag */}
          <Box sx={{ 
            width: isMobile ? "100%" : 180, 
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
              px: 1.2, py: 0.4, borderRadius: "6px", fontSize: 10, fontWeight: 800, textTransform: 'uppercase',
            }}>
              {tagInfo.text}
            </Box>
          </Box>

          <Box flex={1} display="flex" flexDirection="column">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
              <Box>
                <Typography sx={{ 
                  fontSize: isMobile ? "1.1rem" : "1.25rem", fontWeight: 800, 
                  color: "#1C1B19", fontFamily: "'Playfair Display', serif", mb: 0.5
                }}>
                  {roomSnapshot?.hotelName || "Luxstay Hotel"}
                </Typography>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Hotel sx={{ fontSize: 14, color: '#C2A56D' }} />
                  <Typography variant="caption" sx={{ color: "#72716E", fontWeight: 600 }}>
                    {roomSnapshot?.name || "Premium Suite"}
                  </Typography>
                </Stack>
              </Box>
              <Chip label={payInfo.label} size="small" sx={{ bgcolor: payInfo.bgcolor, color: payInfo.color, fontWeight: 800, fontSize: 10 }} />
            </Stack>

            {/* Thông tin ngày tháng */}
            <Box sx={{ bgcolor: "#F9F8F6", p: 1.5, borderRadius: "12px", my: 1.5 }}>
              <Stack direction="row" spacing={2} alignItems="center">
                <CalendarToday sx={{ fontSize: 14, color: '#C2A56D' }} />
                <Typography sx={{ fontSize: 13, fontWeight: 700, color: '#1C1B19' }}>
                  {new Date(booking.checkIn).toLocaleDateString("vi-VN")} — {new Date(booking.checkOut).toLocaleDateString("vi-VN")}
                </Typography>
              </Stack>
            </Box>

            {/* Footer: Giá và Nút bấm */}
            <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems={isMobile ? "stretch" : "flex-end"} spacing={2}>
              <Box>
                <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 700, textTransform: "uppercase", fontSize: 10 }}>
                  {paymentStatus === 'DEPOSITED' ? 'Tổng tiền (Đã cọc 30%)' : 'Tổng giá trị'}
                </Typography>
                <Typography sx={{ fontSize: "1.4rem", fontWeight: 900, color: "#1C1B19", lineHeight: 1 }}>
                  {Number(totalPrice || 0).toLocaleString("vi-VN")} <span style={{ fontSize: 12 }}>VND</span>
                </Typography>
                {paymentStatus === 'DEPOSITED' && (
                  <Typography variant="caption" sx={{ color: "#0288d1", fontWeight: 600 }}>
                    Cần trả thêm: {(totalPrice - depositAmount).toLocaleString("vi-VN")} VND
                  </Typography>
                )}
              </Box>

              <Stack direction="row" spacing={1}>
                {paymentStatus === 'UNPAID' && !isExpired && status !== 'cancelled' && (
                  <Button 
                    variant="contained"
                    onClick={() => {
                      const roomId = room?._id || room || roomSnapshot?._id;
                      // Truyền toàn bộ booking state để Checkout có dữ liệu ngay
                      navigate(`/checkout/${roomId}`, { 
                        state: { 
                          ...booking,
                          roomName: roomSnapshot?.name,
                          hotelName: roomSnapshot?.hotelName
                        } 
                      });
                    }}
                    sx={{ bgcolor: "#C2A56D", color: "#fff", borderRadius: "10px", fontWeight: 700, textTransform: 'none', px: 2 }}
                  >
                    Thanh toán ngay
                  </Button>
                )}
                <Button 
                  variant="outlined"
                  onClick={() => onView(booking)}
                  sx={{ 
                    borderColor: "#1C1B19", color: "#1C1B19", borderRadius: "10px", 
                    fontWeight: 700, textTransform: 'none', px: 2,
                    '&:hover': { borderColor: "#C2A56D", color: "#C2A56D" }
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