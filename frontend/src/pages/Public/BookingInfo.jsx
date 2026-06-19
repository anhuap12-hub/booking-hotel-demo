import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, Grid, Paper, Typography, TextField, 
  Button, Box, Stack, Divider, ThemeProvider, createTheme, Fade 
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { differenceInDays, startOfDay, addDays } from 'date-fns';
import { ChevronLeftOutlined, PersonOutline, PhoneAndroidOutlined, GroupsOutlined, DateRangeOutlined } from '@mui/icons-material';

// THEME: Blue & White (Hiện đại, sang trọng)
const theme = createTheme({
  palette: { 
    primary: { main: '#0056b3' },
    background: { default: '#F8FAFC' }
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h4: { fontFamily: "'Playfair Display', serif", fontWeight: 800 },
    h5: { fontFamily: "'Playfair Display', serif", fontWeight: 800 },
    h6: { fontFamily: "'Playfair Display', serif", fontWeight: 700 }
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: { borderRadius: 12, '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderColor: '#0056b3' } }
      }
    },
    MuiButton: {
      styleOverrides: { root: { borderRadius: 12, textTransform: 'none', fontWeight: 700 } }
    }
  },
});

export default function BookingInfo() {
  const { id: roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  
  const room = location.state?.room;
  const unitPrice = room?.finalPrice || room?.price || 0;

  const [info, setInfo] = useState({
    firstName: '', lastName: '', phone: '',
    checkIn: startOfDay(new Date()),
    checkOut: startOfDay(addDays(new Date(), 1)),
  });

  const [errors, setErrors] = useState({});
  const nights = useMemo(() => {
    const d = differenceInDays(info.checkOut, info.checkIn);
    return d > 0 ? d : 1;
  }, [info.checkIn, info.checkOut]);

  const totalPrice = unitPrice * nights;
  const depositAmount = Math.round(totalPrice * 0.3);

  const handleNext = () => {
  const newErrors = {};
  if (!info.lastName.trim()) newErrors.lastName = "Hãy điền Họ và tên đệm của bạn";
  if (!info.firstName.trim()) newErrors.firstName = "Hãy điền tên của bạn";
  if (!info.phone.trim()) newErrors.phone = "Hãy điền số điện thoại của bạn";
  
  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return; // Dừng lại, không điều hướng
  }

  // Nếu không có lỗi, mới điều hướng
  navigate(`/checkout/${roomId}`, {
    state: { 
      ...info,
      checkIn: info.checkIn.toISOString(), checkOut: info.checkOut.toISOString(),
      roomName: room?.name, hotelName: room?.hotel?.name,
      guestName: `${info.lastName} ${info.firstName}`,
      guestPhone: info.phone, nights, unitPrice, totalPrice, depositAmount 
    }
  });
};

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
        <Box sx={{ bgcolor: "#F8FAFC", minHeight: "100vh", py: 6 }}>
          <Container maxWidth="lg">
            <Button startIcon={<ChevronLeftOutlined />} onClick={() => navigate(-1)} sx={{ color: "#64748B", mb: 3 }}>
              Quay lại danh sách phòng
            </Button>

            <Grid container spacing={4}>
              {/* CỘT TRÁI: THÔNG TIN KHÁCH HÀNG & LỊCH */}
              <Grid item xs={12} md={7}>
                <Fade in timeout={800}>
                  <Stack spacing={3}>
                    <Typography variant="h4" sx={{ color: "#0F172A", mb: 1 }}>Xác nhận thông tin</Typography>
                    
                    {/* THÔNG TIN KHÁCH HÀNG DỌC */}
                    <Paper sx={{ p: 4, borderRadius: "20px", border: '1px solid #E2E8F0' }} elevation={0}>
                      <Typography variant="h6" sx={{ color: '#000000', mb: 3 }}>Thông tin người nhận phòng</Typography>
                      <Stack spacing={2}>
  <TextField 
    fullWidth label="Họ và tên đệm" 
    error={!!errors.lastName} 
    helperText={errors.lastName}
    onChange={(e) => {
      setInfo({...info, lastName: e.target.value});
      if (errors.lastName) setErrors({...errors, lastName: ""}); // Xóa lỗi khi người dùng bắt đầu nhập
    }} 
  />
  <TextField 
    fullWidth label="Tên" 
    error={!!errors.firstName} 
    helperText={errors.firstName}
    onChange={(e) => {
      setInfo({...info, firstName: e.target.value});
      if (errors.firstName) setErrors({...errors, firstName: ""});
    }} 
  />
  <TextField 
    fullWidth label="Số điện thoại" 
    error={!!errors.phone} 
    helperText={errors.phone}
    onChange={(e) => {
      setInfo({...info, phone: e.target.value});
      if (errors.phone) setErrors({...errors, phone: ""});
    }} 
  />
</Stack>
                    </Paper>

                    {/* LỊCH DƯỚI THÔNG TIN */}
                    <Paper sx={{ p: 4, borderRadius: "20px", border: '1px solid #E2E8F0' }} elevation={0}>
  <Typography variant="h6" sx={{ color: '#000000', mb: 3 }}>Lịch trình lưu trú</Typography>
  <Stack direction="row" spacing={2}>
    <DatePicker 
      label="Nhận phòng" 
      value={info.checkIn} 
      minDate={startOfDay(new Date())} // Chỉ cho phép từ hôm nay trở đi
      onChange={(v) => {
        const newCheckIn = startOfDay(v);
        setInfo(prev => ({
          ...prev, 
          checkIn: newCheckIn,
          // Nếu checkOut cũ nhỏ hơn hoặc bằng checkIn mới thì tự động tăng checkOut lên 1 ngày
          checkOut: info.checkOut <= newCheckIn ? addDays(newCheckIn, 1) : info.checkOut
        }));
      }} 
      slotProps={{ textField: { fullWidth: true } }} 
    />
    <DatePicker 
      label="Trả phòng" 
      value={info.checkOut} 
      minDate={addDays(info.checkIn, 1)} // Ngày trả phải sau ngày nhận ít nhất 1 ngày
      onChange={(v) => setInfo(prev => ({ ...prev, checkOut: startOfDay(v) }))} 
      slotProps={{ textField: { fullWidth: true } }} 
    />
  </Stack>
</Paper>
                  </Stack>
                </Fade>
              </Grid>

              {/* CỘT PHẢI: CHI TIẾT THANH TOÁN */}
              <Grid item xs={12} md={5}>
                <Box sx={{ position: 'sticky', top: 40 }}>
                  <Paper sx={{ p: 4, borderRadius: "20px", bgcolor: '#0056b3', color: '#fff' }} elevation={0}>
                    <Typography variant="h5" sx={{ mb: 3, color: '#fff' }}>Chi tiết thanh toán</Typography>
                    <Stack spacing={2} sx={{ mb: 3 }}>
                      <Row label="Phòng:" value={room?.name} />
                      <Row label="Thời gian:" value={`${nights} đêm`} />
                      <Row label="Đơn giá:" value={`${unitPrice.toLocaleString()}đ`} />
                      <Divider sx={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                      <Row label="Tổng cộng:" value={`${totalPrice.toLocaleString()}đ`} variant="h6" />
                    </Stack>
                    <Box sx={{ p: 2, borderRadius: 3, bgcolor: 'rgba(255,255,255,0.1)' }}>
                      <Typography variant="caption" sx={{ display: 'block', opacity: 0.8 }}>Yêu cầu đặt cọc (30%)</Typography>
                      <Typography variant="h5" sx={{ fontWeight: 900 }}>{depositAmount.toLocaleString()}đ</Typography>
                    </Box>
                    <Button fullWidth variant="contained" onClick={handleNext} sx={{ mt: 3, py: 1.8, bgcolor: '#fff', color: '#0056b3', '&:hover': { bgcolor: '#F1F5F9' } }}>
                      Tiến hành đặt phòng
                    </Button>
                  </Paper>
                </Box>
              </Grid>
            </Grid>
          </Container>
        </Box>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

function Row({ label, value, variant = "body1" }) {
  return (
    <Box display="flex" justifyContent="space-between">
      <Typography sx={{ opacity: 0.8 }}>{label}</Typography>
      <Typography variant={variant} fontWeight={700}>{value}</Typography>
    </Box>
  );
}