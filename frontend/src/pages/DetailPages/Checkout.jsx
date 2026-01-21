import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Paper, Typography, Stack, Divider, 
  Button, CircularProgress, Alert, Grid 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { createBooking, getBookingDetail } from '../../api/booking.api';

export default function Checkout() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  
  // Nhận data từ RoomDetail qua state (đã bao gồm guestName và guestPhone từ Dialog)
  const { 
    roomName, 
    hotelName, 
    checkIn, 
    checkOut, 
    guestsCount, 
    guestName, 
    guestPhone 
  } = location.state || {};

  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isPaid, setIsPaid] = useState(false);
  const pollingRef = useRef(null);

  useEffect(() => {
    const initOrder = async () => {
      try {
        const res = await createBooking({
          room: roomId,
          checkIn,
          checkOut,
          guestsCount: guestsCount || 1,
          guest: { 
            name: guestName || "Khách đặt", 
            phone: guestPhone // Dùng trực tiếp phone từ Dialog truyền sang
          }
        });
        setBooking(res.data.booking);
      } catch (err) {
        console.error("Lỗi tạo đơn:", err);
      } finally {
        setLoading(false);
      }
    };

    // Điều kiện: Phải có phone từ Dialog mới cho tạo đơn
    if (roomId && checkIn && guestPhone) {
      initOrder();
    } else {
      console.warn("Thiếu thông tin Phone hoặc ngày đặt. Quay lại...");
      navigate(-1); 
    }
  }, [roomId, checkIn, checkOut, navigate, guestsCount, guestName, guestPhone]);

  // Cơ chế Polling tự động check thanh toán
  useEffect(() => {
    if (booking && !isPaid) {
      pollingRef.current = setInterval(async () => {
        try {
          const res = await getBookingDetail(booking._id);
          if (res.data.paymentStatus === 'DEPOSITED' || res.data.paymentStatus === 'PAID') {
            setIsPaid(true);
            clearInterval(pollingRef.current);
          }
        } catch (err) {
          console.log("Đang chờ thanh toán...", err);
        }
      }, 3000);
    }
    return () => clearInterval(pollingRef.current);
  }, [booking, isPaid]);

  if (loading) return <Box textAlign="center" py={10}><CircularProgress /><Typography mt={2}>Đang tạo hóa đơn...</Typography></Box>;

  // Cấu hình mã QR SePay
  const bankID = "vietinbank"; 
  const accountNo = "108877368467"; 
  const accountName = "NGUYEN HOANG ANH";
  const content = `DH${booking?._id}`; 
  const qrUrl = `https://img.vietqr.io/image/${bankID}-${accountNo}-compact.png?amount=${booking?.depositAmount}&addInfo=${content}&accountName=${accountName}`;

  return (
    <Container maxWidth="md" sx={{ py: 5 }}>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Typography variant="h5" fontWeight={800} mb={3}>Thông tin cọc</Typography>
          <Paper sx={{ p: 3, borderRadius: 3, bgcolor: '#f8f9fa' }}>
            <Typography variant="subtitle1" fontWeight={700}>{roomName}</Typography>
            <Typography variant="body2" color="text.secondary">{hotelName}</Typography>
            
            <Stack direction="row" spacing={2} my={2}>
               <Box>
                  <Typography variant="caption" color="text.secondary">Liên hệ</Typography>
                  <Typography variant="body2" fontWeight={600}>{guestName} - {guestPhone}</Typography>
               </Box>
            </Stack>

            <Divider sx={{ my: 2 }} />
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography>Tổng tiền phòng:</Typography>
              <Typography fontWeight={600}>{booking?.totalPrice?.toLocaleString()}đ</Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between" mb={2} color="primary.main">
              <Typography fontWeight={700}>Tiền cọc 30%:</Typography>
              <Typography variant="h6" fontWeight={800}>{booking?.depositAmount?.toLocaleString()}đ</Typography>
            </Stack>
            
            <Alert severity="info" icon={false} sx={{ mt: 2, fontSize: '0.85rem' }}>
              Số tiền còn lại <b>{booking?.remainingAmount?.toLocaleString()}đ</b> thanh toán tại quầy.
            </Alert>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: 4, border: isPaid ? '2px solid #4caf50' : '2px solid #0076FF' }}>
            {isPaid ? (
              <Box py={4}>
                <CheckCircleIcon sx={{ fontSize: 80, color: '#4caf50', mb: 2 }} />
                <Typography variant="h5" fontWeight={800} color="success.main">CỌC THÀNH CÔNG!</Typography>
                <Button fullWidth variant="contained" color="success" sx={{ mt: 4 }} onClick={() => navigate('/my-bookings')}>XEM ĐƠN HÀNG</Button>
              </Box>
            ) : (
              <>
                <Typography variant="h6" fontWeight={800} mb={2}>Quét mã để giữ chỗ</Typography>
                <Box sx={{ p: 1, bgcolor: '#fff', display: 'inline-block', border: '1px solid #eee', mb: 3 }}>
                  <img src={qrUrl} alt="VietQR" style={{ width: '100%', maxWidth: '240px' }} />
                </Box>
                <Stack spacing={1} textAlign="left" sx={{ bgcolor: '#fff4e5', p: 2, borderRadius: 2 }}>
                   <Typography variant="caption"><b>Nội dung:</b> <span style={{color:'red', fontWeight:'bold'}}>{content}</span></Typography>
                   <Typography variant="caption"><b>Số tiền:</b> {booking?.depositAmount?.toLocaleString()}đ</Typography>
                </Stack>
                <Stack direction="row" alignItems="center" justifyContent="center" spacing={1} mt={3}>
                  <CircularProgress size={14} />
                  <Typography variant="caption" color="text.secondary">Đang chờ ngân hàng xác nhận...</Typography>
                </Stack>
              </>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}