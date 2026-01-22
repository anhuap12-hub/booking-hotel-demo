import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useNavigate } from 'react-router-dom'; // Thêm useNavigate
import { Container, Grid, Paper, Typography, Box, CircularProgress, Stack, Divider } from '@mui/material';
import { createBooking, getBookingStatus } from '../../api/booking.api'; // Đảm bảo bạn có hàm getBookingDetail
import Swal from 'sweetalert2'; // Nên cài: npm install sweetalert2

export default function Checkout() {
  const { id: roomId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { checkIn, checkOut, guestName, guestPhone, guestsCount } = location.state || {};
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Khởi tạo đơn hàng (Giữ nguyên của bạn)
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
        setBooking(res.data.booking);
      } catch (err) {
        console.error("Lỗi tạo đơn:", err.response?.data || err.message);
      } finally {
        setLoading(false);
      }
    };
    if (roomId && checkIn) initOrder();
  }, [roomId, checkIn, checkOut, guestName, guestPhone, guestsCount]);

  // 2. LOGIC POLLING: Tự động kiểm tra trạng thái thanh toán mỗi 3 giây
  useEffect(() => {
    let interval;
    if (booking && booking.paymentStatus !== 'PAID') {
      interval = setInterval(async () => {
        try {
          // Gọi API lấy chi tiết đơn hàng hiện tại
          const res = await getBookingStatus(booking._id); 
          const currentBooking = res.data.booking;

          if (currentBooking.paymentStatus === 'PAID') {
            clearInterval(interval); // Dừng kiểm tra
            
            // Thông báo thành công
            Swal.fire({
              title: 'Thanh toán thành công!',
              text: 'Đơn hàng của bạn đã được xác nhận tự động.',
              icon: 'success',
              confirmButtonText: 'Xem lịch sử đặt phòng',
              timer: 3000, // Tự động đóng sau 3s
              timerProgressBar: true
            }).then(() => {
              navigate('/my-bookings'); // Chuyển hướng
            });
          }
        } catch (err) {
          console.error("Lỗi khi kiểm tra trạng thái:", err);
        }
      }, 3000); // 3 giây kiểm tra 1 lần
    }

    return () => clearInterval(interval); // Clear khi unmount
  }, [booking, navigate]);

  if (loading) return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
      <CircularProgress />
    </Box>
  );

  const orderIdSuffix = booking?._id ? booking._id.slice(-6).toUpperCase() : "ERROR";
  const bankInfo = {
    id: "vietinbank",
    no: "108877368467",
    name: "NGUYEN HOANG ANH",
    content: `DH${orderIdSuffix}`
  };

  const finalAmount = 2000; // Để test 
  const qrUrl = `https://img.vietqr.io/image/${bankInfo.id}-${bankInfo.no}-compact.png?amount=${finalAmount}&addInfo=${bankInfo.content}&accountName=${encodeURIComponent(bankInfo.name)}`;

  return (
    <Container maxWidth="lg" sx={{ py: 5 }}>
      {/* ... Phần giao diện giữ nguyên như bạn đã viết ... */}
      <Typography variant="h4" fontWeight={800} mb={4}>Chi tiết đặt phòng</Typography>
      <Grid container spacing={4}>
         {/* Cột trái & Cột phải hiển thị QR */}
         {/* Nhớ thêm một dòng chữ nhỏ thông báo cho khách */}
         <Grid item xs={12} md={5}>
            <Paper sx={{ p: 4, borderRadius: 4, textAlign: 'center', position: 'sticky', top: 24 }}>
               {/* QR IMAGE */}
               <Box component="img" src={qrUrl} sx={{ width: '100%', maxWidth: 280, mb: 3 }} />
               
               <Box sx={{ bgcolor: '#e3f2fd', p: 2, borderRadius: 2, mb: 2 }}>
                  <CircularProgress size={20} sx={{ mr: 1, verticalAlign: 'middle' }} />
                  <Typography variant="body2" color="primary" display="inline">
                    Đang chờ thanh toán... Hệ thống sẽ tự động chuyển hướng.
                  </Typography>
               </Box>

               <Box sx={{ bgcolor: '#fff4f4', p: 2, borderRadius: 2, border: '1px dashed red' }}>
                  <Typography variant="h5" fontWeight={900} color="error">{bankInfo.content}</Typography>
               </Box>
            </Paper>
         </Grid>
      </Grid>
    </Container>
  );
}