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
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function BookingDialog({ open, onClose, room }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  // State quản lý form
  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");

  const [error, setError] = useState("");

  // Reset form khi đóng/mở Dialog
  useEffect(() => {
    if (open) {
      // Tự động điền tên khách nếu user đã đăng nhập
      if (user) {
        setGuestName(user.name || "");
      }
    } else {
      setCheckIn("");
      setCheckOut("");
      setGuestsCount(1);
      setGuestName("");
      setGuestPhone("");
      setError("");
    }
  }, [open, user]);

  // Tính số đêm ở
  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end - start) / 86400000; // Chia cho số ms trong 1 ngày
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  if (!room) return null;

  // Tính tổng giá tiền
  const totalPrice = nights * room.price;

  const handleSubmit = () => {
    // 1. Kiểm tra đăng nhập
    if (!user) {
      return setError("Vui lòng đăng nhập để thực hiện đặt phòng.");
    }

    // 2. Validate ngày tháng
    if (nights <= 0) {
      return setError("Ngày nhận phòng và trả phòng không hợp lệ.");
    }

    // 3. Validate thông tin khách hàng
    if (!guestName.trim() || !guestPhone.trim()) {
      return setError("Vui lòng nhập đầy đủ Tên và Số điện thoại để chúng tôi liên hệ.");
    }

    // 4. Chuyển hướng sang trang Checkout kèm theo dữ liệu (State)
    // Dữ liệu này sẽ được trang Checkout sử dụng để gọi API tạo Booking thực tế
    navigate(`/checkout/${room._id}`, {
      state: {
        roomName: room.name,
        hotelName: room.hotel?.name || "Khách sạn",
        checkIn,
        checkOut,
        guestsCount,
        guestName,
        guestPhone,
        totalPrice,
        pricePerNight: room.price
      }
    });

    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle sx={{ 
        fontFamily: "'Playfair Display', serif", 
        fontWeight: 700,
        fontSize: '1.5rem',
        pb: 1
      }}>
        Đặt phòng: {room.name}
      </DialogTitle>

      <DialogContent dividers>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2.5} mt={1}>
          <Box display="flex" gap={2}>
            <TextField
              label="Ngày nhận phòng"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              value={checkIn}
              onChange={(e) => setCheckIn(e.target.value)}
            />
            <TextField
              label="Ngày trả phòng"
              type="date"
              InputLabelProps={{ shrink: true }}
              fullWidth
              required
              value={checkOut}
              onChange={(e) => setCheckOut(e.target.value)}
            />
          </Box>

          <TextField
            label="Số lượng khách"
            type="number"
            fullWidth
            inputProps={{ min: 1, max: room.maxPeople }}
            helperText={`Tối đa ${room.maxPeople} người`}
            value={guestsCount}
            onChange={(e) => setGuestsCount(Math.max(1, parseInt(e.target.value) || 1))}
          />

          <Divider>Thông tin liên hệ</Divider>

          <TextField
            label="Họ tên người nhận phòng"
            placeholder="Nhập tên khách"
            fullWidth
            required
            value={guestName}
            onChange={(e) => setGuestName(e.target.value)}
          />

          <TextField
            label="Số điện thoại liên lạc"
            placeholder="Dùng để đối soát thanh toán"
            fullWidth
            required
            value={guestPhone}
            onChange={(e) => setGuestPhone(e.target.value)}
          />
        </Stack>

        {nights > 0 && (
          <Box 
            mt={3} 
            p={2} 
            sx={{ bgcolor: '#f9f9f9', borderRadius: 2, border: '1px dashed #ccc' }}
          >
            <Stack direction="row" justifyContent="space-between" mb={1}>
              <Typography color="text.secondary">
                {nights} đêm × {room.price.toLocaleString("vi-VN")} ₫
              </Typography>
              <Typography>
                {totalPrice.toLocaleString("vi-VN")} ₫
              </Typography>
            </Stack>
            <Divider sx={{ mb: 1 }} />
            <Stack direction="row" justifyContent="space-between">
              <Typography fontWeight={700}>Tổng cộng:</Typography>
              <Typography fontWeight={700} color="primary.main" fontSize="1.2rem">
                {totalPrice.toLocaleString("vi-VN")} ₫
              </Typography>
            </Stack>
            <Typography fontSize={12} color="orange" mt={1}>
              * Bạn sẽ cần thanh toán cọc 30% ở bước kế tiếp để hoàn tất đơn hàng.
            </Typography>
          </Box>
        )}
      </DialogContent>

      <DialogActions sx={{ p: 2.5 }}>
        <Button onClick={onClose} color="inherit">
          Để sau
        </Button>
        <Button
          variant="contained"
          size="large"
          onClick={handleSubmit}
          sx={{ 
            px: 4, 
            bgcolor: "#1A1A1A", 
            "&:hover": { bgcolor: "#333" },
            textTransform: 'none',
            fontWeight: 600
          }}
        >
          Tiếp tục thanh toán
        </Button>
      </DialogActions>
    </Dialog>
  );
}