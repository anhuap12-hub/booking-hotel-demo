import React, { useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, Grid, Paper, Typography, TextField, 
  Button, Box, Stack, Divider, ThemeProvider, createTheme 
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';

// 1. Tùy chỉnh Theme để bỏ viền xanh mặc định khi Focus
const theme = createTheme({
  palette: {
    primary: { main: '#1A1A1A' }, // Chuyển sang tông đen/xám sang trọng
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#E0E0E0', // Viền xám nhẹ khi focus thay vì xanh
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
  const displayPrice = room?.finalPrice || room?.price || 0;

  const [info, setInfo] = useState({
    firstName: '',
    lastName: '',
    phone: '',
    checkIn: new Date(),
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)),
  });

  // Quản lý trạng thái lỗi cho từng field
  const [errors, setErrors] = useState({});

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
          finalPrice: displayPrice 
        }
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
        <Container maxWidth="lg" sx={{ py: 6 }}>
          <Grid container spacing={4}>
            {/* FORM NHẬP LIỆU */}
            <Grid item xs={12} md={8}>
              <Typography variant="h5" fontWeight={800} mb={3}>Thông tin đặt phòng</Typography>
              
              <Paper sx={{ p: 4, borderRadius: 4, border: '1px solid #F0F0F0' }} elevation={0}>
                <Typography variant="subtitle1" fontWeight={700} mb={3}>Chi tiết khách lưu trú</Typography>
                
                <Grid container spacing={3}>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Họ" 
                      variant="outlined"
                      error={!!errors.lastName}
                      helperText={errors.lastName}
                      onChange={(e) => setInfo({...info, lastName: e.target.value})} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField 
                      fullWidth 
                      label="Tên" 
                      error={!!errors.firstName}
                      helperText={errors.firstName}
                      onChange={(e) => setInfo({...info, firstName: e.target.value})} 
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <TextField 
                      fullWidth 
                      label="Số điện thoại" 
                      error={!!errors.phone}
                      helperText={errors.phone}
                      onChange={(e) => setInfo({...info, phone: e.target.value})} 
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker 
                      label="Ngày nhận phòng" 
                      value={info.checkIn} 
                      onChange={(v) => setInfo({...info, checkIn: v})} 
                      slotProps={{ textField: { fullWidth: true }}}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <DatePicker 
                      label="Ngày trả phòng" 
                      value={info.checkOut} 
                      onChange={(v) => setInfo({...info, checkOut: v})} 
                      slotProps={{ textField: { fullWidth: true }}}
                    />
                  </Grid>
                </Grid>
              </Paper>
            </Grid>

            {/* TÓM TẮT GIÁ */}
            <Grid item xs={12} md={4}>
              <Box sx={{ position: 'sticky', top: 24 }}>
                <Paper sx={{ p: 3, borderRadius: 4, bgcolor: '#F9F9F9', border: '1px solid #F0F0F0' }} elevation={0}>
                  <Typography variant="h6" fontWeight={800} mb={2}>Tóm tắt thanh toán</Typography>
                  
                  <Stack spacing={1.5}>
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="text.secondary">Tên phòng</Typography>
                      <Typography fontWeight={600} textAlign="right">{room?.name || "N/A"}</Typography>
                    </Box>
                    <Box display="flex" justifyContent="space-between">
                      <Typography color="text.secondary">Đơn giá</Typography>
                      <Typography fontWeight={600}>{displayPrice.toLocaleString()}₫</Typography>
                    </Box>
                  </Stack>

                  <Divider sx={{ my: 2, borderStyle: 'dashed' }} />
                  
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                    <Typography variant="h6" fontWeight={800}>Tổng cộng</Typography>
                    <Typography variant="h5" fontWeight={900} color="error.main">
                      {displayPrice.toLocaleString()}₫
                    </Typography>
                  </Stack>
                  
                  <Button 
                    fullWidth 
                    variant="contained" 
                    size="large" 
                    onClick={handleNext} 
                    sx={{ 
                      py: 1.8, 
                      borderRadius: 3,
                      fontWeight: 800,
                      textTransform: 'none',
                      fontSize: '1rem',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#333', boxShadow: 'none' }
                    }}
                  >
                    Tiếp theo: Thanh toán
                  </Button>
                  
                  <Typography variant="caption" color="text.secondary" textAlign="center" display="block" mt={2}>
                    Bằng cách tiếp tục, bạn đồng ý với Điều khoản sử dụng.
                  </Typography>
                </Paper>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </LocalizationProvider>
    </ThemeProvider>
  );
}