import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom';
import { 
  Container, Grid, Paper, Typography, Box, 
  CircularProgress, Divider, Stack, Chip, Avatar 
} from '@mui/material';
import { 
  AccountBalanceWallet, 
  Person, 
  EventNote, 
  VerifiedUser, 
  InfoOutlined,
  Hotel
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

  useEffect(() => {
    const initOrder = async () => {
      try {
        setLoading(true);
        const payload = {
          room: roomId,
          checkIn,
          checkOut,
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
          confirmButtonText: 'Quay lại'
        }).then(() => navigate('/rooms'));
      } finally {
        setLoading(false);
      }
    };

    if (roomId && checkIn) initOrder();
    else navigate('/rooms');
  }, [roomId, checkIn, checkOut, guestName, guestPhone, guestsCount, navigate]);

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

  if (loading) return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh" gap={2}>
      <CircularProgress thickness={5} size={60} sx={{ color: '#2ecc71' }} />
      <Typography variant="h6" color="textSecondary">Đang chuẩn bị mã thanh toán...</Typography>
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
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Avatar sx={{ bgcolor: '#2ecc71' }}><VerifiedUser /></Avatar>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#2c3e50">Thanh toán đặt cọc</Typography>
          <Typography variant="body1" color="textSecondary">Hoàn tất thanh toán để giữ phòng của bạn</Typography>
        </Box>
      </Stack>
      
      <Grid container spacing={4} direction="row">
        {/* CỘT TRÁI (md=7): THÔNG TIN ĐƠN HÀNG */}
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            {/* Thông tin phòng & khách sạn */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #edf2f7', bgcolor: '#f8fafc' }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <Hotel color="primary" />
                <Typography variant="h6" fontWeight={700}>Thông tin phòng nghỉ</Typography>
              </Stack>
              <Typography variant="h5" fontWeight={800} color="primary" gutterBottom>{roomName}</Typography>
              <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>{hotelName}</Typography>
              
              <Divider sx={{ my: 2 }} />
              
              <Grid container spacing={3}>
                <Grid item xs={6} textAlign="center" sx={{ borderRight: '1px solid #e2e8f0' }}>
                  <Typography variant="caption" color="textSecondary" display="block">Ngày nhận phòng</Typography>
                  <Typography variant="h6" fontWeight={700}>{new Date(checkIn).toLocaleDateString('vi-VN')}</Typography>
                </Grid>
                <Grid item xs={6} textAlign="center">
                  <Typography variant="caption" color="textSecondary" display="block">Ngày trả phòng</Typography>
                  <Typography variant="h6" fontWeight={700}>{new Date(checkOut).toLocaleDateString('vi-VN')}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Thông tin khách hàng */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #edf2f7' }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <Person color="primary" />
                <Typography variant="h6" fontWeight={700}>Thông tin người đặt</Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Họ và tên</Typography>
                  <Typography fontWeight={600} variant="body1">{guestName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Số điện thoại</Typography>
                  <Typography fontWeight={600} variant="body1">{guestPhone}</Typography>
                </Grid>
              </Grid>
            </Paper>

            {/* Banner Tiền cọc */}
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, bgcolor: '#1a1a1a', color: '#fff' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Tiền đặt cọc (30%)</Typography>
                  <Typography variant="h3" fontWeight={900} sx={{ color: '#2ecc71' }}>{finalAmount.toLocaleString()}đ</Typography>
                  <Typography variant="caption" sx={{ opacity: 0.6 }}>Đã bao gồm phí dịch vụ và thuế</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2ecc71', width: 64, height: 64 }}>
                  <AccountBalanceWallet sx={{ fontSize: 36 }} />
                </Avatar>
              </Stack>
            </Paper>
          </Stack>
        </Grid>

        {/* CỘT PHẢI (md=5): QR CODE THANH TOÁN */}
        <Grid item xs={12} md={5}>
          <Paper elevation={6} sx={{ p: 4, borderRadius: 6, textAlign: 'center', borderTop: '8px solid #2ecc71', position: 'sticky', top: 24 }}>
            <Typography variant="h6" fontWeight={800} gutterBottom>Mã QR Thanh Toán</Typography>
            <Typography variant="body2" color="textSecondary" mb={2}>Sử dụng App Ngân hàng hoặc Ví điện tử để quét</Typography>
            
            <Box 
              component="img" 
              src={qrUrl} 
              sx={{ 
                width: '100%', maxWidth: 280, my: 1, 
                border: '1px solid #f0f0f0', p: 1.5, borderRadius: 4,
                bgcolor: '#fff',
                boxShadow: '0 10px 25px rgba(0,0,0,0.1)'
              }} 
            />
            
            <Box sx={{ bgcolor: '#f0fff4', py: 1.5, px: 2, borderRadius: 3, mb: 3, display: 'inline-flex', alignItems: 'center', gap: 1.5 }}>
              <CircularProgress size={16} sx={{ color: '#27ae60' }} />
              <Typography variant="caption" color="#27ae60" fontWeight={700} sx={{ letterSpacing: 1 }}>CHỜ GIAO DỊCH...</Typography>
            </Box>

            <Divider sx={{ my: 2 }}>
              <Chip label="CHI TIẾT CHUYỂN KHOẢN" size="small" sx={{ fontWeight: 700 }} />
            </Divider>

            <Stack spacing={1.5} sx={{ textAlign: 'left', bgcolor: '#f8fafc', p: 2.5, borderRadius: 4 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="textSecondary">Số tài khoản:</Typography>
                <Typography variant="body2" fontWeight={800}>{bankInfo.accountNumber}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption" color="textSecondary">Số tiền:</Typography>
                <Typography variant="body2" fontWeight={800} color="error">{finalAmount.toLocaleString()}đ</Typography>
              </Box>
              <Box sx={{ mt: 1, p: 2, bgcolor: '#fff', borderRadius: 2, border: '1px dashed #e74c3c', textAlign: 'center' }}>
                <Typography variant="caption" color="textSecondary" display="block">Nội dung bắt buộc:</Typography>
                <Typography variant="h6" fontWeight={900} color="error">{bankInfo.content}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} mt={3} color="textSecondary" justifyContent="center" alignItems="center">
              <InfoOutlined sx={{ fontSize: 16 }} />
              <Typography variant="caption">Mã QR chứa nội dung chuyển khoản tự động.</Typography>
            </Stack>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}