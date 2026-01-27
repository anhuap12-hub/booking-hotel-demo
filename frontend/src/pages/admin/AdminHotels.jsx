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
        // Giả định Backend trả về cấu trúc { success: true, data: [...] }
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
      const matchesName = hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || hotel.type === typeFilter;
      const matchesCity = cityFilter === "all" || hotel.city === cityFilter;
      return matchesName && matchesType && matchesCity;
    });
  }, [hotels, searchTerm, typeFilter, cityFilter]);

  const uniqueCities = useMemo(() => {
    const cities = hotels.map((h) => h.city);
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
          sx={{ bgcolor: "#3E2C1C", "&:hover": { bgcolor: "#2F2116" } }}
        >
          Thêm Khách Sạn
        </Button>
      </Stack>

      <Paper sx={{ p: 2, borderRadius: 2 }}>
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

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F5F3EF" }}>
              <TableCell><b>Thông tin khách sạn</b></TableCell>
              <TableCell><b>Địa điểm</b></TableCell>
              <TableCell align="center"><b>Giá từ</b></TableCell>
              <TableCell align="center"><b>Phòng</b></TableCell>
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
                        sx={{ width: 60, height: 60, border: "1px solid #eee" }}
                      >
                        H
                      </Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight="bold">
                          {hotel.name}
                        </Typography>
                        <Typography variant="caption" sx={{ textTransform: "capitalize", color: "gray" }}>
                          {hotel.type}
                        </Typography>
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell>
                    <Typography variant="body2">{hotel.city}</Typography>
                    <Typography variant="caption" color="text.secondary">{hotel.address}</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography fontWeight="bold" color="#2E7D32">
                      {hotel.cheapestPrice > 0 
                        ? `${hotel.cheapestPrice.toLocaleString("vi-VN")}đ` 
                        : "---"}
                    </Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Typography variant="body2">{hotel.rooms?.length || 0} phòng</Typography>
                  </TableCell>

                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        onClick={() => navigate(`/admin/hotels/${hotel._id}/edit`)}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="contained"
                        size="small"
                        color="success"
                        onClick={() => navigate(`/admin/hotels/${hotel._id}/rooms`)}
                      >
                        DS Phòng
                      </Button>
                      <Button
                        variant="outlined"
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
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  Không tìm thấy dữ liệu
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