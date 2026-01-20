import { useState, useMemo, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  Alert,
  Box,
  Divider,
  Stack,
} from "@mui/material";
import { createBooking } from "../../api/booking.api";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BookingDialog({ open, onClose, room }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    if (!open) {
      setCheckIn("");
      setCheckOut("");
      setGuestsCount(1);
      setGuestName("");
      setGuestPhone("");
      setError("");
      setSuccess(false);
    }
  }, [open]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end - start) / 86400000;
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  if (!room) return null;

  const totalPrice = nights * room.price;

  const handleSubmit = async () => {
    if (!user) return setError("Vui lòng đăng nhập");
    if (nights <= 0) return setError("Ngày không hợp lệ");
    if (!guestName || !guestPhone)
      return setError("Vui lòng nhập đủ thông tin khách");

    try {
      setLoading(true);
      setError("");

      await createBooking({
        room: room._id,
        checkIn,
        checkOut,
        guestsCount,
        guest: {
          name: guestName,
          phone: guestPhone,
          email: user.email,
        },
      });

      setSuccess(true);
      setTimeout(() => {
        onClose();
        navigate("/my-bookings");
      }, 800);
    } catch (err) {
      setError(err.response?.data?.message || "Đặt phòng thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ fontFamily: "Playfair Display, serif" }}>
        {room.name}
      </DialogTitle>

      <DialogContent>
        {error && <Alert severity="error">{error}</Alert>}
        {success && <Alert severity="success">Đặt phòng thành công</Alert>}

        <Stack spacing={2} mt={2}>
          <TextField
            label="Nhận phòng"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={checkIn}
            onChange={(e) => setCheckIn(e.target.value)}
          />

          <TextField
            label="Trả phòng"
            type="date"
            InputLabelProps={{ shrink: true }}
            fullWidth
            value={checkOut}
            onChange={(e) => setCheckOut(e.target.value)}
          />

          <TextField
            label="Số khách"
            type="number"
            fullWidth
            inputProps={{ min: 1, max: room.maxPeople }}
            value={guestsCount}
            onChange={(e) => setGuestsCount(+e.target.value)}
          />

          <TextField
            label="Tên khách"
            fullWidth
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />

          <TextField
            label="Số điện thoại"
            fullWidth
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
          />
        </Stack>

        {nights > 0 && (
          <Box mt={3}>
            <Divider />
            <Typography mt={2}>
              {nights} đêm × {room.price.toLocaleString("vi-VN")} ₫
            </Typography>
            <Typography fontWeight={600}>
              Tổng: {totalPrice.toLocaleString("vi-VN")} ₫
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Huỷ</Button>
        <Button
          variant="contained"
          disabled={loading || success}
          onClick={handleSubmit}
        >
          Xác nhận đặt phòng
        </Button>
      </DialogActions>
    </Dialog>
  );
}
