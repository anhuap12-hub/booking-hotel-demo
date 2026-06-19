import React, { useState, useMemo } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { 
  Container, Grid, Paper, Typography, TextField, 
  Button, Box, Stack, Divider, ThemeProvider, createTheme, Fade, Avatar
} from '@mui/material';
import { LocalizationProvider, DatePicker } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { vi } from 'date-fns/locale';
import { differenceInDays, startOfDay, addDays } from 'date-fns';
import { AccountCircleOutlined, DateRangeOutlined, ChevronLeftOutlined } from '@mui/icons-material';

// THEME: Tinh chỉnh Ebony & Gold
const theme = createTheme({
  palette: { 
    primary: { main: '#1C1B19' }, // Ebony
    secondary: { main: '#C2A56D' } // Gold
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
    h5: { fontFamily: "'Playfair Display', serif", fontWeight: 800 }
  },
  components: {
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 12,
          '&:hover .MuiOutlinedInput-notchedOutline': { borderColor: '#C2A56D' },
          '&.Mui-focused .MuiOutlinedInput-notchedOutline': { borderWidth: '1px', borderColor: '#1C1B19' },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: { borderRadius: 12, textTransform: 'none', fontWeight: 700 }
      }
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
    firstName: '',
    lastName: '',
    phone: '',
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
          depositAmount 
        }
      });
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={vi}>
        <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh", py: 8 }}>
          <Container maxWidth="lg">
            {/* Quay lại */}
            <Button 
              startIcon={<ChevronLeftOutlined />} 
              onClick={() => navigate(-1)}
              sx={{ color: "#72716E", mb: 3 }}
            >
              Quay lại danh sách phòng
            </Button>

            <Grid container spacing={5}>
              {/* CỘT TRÁI: FORM THÔNG TIN */}
              <Grid item xs={12} md={8}>
                <Fade in timeout={800}>
                  <Box>
                    <Typography variant="h4" sx={{ color: "#1C1B19", mb: 4 }}>
                      Xác nhận thông tin nghỉ dưỡng
                    </Typography>
                    
                    <Paper sx={{ p: 5, borderRadius: "24px", border: '1px solid rgba(194, 165, 109, 0.2)', bgcolor: '#fff' }} elevation={0}>
                      {/* Section Khách hàng */}
                      <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                        <Avatar sx={{ bgcolor: '#1C1B19', color: '#C2A56D' }}><AccountCircleOutlined /></Avatar>
                        <Typography variant="h6" fontWeight={700}>Thông tin khách hàng</Typography>
                      </Stack>
                      
                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Họ" variant="outlined"
                            error={!!errors.lastName} helperText={errors.lastName}
                            onChange={(e) => setInfo({...info, lastName: e.target.value})} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <TextField fullWidth label="Tên" 
                            error={!!errors.firstName} helperText={errors.firstName}
                            onChange={(e) => setInfo({...info, firstName: e.target.value})} />
                        </Grid>
                        <Grid item xs={12}>
                          <TextField fullWidth label="Số điện thoại di động" 
                            error={!!errors.phone} helperText={errors.phone}
                            onChange={(e) => setInfo({...info, phone: e.target.value})} />
                        </Grid>
                      </Grid>

                      <Divider sx={{ my: 5, borderColor: 'rgba(194, 165, 109, 0.1)' }} />

                      {/* Section Ngày tháng */}
                      <Stack direction="row" spacing={2} alignItems="center" mb={4}>
                        <Avatar sx={{ bgcolor: '#F9F8F6', color: '#C2A56D', border: '1px solid rgba(194, 165, 109, 0.3)' }}>
                          <DateRangeOutlined />
                        </Avatar>
                        <Typography variant="h6" fontWeight={700}>Lịch trình lưu trú</Typography>
                      </Stack>

                      <Grid container spacing={3}>
                        <Grid item xs={12} sm={6}>
                          <DatePicker label="Nhận phòng (Check-in)" value={info.checkIn} minDate={startOfDay(new Date())}
                            onChange={(v) => {
                              const newIn = startOfDay(v);
                              setInfo({
                                ...info, checkIn: newIn, 
                                checkOut: info.checkOut <= newIn ? addDays(newIn, 1) : info.checkOut
                              });
                            }} 
                            slotProps={{ textField: { fullWidth: true }}} />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <DatePicker label="Trả phòng (Check-out)" value={info.checkOut} minDate={addDays(info.checkIn, 1)}
                            onChange={(v) => setInfo({...info, checkOut: startOfDay(v)})} 
                            slotProps={{ textField: { fullWidth: true }}} />
                        </Grid>
                      </Grid>
                    </Paper>
                  </Box>
                </Fade>
              </Grid>

              {/* CỘT PHẢI: TÓM TẮT DỊCH VỤ */}
              <Grid item xs={12} md={4}>
                <Box sx={{ position: 'sticky', top: 40 }}>
                  <Paper sx={{ 
                    p: 4, borderRadius: "24px", bgcolor: '#1C1B19', color: '#fff',
                    backgroundImage: 'linear-gradient(135deg, #1C1B19 0%, #2D2C2A 100%)',
                    boxShadow: '0 20px 40px rgba(0,0,0,0.15)'
                  }} elevation={0}>
                    <Typography variant="h6" sx={{ color: "#C2A56D", fontWeight: 800, mb: 3 }}>
                      Chi tiết thanh toán
                    </Typography>

                    <Stack spacing={2.5}>
                      <Box display="flex" justifyContent="space-between">
                        <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>Phòng</Typography>
                        <Typography fontWeight={600} textAlign="right">{room?.name}</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>Thời gian</Typography>
                        <Typography fontWeight={600}>{nights} đêm</Typography>
                      </Box>
                      <Box display="flex" justifyContent="space-between">
                        <Typography sx={{ color: "rgba(255,255,255,0.6)" }}>Đơn giá</Typography>
                        <Typography fontWeight={600}>{unitPrice.toLocaleString()}₫</Typography>
                      </Box>

                      <Divider sx={{ my: 1, borderColor: 'rgba(194, 165, 109, 0.3)', borderStyle: 'dashed' }} />
                      
                      <Box display="flex" justifyContent="space-between" alignItems="baseline">
                        <Typography sx={{ color: "#C2A56D", fontWeight: 700 }}>Tổng cộng</Typography>
                        <Typography variant="h5" fontWeight={800}>{totalPrice.toLocaleString()}₫</Typography>
                      </Box>

                      <Box sx={{ 
                        p: 2, borderRadius: 2, bgcolor: 'rgba(194, 165, 109, 0.1)', 
                        border: '1px solid rgba(194, 165, 109, 0.2)', mt: 2 
                      }}>
                        <Stack direction="row" justifyContent="space-between">
                          <Typography variant="body2" fontWeight={700} color="#C2A56D">Yêu cầu cọc (30%)</Typography>
                          <Typography variant="body1" fontWeight={900} color="#C2A56D">{depositAmount.toLocaleString()}₫</Typography>
                        </Stack>
                        <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block', mt: 1 }}>
                          * Quý khách sẽ thanh toán số tiền cọc này để xác nhận giữ phòng.
                        </Typography>
                      </Box>
                    </Stack>

                    <Button 
                      fullWidth 
                      variant="contained" 
                      onClick={handleNext} 
                      sx={{ 
                        mt: 4, py: 2, bgcolor: '#C2A56D', color: '#1C1B19',
                        '&:hover': { bgcolor: '#D4BB8D' },
                        fontSize: '1rem'
                      }}
                    >
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