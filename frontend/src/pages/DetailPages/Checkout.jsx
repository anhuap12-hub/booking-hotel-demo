import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';

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

  // 1. KHỞI TẠO ĐƠN HÀNG
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
          text: err.response?.data?.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.',
          icon: 'warning',
          confirmButtonText: 'Quay lại', 
        }).then(() => navigate('/rooms'));
      } finally {
        setLoading(false);
      }
    };
    if (roomId && checkIn) initOrder();
    else navigate('/rooms');
  }, [roomId, checkIn, checkOut, guestName, guestPhone, guestsCount, navigate]);

  // 2. KIỂM TRA TRẠNG THÁI TỰ ĐỘNG
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
              text: currentStatus === 'DEPOSITED' ? 'Bạn đã đặt cọc thành công 30%.' : 'Thanh toán hoàn tất!',
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
    // Có thể dùng Toast nhẹ ở đây nếu muốn
  };

  if (loading) return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="90vh" gap={3}>
      <CircularProgress thickness={4} size={50} sx={{ color: '#C2A56D' }} />
      <Typography variant="body1" sx={{ color: '#72716E', letterSpacing: 2, fontWeight: 600 }}>ĐANG KHỞI TẠO THANH TOÁN...</Typography>
    </Box>
  );

  const orderIdSuffix = booking?._id ? booking._id.slice(-6).toUpperCase() : "";
  const depositAmount = booking?.depositAmount || 0;
  const totalPrice = booking?.totalPrice || 0;

  const bankInfo = {
    accountName: "NGUYEN HOANG ANH",
    accountNumber: "108877368467",
    bankId: "vietinbank", 
    content: `SEVQR DH${orderIdSuffix}`, 
  };

  const qrUrl = `https://img.vietqr.io/image/${bankInfo.bankId}-${bankInfo.accountNumber}-compact2.png?amount=${depositAmount}&addInfo=${encodeURIComponent(bankInfo.content)}&accountName=${encodeURIComponent(bankInfo.accountName)}`;

  return (
    <Fade in={true} timeout={800}>
      <Container maxWidth="lg" sx={{ py: { xs: 4, md: 8 }, bgcolor: '#F9F8F6' }}>
        <Grid container spacing={5}>
          
          {/* CỘT TRÁI: THÔNG TIN CHI TIẾT */}
          <Grid item xs={12} md={7}>
            <Box mb={5}>
              <Typography variant="h3" sx={{ color: '#1C1B19', mb: 1.5, fontSize: {xs: '2rem', md: '2.8rem'}, fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>
                Hoàn tất đặt phòng
              </Typography>
              <Stack direction="row" spacing={1.5} alignItems="center">
                <SecurityOutlined sx={{ fontSize: 20, color: '#C2A56D' }} />
                <Typography variant="body2" color="#72716E" fontWeight={500}>Cổng thanh toán bảo mật tự động</Typography>
              </Stack>
            </Box>

            <Stack spacing={4}>
              <Paper elevation={0} sx={{ p: 4, borderRadius: '24px', border: '1px solid rgba(194, 165, 109, 0.2)' }}>
                <Typography variant="overline" sx={{ color: '#C2A56D', fontWeight: 800 }}>CHI TIẾT PHÒNG</Typography>
                <Typography variant="h5" sx={{ mt: 1, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>{roomName}</Typography>
                <Typography variant="body2" color="#72716E" sx={{ mb: 2 }}>{hotelName}</Typography>

                <Grid container spacing={2} sx={{ bgcolor: '#F9F8F6', p: 3, borderRadius: '16px' }}>
                  <Grid item xs={6}>
                    <Typography variant="caption" sx={{ color: '#A8A7A1', fontWeight: 600 }}>NHẬN PHÒNG</Typography>
                    <Typography variant="body1" fontWeight={700}>{new Date(checkIn).toLocaleDateString('vi-VN')}</Typography>
                  </Grid>
                  <Grid item xs={6} sx={{ borderLeft: '1px solid #EAE9E2', pl: 2 }}>
                    <Typography variant="caption" sx={{ color: '#A8A7A1', fontWeight: 600 }}>TRẢ PHÒNG</Typography>
                    <Typography variant="body1" fontWeight={700}>{new Date(checkOut).toLocaleDateString('vi-VN')}</Typography>
                  </Grid>
                </Grid>
              </Paper>

              <Paper elevation={0} sx={{ 
                p: 4, borderRadius: '24px', 
                background: '#1C1B19', color: '#fff',
                position: 'relative', overflow: 'hidden'
              }}>
                <Box sx={{ position: 'relative', zIndex: 1 }}>
                  <Typography variant="body2" sx={{ opacity: 0.7 }}>TỔNG GIÁ TRỊ: {totalPrice.toLocaleString()} VND</Typography>
                  <Typography variant="body1" sx={{ color: '#C2A56D', fontWeight: 700, mt: 1 }}>SỐ TIỀN CẦN CỌC (30%):</Typography>
                  <Typography variant="h2" fontWeight={800} sx={{ color: '#C2A56D', fontFamily: "'Playfair Display', serif" }}>
                    {depositAmount.toLocaleString()} <Typography component="span" variant="h5">VND</Typography>
                  </Typography>
                  <Divider sx={{ my: 2, borderColor: 'rgba(255,255,255,0.1)' }} />
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>* Số tiền còn lại sẽ thanh toán khi nhận phòng</Typography>
                </Box>
                <PaymentOutlined sx={{ position: 'absolute', right: -20, bottom: -20, fontSize: 160, opacity: 0.05, transform: 'rotate(-15deg)', color: '#C2A56D' }} />
              </Paper>
            </Stack>
          </Grid>

          {/* CỘT PHẢI: QR CODE */}
          <Grid item xs={12} md={5}>
            <Paper elevation={0} sx={{ 
              p: 4, borderRadius: '32px', textAlign: 'center', 
              border: '1px solid rgba(194, 165, 109, 0.2)',
              position: 'sticky', top: 40, bgcolor: '#FFF'
            }}>
              <Typography variant="h6" fontWeight={800} sx={{ fontFamily: "'Playfair Display', serif" }}>Quét mã QR để cọc</Typography>
              
              <Box sx={{ mt: 3, mb: 3, p: 1.5, bgcolor: '#F9F8F6', borderRadius: '24px', display: 'inline-block' }}>
                <img src={qrUrl} alt="QR Code" style={{ width: '100%', maxWidth: 240, borderRadius: '12px' }} />
              </Box>
              
              <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mb={3}>
                <CircularProgress size={14} sx={{ color: '#C2A56D' }} />
                <Typography variant="caption" sx={{ fontWeight: 800, color: '#C2A56D', letterSpacing: 1.5 }}>CHỜ GIAO DỊCH...</Typography>
              </Stack>

              <Box sx={{ p: 2.5, borderRadius: '16px', bgcolor: '#F9F8F6', border: '1px dashed #C2A56D', textAlign: 'left' }}>
                <Typography variant="caption" color="#72716E" display="block" mb={0.5} fontWeight={600}>NỘI DUNG CHUYỂN KHOẢN:</Typography>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography variant="h5" fontWeight={900} letterSpacing={1}>{bankInfo.content}</Typography>
                  <Tooltip title="Sao chép">
                    <Button 
                      onClick={() => handleCopy(bankInfo.content)}
                      variant="text"
                      sx={{ minWidth: 0, p: 1, color: '#C2A56D' }}
                    >
                      <ContentCopy fontSize="small" />
                    </Button>
                  </Tooltip>
                </Stack>
              </Box>

              <Stack spacing={1} mt={3} textAlign="left">
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="#A8A7A1">Chủ TK:</Typography>
                  <Typography variant="caption" fontWeight={700}>{bankInfo.accountName}</Typography>
                </Box>
                <Box display="flex" justifyContent="space-between">
                  <Typography variant="caption" color="#A8A7A1">Số TK:</Typography>
                  <Typography variant="caption" fontWeight={700}>{bankInfo.accountNumber}</Typography>
                </Box>
              </Stack>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Fade>
  );
}