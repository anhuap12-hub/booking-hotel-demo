import React, { useEffect, useState } from 'react';
import { useParams, useLocation } from 'react-router-dom';
import { Container, Grid, Paper, Typography, Box, CircularProgress, Stack, Divider } from '@mui/material';
import { createBooking } from '../../api/booking.api';

export default function Checkout() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const { checkIn, checkOut, guestName, guestPhone, guestsCount } = location.state || {};
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initOrder = async () => {
      try {
        setLoading(true);
        const payload = {
          room: roomId,
          checkIn: checkIn,
          checkOut: checkOut,
          guestsCount: Number(guestsCount) || 1,
          guest: {
            name: guestName || "Khách hàng",
            phone: guestPhone || "Không có"
          }
        };

        const res = await createBooking(payload);
        // Backend trả về booking đã có totalPrice và depositAmount đã trừ discount
        setBooking(res.data.booking);
      } catch (err) {
        console.error("Lỗi tạo đơn:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };

    if (roomId && checkIn) initOrder();
  }, [roomId, checkIn, checkOut, guestName, guestPhone, guestsCount]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );

  // Lấy 6 ký tự cuối ID làm mã đơn hàng
  // Lấy 6 ký tự cuối ID làm mã đơn hàng
const orderIdSuffix = booking?._id ? booking._id.slice(-6).toUpperCase() : "ERROR";

const bankInfo = {
  id: "vietinbank", // ID ngân hàng của bạn
  no: "108877368467",
  name: "NGUYEN HOANG ANH",
  content: `DH${orderIdSuffix}`
};

// --- LOGIC TEST: Cố định 2000đ để test quét mã ---
const testAmount = 2000; 
// Sử dụng testAmount nếu bạn muốn test, hoặc dùng booking?.depositAmount cho thực tế
const finalAmount = testAmount; 

// URL VietQR 
const qrUrl = `https://img.vietqr.io/image/${bankInfo.id}-${bankInfo.no}-compact.png?amount=${finalAmount}&addInfo=${bankInfo.content}&accountName=${encodeURIComponent(bankInfo.name)}`;
  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      <Typography variant="h4" fontWeight={800} mb={4}>Chi tiết đặt phòng</Typography>
      
      <Grid container spacing={4}>
        {/* CỘT TRÁI: THÔNG TIN TÓM TẮT */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ p: 4, borderRadius: 4 }} variant="outlined">
            <Typography variant="h5" fontWeight={700} mb={1}>{location.state?.roomName}</Typography>
            <Typography color="text.secondary" mb={3}>{location.state?.hotelName}</Typography>
            
            <Box sx={{ bgcolor: '#f8f9fa', p: 3, borderRadius: 2 }}>
              <Stack spacing={2}>
                <Box>
                  <Typography variant="caption" color="text.secondary">Thời gian lưu trú</Typography>
                  <Typography variant="body1" fontWeight={600}>
                    {new Date(checkIn).toLocaleDateString('vi-VN')} - {new Date(checkOut).toLocaleDateString('vi-VN')} ({booking?.nights} đêm)
                  </Typography>
                </Box>
                <Box>
                  <Typography variant="caption" color="text.secondary">Khách hàng</Typography>
                  <Typography variant="body1" fontWeight={600}>{guestName} • {guestPhone}</Typography>
                </Box>
              </Stack>
            </Box>

            <Divider sx={{ my: 4 }} />

            <Stack spacing={2}>
              <Stack direction="row" justifyContent="space-between">
                <Typography variant="h6" color="text.secondary">Tổng tiền phòng</Typography>
                <Typography variant="h6" fontWeight={700}>
                  {(booking?.totalPrice || 0).toLocaleString()}₫
                </Typography>
              </Stack>
              
              <Stack direction="row" justifyContent="space-between" sx={{ color: 'primary.main' }}>
                <Box>
                  <Typography variant="h5" fontWeight={800}>Tiền cọc thanh toán ngay</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.8 }}> (30% giá trị phòng để xác nhận đơn)</Typography>
                </Box>
                <Typography variant="h4" fontWeight={900}>
                  {(booking?.depositAmount || 0).toLocaleString()}₫
                </Typography>
              </Stack>
            </Stack>
          </Paper>
        </Grid>

        {/* CỘT PHẢI: MÃ QR THANH TOÁN */}
        <Grid item xs={12} md={5}>
          <Paper 
            sx={{ 
              p: 4, 
              borderRadius: 4, 
              textAlign: 'center', 
              border: '2px solid',
              borderColor: 'primary.light',
              position: 'sticky',
              top: 24
            }}
          >
            <Typography variant="h6" fontWeight={700} mb={2}>Quét mã VietQR để đặt chỗ</Typography>
            
            <Box 
              component="img" 
              src={qrUrl} 
              sx={{ 
                width: '100%', 
                maxWidth: 280, 
                mb: 3, 
                borderRadius: 2,
                boxShadow: '0 4px 12px rgba(0,0,0,0.1)' 
              }} 
            />
            
            <Box sx={{ bgcolor: '#fff4f4', p: 2, borderRadius: 2, border: '1px dashed red' }}>
              <Typography variant="body2" color="error" fontWeight={600}>
                Nội dung chuyển khoản bắt buộc:
              </Typography>
              <Typography variant="h5" fontWeight={900} color="error">
                {bankInfo.content}
              </Typography>
            </Box>
            
            <Typography variant="caption" display="block" sx={{ mt: 2, color: 'text.secondary', fontStyle: 'italic' }}>
              * Hệ thống sẽ tự động xác nhận đơn sau khi nhận được tiền
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}