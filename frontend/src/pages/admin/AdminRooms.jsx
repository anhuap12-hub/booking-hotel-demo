import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { getRoomsByHotel, deleteRoom } from "../../api/room.api";
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
  Chip
} from "@mui/material";

export default function AdminRooms() {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRoomsByHotel(hotelId);
        // Backend trả về: { success: true, hotel: {...}, rooms: [...] }
        setHotel(res.data.hotel);
        setRooms(res.data.rooms);
      } catch (err) {
        console.error("Error fetching rooms:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [hotelId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa phòng này? Giá khách sạn sẽ được tính toán lại.")) return;
    try {
      await deleteRoom(id);
      setRooms((prev) => prev.filter((r) => r._id !== id));
      // Lưu ý: Backend đã tự chạy syncHotelPrice sau khi xóa
    } catch (err) {
      alert("Không thể xóa phòng. Vui lòng thử lại."), err;
    }
  };

  // Hàm hiển thị tag trạng thái đẹp mắt
  const getStatusChip = (status) => {
    const config = {
      active: { label: "Sẵn sàng", color: "success" },
      maintenance: { label: "Bảo trì", color: "warning" },
      inactive: { label: "Tạm ngưng", color: "error" }
    };
    const { label, color } = config[status] || { label: status, color: "default" };
    return <Chip label={label} color={color} size="small" variant="outlined" />;
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
        <Box>
          <Typography variant="h4" fontWeight="bold" color="#3E2C1C">
            Danh sách phòng
          </Typography>
          <Typography variant="subtitle1" color="text.secondary">
            Khách sạn: {hotel?.name}
          </Typography>
        </Box>
        <Button
          variant="contained"
          component={Link}
          to={`/admin/hotels/${hotelId}/rooms/new`}
          sx={{ bgcolor: "#3E2C1C", "&:hover": { bgcolor: "#2F2116" } }}
        >
          Thêm phòng mới
        </Button>
      </Stack>

      <TableContainer component={Paper} elevation={2} sx={{ borderRadius: 2 }}>
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
            {rooms.length > 0 ? (
              rooms.map((room) => (
                <TableRow key={room._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>{room.name}</TableCell>
                  <TableCell sx={{ textTransform: "capitalize" }}>{room.type}</TableCell>
                  <TableCell align="center">
                    {room.price?.toLocaleString("vi-VN")}đ
                  </TableCell>
                  <TableCell align="center">{room.maxPeople} người</TableCell>
                  <TableCell align="center">
                    {getStatusChip(room.status)}
                  </TableCell>
                  <TableCell align="center">
                    <Stack direction="row" spacing={1} justifyContent="center">
                      <Button
                        variant="outlined"
                        size="small"
                        component={Link}
                        to={`/admin/rooms/${room._id}/edit`}
                      >
                        Sửa
                      </Button>
                      <Button
                        variant="outlined"
                        size="small"
                        color="error"
                        onClick={() => handleDelete(room._id)}
                      >
                        Xóa
                      </Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                  Chưa có phòng nào được tạo cho khách sạn này.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}