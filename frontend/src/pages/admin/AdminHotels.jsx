import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState, useMemo } from "react";
import axios from "../../api/axios";
import {
  Button,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Typography,
  Stack,
  Paper,
  TableContainer,
  CircularProgress,
  Box,
  TextField,
  MenuItem,
  Avatar,
  Chip,
} from "@mui/material";

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
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesName = (hotel.name || "").toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || hotel.type === typeFilter;
      const matchesCity = cityFilter === "all" || hotel.city === cityFilter;
      return matchesName && matchesType && matchesCity;
    });
  }, [hotels, searchTerm, typeFilter, cityFilter]);

  const uniqueCities = useMemo(() => {
    const cities = hotels.map((h) => h.city).filter(Boolean);
    return ["all", ...new Set(cities)];
  }, [hotels]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa khách sạn này và toàn bộ phòng liên quan?")) return;
    try {
      await axios.delete(`/hotels/${id}`);
      setHotels((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xóa khách sạn");
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={10}>
        <CircularProgress sx={{ color: "#3E2C1C" }} />
      </Box>
    );

  return (
    <Stack spacing={3} sx={{ p: { xs: 2, md: 4 } }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" fontWeight="bold" color="#3E2C1C">
          Quản Lý Khách Sạn
        </Typography>
        <Button
          variant="contained"
          component={Link}
          to="/admin/hotels/new"
          sx={{ bgcolor: "#3E2C1C", "&:hover": { bgcolor: "#2F2116" }, textTransform: 'none' }}
        >
          Thêm Khách Sạn Mới
        </Button>
      </Stack>

      <Paper sx={{ p: 2, borderRadius: 2, border: '1px solid #E5E2DC' }} elevation={0}>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          <TextField
            label="Tìm theo tên..."
            size="small"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <TextField
            select
            label="Loại hình"
            size="small"
            sx={{ minWidth: 150 }}
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <MenuItem value="all">Tất cả</MenuItem>
            <MenuItem value="hotel">Khách sạn</MenuItem>
            <MenuItem value="apartment">Căn hộ</MenuItem>
            <MenuItem value="resort">Resort</MenuItem>
            <MenuItem value="villa">Villa</MenuItem>
          </TextField>
          <TextField
            select
            label="Thành phố"
            size="small"
            sx={{ minWidth: 150 }}
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
          >
            {uniqueCities.map((city) => (
              <MenuItem key={city} value={city}>
                {city === "all" ? "Tất cả thành phố" : city}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Paper>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 2, border: '1px solid #E5E2DC' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F9F8F6" }}>
              <TableCell><b>Thông tin khách sạn</b></TableCell>
              <TableCell><b>Địa điểm</b></TableCell>
              <TableCell align="center"><b>Trạng thái</b></TableCell>
              <TableCell align="center"><b>Quy mô</b></TableCell>
              <TableCell align="center"><b>Hành động</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => (
                <TableRow key={hotel._id} hover>
                  <TableCell>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar
                        src={hotel.photos?.[0]?.url || ""} 
                        variant="rounded"
                        sx={{ width: 55, height: 55, border: "1px solid #eee", bgcolor: '#F0EBE3', color: '#3E2C1C' }}
                      >
                        {hotel.name?.charAt(0)}
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {hotel.name}
                        </Typography>
                        <Typography variant="caption" sx={{ textTransform: "uppercase", color: "#C2A56D", fontWeight: 600 }}>
                          {hotel.type}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{hotel.city}</Typography>
                    <Typography variant="caption" color="text.secondary" noWrap sx={{ display: 'block', maxWidth: 200 }}>
                      {hotel.address}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Chip 
                      label={hotel.status === "active" ? "Hoạt động" : "Tạm ngưng"}
                      color={hotel.status === "active" ? "success" : "default"}
                      size="small"
                      variant="soft"
                      sx={{ fontWeight: 600, fontSize: '0.75rem' }}
                    />
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2" fontWeight={600}>
                      {hotel.rooms?.length || 0}
                    </Typography>
                    <Typography variant="caption" color="text.secondary">phòng</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        sx={{ color: '#3E2C1C', borderColor: '#3E2C1C' }}
                        onClick={() => navigate(`/admin/hotels/${hotel._id}/edit`)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        sx={{ bgcolor: '#C2A56D', '&:hover': { bgcolor: '#B1945C' } }}
                        onClick={() => navigate(`/admin/hotels/${hotel._id}/rooms`)}
                      >
                        Phòng
                      </Button>
                      <Button
                        variant="text"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(hotel._id)}
                      >
                        Xóa
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 6 }}>
                  <Typography color="text.secondary">Không tìm thấy khách sạn nào khớp với bộ lọc</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
};

export default AdminHotels;