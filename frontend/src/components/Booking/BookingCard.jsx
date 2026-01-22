import {
  Card, CardContent, Typography, Box, Chip, Stack, Divider, Button
} from "@mui/material";
import { 
  CheckCircle, AccessTime, CalendarToday, LocationOn, ChevronRight
} from "@mui/icons-material";
import { motion } from "framer-motion";

const MotionCard = motion(Card);

export default function BookingCard({ booking, onCancel, onView }) {
  if (!booking || !booking.hotel) return null;

  const { hotel, room, status, paymentStatus, totalPrice } = booking;

  // 🎨 RE-DESIGNED LOGIC MÀU SẮC (LUXURY TONES)
  const getPaymentBadge = (ps) => {
    const s = ps?.toUpperCase();
    return (s === 'PAID' || s === 'DEPOSITED') 
      ? { label: "Đã quyết toán", color: "#10b981", bgcolor: "rgba(16, 185, 129, 0.08)" }
      : { label: "Chờ thanh toán", color: "#C2A56D", bgcolor: "rgba(194, 165, 109, 0.1)" };
  };

  const getStatusInfo = (s) => {
    const st = s?.toLowerCase();
    if (st === 'confirmed') return { text: "Xác nhận", color: "#fff", bg: "#1C1B19" };
    if (st === 'cancelled') return { text: "Đã hủy", color: "#999", bg: "#f5f5f5" };
    return { text: "Đang xử lý", color: "#1C1B19", bg: "#C2A56D" };
  };

  const payInfo = getPaymentBadge(paymentStatus);
  const statInfo = getStatusInfo(status);
  const image = room?.photos?.[0]?.url || hotel?.photos?.[0]?.url || "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg";

  return (
    <MotionCard 
      layout
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -5, boxShadow: "0 20px 40px rgba(0,0,0,0.08)" }}
      sx={{ 
        mb: 2.5, 
        borderRadius: "20px", 
        border: '1px solid rgba(194, 165, 109, 0.15)',
        bgcolor: '#fff',
        overflow: 'hidden',
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)"
      }}
    >
      <CardContent sx={{ p: { xs: 2.5, md: 3 } }}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
          
          {/* ẢNH PHÒNG - Tỷ lệ 1:1 hoặc 4:3 cho chuyên nghiệp */}
          <Box sx={{ 
            width: { xs: "100%", md: 160 }, 
            height: 160, 
            borderRadius: "16px", 
            overflow: "hidden", 
            flexShrink: 0,
            position: 'relative',
            boxShadow: "0 8px 16px rgba(0,0,0,0.05)"
          }}>
            <img src={image} alt="room" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            <Box sx={{ 
              position: 'absolute', bottom: 0, left: 0, right: 0,
              bgcolor: statInfo.bg, color: statInfo.color,
              py: 0.8, textAlign: 'center', fontSize: 10, fontWeight: 900,
              textTransform: 'uppercase', letterSpacing: 1.5,
              backdropFilter: "blur(4px)"
            }}>
              {statInfo.text}
            </Box>
          </Box>

          {/* NỘI DUNG */}
          <Box flex={1} display="flex" flexDirection="column">
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
              <Box>
                <Typography sx={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontSize: "1.3rem", 
                  fontWeight: 800, 
                  color: "#1C1B19",
                  lineHeight: 1.2
                }}>
                  {hotel?.name}
                </Typography>
                <Typography variant="body2" sx={{ color: "#A8A7A1", display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5, fontWeight: 500 }}>
                  <LocationOn sx={{ fontSize: 16, color: "#C2A56D" }} /> {room?.name}
                </Typography>
              </Box>
              <Chip 
                label={payInfo.label} 
                sx={{ 
                  bgcolor: payInfo.bgcolor, 
                  color: payInfo.color, 
                  fontWeight: 800, 
                  fontSize: 10, 
                  borderRadius: "8px",
                  height: 28,
                  textTransform: "uppercase",
                  letterSpacing: 0.5
                }} 
              />
            </Stack>

            <Stack direction="row" spacing={4} mt={3}>
              <Box>
                <Typography sx={{ color: "#BCBBB9", textTransform: 'uppercase', fontWeight: 700, fontSize: 10, letterSpacing: 1, mb: 0.5 }}>Lịch trình</Typography>
                <Stack direction="row" spacing={1} alignItems="center">
                  <CalendarToday sx={{ fontSize: 14, color: '#C2A56D' }} />
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: '#1C1B19' }}>
                    {new Date(booking.checkIn).toLocaleDateString("vi-VN")}
                    <Box component="span" sx={{ mx: 1, color: "#C2A56D" }}>→</Box>
                    {new Date(booking.checkOut).toLocaleDateString("vi-VN")}
                  </Typography>
                </Stack>
              </Box>
            </Stack>

            <Box sx={{ mt: 'auto', pt: 2 }}>
              <Divider sx={{ mb: 2, borderStyle: 'dashed', borderColor: 'rgba(194, 165, 109, 0.2)' }} />
              
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography sx={{ color: "#BCBBB9", fontWeight: 700, fontSize: 10, textTransform: "uppercase" }}>Giá trị kỳ nghỉ</Typography>
                  <Typography sx={{ fontSize: "1.4rem", fontWeight: 900, color: "#1C1B19" }}>
                    {totalPrice?.toLocaleString()}<Typography component="span" sx={{ fontSize: 14, fontWeight: 700, ml: 0.5 }}>VND</Typography>
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  <Button 
                    variant="text"
                    onClick={() => onView?.(booking)}
                    endIcon={<ChevronRight />}
                    sx={{ 
                      color: "#1C1B19", textTransform: 'none', fontWeight: 800, fontSize: 13,
                      "&:hover": { bgcolor: 'transparent', color: "#C2A56D" }
                    }}
                  >
                    Xem chi tiết
                  </Button>
                  
                  {status?.toLowerCase() !== 'cancelled' && (
                    <Button 
                      variant="outlined"
                      onClick={() => onCancel?.(booking)}
                      sx={{ 
                        borderRadius: "12px", textTransform: 'none', fontWeight: 700, fontSize: 13,
                        borderColor: 'rgba(239, 68, 68, 0.3)', color: '#EF4444',
                        px: 3, 
                        "&:hover": { bgcolor: '#FEF2F2', borderColor: '#EF4444' } 
                      }}
                    >
                      Hủy phòng
                    </Button>
                  )}
                </Stack>
              </Stack>
            </Box>
          </Box>
        </Stack>
      </CardContent>
    </MotionCard>
  );
}