import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRoomsByHotel, deleteRoom } from "../../api/room.api";
import { getHotelById } from "../../api/hotel.api"; // Import thêm hàm này
import {
  Typography,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Button,
  Stack,
  Paper,
  TableContainer,
  CircularProgress,
  Box,
  Chip,
  Breadcrumbs
} from "@mui/material";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";

export default function AdminRooms() {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Chạy song song cả 2 API để tối ưu tốc độ
        const [roomsRes, hotelRes] = await Promise.all([
          getRoomsByHotel(hotelId),
          getHotelById(hotelId)
        ]);

        // Fix cấu trúc data theo trang Public của bạn
        setRooms(roomsRes.data?.data || []);
        setHotel(hotelRes.data?.data || hotelRes.data); // Tùy vào Backend trả về {data: {}} hay trực tiếp {}
      } catch (err) {
        console.error("Lỗi fetch dữ liệu Admin:", err);
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) fetchData();
  }, [hotelId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này?")) return;
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r._id !== id));
    } catch (err) {
      alert("Không thể xóa phòng.");
    }
  };

  const getStatusChip = (status) => {
    const config = {
      active: { label: "Sẵn sàng", color: "success" },
      maintenance: { label: "Bảo trì", color: "warning" },
      inactive: { label: "Tạm ngưng", color: "error" }
    };
    const { label, color } = config[status] || { label: status, color: "default" };
    return <Chip label={label} color={color} size="small" variant="outlined" />;
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" py={10}><CircularProgress sx={{ color: "#3E2C1C" }} /></Box>
  );

  return (
    <Stack spacing={3} sx={{ p: { xs: 2, md: 4 } }}>
      {/* Breadcrumbs cho chuyên nghiệp */}
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        <Link component={Link} to="/admin/hotels" underline="hover" color="inherit">Quản lý khách sạn</Link>
        <Typography color="text.primary">Danh sách phòng</Typography>
      </Breadcrumbs>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#3E2C1C">
            {hotel?.name || "Chi tiết phòng"}
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Địa chỉ: {hotel?.address || "Đang cập nhật..."}
          </Typography>
        </Box>
        <Button
          variant="contained"
          component={Link}
          to={`/admin/hotels/${hotelId}/rooms/new`}
          sx={{ bgcolor: "#3E2C1C", "&:hover": { bgcolor: "#2F2116" }, borderRadius: 2 }}
        >
          Thêm phòng mới
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: 3, border: '1px solid #e0e0e0' }}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#F5F3EF" }}>
              <TableCell><b>Tên / Số phòng</b></TableCell>
              <TableCell><b>Loại</b></TableCell>
              <TableCell align="center"><b>Giá / Đêm</b></TableCell>
              <TableCell align="center"><b>Sức chứa</b></TableCell>
              <TableCell align="center"><b>Trạng thái</b></TableCell>
              <TableCell align="center"><b>Hành động</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms?.length > 0 ? (
              rooms.map((room) => (
                <TableRow key={room._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{room.name}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>{room.type}</TableCell>
                  <TableCell align="center">{room.price?.toLocaleString("vi-VN")}đ</TableCell>
                  <TableCell align="center">{room.maxPeople} người</TableCell>
                  <TableCell align="center">{getStatusChip(room.status)}</TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button variant="outlined" size="small" component={Link} to={`/admin/rooms/${room._id}/edit`}>Sửa</Button>
                      <Button variant="outlined" size="small" color="error" onClick={() => handleDelete(room._id)}>Xóa</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 5 }}>
                  <Typography color="text.secondary">Khách sạn này hiện chưa có phòng nào.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}