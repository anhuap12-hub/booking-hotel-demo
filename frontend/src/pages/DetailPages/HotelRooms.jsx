import {
  Box,
  Container,
  Typography,
  Stack,
  Divider,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "../../api/axios";
import RoomCard from "../../components/Room/RoomCard";
import BookingDialog from "../../components/Booking/BookingDialog";

export default function HotelRoom() {
  const { hotelId } = useParams();
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  useEffect(() => {
    const fetchRooms = async () => {
      const res = await axios.get(`/rooms/hotel/${hotelId}`);
      setRooms(res.data.rooms || []);
      setHotel(res.data.hotel);
    };
    fetchRooms();
  }, [hotelId]);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      {/* ===== Hero Banner ===== */}
      <Box
        sx={{
          height: 440,
          width: "100vw",
          ml: "calc(-50vw + 50%)",
          backgroundImage:
            "url(https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg)",
          backgroundSize: "cover",
          backgroundPosition: "center",
          position: "relative",
        }}
      >
        {/* Overlay trầm */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(28,28,28,0.35), rgba(28,28,28,0.75))",
          }}
        />

        <Container
          sx={{
            position: "relative",
            height: "100%",
            display: "flex",
            alignItems: "flex-end",
            pb: 6,
          }}
        >
          <Stack spacing={1.2}>
            <Typography variant="h3" sx={{ color: "#fff" }}>
              {hotel?.name}
            </Typography>

            <Typography
              variant="body2"
              sx={{
                color: "rgba(255,255,255,0.75)",
                maxWidth: 520,
                fontStyle: "italic",
              }}
            >
              “Một nơi đủ yên tĩnh để chậm lại,  
              nhấp một ngụm cà phê và để thời gian trôi qua.”
            </Typography>
          </Stack>
        </Container>
      </Box>

      {/* ===== Rooms Section ===== */}
      <Container sx={{ py: 8 }}>
        <Stack spacing={3}>
          <Stack spacing={1}>
            <Typography variant="h4">
              Các phòng đang sẵn sàng
            </Typography>

            <Typography variant="body2" color="text.secondary">
              “Không phải nơi để vội vàng,  
              mà là nơi để nghỉ ngơi.”
            </Typography>
          </Stack>

          <Divider />

          <Stack spacing={4}>
            {rooms.map((room) => (
              <RoomCard
                key={room._id}
                room={room}
                onBook={(room) => {
                  setSelectedRoom(room);
                  setOpen(true);
                }}
              />
            ))}
          </Stack>
        </Stack>
      </Container>

      {/* ===== Booking Dialog ===== */}
      <BookingDialog
        open={open}
        room={selectedRoom}
        onClose={() => {
          setOpen(false);
          setSelectedRoom(null);
        }}
      />
    </Box>
  );
}
