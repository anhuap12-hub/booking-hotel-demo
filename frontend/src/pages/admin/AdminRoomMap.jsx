import React, { useEffect, useState } from 'react';
import { 
  Box, Grid, Paper, Typography, Stack, Chip, CircularProgress, 
  Popover, Button, Divider, Alert, Snackbar 
} from '@mui/material';
import { getAdminRoomMap, updateRoomStatus } from '../../api/admin.api';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';

const statusMap = {
  active: { color: '#4caf50', label: 'Trống' },
  available: { color: '#4caf50', label: 'Trống' },
  occupied: { color: '#f44336', label: 'Đang ở' },
  booked: { color: '#ff9800', label: 'Đã đặt' },
  maintenance: { color: '#757575', label: 'Bảo trì' },
  inactive: { color: '#212121', label: 'Ngừng bán' },
};

export default function AdminRoomMap() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState(null);
  
  // Trạng thái thông báo (Toast)
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    try {
      const res = await getAdminRoomMap();
      setRooms(res.data);
    } catch (err) {
      console.error(err);
      showSnackbar("Không thể tải sơ đồ phòng", "error");
    } finally {
      setLoading(false);
    }
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  const handleOpenPopover = (event, room) => {
    setAnchorEl(event.currentTarget);
    setPopoverData(room);
  };

  const handleUpdateStatus = async (roomId, newStatus) => {
    try {
      await updateRoomStatus(roomId, newStatus);
      showSnackbar("Cập nhật trạng thái thành công!");
      setAnchorEl(null);
      fetchRooms(); // Reload dữ liệu
    } catch (error) {
      showSnackbar("Lỗi khi cập nhật trạng thái", error);
    }
  };

  if (loading) return (
    <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" py={20}>
      <CircularProgress />
      <Typography sx={{ mt: 2 }} color="text.secondary">Đang tải sơ đồ phòng...</Typography>
    </Box>
  );

  return (
    <Box p={3} sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      {/* HEADER SECTION */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={800} color="#1a2027">Sơ Đồ Phòng Real-time</Typography>
        <Stack direction="row" spacing={3} mt={2}>
  <Typography variant="body2">Tổng: <b>{rooms.length}</b></Typography>
  
  {/* Sửa: Lọc theo 'active' thay vì 'available' */}
  <Typography variant="body2" color="success.main">
    
Trống: <b>{rooms.filter(r => ['active', 'available'].includes(r.displayStatus)).length}</b>
  </Typography>
  
  <Typography variant="body2" color="error.main">
    Đang ở: <b>{rooms.filter(r => r.displayStatus === 'occupied').length}</b>
  </Typography>
  
  <Typography variant="body2" color="warning.main">
    Đã đặt: <b>{rooms.filter(r => r.displayStatus === 'booked').length}</b>
  </Typography>
</Stack>
      </Box>
      
      {/* CHÚ THÍCH (LEGEND) */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: 3, border: '1px solid #eee' }}>
        <Stack direction="row" spacing={4} flexWrap="wrap" useFlexGap>
          {Object.entries(statusMap).map(([key, value]) => (
            <Stack key={key} direction="row" alignItems="center" spacing={1}>
              <Box sx={{ width: 14, height: 14, bgcolor: value.color, borderRadius: '4px' }} />
              <Typography variant="caption" fontWeight={600} color="text.secondary">{value.label}</Typography>
            </Stack>
          ))}
        </Stack>
      </Paper>

      {/* GRID PHÒNG */}
      {rooms.length === 0 ? (
        <Alert severity="info">Hiện chưa có dữ liệu phòng nào được tạo.</Alert>
      ) : (
        <Grid container spacing={2.5}>
          {rooms.map((room) => (
            <Grid item xs={12} sm={6} md={4} lg={2.4} key={room._id}> 
              <Paper
                elevation={0}
                onClick={(e) => handleOpenPopover(e, room)}
                sx={{
                  p: 2.5,
                  cursor: 'pointer',
                  borderRadius: 4,
                  border: '1px solid #eef0f2',
                  borderTop: `6px solid ${statusMap[room.displayStatus].color}`,
                  bgcolor: '#fff',
                  transition: 'all 0.25s ease-in-out',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  justifyContent: 'space-between',
                  '&:hover': { 
                    transform: 'translateY(-6px)', 
                    boxShadow: '0 12px 24px rgba(0,0,0,0.08)',
                    borderColor: statusMap[room.displayStatus].color 
                  }
                }}
              >
                <Box>
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
                    <Typography variant="h6" fontWeight={800} sx={{ color: '#2d3436', lineHeight: 1.2 }}>
                      {room.roomName}
                    </Typography>
                    <MeetingRoomIcon sx={{ color: '#dfe6e9', fontSize: 20 }} />
                  </Stack>
                  <Typography variant="caption" fontWeight={600} color="text.secondary" display="block" sx={{ mt: 0.5, textTransform: 'uppercase', letterSpacing: 0.5 }}>
                    {room.roomType}
                  </Typography>
                  <Typography variant="caption" color="text.disabled">{room.hotelName}</Typography>
                </Box>

                <Stack direction="row" justifyContent="space-between" alignItems="center" mt={3}>
                  <Chip 
                    label={statusMap[room.displayStatus].label} 
                    size="small" 
                    sx={{ 
                      fontWeight: 800, 
                      fontSize: '0.6rem', 
                      bgcolor: statusMap[room.displayStatus].color, 
                      color: '#fff',
                      px: 0.5
                    }} 
                  />
                  <Typography variant="subtitle2" fontWeight={800} color="#2d3436">
  {room.price ? `${room.price.toLocaleString()}đ` : 'Liên hệ'}
</Typography>
                </Stack>
              </Paper>
            </Grid>
          ))}
        </Grid>
      )}

      {/* CHI TIẾT KHI CLICK (POPOVER) */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        transformOrigin={{ vertical: 'top', horizontal: 'center' }}
        PaperProps={{ sx: { borderRadius: 4, boxShadow: '0 10px 40px rgba(0,0,0,0.12)', minWidth: 280, p: 1 } }}
      >
        {popoverData && (
          <Box p={1.5}>
            {popoverData.bookingDetails ? (
              <Box mb={2} p={2} sx={{ bgcolor: '#fff5f5', borderRadius: 3, border: '1px solid #ffe3e3' }}>
                <Typography variant="subtitle2" color="error" fontWeight={800} mb={1}>Thông tin khách đang thuê</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}><b>Khách:</b> {popoverData.bookingDetails.customerName}</Typography>
                <Typography variant="body2" sx={{ mb: 0.5 }}><b>Trả phòng:</b> {new Date(popoverData.bookingDetails.checkOut).toLocaleDateString('vi-VN')}</Typography>
                <Typography variant="body2"><b>Thanh toán:</b> 
                   <Chip label={popoverData.bookingDetails.paymentStatus} size="small" color="primary" sx={{ ml: 1, height: 18, fontSize: '0.6rem' }} />
                </Typography>
              </Box>
            ) : (
              <Box mb={2} p={2} sx={{ bgcolor: '#f0fff4', borderRadius: 3, border: '1px solid #c6f6d5' }}>
                <Typography variant="subtitle2" fontWeight={800} color="success.main">Phòng trống</Typography>
                <Typography variant="caption" color="text.secondary">Sẵn sàng để đón khách hoặc thực hiện bảo trì định kỳ.</Typography>
              </Box>
            )}

            <Stack spacing={1.5}>
               {popoverData.displayStatus === 'maintenance' ? (
                 <Button 
                    fullWidth 
                    variant="contained" 
                    color="success" 
                    startIcon={<CheckCircleIcon />}
                    onClick={() => handleUpdateStatus(popoverData._id, 'active')}
                    sx={{ borderRadius: 2, fontWeight: 700 }}
                 >
                   Hoàn tất bảo trì
                 </Button>
               ) : (
                 !popoverData.bookingDetails && (
                   <Button 
                      fullWidth 
                      variant="outlined" 
                      color="inherit" 
                      startIcon={<BuildIcon />}
                      onClick={() => handleUpdateStatus(popoverData._id, 'maintenance')}
                      sx={{ borderRadius: 2, fontWeight: 700, borderColor: '#ddd' }}
                   >
                     Bắt đầu bảo trì
                   </Button>
                 )
               )}
            </Stack>
          </Box>
        )}
      </Popover>

      {/* THÔNG BÁO (TOAST) */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={() => setSnackbar({ ...snackbar, open: false })}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
      >
        <Alert severity={snackbar.severity} sx={{ width: '100%', borderRadius: 2, fontWeight: 600 }}>
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}