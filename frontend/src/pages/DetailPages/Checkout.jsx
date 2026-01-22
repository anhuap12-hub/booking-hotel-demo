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
  InfoOutlined 
} from '@mui/icons-material';
import { createBooking, getBookingStatus } from '../../api/booking.api'; 
import Swal from 'sweetalert2';

export default function Checkout() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // 1. Lấy dữ liệu từ trang đặt phòng trước đó
  const { checkIn, checkOut, guestName, guestPhone, guestsCount } = location.state || {};
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // 2. Khởi tạo đơn hàng ngay khi vào trang
  useEffect(() => {
    const initOrder = async () => {
      try {
        setLoading(true);
        const payload = {
          room: roomId,
          checkIn,
          checkOut,
          guestsCount: Number(guestsCount) || 1,
          guest: {
            name: guestName || "Khách hàng",
            phone: guestPhone || "Không có"
          }
        };
        const res = await createBooking(payload);
        setBooking(res.data?.booking);
      } catch (err) {
        console.error("Lỗi khởi tạo đơn hàng:", err);
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

  // 3. LOGIC POLLING: Tự động kiểm tra trạng thái thanh toán (3 giây/lần)
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
              text: 'Chúng tôi đã nhận được khoản thanh toán của bạn.',
              icon: 'success',
              timer: 3000,
              showConfirmButton: false,
              timerProgressBar: true
            }).then(() => navigate('/my-bookings'));
          }
        } catch (err) {
          console.warn("Hệ thống đang kiểm tra lại giao dịch...");
        }
      }, 3000); 
    }
    return () => clearInterval(interval);
  }, [booking, navigate]);

  if (loading) return (
    <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight="80vh" gap={2}>
      <CircularProgress thickness={5} size={60} sx={{ color: '#2ecc71' }} />
      <Typography variant="h6" color="textSecondary">Đang khởi tạo đơn hàng...</Typography>
    </Box>
  );

  // Thông tin cấu hình thanh toán
  const orderIdSuffix = booking?._id ? booking._id.slice(-6).toUpperCase() : "...";
  const finalAmount = 2000; // Số tiền test cố định
  const bankInfo = {
    id: "vietinbank",
    no: "108877368467",
    name: "NGUYEN HOANG ANH",
    content: `DH${orderIdSuffix}`
  };

  const qrUrl = `https://img.vietqr.io/image/${bankInfo.id}-${bankInfo.no}-compact.png?amount=${finalAmount}&addInfo=${bankInfo.content}&accountName=${encodeURIComponent(bankInfo.name)}`;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      {/* Header đơn hàng */}
      <Stack direction="row" alignItems="center" spacing={2} mb={4}>
        <Avatar sx={{ bgcolor: '#2ecc71' }}><VerifiedUser /></Avatar>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#2c3e50">Thanh toán đặt cọc</Typography>
          <Typography variant="body1" color="textSecondary">Mã đơn hàng: #DH{orderIdSuffix}</Typography>
        </Box>
      </Stack>
      
      <Grid container spacing={4}>
        {/* CỘT TRÁI: QR CODE THANH TOÁN */}
        <Grid item xs={12} md={5}>
          <Paper elevation={4} sx={{ p: 4, borderRadius: 5, textAlign: 'center', borderTop: '6px solid #2ecc71' }}>
            <Typography variant="subtitle1" fontWeight={700} gutterBottom>Quét mã VietQR để thanh toán</Typography>
            
            <Box 
              component="img" 
              src={qrUrl} 
              sx={{ 
                width: '100%', maxWidth: 300, my: 2, 
                border: '1px solid #f0f0f0', p: 2, borderRadius: 3,
                boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
              }} 
            />
            
            <Box sx={{ bgcolor: '#f0fff4', p: 2, borderRadius: 3, mb: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1.5 }}>
              <CircularProgress size={18} sx={{ color: '#27ae60' }} />
              <Typography variant="body2" color="#27ae60" fontWeight={600}>Đang chờ xác thực...</Typography>
            </Box>

            <Divider sx={{ my: 3 }}>
              <Chip label="THÔNG TIN CHUYỂN KHOẢN" size="small" variant="outlined" />
            </Divider>

            <Stack spacing={2} sx={{ textAlign: 'left', bgcolor: '#fafafa', p: 2, borderRadius: 3 }}>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="textSecondary">Ngân hàng:</Typography>
                <Typography variant="body2" fontWeight={700}>VietinBank</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="textSecondary">Số tài khoản:</Typography>
                <Typography variant="body2" fontWeight={700}>{bankInfo.no}</Typography>
              </Box>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="body2" color="textSecondary">Số tiền:</Typography>
                <Typography variant="body2" fontWeight={700} color="error">{finalAmount.toLocaleString()}đ</Typography>
              </Box>
              <Box sx={{ p: 1.5, bgcolor: '#fff', borderRadius: 2, border: '1px dashed #e74c3c' }}>
                <Typography variant="caption" color="textSecondary" display="block">Nội dung chuyển khoản:</Typography>
                <Typography variant="h6" align="center" fontWeight={900} color="error">{bankInfo.content}</Typography>
              </Box>
            </Stack>

            <Stack direction="row" spacing={1} mt={3} color="textSecondary" justifyContent="center">
              <InfoOutlined fontSize="small" />
              <Typography variant="caption">Hệ thống tự động duyệt sau khi nhận tiền.</Typography>
            </Stack>
          </Paper>
        </Grid>

        {/* CỘT PHẢI: THÔNG TIN ĐƠN HÀNG */}
        <Grid item xs={12} md={7}>
          <Stack spacing={3}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #edf2f7' }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <Person color="primary" />
                <Typography variant="h6" fontWeight={700}>Khách hàng</Typography>
              </Stack>
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Họ và tên</Typography>
                  <Typography fontWeight={600}>{guestName}</Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="caption" color="textSecondary">Số điện thoại</Typography>
                  <Typography fontWeight={600}>{guestPhone}</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, border: '1px solid #edf2f7' }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <EventNote color="primary" />
                <Typography variant="h6" fontWeight={700}>Lịch trình</Typography>
              </Stack>
              <Grid container spacing={3}>
                <Grid item xs={6} textAlign="center" sx={{ borderRight: '1px solid #eee' }}>
                  <Typography variant="caption" color="textSecondary">Check-in</Typography>
                  <Typography variant="h6" fontWeight={700}>{new Date(checkIn).toLocaleDateString('vi-VN')}</Typography>
                </Grid>
                <Grid item xs={6} textAlign="center">
                  <Typography variant="caption" color="textSecondary">Check-out</Typography>
                  <Typography variant="h6" fontWeight={700}>{new Date(checkOut).toLocaleDateString('vi-VN')}</Typography>
                </Grid>
              </Grid>
            </Paper>

            <Paper elevation={0} sx={{ p: 4, borderRadius: 5, bgcolor: '#2c3e50', color: '#fff' }}>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Box>
                  <Typography variant="body2" sx={{ opacity: 0.8 }}>Tổng tiền đặt cọc</Typography>
                  <Typography variant="h4" fontWeight={900}>{finalAmount.toLocaleString()}đ</Typography>
                </Box>
                <Avatar sx={{ bgcolor: '#2ecc71', width: 56, height: 56 }}>
                  <AccountBalanceWallet sx={{ fontSize: 32 }} />
                </Avatar>
              </Stack>
            </Paper>
          </Stack>
        </Grid>
      </Grid>
    </Container>
  );
}