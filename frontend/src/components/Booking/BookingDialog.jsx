import { useState, useMemo, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Alert, Box, Divider, Stack, IconButton, InputAdornment
} from "@mui/material";
import { 
  Close as CloseIcon, 
  CalendarMonth as CalendarIcon, 
  PersonOutline as PersonIcon,
  PhoneIphone as PhoneIcon
} from '@mui/icons-material';
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { motion, AnimatePresence } from "framer-motion";

const MotionBox = motion(Box);

export default function BookingDialog({ open, onClose, room }) {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guestsCount, setGuestsCount] = useState(1);
  const [guestName, setGuestName] = useState("");
  const [guestPhone, setGuestPhone] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (open) {
      if (user) setGuestName(user.name || "");
    } else {
      setCheckIn(""); setCheckOut(""); setGuestsCount(1);
      setGuestName(""); setGuestPhone(""); setError("");
    }
  }, [open, user]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = (end - start) / 86400000;
    return diff > 0 ? diff : 0;
  }, [checkIn, checkOut]);

  if (!room) return null;
  const totalPrice = nights * room.price;

  const handleSubmit = () => {
    if (!user) return setError("Vui lòng đăng nhập để thực hiện đặt phòng.");
    if (nights <= 0) return setError("Ngày nhận/trả phòng không hợp lệ.");
    if (!guestName.trim() || !guestPhone.trim()) return setError("Vui lòng điền đầy đủ thông tin liên hệ.");

    navigate(`/checkout/${room._id}`, {
      state: { roomName: room.name, hotelName: room.hotel?.name, checkIn, checkOut, guestsCount, guestName, guestPhone, totalPrice, pricePerNight: room.price }
    });
    onClose();
  };

  return (
    <Dialog 
      open={open} 
      onClose={onClose} 
      fullWidth 
      maxWidth="sm"
      PaperProps={{
        sx: { 
          borderRadius: { xs: 0, sm: 6 }, // Mobile để vuông cho tối ưu diện tích, PC bo tròn
          backgroundImage: 'none',
          m: { xs: 0, sm: 2 },
          maxHeight: { xs: '100%', sm: '90vh' }
        }
      }}
      // Hiệu ứng Fade mượt
      transitionDuration={400}
    >
      {/* HEADER TỐI GIẢN */}
      <DialogTitle sx={{ p: 3, pb: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.75rem', color: '#1c1b19', lineHeight: 1.1 }}>
            Đặt chỗ
          </Typography>
          <Typography variant="body2" sx={{ color: '#c2a56d', fontWeight: 700, mt: 0.5, letterSpacing: 0.5, textTransform: 'uppercase' }}>
            {room.hotel?.name}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ bgcolor: '#f8f8f8', '&:hover': { bgcolor: '#eee' } }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2, sm: 4 }, py: 0 }}>
        <AnimatePresence>
          {error && (
            <MotionBox initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
              <Alert severity="error" variant="filled" sx={{ mb: 3, borderRadius: 3, bgcolor: '#ff5a5f' }}>{error}</Alert>
            </MotionBox>
          )}
        </AnimatePresence>

        <Stack spacing={4} sx={{ mt: 2 }}>
          {/* SECTION 1: DATES */}
          <Box>
            <Stack direction="row" spacing={2}>
              <TextField
                label="Nhận phòng" type="date" fullWidth InputLabelProps={{ shrink: true }}
                value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><CalendarIcon sx={{ fontSize: 18 }} /></InputAdornment> }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4, bgcolor: '#fafafa' } }}
              />
              <TextField
                label="Trả phòng" type="date" fullWidth InputLabelProps={{ shrink: true }}
                value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><CalendarIcon sx={{ fontSize: 18 }} /></InputAdornment> }}
                sx={{ "& .MuiOutlinedInput-root": { borderRadius: 4, bgcolor: '#fafafa' } }}
              />
            </Stack>
          </Box>

          {/* SECTION 2: GUEST INFO */}
          <Stack spacing={2.5}>
            <TextField
              label="Tên người đại diện" fullWidth variant="standard"
              value={guestName} onChange={(e) => setGuestName(e.target.value)}
              InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ fontSize: 20 }} /></InputAdornment> }}
              sx={{ "& .MuiInput-root": { py: 1 } }}
            />
            <Stack direction="row" spacing={3}>
              <TextField
                label="Số điện thoại" fullWidth variant="standard"
                value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ fontSize: 20 }} /></InputAdornment> }}
                sx={{ "& .MuiInput-root": { py: 1 } }}
              />
              <TextField
                label="Khách" type="number" variant="standard"
                value={guestsCount} onChange={(e) => setGuestsCount(e.target.value)}
                sx={{ width: 80, "& .MuiInput-root": { py: 1 } }}
              />
            </Stack>
          </Stack>

          {/* SECTION 3: BILL SUMMARY */}
          <AnimatePresence>
            {nights > 0 && (
              <MotionBox initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} sx={{ p: 3, borderRadius: 5, bgcolor: '#1c1b19', color: '#fff' }}>
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', textTransform: 'uppercase' }}>
                      Tổng cộng cho {nights} đêm
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 800, color: '#c2a56d' }}>
                      {totalPrice.toLocaleString()}₫
                    </Typography>
                  </Box>
                  <Box textAlign="right">
                     <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.6)', display: 'block' }}>Tiền cọc 30%</Typography>
                     <Typography sx={{ fontWeight: 700 }}>{(totalPrice * 0.3).toLocaleString()}₫</Typography>
                  </Box>
                </Stack>
              </MotionBox>
            )}
          </AnimatePresence>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 3 }}>
        <Button 
          fullWidth variant="contained" size="large" onClick={handleSubmit}
          sx={{ 
            bgcolor: "#c2a56d", borderRadius: 4, py: 2, fontWeight: 800, fontSize: '1rem',
            textTransform: 'none', boxShadow: '0 10px 20px rgba(194, 165, 109, 0.2)',
            "&:hover": { bgcolor: "#b0945d" }
          }}
        >
          Tiếp tục đặt phòng
        </Button>
      </DialogActions>
    </Dialog>
  );
}