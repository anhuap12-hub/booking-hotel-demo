import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "../../api/axios";
import {
  Button, Table, TableHead, TableRow, TableCell, TableBody,
  Typography, Stack, Paper, TableContainer, CircularProgress,
  Box, TextField, MenuItem, Avatar, Chip, IconButton
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get("/hotels");
        setHotels(res.data.data || res.data || []);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    fetchHotels();
  }, []);

  const filteredHotels = useMemo(() => {
    return hotels.filter((h) => {
      return (h.name || "").toLowerCase().includes(searchTerm.toLowerCase()) &&
        (typeFilter === "all" || h.type === typeFilter) &&
        (cityFilter === "all" || h.city === cityFilter);
    });
  }, [hotels, searchTerm, typeFilter, cityFilter]);

  const uniqueCities = useMemo(() => ["all", ...new Set(hotels.map((h) => h.city).filter(Boolean))], [hotels]);

  const handleDelete = async (id) => {
    if (!window.confirm("Xóa khách sạn này?")) return;
    try {
      await axios.delete(`/hotels/${id}`);
      setHotels((prev) => prev.filter((h) => h._id !== id));
    } catch (err) { alert("Lỗi xóa khách sạn"); }
  };

  if (loading) return <Box display="flex" justifyContent="center" py={10}><CircularProgress sx={{ color: '#2D3436' }} /></Box>;

  return (
    <Stack spacing={3} sx={{ p: { xs: 2, md: 4 }, bgcolor: '#F8F9FA', minHeight: '100vh' }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="800" sx={{ color: '#2D3436' }}>Danh mục Khách sạn</Typography>
        </Box>
        <Button variant="contained" component={Link} to="/admin/hotels/new" startIcon={<AddIcon />}
          sx={{ bgcolor: '#2D3436', '&:hover': { bgcolor: '#000' }, borderRadius: 2 }}>Thêm mới</Button>
      </Stack>

      <Paper sx={{ p: 2, borderRadius: 3, display: 'flex', gap: 2, boxShadow: 'none', border: '1px solid #EEE' }}>
        <TextField label="Tìm tên..." size="small" fullWidth value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        <TextField select label="Loại" size="small" sx={{ minWidth: 120 }} value={typeFilter} onChange={(e) => setTypeFilter(e.target.value)}>
          <MenuItem value="all">Tất cả</MenuItem>
          {['hotel', 'apartment', 'resort', 'villa'].map(t => <MenuItem key={t} value={t}>{t.toUpperCase()}</MenuItem>)}
        </TextField>
      </Paper>

      <TableContainer component={Paper} sx={{ borderRadius: 3, boxShadow: 'none', border: '1px solid #EEE' }}>
        <Table sx={{ tableLayout: 'fixed', minWidth: 900 }}>
          <TableHead sx={{ bgcolor: '#F4F6F8' }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700, width: '25%' }}>Khách sạn</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '15%' }}>Địa điểm</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '12%' }} align="center">Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '18%' }} align="center">Trạng thái phòng</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '10%' }} align="center">Số phòng</TableCell>
              <TableCell sx={{ fontWeight: 700, width: '20%' }} align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {filteredHotels.map((hotel) => {
              const roomsList = Array.isArray(hotel.rooms) ? hotel.rooms : [];
              const hasMaintenance = roomsList.some(r => r.status === 'maintenance');
              const hasActive = roomsList.some(r => r.status === 'active');
              
              return (
                <TableRow key={hotel._id} hover sx={{ '& td': { borderBottom: '1px solid #EEE', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' } }}>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center" sx={{ overflow: 'hidden' }}>
                      <Avatar src={hotel.photos?.[0]?.url} variant="rounded" sx={{ width: 45, height: 45 }} />
                      <Box sx={{ overflow: 'hidden' }}>
                        <Typography fontWeight="700" noWrap>{hotel.name}</Typography>
                        <Typography variant="caption" sx={{ color: '#636E72', textTransform: 'uppercase' }}>{hotel.type}</Typography>
                      </Box>
                    </Stack>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">{hotel.city}</Typography>
                    <Typography variant="caption" sx={{ display: 'block' }}>{hotel.address}</Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={hotel.status === "active" ? "Hoạt động" : "Tạm dừng"} color={hotel.status === "active" ? "success" : "default"} size="small" />
                  </TableCell>
                  <TableCell align="center">
                    <Chip label={hasMaintenance ? "Có bảo trì" : (hasActive ? "Sẵn sàng" : "Trống")} 
                          color={hasMaintenance ? "warning" : "info"} size="small" variant="outlined" />
                  </TableCell>
                  <TableCell align="center">{roomsList.length} phòng</TableCell>
                  <TableCell align="center">
                    <IconButton size="small" color="primary" onClick={() => navigate(`/admin/hotels/${hotel._id}/edit`)}><EditIcon fontSize="small"/></IconButton>
                    <IconButton size="small" sx={{ color: '#D63031' }} onClick={() => handleDelete(hotel._id)}><DeleteOutlineIcon fontSize="small"/></IconButton>
                    <Button variant="outlined" size="small" sx={{ ml: 1, borderRadius: 2 }} onClick={() => navigate(`/admin/hotels/${hotel._id}/rooms`)}>Quản lý</Button>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};
export default AdminHotels;