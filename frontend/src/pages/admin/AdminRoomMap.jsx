import React, { useEffect, useState } from 'react';
import { Box, Grid, Paper, Typography, Stack, Chip, Tooltip, CircularProgress, Popover } from '@mui/material';
import { getAdminRoomMap } from '../../api/admin.api'; 

const statusMap = {
  available: { color: '#4caf50', label: 'Trống', desc: 'Sẵn sàng đón khách' },
  occupied: { color: '#f44336', label: 'Đang ở', desc: 'Khách đã nhận phòng' },
  booked: { color: '#ff9800', label: 'Đã đặt', desc: 'Chưa thanh toán/Chưa check-in' },
  maintenance: { color: '#757575', label: 'Bảo trì', desc: 'Đang sửa chữa' },
  inactive: { color: '#9e9e9e', label: 'Ngừng bán', desc: 'Đang đóng cửa' },
};

export default function AdminRoomMap() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState(null);

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
    try {
      const res = await getAdminRoomMap();
      setRooms(res.data);
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  };

  const handleOpenPopover = (event, room) => {
    if (room.bookingDetails) {
      setAnchorEl(event.currentTarget);
      setPopoverData(room);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" py={10}><CircularProgress /></Box>;

  return (
    <Box p={3}>
      <Typography variant="h5" fontWeight={700} mb={3}>Sơ Đồ Phòng Real-time</Typography>
      
      {/* Legend */}
      <Stack direction="row" spacing={3} mb={4} flexWrap="wrap">
        {Object.entries(statusMap).map(([key, value]) => (
          <Stack key={key} direction="row" alignItems="center" spacing={1}>
            <Box sx={{ width: 14, height: 14, bgcolor: value.color, borderRadius: '3px' }} />
            <Typography variant="caption" fontWeight={600}>{value.label}</Typography>
          </Stack>
        ))}
      </Stack>

      <Grid container spacing={2}>
        {rooms.map((room) => (
          <Grid item xs={6} sm={4} md={3} lg={2} key={room._id}>
            <Paper
              elevation={2}
              onClick={(e) => handleOpenPopover(e, room)}
              sx={{
                p: 2,
                cursor: room.bookingDetails ? 'pointer' : 'default',
                borderLeft: `6px solid ${statusMap[room.displayStatus].color}`,
                transition: '0.2s',
                '&:hover': { transform: 'translateY(-3px)', boxShadow: 4 }
              }}
            >
              <Typography variant="h6" fontWeight={800}>{room.roomName}</Typography>
              <Typography variant="caption" color="text.secondary" sx={{ textTransform: 'uppercase' }}>
                {room.roomType}
              </Typography>
              <Box mt={1}>
                <Chip 
                   label={statusMap[room.displayStatus].label} 
                   size="small" 
                   sx={{ height: 20, fontSize: '0.65rem', bgcolor: statusMap[room.displayStatus].color, color: '#fff' }} 
                />
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Popover xem nhanh thông tin khách */}
      <Popover
        open={Boolean(anchorEl)}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        {popoverData && (
          <Box p={2} sx={{ minWidth: 200 }}>
            <Typography variant="subtitle2" color="primary">Thông tin khách thuê:</Typography>
            <Typography variant="body2"><b>Khách:</b> {popoverData.bookingDetails.customerName}</Typography>
            <Typography variant="body2"><b>Trả phòng:</b> {new Date(popoverData.bookingDetails.checkOut).toLocaleDateString()}</Typography>
            <Typography variant="body2"><b>TT:</b> {popoverData.bookingDetails.paymentStatus}</Typography>
          </Box>
        )}
      </Popover>
    </Box>
  );
}