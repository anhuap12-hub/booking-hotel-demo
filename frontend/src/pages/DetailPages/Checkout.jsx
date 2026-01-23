import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

// Tối ưu hóa Import trực tiếp
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import CircularProgress from '@mui/material/CircularProgress';
import Divider from '@mui/material/Divider';
import Stack from '@mui/material/Stack';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Fade from '@mui/material/Fade';

import { 
  VerifiedUserOutlined, InfoOutlined, 
  HotelOutlined, ContentCopy, SecurityOutlined, CalendarMonthOutlined, 
  LocationOnOutlined, PaymentOutlined
} from '@mui/icons-material';
import { createBooking, getBookingStatus } from '../../api/booking.api'; 
import Swal from 'sweetalert2';

export default function Checkout() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { checkIn, checkOut, guestName, guestPhone, guestsCount, roomName, hotelName } = location.state || {};
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // LOGIC KHỞI TẠO ĐƠN HÀNG (GIỮ NGUYÊN)
  useEffect(() => {
    const initOrder = async () => {
      try {
        setLoading(true);
        const payload = {
          room: roomId, checkIn, checkOut,
          guestsCount: Number(guestsCount) || 1,
          guest: { name: guestName || "Khách hàng", phone: guestPhone || "Không có" }
        };
        const res = await createBooking(payload);
        setBooking(res.data?.booking);
      } catch (err) {
        Swal.fire({
          title: 'Thông báo',
          text: 'Không thể khởi tạo đơn hàng. Vui lòng thử lại.',
          icon: 'warning',
          confirmButtonText: 'Quay lại', 
          err
        }).then(() => navigate('/rooms'));
      } finally {
        setLoading(false);
      }
    };
    if (roomId && checkIn) initOrder();
    else navigate('/rooms');
  }, [roomId, checkIn, checkOut, guestName, guestPhone, guestsCount, navigate]);

  // LOGIC KIỂM TRA TRẠNG THÁI THANH TOÁN (GIỮ NGUYÊN)
  useEffect(() => {
    let interval;
    if (booking?._id && !['PAID', 'DEPOSITED'].includes(booking?.paymentStatus)) {
      interval = setInterval(async () => {
        try {
          const res = await getBookingStatus(booking._id); 
          const currentStatus = res?.data?.booking?.paymentStatus;
          if (currentStatus === 'PAID' || currentStatus === 'DEPOSITED') {
            clearInterval(interval); 
            Swal.fire({
              title: 'Thành công!',
              text: 'Thanh toán đặt cọc thành công.',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false,
            }).then(() => navigate('/my-bookings'));
          }
        } catch (err) {
          console.warn("Đang kiểm tra giao dịch..."),err;
        }
      }, 3000); 
    }
    return () => clearInterval(interval);
  }, [booking, navigate]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Có thể thêm một thông báo nhỏ "Đã sao chép" ở đây nếu muốn
  };

  if (loading) return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="90vh" gap={3}>
      <CircularProgress thickness={4} size={50} sx={{ color: '#C2A56D' }} />
      <Typography variant="body1" sx={{ color: '#72716E', letterSpacing: 2, fontWeight: 600 }}>ĐANG KHỞI TẠO THANH TOÁN...</Typography>
    </Box>
  );

  const orderIdSuffix = booking?._id ? booking._id.slice(-6).toUpperCase() : "";
  const finalAmount = booking?.depositAmount || 0;

  const bankInfo = {
    accountName: "NGUYEN HOANG ANH",
    accountNumber: "108877368467",
    bankId: "vietinbank", 
    content: `SEVQR DH${orderIdSuffix}`, 
  };

  const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNumber}-compact2.png?amount=${finalAmount}&addInfo=${encodeURIComponent(bankInfo.content)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, bgcolor: '#F9F8F6' }}>
        <Grid container spacing={5}>
          
          {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
          <Grid item xs={12} md={7}>
            <Box mb={5}>
              <Typography variant="h3" sx={{ 
                color: '#1C1B19', 
                mb: 1.5, 
                fontSize: {xs: '2rem', md: '2.8rem'},
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800
              }}>
                Hoàn tất đặt phòng
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <SecurityOutlined sx={{ fontSize: 20, color: '#C2A56D' }} />
                <Typography variant="body2" color="#72716E" fontWeight={500}>
                  Cổng thanh toán an toàn 256-bit AES
                </Typography>
              </Stack>
            </Box>

            <Stack spacing={4}>
              {/* Room Info Card */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid rgba(194, 165, 109, 0.2)', bgcolor: '#fff' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={3}>
                  <Box>
                    <Typography variant="overline" sx={{ color: '#C2A56D', fontWeight: 800, letterSpacing: 1.5 }}>LỰA CHỌN CỦA BẠN</Typography>
                    <Typography variant="h5" sx={{ mt: 1, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{roomName}</Typography>
                    <Stack direction="row" spacing={0.5} alignItems="center" mt={1}>
                      <LocationOnOutlined sx={{ fontSize: 18, color: '#A8A7A1' }} />
                      <Typography variant="body2" color="#72716E">{hotelName}</Typography>
                    </Stack>
                  </Box>
                  <Avatar sx={{ bgcolor: '#F9F8F6', color: '#C2A56D', borderRadius: '12px', width: 56, height: 56, border: '1px solid rgba(194, 165, 109, 0.3)' }}>
                    <HotelOutlined />
                  </Avatar>
                </Stack>

                <Grid container spacing={2} sx={{ bgcolor: '#F9F8F6', p: 3, borderRadius: '16px' }}>
                  <Grid item xs={6}>
                    <Stack spacing={0.5}>
                      <Typography variant="caption" sx={{ color: '#A8A7A1', fontWeight: 600, textTransform: 'uppercase' }}>Nhận phòng</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarMonthOutlined sx={{ fontSize: 18, color: '#C2A56D' }} />
                        <Typography variant="body1" fontWeight={700} color="#1C1B19">{new Date(checkIn).toLocaleDateString('vi-VN')}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                  <Grid item xs={6} sx={{ borderLeft: '1px solid rgba(194, 165, 109, 0.1)' }}>
                    <Stack spacing={0.5} sx={{ pl: 2 }}>
                      <Typography variant="caption" sx={{ color: '#A8A7A1', fontWeight: 600, textTransform: 'uppercase' }}>Trả phòng</Typography>
                      <Stack direction="row" spacing={1} alignItems="center">
                        <CalendarMonthOutlined sx={{ fontSize: 18, color: '#C2A56D' }} />
                        <Typography variant="body1" fontWeight={700} color="#1C1B19">{new Date(checkOut).toLocaleDateString('vi-VN')}</Typography>
                      </Stack>
                    </Stack>
                  </Grid>
                </Grid>
              </Paper>

              {/* Guest Info Card */}
              <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid #EFE7DD' }}>
                <Typography variant="overline" sx={{ color: '#A8A7A1', fontWeight: 800 }}>THÔNG TIN KHÁCH TRÚ</Typography>
                <Grid container spacing={3} mt={1}>
                  <Grid item xs={12} sm={6}>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ width: 48, height: 48, bgcolor: '#1C1B19', color: '#C2A56D', fontWeight: 700 }}>{guestName?.charAt(0)}</Avatar>
                      <Box>
                        <Typography variant="caption" color="#A8A7A1">Họ và tên</Typography>
                        <Typography variant="body1" fontWeight={700} color="#1C1B19">{guestName}</Typography>
                      </Box>
                    </Stack>
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <Box sx={{ pl: { sm: 2 }, borderLeft: { sm: '1px solid #EFE7DD' } }}>
                      <Typography variant="caption" color="#A8A7A1">Số điện thoại</Typography>
                      <Typography variant="body1" fontWeight={700} color="#1C1B19">{guestPhone}</Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Paper>

              {/* Price Banner */}
              <Paper elevation={0} sx={{ 
                p: 4, borderRadius: '24px', 
                background: 'linear-gradient(135deg, #1C1B19 0%, #333230 100%)', 
                color: '#fff',
                position: 'relative',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 500, letterSpacing: 1 }}>SỐ TIỀN ĐẶT CỌC (30%)</Typography>
                  <Stack direction="row" alignItems="baseline" spacing={1.5} mt={2}>
                    <Typography variant="h2" fontWeight={800} sx={{ color: '#C2A56D', fontFamily: "'Playfair Display', serif" }}>
                      {finalAmount.toLocaleString()}
                    </Typography>
                    <Typography variant="h5" fontWeight={600} sx={{ color: '#C2A56D' }}>VND</Typography>
                  </Stack>
                  <Divider sx={{ my: 2.5, borderColor: 'rgba(194, 165, 109, 0.3)' }} />
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <VerifiedUserOutlined sx={{ fontSize: 18, color: '#C2A56D' }} />
                    <Typography variant="caption" sx={{ opacity: 0.8, fontWeight: 500 }}>
                      Chính sách: Hoàn tiền 100% nếu hủy trước 24h nhận phòng
                    </Typography>
                  </Stack>
                </Box>
                <PaymentOutlined sx={{ 
                  position: 'absolute', right: -30, bottom: -30, 
                  fontSize: 180, opacity: 0.07, transform: 'rotate(-15deg)',
                  color: '#C2A56D'
                }} />
              </Paper>
            </Stack>
          </Grid>

          {/* CỘT PHẢI: QR CODE CARD */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ 
              p: {xs: 4, md: 5}, borderRadius: '32px', textAlign: 'center', 
              border: '1px solid rgba(194, 165, 109, 0.2)',
              boxShadow: '0 30px 60px -12px rgba(28, 27, 25, 0.1)',
              position: 'sticky', top: 40,
              bgcolor: '#FFF'
            }}>
              <Typography variant="h5" sx={{ fontWeight: 800, color: '#1C1B19', fontFamily: "'Playfair Display', serif" }}>
                Thanh toán QR Code
              </Typography>
              <Typography variant="body2" color="#72716E" sx={{ mb: 4, mt: 1 }}>
                Sử dụng ứng dụng Ngân hàng hoặc Ví điện tử
              </Typography>
              
              <Box sx={{ position: 'relative', display: 'inline-block', mb: 4, p: 1 }}>
                <Box 
                  component="img" 
                  src={qrUrl} 
                  sx={{ 
                    width: '100%', maxWidth: 280,
                    p: 2, borderRadius: '24px',
                    bgcolor: '#fff',
                    border: '1px solid #F9F8F6',
                    boxShadow: '0 10px 30px rgba(0,0,0,0.05)'
                  }} 
                />
                <Box sx={{ position: 'absolute', top: 0, left: 0, width: 30, height: 30, borderTop: '4px solid #C2A56D', borderLeft: '4px solid #C2A56D', borderRadius: '8px 0 0 0' }} />
                <Box sx={{ position: 'absolute', top: 0, right: 0, width: 30, height: 30, borderTop: '4px solid #C2A56D', borderRight: '4px solid #C2A56D', borderRadius: '0 8px 0 0' }} />
                <Box sx={{ position: 'absolute', bottom: 0, left: 0, width: 30, height: 30, borderBottom: '4px solid #C2A56D', borderLeft: '4px solid #C2A56D', borderRadius: '0 0 0 8px' }} />
                <Box sx={{ position: 'absolute', bottom: 0, right: 0, width: 30, height: 30, borderBottom: '4px solid #C2A56D', borderRight: '4px solid #C2A56D', borderRadius: '0 0 8px 0' }} />
              </Box>
              
              <Stack direction="row" spacing={1.5} justifyContent="center" alignItems="center" mb={4}>
                <CircularProgress size={16} sx={{ color: '#C2A56D' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#C2A56D', letterSpacing: 2 }}>
                  ĐANG CHỜ GIAO DỊCH...
                </Typography>
              </Stack>

              <Stack spacing={2} sx={{ textAlign: 'left' }}>
                <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#F9F8F6', border: '1px dashed #C2A56D' }}>
                  <Typography variant="caption" color="#72716E" display="block" mb={1} sx={{ fontWeight: 600 }}>NỘI DUNG CHUYỂN KHOẢN:</Typography>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="h5" fontWeight={900} color="#1C1B19" letterSpacing={1}>{bankInfo.content}</Typography>
                    <Tooltip title="Sao chép nội dung">
                      
                      <Button 
                        onClick={() => handleCopy(bankInfo.content)} 
                        sx={{ 
                          minWidth: 40, width: 40, height: 40, 
                          borderRadius: '50%', color: '#C2A56D',
                          p: 0,
                          '&:hover': { bgcolor: 'rgba(194, 165, 109, 0.1)' }
                        }}
                      >
                        <ContentCopy sx={{ fontSize: 20 }} />
                      </Button>
                    </Tooltip>
                  </Stack>
                </Box>

                <Box px={1} pt={1}>
                   <Stack spacing={1}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="#A8A7A1">Chủ tài khoản</Typography>
                      <Typography variant="body2" fontWeight={700} color="#1C1B19">{bankInfo.accountName}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography variant="body2" color="#A8A7A1">Số tài khoản</Typography>
                      <Typography variant="body2" fontWeight={700} color="#1C1B19">{bankInfo.accountNumber}</Typography>
                    </Box>
                  </Stack>
                </Box>
              </Stack>

              <Box mt={4} pt={3} sx={{ borderTop: '1px solid #F9F8F6' }}>
                <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" color="#A8A7A1">
                  <InfoOutlined sx={{ fontSize: 16 }} />
                  <Typography variant="caption" fontWeight={500}>Hệ thống tự động xác nhận sau khi nhận tín hiệu.</Typography>
                </Stack>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}