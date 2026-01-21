import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Paper, Typography, Stack, Divider, 
  Button, CircularProgress, Alert, Grid, IconButton, Tooltip 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import WarningAmberIcon from '@mui/icons-material/WarningAmber';
import { createBooking, getBookingStatus } from '../../api/booking.api';

export default function Checkout() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  const { 
    roomName, hotelName, checkIn, checkOut, 
    guestsCount, guestName, guestPhone 
  } = location.state || {};

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const pollingRef = useRef(null);

  // 1. Khởi tạo đơn hàng
  useEffect(() => {
    const initOrder = async () => {
      try {
        setLoading(true);
        const res = await createBooking({
          room: roomId,
          checkIn,
          checkOut,
          guestsCount: guestsCount || 1,
          guest: { name: guestName, phone: guestPhone }
        });
        setBooking(res.data.booking);
      } catch (err) {
        console.error("Lỗi tạo đơn:", err);
      } finally {
        setLoading(false);
      }
    };

    if (roomId && checkIn && guestPhone) {
      initOrder();
    } else {
      navigate(-1); 
    }
  }, [roomId, checkIn, checkOut, guestName, guestPhone, guestsCount, navigate]);

  // 2. Polling kiểm tra trạng thái thanh toán SePay
  useEffect(() => {
    if (booking?._id && !isPaid) {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await getBookingStatus(booking._id);
          // DEPOSITED là trạng thái đã nhận tiền cọc từ Webhook SePay
          if (res.data.paymentStatus === 'DEPOSITED' || res.data.paymentStatus === 'PAID') {
            setIsPaid(true);
            clearInterval(pollingRef.current);
          }
        } catch (err) {
          console.log("Đang chờ...", err);
        }
      }, 3000);
    }
    return () => clearInterval(pollingRef.current);
  }, [booking, isPaid]);

  // Hàm copy nhanh
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    // Có thể thêm toast notification ở đây
  };

  if (loading) return (
    <Box textAlign="center" py={15}>
      <CircularProgress size={50} thickness={4} />
      <Typography mt={3} variant="h6" color="text.secondary">Đang thiết lập kênh thanh toán an toàn...</Typography>
    </Box>
  );

  const bankInfo = {
    id: "vietinbank",
    no: "108877368467",
    name: "NGUYEN HOANG ANH",
    content: `DH${booking?._id?.slice(-6).toUpperCase()}` // Rút ngắn mã cho khách dễ nhìn
  };

  const qrUrl = `https://img.vietqr.io/image/${bankInfo.id}-${bankInfo.no}-compact.png?amount=${booking?.depositAmount}&addInfo=${bankInfo.content}&accountName=${bankInfo.name}`;

  return (
    <Container maxWidth="lg" sx={{ py: 6 }}>
      <Grid container spacing={4} justifyContent="center">
        
        {/* CỘT 1: TÓM TẮT ĐƠN HÀNG */}
        <Grid item xs={12} md={5}>
          <Typography variant="h5" fontWeight={800} mb={3}>Chi tiết đặt phòng</Typography>
          <Paper elevation={0} sx={{ p: 3, borderRadius: 4, border: '1px solid #eef2f6', bgcolor: '#fff' }}>
            <Typography variant="h6" fontWeight={700} gutterBottom>{roomName}</Typography>
            <Typography variant="body2" color="text.secondary" mb={2}>{hotelName}</Typography>
            
            <Stack spacing={2} sx={{ bgcolor: '#f8f9fa', p: 2, borderRadius: 2 }}>
              <Box>
                <Typography variant="caption" color="text.secondary">Thời gian lưu trú</Typography>
                <Typography variant="body2" fontWeight={600}>{new Date(checkIn).toLocaleDateString('vi-VN')} - {new Date(checkOut).toLocaleDateString('vi-VN')}</Typography>
              </Box>
              <Box>
                <Typography variant="caption" color="text.secondary">Khách hàng</Typography>
                <Typography variant="body2" fontWeight={600}>{guestName} • {guestPhone}</Typography>
              </Box>
            </Stack>

            <Divider sx={{ my: 3 }} />
            
            <Stack spacing={1.5}>
              <Stack direction="row" justifyContent="space-between">
                <Typography color="text.secondary">Tổng tiền phòng</Typography>
                <Typography fontWeight={700}>{booking?.totalPrice?.toLocaleString()}đ</Typography>
              </Stack>
              <Stack direction="row" justifyContent="space-between" color="primary.main">
                <Typography fontWeight={700}>Tiền cọc cần thanh toán (30%)</Typography>
                <Typography variant="h5" fontWeight={900}>{booking?.depositAmount?.toLocaleString()}đ</Typography>
              </Stack>
            </Stack>

            <Alert severity="warning" icon={<WarningAmberIcon />} sx={{ mt: 3, borderRadius: 2 }}>
              Vui lòng chuyển <b>chính xác</b> số tiền và nội dung để hệ thống tự động xác nhận.
            </Alert>
          </Paper>
        </Grid>

        {/* CỘT 2: KHU VỰC QUÉT MÃ QR */}
        <Grid item xs={12} md={5}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 4, textAlign: 'center', borderRadius: 5, 
              border: isPaid ? '3px solid #4caf50' : '1px solid #dbeafe',
              bgcolor: isPaid ? '#f1fcf1' : '#fff',
              transition: 'all 0.3s ease'
            }}
          >
            {isPaid ? (
              <Box py={4}>
                <CheckCircleIcon sx={{ fontSize: 100, color: '#4caf50', mb: 2 }} />
                <Typography variant="h4" fontWeight={900} color="success.main" gutterBottom>ĐÃ XÁC NHẬN</Typography>
                <Typography variant="body1" color="text.secondary" mb={4}>
                  Cảm ơn bạn! Tiền cọc đã được ghi nhận. Mã đơn hàng đã được gửi về số điện thoại của bạn.
                </Typography>
                <Button 
                  fullWidth size="large" variant="contained" color="success" 
                  sx={{ py: 2, borderRadius: 3, fontWeight: 700 }}
                  onClick={() => navigate('/my-bookings')}
                >
                  XEM LỊCH TRÌNH CỦA TÔI
                </Button>
              </Box>
            ) : (
              <Box>
                <Typography variant="h6" fontWeight={800} mb={1}>Quét mã VietQR</Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>Sử dụng ứng dụng Ngân hàng hoặc Ví điện tử để quét</Typography>
                
                <Box sx={{ position: 'relative', display: 'inline-block', p: 1.5, bgcolor: '#fff', border: '1px solid #e2e8f0', borderRadius: 3, mb: 3 }}>
                  <img src={qrUrl} alt="VietQR SePay" style={{ width: '100%', maxWidth: '260px', display: 'block' }} />
                  {/* Watermark bảo mật */}
                  <Typography variant="caption" sx={{ position: 'absolute', bottom: 15, left: 0, right: 0, opacity: 0.5, fontSize: 10 }}>
                    SEPAY SECURE PAYMENT
                  </Typography>
                </Box>

                <Stack spacing={1.5}>
                  <Paper variant="outlined" sx={{ p: 1.5, textAlign: 'left', position: 'relative', bgcolor: '#fff' }}>
                    <Typography variant="caption" color="text.secondary" display="block">Nội dung chuyển khoản</Typography>
                    <Typography variant="body1" fontWeight={800} color="error.main">{bankInfo.content}</Typography>
                    <Tooltip title="Sao chép nội dung">
                      <IconButton size="small" sx={{ position: 'absolute', right: 8, top: 12 }} onClick={() => handleCopy(bankInfo.content)}>
                        <ContentCopyIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Paper>

                  <Stack direction="row" alignItems="center" justifyContent="center" spacing={1.5} py={2}>
                    <CircularProgress size={16} thickness={5} />
                    <Typography variant="body2" fontWeight={600} color="primary.main">
                      Đang chờ tín hiệu từ ngân hàng...
                    </Typography>
                  </Stack>
                </Stack>
              </Box>
            )}
          </Paper>
          
          {!isPaid && (
            <Typography variant="caption" color="text.disabled" textAlign="center" display="block" sx={{ mt: 3 }}>
              Hệ thống sẽ tự động chuyển trang ngay sau khi nhận được tiền. <br/>
              Đừng đóng cửa sổ này cho đến khi nhận được thông báo thành công.
            </Typography>
          )}
        </Grid>
      </Grid>
    </Container>
  );
}