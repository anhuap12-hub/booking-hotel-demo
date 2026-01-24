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
  
  // State phục vụ việc lọc
  const [searchTerm, setSearchTerm] = useState("");
  const [typeFilter, setTypeFilter] = useState("all");
  const [cityFilter, setCityFilter] = useState("all");

  const navigate = useNavigate();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await axios.get("/hotels");
        setHotels(res.data.data || []);
      } catch (err) {
        console.error("Error fetching hotels:", err);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  // ✅ LOGIC LỌC DỮ LIỆU TẠI FRONTEND
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      const matchesName = hotel.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesType = typeFilter === "all" || hotel.type === typeFilter;
      const matchesCity = cityFilter === "all" || hotel.city === cityFilter;
      return matchesName && matchesType && matchesCity;
    });
  }, [hotels, searchTerm, typeFilter, cityFilter]);

  // ✅ LẤY DANH SÁCH CITY DUY NHẤT ĐỂ LÀM DROPDOWN
  const uniqueCities = useMemo(() => {
    const cities = hotels.map((h) => h.city);
    return ["all", ...new Set(cities)];
  }, [hotels]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this hotel?")) return;
    try {
      await axios.delete(`/admin/hotels/${id}`);
      setHotels((prev) => prev.filter((h) => h._id !== id));
    } catch (err) {
      console.error(err);
    }
  };

  if (loading)
    return (
      <Box display="flex" justifyContent="center" py={5}>
        <CircularProgress />
      </Box>
    );

  return (
    <Stack spacing={3}>
      <Typography variant="h4" fontWeight="bold">
        Manage Hotels
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={2} justifyContent="space-between">
        <Button
          variant="contained"
          component={Link}
          to="/admin/hotels/new"
          sx={{ alignSelf: "flex-start", height: "fit-content" }}
        >
          Add Hotel
        </Button>

        {/* ✅ BỘ LỌC TÌM KIẾM */}
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} flex={1} justifyContent="flex-end">
          <TextField
            label="Search by name..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ minWidth: 200 }}
          />
          <TextField
            select
            label="Type"
            size="small"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
            sx={{ minWidth: 120 }}
          >
            <MenuItem value="all">All Types</MenuItem>
            <MenuItem value="hotel">Hotel</MenuItem>
            <MenuItem value="apartment">Apartment</MenuItem>
            <MenuItem value="resort">Resort</MenuItem>
            <MenuItem value="villa">Villa</MenuItem>
          </TextField>
          <TextField
            select
            label="City"
            size="small"
            value={cityFilter}
            onChange={(e) => setCityFilter(e.target.value)}
            sx={{ minWidth: 150 }}
          >
            {uniqueCities.map((city) => (
              <MenuItem key={city} value={city}>
                {city === "all" ? "All Cities" : city}
              </MenuItem>
            ))}
          </TextField>
        </Stack>
      </Stack>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0f4f8" }}>
              <TableCell><b>Hotel</b></TableCell> {/* Gộp ảnh và tên */}
              <TableCell><b>City</b></TableCell>
              <TableCell><b>Address</b></TableCell>
              <TableCell><b>Price (from room)</b></TableCell>
              <TableCell><b>Rooms</b></TableCell>
              <TableCell><b>Images</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {filteredHotels.length > 0 ? (
              filteredHotels.map((hotel) => {
                const minRoomPrice = (() => {
                  if (!Array.isArray(hotel.rooms)) return null;
                  const prices = hotel.rooms
                    .map((r) => r.price)
                    .filter((p) => typeof p === "number");
                  if (!prices.length) return null;
                  return Math.min(...prices);
                })();

                return (
                  <TableRow key={hotel._id} hover>
                    <TableCell>
                      {/* ✅ HIỂN THỊ ẢNH BÊN TRÁI TÊN */}
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar
                          src={hotel.photos?.[0]} // Lấy ảnh đầu tiên
                          variant="rounded"
                          sx={{ width: 50, height: 50, border: "1px solid #ddd" }}
                        >
                          H
                        </Avatar>
                        <Box>
                          <Typography variant="body2" fontWeight="bold">
                            {hotel.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary" sx={{ textTransform: "capitalize" }}>
                            {hotel.type}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>{hotel.city}</TableCell>
                    <TableCell>{hotel.address}</TableCell>

                    <TableCell>
                      {minRoomPrice
                        ? `${minRoomPrice.toLocaleString("vi-VN")} VND`
                        : "Chưa có phòng"}
                    </TableCell>

                    <TableCell>{hotel.rooms?.length || 0}</TableCell>
                    <TableCell>{hotel.photos?.length || 0}</TableCell>

                    <TableCell>
                      <Stack direction="row" spacing={1}>
                        <Button
                          variant="outlined"
                          size="small"
                          component={Link}
                          to={`/admin/hotels/${hotel._id}/edit`}
                        >
                          Edit
                        </Button>

                        <Button
                          variant="outlined"
                          size="small"
                          color="error"
                          onClick={() => handleDelete(hotel._id)}
                        >
                          Delete
                        </Button>

                        <Button
                          variant="contained"
                          size="small"
                          color="success"
                          onClick={() =>
                            navigate(`/admin/hotels/${hotel._id}/rooms`)
                          }
                        >
                          Rooms
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={7} align="center">
                  <Typography variant="body2" sx={{ py: 2 }}>
                    Không tìm thấy khách sạn nào phù hợp
                  </Typography>
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