import {
  Card, CardContent, Typography, Box, Chip, Stack, Divider, Button
} from "@mui/material";
import { 
  Info, CheckCircle, AccessTime, CalendarToday, LocationOn
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function BookingCard({ booking, onCancel, onView }) {
  if (!booking || !booking.hotel) return null;

  const { hotel, room, status, paymentStatus, totalPrice } = booking;

  // 🎨 LOGIC MÀU SẮC TRẠNG THÁI
  const getPaymentBadge = (ps) => {
    const s = ps?.toUpperCase();
    return (s === 'PAID' || s === 'DEPOSITED') 
      ? { label: "Đã thanh toán", bgcolor: "#ecfdf5", color: "#10b981", icon: <CheckCircle sx={{ fontSize: 14 }} /> }
      : { label: "Chờ thanh toán", bgcolor: "#fff7ed", color: "#f59e0b", icon: <AccessTime sx={{ fontSize: 14 }} /> };
  };

  const getStatusInfo = (s) => {
    const st = s?.toLowerCase();
    if (st === 'confirmed') return { text: "Thành công", color: "#10b981", bg: "#f0fdf4" };
    if (st === 'cancelled') return { text: "Đã hủy", color: "#ef4444", bg: "#fef2f2" };
    return { text: "Đang xử lý", color: "#6366f1", bg: "#eef2ff" };
  };

  const payInfo = getPaymentBadge(paymentStatus);
  const statInfo = getStatusInfo(status);
  const image = room?.photos?.[0]?.url || hotel?.photos?.[0]?.url || "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg";

  return (
    <MotionCard 
      layout
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, boxShadow: "0 20px 25px -5px rgba(0,0,0,0.05)" }}
      sx={{ 
        mb: 3, 
        borderRadius: 6, 
        border: '1px solid #f1f0ee',
        bgcolor: '#fff',
        overflow: 'hidden'
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} alignItems="stretch">
          
          {/* ẢNH PHÒNG - Visual focus */}
          <Box sx={{ 
            width: { xs: "100%", md: 180 }, 
            height: { xs: 140, md: "auto" }, 
            borderRadius: 4, 
            overflow: "hidden", 
            flexShrink: 0,
            position: 'relative'
          }}>
            <img src={image} alt="room" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <Box sx={{ 
              position: 'absolute', top: 10, left: 10,
              bgcolor: statInfo.bg, color: statInfo.color,
              px: 1.5, py: 0.5, borderRadius: 2, fontSize: 10, fontWeight: 800,
              textTransform: 'uppercase', letterSpacing: 1
            }}>
              {statInfo.text}
            </Box>
          </Box>

          {/* NỘI DUNG - Tập trung rõ info */}
          <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
            <Box>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                <Box>
                  <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.15rem", fontWeight: 800, color: "#1c1b19" }}>
                    {hotel?.name}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "#72716e", display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <LocationOn sx={{ fontSize: 14 }} /> {room?.name}
                  </Typography>
                </Box>
                <Chip 
                  label={payInfo.label} 
                  icon={payInfo.icon}
                  sx={{ 
                    bgcolor: payInfo.bgcolor, color: payInfo.color, 
                    fontWeight: 700, fontSize: 11, borderRadius: 2,
                    "& .MuiChip-icon": { color: 'inherit' }
                  }} 
                />
              </Stack>

              <Stack direction="row" spacing={3} mt={2.5}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#a09f9c", textTransform: 'uppercase', fontWeight: 700, letterSpacing: 0.5 }}>Lịch trình</Typography>
                  <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
                    <CalendarToday sx={{ fontSize: 14, color: '#c2a56d' }} />
                    <Typography sx={{ fontSize: 13, fontWeight: 600, color: '#1c1b19' }}>
                      {new Date(booking.checkIn).toLocaleDateString("vi-VN")} - {new Date(booking.checkOut).toLocaleDateString("vi-VN")}
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 2, borderColor: '#f1f0ee' }} />

            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Box>
                <Typography variant="caption" sx={{ color: "#a09f9c", fontWeight: 600 }}>Tổng thanh toán</Typography>
                <Typography sx={{ fontSize: "1.25rem", fontWeight: 900, color: "#c2a56d" }}>
                  {totalPrice?.toLocaleString()}đ
                </Typography>
              </Box>

              <Stack direction="row" spacing={1.5}>
                <Button 
                  onClick={() => onView?.(booking)}
                  sx={{ 
                    color: "#72716e", textTransform: 'none', fontWeight: 700, fontSize: 13,
                    px: 2, "&:hover": { color: "#1c1b19", bgcolor: 'transparent' }
                  }}
                >
                  Chi tiết
                </Button>
                {status?.toLowerCase() !== 'cancelled' && (
                  <Button 
                    variant="contained" 
                    disableElevation
                    onClick={() => onCancel?.(booking)}
                    sx={{ 
                      borderRadius: 3, textTransform: 'none', fontWeight: 700, 
                      bgcolor: '#fff', color: '#ef4444', border: '1px solid #fee2e2',
                      px: 3, "&:hover": { bgcolor: '#fef2f2', borderColor: '#ef4444' } 
                    }}
                  >
                    Hủy phòng
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </MotionCard>
  );
}