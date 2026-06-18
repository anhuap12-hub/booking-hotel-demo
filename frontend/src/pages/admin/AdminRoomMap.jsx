import React, { useEffect, useState } from 'react';
import { 
  Box, Paper, Typography, Stack, CircularProgress, 
  Popover, Button, Table, TableBody, TableCell, TableContainer, 
  TableHead, TableRow, IconButton, Snackbar, Alert 
} from '@mui/material';
import { getAdminRoomMap, updateRoomStatus } from '../../api/admin.api';
import BuildIcon from '@mui/icons-material/Build';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import SettingsIcon from '@mui/icons-material/Settings';

const statusMap = {
  active: { color: '#4caf50', label: 'Trống' },
  occupied: { color: '#f44336', label: 'Đang ở' },
  booked: { color: '#ff9800', label: 'Đã đặt' },
  maintenance: { color: '#757575', label: 'Bảo trì' },
  inactive: { color: '#212121', label: 'Ngừng hoạt động' },
};

export default function AdminRoomMap() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [anchorEl, setAnchorEl] = useState(null);
  const [popoverData, setPopoverData] = useState(null);
  const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

  useEffect(() => { fetchRooms(); }, []);

  const fetchRooms = async () => {
  try {
    const res = await getAdminRoomMap();
    setRooms(res.data.data || res.data); 
  } catch (err) {
    showSnackbar("Không thể tải sơ đồ phòng", "error");
  } finally {
    setLoading(false);
  }
};

  const showSnackbar = (message, severity = 'success') => {
    setSnackbar({ open: true, message, severity });
  };

  if (loading) return <Box display="flex" justifyContent="center" py={20}><CircularProgress /></Box>;

  return (
    <Box p={3} sx={{ bgcolor: '#f8f9fa', minHeight: '100vh' }}>
      <Typography variant="h5" fontWeight={800} mb={3}>Sơ Đồ Phòng Real-time</Typography>
      
      {/* STATS SECTION */}
      <Stack direction="row" spacing={2} mb={3}>
        {Object.entries(statusMap).map(([key, val]) => (
          <Box key={key} sx={{ px: 2, py: 1, borderRadius: 1, border: '1px solid #ddd', bgcolor: '#fff' }}>
            <Typography variant="body2" fontWeight={700}>{val.label}: {rooms.filter(r => r.displayStatus === key).length}</Typography>
          </Box>
        ))}
      </Stack>
<TableContainer component={Paper} sx={{ borderRadius: 2, border: '1px solid #e0e0e0', boxShadow: 'none' }}>
  <Table>
    <TableHead sx={{ bgcolor: '#f9f9f9' }}>
      <TableRow>
        <TableCell sx={{ fontWeight: 800 }}>Lưu trú</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Địa chỉ</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Phòng</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Tên khách</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Số liên hệ</TableCell>
        <TableCell sx={{ fontWeight: 800 }}>Trạng thái</TableCell>
        <TableCell sx={{ fontWeight: 800 }} align="center">Thao tác</TableCell>
      </TableRow>
    </TableHead>
    <TableBody>
      {rooms.map((room) => {
        const status = statusMap[room.displayStatus] || { color: '#000', label: room.displayStatus };
        return (
          <TableRow key={room._id} hover>
            <TableCell>{room.hotelName || "N/A"}</TableCell>
            <TableCell sx={{ fontSize: '0.85rem', color: '#666' }}>{room.hotelAddress || "N/A"}</TableCell>
            <TableCell sx={{ fontWeight: 600 }}>{room.roomName}</TableCell>
            <TableCell>{room.bookingDetails?.customerName || "Đang trống"}</TableCell>
            <TableCell>
              {room.bookingDetails?.customerPhone ? `Số ĐT: ${room.bookingDetails.customerPhone}` : "Đang trống"}
            </TableCell>
            <TableCell>
              <Box sx={{ 
                px: 1.5, py: 0.5, borderRadius: 1, display: 'inline-block',
                bgcolor: `${status.color}15`, color: status.color, 
                fontWeight: 700, fontSize: '0.85rem', border: `1px solid ${status.color}`
              }}>
                {status.label}
              </Box>
            </TableCell>
            <TableCell align="center">
              <IconButton onClick={(e) => { setAnchorEl(e.currentTarget); setPopoverData(room); }}>
                <SettingsIcon />
              </IconButton>
            </TableCell>
          </TableRow>
        );
      })}
    </TableBody>
  </Table>
</TableContainer>

      <Popover open={Boolean(anchorEl)} anchorEl={anchorEl} onClose={() => setAnchorEl(null)}>
        {popoverData && (
          <Box p={2} sx={{ width: 260 }}>
            <Typography variant="subtitle1" fontWeight={800} mb={1}>{popoverData.roomName}</Typography>
            <Button 
              fullWidth variant="contained" 
              color={popoverData.displayStatus === 'maintenance' ? 'success' : 'inherit'}
              startIcon={popoverData.displayStatus === 'maintenance' ? <CheckCircleIcon /> : <BuildIcon />}
              onClick={async () => {
                await updateRoomStatus(popoverData._id, popoverData.displayStatus === 'maintenance' ? 'active' : 'maintenance');
                setAnchorEl(null);
                fetchRooms();
              }}
            >
              {popoverData.displayStatus === 'maintenance' ? 'Hoàn tất bảo trì' : 'Chuyển bảo trì'}
            </Button>
          </Box>
        )}
      </Popover>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity}>{snackbar.message}</Alert>
      </Snackbar>
    </Box>
  );
}