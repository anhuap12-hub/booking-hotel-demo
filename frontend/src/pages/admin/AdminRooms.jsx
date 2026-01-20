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
} from "@mui/material";

export default function AdminRooms() {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getRoomsByHotel(hotelId).then((res) => {
      setHotel(res.data.hotel);
      setRooms(res.data.rooms);
      setLoading(false);
    });
  }, [hotelId]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this room?")) return;
    await deleteRoom(id);
    setRooms((prev) => prev.filter((r) => r._id !== id));
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
        Rooms of {hotel?.name}
      </Typography>
      <Button
        variant="contained"
        component={Link}
        to={`/admin/hotels/${hotelId}/rooms/new`}
        sx={{ alignSelf: "flex-start" }}
      >
        Add Room
      </Button>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0f4f8" }}>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>Price</b></TableCell>
              <TableCell><b>Max People</b></TableCell>
              <TableCell><b>Status</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rooms.map((room) => (
              <TableRow key={room._id} hover>
                <TableCell>{room.name}</TableCell>
                <TableCell>
                  VND {room.price?.toLocaleString("vi-VN")}
                </TableCell>
                <TableCell>{room.maxPeople}</TableCell>
                <TableCell>{room.status}</TableCell>
                <TableCell>
                  <Stack direction="row" spacing={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      component={Link}
                      to={`/admin/rooms/${room._id}/edit`}
                    >
                      Edit
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      color="error"
                      onClick={() => handleDelete(room._id)}
                    >
                      Delete
                    </Button>
                  </Stack>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Stack>
  );
}
