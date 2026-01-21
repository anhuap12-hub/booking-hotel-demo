import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link as RouterLink } from 'react-router-dom';
import { 
  Box, Container, Grid, Typography, Stack, Chip, Button, 
  Divider, Paper, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Alert, ImageList, ImageListItem, Breadcrumbs, Link
} from '@mui/material';

// Icons
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import KingBedIcon from '@mui/icons-material/KingBed';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentsIcon from '@mui/icons-material/Payments';
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import WifiIcon from '@mui/icons-material/Wifi';
import PoolIcon from '@mui/icons-material/Pool';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';

import { getRoomDetail } from '../../api/room.api';

export default function RoomDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomDetail(id);
        setRoom(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [id]);

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}><CircularProgress /></Box>;
  if (!room) return <Container sx={{ py: 5 }}><Alert severity="error">Không tìm thấy thông tin phòng!</Alert></Container>;

  const finalPrice = Math.round(room.discount ? room.price * (1 - room.discount / 100) : room.price);

  const handleBooking = () => {
    navigate(`/checkout/${room._id}`, { 
      state: { 
        roomName: room.name,
        finalPrice: finalPrice,
        hotelName: room.hotel?.name 
      } 
    });
  };

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      {/* 1. BREADCRUMBS NAVIGATION */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #eee", py: 1.5, mb: 3 }}>
        <Container>
          <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />}>
            <Link component={RouterLink} to="/" color="inherit" underline="hover" sx={{ fontSize: '0.85rem' }}>Trang chủ</Link>
            <Link component={RouterLink} to={`/hotel/${room.hotel?._id}`} color="inherit" underline="hover" sx={{ fontSize: '0.85rem' }}>
              {room.hotel?.name}
            </Link>
            <Typography color="text.primary" sx={{ fontWeight: 600, fontSize: '0.85rem' }}>{room.name}</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ pb: 8 }}>
        <Grid container spacing={4}>
          {/* BÊN TRÁI: THÔNG TIN PHÒNG */}
          <Grid item xs={12} md={8}>
            <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={2}>
              <Box>
                <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, mb: 1 }}>{room.name}</Typography>
                <Stack direction="row" spacing={1} alignItems="center" color="text.secondary">
                  <LocationOnIcon sx={{ fontSize: 18 }} />
                  <Typography variant="body2">{room.hotel?.address}</Typography>
                </Stack>
              </Box>
              <Chip label={room.type} color="primary" variant="outlined" sx={{ textTransform: 'capitalize', fontWeight: 600 }} />
            </Stack>

            {/* GALLERY COMPONENT */}
            <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', mb: 3 }}>
              <Grid container spacing={1}>
                <Grid item xs={12} sm={8}>
                  <img src={room.photos[0]?.url} alt="main" style={{ width: '100%', height: '450px', objectFit: 'cover' }} />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <Stack spacing={1} sx={{ height: '450px' }}>
                    {room.photos.slice(1, 3).map((img, idx) => (
                      <Box key={idx} sx={{ flex: 1, overflow: 'hidden' }}>
                        <img src={img.url} alt="sub" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      </Box>
                    ))}
                  </Stack>
                </Grid>
              </Grid>
            </Paper>

            {/* DESCRIPTION & AMENITIES */}
            <Stack spacing={4}>
              <Box>
                <Typography variant="h6" fontWeight={700} mb={2}>Về căn phòng này</Typography>
                <Typography variant="body1" sx={{ color: '#444', lineHeight: 1.8 }}>{room.desc}</Typography>
              </Box>

              <Divider />

              <Box>
                <Typography variant="h6" fontWeight={700} mb={2}>Tiện nghi chuẩn quốc tế</Typography>
                <Grid container spacing={3}>
                  {room.amenities.map((item, idx) => (
                    <Grid item xs={6} sm={4} key={idx}>
                      <Stack direction="row" alignItems="center" spacing={1.5}>
                        <Box sx={{ bgcolor: '#E8F5E9', p: 0.8, borderRadius: 1.5, display: 'flex' }}>
                          <CheckCircleIcon sx={{ color: '#2E7D32', fontSize: 18 }} />
                        </Box>
                        <Typography variant="body2" fontWeight={600}>{item}</Typography>
                      </Stack>
                    </Grid>
                  ))}
                </Grid>
              </Box>
            </Stack>
          </Grid>

          {/* BÊN PHẢI: BOOKING CARD (STICKY) */}
          <Grid item xs={12} md={4}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: 4, border: '1px solid #eef2f6', position: 'sticky', top: 24, boxShadow: '0 10px 40px rgba(0,0,0,0.04)' }}>
              {/* Giá cả */}
              <Box mb={3}>
                <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>Giá chỉ từ</Typography>
                <Stack direction="row" alignItems="baseline" spacing={1}>
                  <Typography variant="h3" fontWeight={800} color="primary">
                    {finalPrice.toLocaleString()}đ
                  </Typography>
                  <Typography variant="body2" color="text.secondary">/đêm</Typography>
                </Stack>
                {room.discount > 0 && (
                   <Chip label={`Giảm ${room.discount}%`} size="small" color="error" sx={{ mt: 1, borderRadius: 1, fontWeight: 700 }} />
                )}
              </Box>

              <Divider sx={{ my: 3 }} />

              {/* Thông tin nhanh */}
              <Stack spacing={2} mb={4}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Số khách tối đa</Typography>
                  <Typography fontWeight={700}>{room.maxPeople} người</Typography>
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Typography color="text.secondary">Loại giường</Typography>
                  <Typography fontWeight={700} sx={{ textTransform: 'capitalize' }}>{room.type}</Typography>
                </Box>
              </Stack>

              {/* Thanh toán SePay - Highlight */}
              <Box sx={{ p: 2.5, bgcolor: '#F0F7FF', borderRadius: 3, mb: 3, border: '1px solid #D0E3FF' }}>
                <Stack direction="row" spacing={1.5} alignItems="center" mb={1}>
                  <PaymentsIcon color="primary" />
                  <Typography variant="subtitle2" fontWeight={700}>Thanh toán tự động</Typography>
                </Stack>
                <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.8rem' }}>
                  Hệ thống sử dụng SePay giúp bạn xác nhận phòng ngay lập tức qua mã VietQR mà không cần chờ đợi.
                </Typography>
              </Box>

              <Button 
                fullWidth 
                variant="contained" 
                size="large"
                onClick={handleBooking}
                sx={{ 
                  py: 2, borderRadius: 3, fontWeight: 800, fontSize: '1.1rem',
                  boxShadow: '0 8px 24px rgba(25, 118, 210, 0.3)'
                }}
              >
                ĐẶT PHÒNG NGAY
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}