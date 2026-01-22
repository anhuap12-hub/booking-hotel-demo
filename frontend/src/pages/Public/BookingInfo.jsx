import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, Grid, Paper, Typography, TextField, 
  Button, Box, Stack, Divider, ThemeProvider, createTheme 
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { differenceInDays, startOfDay, addDays } from 'date-fns';

const theme = createTheme({
  palette: { primary: { main: '#1A1A1A' } },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0E0E0',
            borderWidth: '1px',
          },
        },
      },
    },
  },
});

export default function BookingInfo() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const room = location.state?.room;
  const unitPrice = room?.finalPrice || room?.price || 0;

  const [info, setInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    checkIn: startOfDay(new Date()),
    checkOut: startOfDay(addDays(new Date(), 1)),
  });

  const [errors, setErrors] = useState({});

  // --- LOGIC TÍNH TOÁN ĐỒNG BỘ VỚI BACKEND ---
  const nights = useMemo(() => {
    const d = differenceInDays(info.checkOut, info.checkIn);
    return d > 0 ? d : 1;
  }, [info.checkIn, info.checkOut]);

  const totalPrice = unitPrice * nights;
  const depositAmount = Math.round(totalPrice * 0.3); // Khớp với 30% ở Backend

  const validate = () => {
    let tempErrors = {};
    if (!info.lastName.trim()) tempErrors.lastName = "Vui lòng nhập họ";
    if (!info.firstName.trim()) tempErrors.firstName = "Vui lòng nhập tên";
    if (!info.phone.trim()) tempErrors.phone = "Vui lòng nhập số điện thoại";
    else if (!/^\d{10,11}$/.test(info.phone)) tempErrors.phone = "Số điện thoại không hợp lệ";
    
    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      navigate(`/checkout/${roomId}`, {
        state: { 
          ...info,
          checkIn: info.checkIn.toISOString(),
          checkOut: info.checkOut.toISOString(),
          roomName: room?.name,
          hotelName: room?.hotel?.name,
          guestName: `${info.lastName} ${info.firstName}`,
          guestPhone: info.phone,
          nights,
          unitPrice,
          totalPrice,
          depositAmount // Truyền số tiền cọc sang để hiển thị QR
        }
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight={800} mb={3}>Thông tin đặt phòng</Typography>
              <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #F0F0F0' }} elevation={0}>
                <Typography variant="subtitle1" fontWeight={700} mb={3}>Chi tiết khách lưu trú</Typography>
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Họ" error={!!errors.lastName} helperText={errors.lastName}
                      onChange={(e) => setInfo({...info, lastName: e.target.value})} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField fullWidth label="Tên" error={!!errors.firstName} helperText={errors.firstName}
                      onChange={(e) => setInfo({...info, firstName: e.target.value})} />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField fullWidth label="Số điện thoại" error={!!errors.phone} helperText={errors.phone}
                      onChange={(e) => setInfo({...info, phone: e.target.value})} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker label="Ngày nhận phòng" value={info.checkIn} minDate={startOfDay(new Date())}
                      onChange={(v) => {
                        const newIn = startOfDay(v);
                        setInfo({
                          ...info, 
                          checkIn: newIn, 
                          checkOut: info.checkOut <= newIn ? addDays(newIn, 1) : info.checkOut
                        });
                      }} 
                      slotProps={{ textField: { fullWidth: true }}} />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker label="Ngày trả phòng" value={info.checkOut} minDate={addDays(info.checkIn, 1)}
                      onChange={(v) => setInfo({...info, checkOut: startOfDay(v)})} 
                      slotProps={{ textField: { fullWidth: true }}} />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#F9F9F9', border: '1px solid #F0F0F0' }} elevation={0}>
                  <Typography variant="h6" fontWeight={800} mb={2}>Tóm tắt thanh toán</Typography>
                  <Stack spacing={1.5}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="text.secondary">Thời gian</Typography>
                      <Typography fontWeight={600}>{nights} đêm</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="text.secondary">Đơn giá/đêm</Typography>
                      <Typography fontWeight={600}>{unitPrice.toLocaleString()}₫</Typography>
                    </Box>
                    <Divider sx={{ my: 1, borderStyle: 'dashed' }} />
                    <Box display="flex" justifyContent="space-between">
                      <Typography fontWeight={700}>Tổng tiền phòng</Typography>
                      <Typography fontWeight={700}>{totalPrice.toLocaleString()}₫</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between" sx={{ color: 'error.main' }}>
                      <Typography fontWeight={700}>Tiền cọc (30%)</Typography>
                      <Typography fontWeight={900}>{depositAmount.toLocaleString()}₫</Typography>
                    </Box>
                  </Stack>

                  <Button fullWidth variant="contained" size="large" onClick={handleNext} 
                    sx={{ mt: 3, py: 1.8, borderRadius: 3, fontWeight: 800, textTransform: 'none' }}>
                    Tiếp theo: Thanh toán cọc
                  </Button>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}