import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
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
} from "@mui/material";

const AdminHotels = () => {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
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

      <Button
        variant="contained"
        component={Link}
        to="/admin/hotels/new"
        sx={{ alignSelf: "flex-start" }}
      >
        Add Hotel
      </Button>

      <TableContainer component={Paper} elevation={3}>
        <Table>
          <TableHead>
            <TableRow sx={{ bgcolor: "#f0f4f8" }}>
              <TableCell><b>Name</b></TableCell>
              <TableCell><b>City</b></TableCell>
              <TableCell><b>Address</b></TableCell>
              <TableCell><b>Price (from room)</b></TableCell>
              <TableCell><b>Rooms</b></TableCell>
              <TableCell><b>Images</b></TableCell>
              <TableCell><b>Actions</b></TableCell>
            </TableRow>
          </TableHead>

          <TableBody>
            {Array.isArray(hotels) && hotels.length > 0 ? (
              hotels.map((hotel) => {
                // ✅ TÍNH GIÁ THẤP NHẤT TỪ ROOMS
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
                    <TableCell>{hotel.name}</TableCell>
                    <TableCell>{hotel.city}</TableCell>
                    <TableCell>{hotel.address}</TableCell>

                    <TableCell>
                      {minRoomPrice
                        ? `VND ${minRoomPrice.toLocaleString("vi-VN")}`
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
                  Không có khách sạn nào
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
