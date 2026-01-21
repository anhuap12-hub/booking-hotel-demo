import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Box, Container, Grid, Typography, Stack, Chip, Button, 
  Divider, Paper, List, ListItem, ListItemIcon, ListItemText,
  CircularProgress, Alert, ImageList, ImageListItem 
} from '@mui/material';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import PeopleAltIcon from '@mui/icons-material/PeopleAlt';
import KingBedIcon from '@mui/icons-material/KingBed';
import SecurityIcon from '@mui/icons-material/Security';
import PaymentsIcon from '@mui/icons-material/Payments'; // Icon mới cho thanh toán
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

  // Tính toán giá sau khi giảm (Làm tròn để phù hợp với giao dịch ngân hàng)
  const finalPrice = Math.round(
    room.discount ? room.price * (1 - room.discount / 100) : room.price
  );

  const handleBooking = () => {
    // Truyền dữ liệu sang trang Checkout để tạo mã QR SePay
    navigate(`/checkout/${room._id}`, { 
      state: { 
        roomName: room.name,
        finalPrice: finalPrice,
        hotelName: room.hotel?.name 
      } 
    });
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Grid container spacing={4}>
        {/* BÊN TRÁI: HÌNH ẢNH & MÔ TẢ */}
        <Grid item xs={12} md={8}>
          <Typography variant="h4" fontWeight={800} mb={1}>{room.name}</Typography>
          <Typography variant="body2" color="text.secondary" mb={3}>
            Địa chỉ: {room.hotel?.address} ({room.hotel?.name})
          </Typography>

          <Paper elevation={0} sx={{ borderRadius: 4, overflow: 'hidden', mb: 2 }}>
            <img 
              src={room.photos[0]?.url || 'https://via.placeholder.com/800x450'} 
              alt="main" 
              style={{ width: '100%', height: '400px', objectFit: 'cover' }} 
            />
          </Paper>
          
          <ImageList cols={4} rowHeight={120} gap={8}>
            {room.photos.slice(1, 5).map((item, idx) => (
              <ImageListItem key={idx} sx={{ borderRadius: 2, overflow: 'hidden' }}>
                <img src={item.url} alt={`sub-${idx}`} loading="lazy" style={{ height: '100%', objectFit: 'cover' }} />
              </ImageListItem>
            ))}
          </ImageList>

          <Box mt={4}>
            <Typography variant="h6" fontWeight={700} mb={2}>Mô tả phòng</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-line', lineHeight: 1.7 }}>
              {room.desc}
            </Typography>
          </Box>

          <Box mt={4}>
            <Typography variant="h6" fontWeight={700} mb={2}>Tiện nghi có sẵn</Typography>
            <Grid container spacing={2}>
              {room.amenities.map((item, idx) => (
                <Grid item xs={6} sm={4} key={idx}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <CheckCircleIcon sx={{ color: '#4caf50', fontSize: 18 }} />
                    <Typography variant="body2" fontWeight={500}>{item}</Typography>
                  </Stack>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Grid>

        {/* BÊN PHẢI: ĐẶT PHÒNG & CHÍNH SÁCH THANH TOÁN */}
        <Grid item xs={12} md={4}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: 3, 
              borderRadius: 4, 
              border: '1px solid #e0e0e0', 
              position: 'sticky', 
              top: 24,
              bgcolor: '#fff'
            }}
          >
            {/* Phần giá cả */}
            <Box mb={3}>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>Giá mỗi đêm</Typography>
              {room.discount ? (
                <Stack spacing={0.5}>
                  <Typography variant="body2" sx={{ textDecoration: 'line-through', color: 'text.disabled' }}>
                    {room.price.toLocaleString()}đ
                  </Typography>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Typography variant="h4" fontWeight={800} color="primary.main">
                      {finalPrice.toLocaleString()}đ
                    </Typography>
                    <Chip label={`-${room.discount}%`} size="small" color="error" sx={{ fontWeight: 700, borderRadius: 1 }} />
                  </Stack>
                </Stack>
              ) : (
                <Typography variant="h4" fontWeight={800} color="primary.main">
                  {room.price.toLocaleString()}đ
                </Typography>
              )}
            </Box>

            <Divider sx={{ my: 2, borderStyle: 'dashed' }} />

            <List sx={{ py: 0 }}>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}><PeopleAltIcon fontSize="small" color="action" /></ListItemIcon>
                <ListItemText primary={`Sức chứa: ${room.maxPeople} người`} primaryTypographyProps={{ variant: 'body2' }} />
              </ListItem>
              <ListItem disableGutters>
                <ListItemIcon sx={{ minWidth: 32 }}><KingBedIcon fontSize="small" color="action" /></ListItemIcon>
                <ListItemText primary={`Loại: ${room.type}`} primaryTypographyProps={{ variant: 'body2', sx: { textTransform: 'capitalize' } }} />
              </ListItem>
            </List>

            {/* Thông tin thanh toán SePay */}
            <Box sx={{ bgcolor: '#f0f7ff', p: 2, borderRadius: 2, my: 2 }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <PaymentsIcon sx={{ color: '#0288d1', fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#0288d1">Thanh toán tự động</Typography>
              </Stack>
              <Typography variant="caption" color="text.secondary" display="block">
                Hỗ trợ chuyển khoản qua VietQR. Hệ thống xác nhận đơn hàng ngay lập tức sau khi nhận tiền.
              </Typography>
            </Box>

            {/* Chính sách hủy */}
            <Box sx={{ bgcolor: '#fff9f0', p: 2, borderRadius: 2, mb: 3 }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={1}>
                <SecurityIcon sx={{ color: '#ff9800', fontSize: 18 }} />
                <Typography variant="subtitle2" fontWeight={700} color="#b47c00">Chính sách hủy</Typography>
              </Stack>
              <Typography variant="caption" display="block" color="text.secondary">
                • Hủy miễn phí trước <b>{room.cancellationPolicy?.freeCancelBeforeHours}h</b> check-in.
              </Typography>
              <Typography variant="caption" display="block" color="text.secondary">
                • Hoàn tiền <b>{room.cancellationPolicy?.refundPercent}%</b> giá trị đơn.
              </Typography>
            </Box>

            <Button 
              fullWidth 
              variant="contained" 
              size="large" 
              disabled={room.status !== 'active'}
              onClick={handleBooking}
              sx={{ 
                borderRadius: 2, 
                py: 1.8, 
                fontWeight: 800, 
                fontSize: '1rem',
                boxShadow: '0 4px 14px 0 rgba(0,118,255,0.39)',
                '&:hover': { boxShadow: '0 6px 20px rgba(0,118,255,0.23)' }
              }}
            >
              {room.status === 'active' ? 'TIẾP TỤC ĐẶT PHÒNG' : 'PHÒNG KHÔNG SẴN SÀNG'}
            </Button>
            
            <Typography variant="caption" color="text.disabled" align="center" display="block" sx={{ mt: 1.5 }}>
              Mã bảo mật giao dịch: 256-bit SSL
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
}