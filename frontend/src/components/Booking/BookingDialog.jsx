import { useState, useMemo, useEffect } from "react";
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Typography, Alert, Box, Stack, IconButton, InputAdornment
} from "@mui/material";
import { 
  Close as CloseIcon, 
  CalendarMonth as CalendarIcon, 
  PersonOutline as PersonIcon,
  PhoneIphone as PhoneIcon,
  Groups as GroupsIcon
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

  // FIX LỖI RENDER: Chỉ set giá trị khi Dialog thực sự MỞ và guestName còn trống
  useEffect(() => {
    if (open && user && !guestName) {
      setGuestName(user.name || "");
    }
    if (!open) {
      setError(""); // Reset lỗi khi đóng
    }
  }, [open, user, guestName]);

  const nights = useMemo(() => {
    if (!checkIn || !checkOut) return 0;
    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const diff = Math.ceil((end - start) / 86400000);
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
          borderRadius: { xs: "20px 20px 0 0", sm: "28px" },
          backgroundImage: 'none',
          position: { xs: 'fixed', sm: 'relative' },
          bottom: { xs: 0, sm: 'auto' },
          m: { xs: 0, sm: 2 },
          overflow: 'hidden'
        }
      }}
    >
      <DialogTitle sx={{ p: 3, pb: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Box>
          <Typography sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: '1.5rem', color: '#1c1b19' }}>
            Xác nhận đặt chỗ
          </Typography>
          <Typography variant="caption" sx={{ color: '#c2a56d', fontWeight: 800, letterSpacing: 1 }}>
            {room.name.toUpperCase()}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ bgcolor: '#F5F5F3' }}>
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent sx={{ px: { xs: 2.5, sm: 4 }, py: 2 }}>
        <AnimatePresence>
          {error && (
            <MotionBox initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
              <Alert severity="error" sx={{ mb: 2, borderRadius: "12px", fontSize: '0.85rem' }}>{error}</Alert>
            </MotionBox>
          )}
        </AnimatePresence>

        <Stack spacing={3}>
          {/* DATES SELECTOR */}
          <Stack direction="row" spacing={2}>
            <TextField
              label="Check-in" type="date" fullWidth InputLabelProps={{ shrink: true }}
              value={checkIn} onChange={(e) => setCheckIn(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: '#F9F9F8' } }}
            />
            <TextField
              label="Check-out" type="date" fullWidth InputLabelProps={{ shrink: true }}
              value={checkOut} onChange={(e) => setCheckOut(e.target.value)}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: '#F9F9F8' } }}
            />
          </Stack>

          {/* GUEST INFO */}
          <Box sx={{ p: 2.5, borderRadius: "16px", border: '1px solid #EEE' }}>
            <Typography variant="caption" sx={{ color: '#999', fontWeight: 700, mb: 2, display: 'block' }}>THÔNG TIN KHÁCH HÀNG</Typography>
            <Stack spacing={2}>
              <TextField
                placeholder="Tên người đại diện" fullWidth variant="standard"
                value={guestName} onChange={(e) => setGuestName(e.target.value)}
                InputProps={{ startAdornment: <InputAdornment position="start"><PersonIcon sx={{ color: '#C2A56D' }} /></InputAdornment> }}
              />
              <Stack direction="row" spacing={2}>
                <TextField
                  placeholder="Số điện thoại" fullWidth variant="standard"
                  value={guestPhone} onChange={(e) => setGuestPhone(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><PhoneIcon sx={{ color: '#C2A56D' }} /></InputAdornment> }}
                />
                <TextField
                  type="number" variant="standard"
                  value={guestsCount} onChange={(e) => setGuestsCount(e.target.value)}
                  InputProps={{ startAdornment: <InputAdornment position="start"><GroupsIcon sx={{ color: '#C2A56D' }} /></InputAdornment> }}
                  sx={{ width: 100 }}
                />
              </Stack>
            </Stack>
          </Box>

          {/* BILLING SUMMARY */}
          <AnimatePresence>
            {nights > 0 && (
              <MotionBox 
                initial={{ opacity: 0, scale: 0.95 }} 
                animate={{ opacity: 1, scale: 1 }}
                sx={{ p: 3, borderRadius: "20px", bgcolor: '#1C1B19', color: '#FFF', boxShadow: '0 15px 30px rgba(0,0,0,0.2)' }}
              >
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Box>
                    <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>
                      CHI PHÍ TẠM TÍNH ({nights} ĐÊM)
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 900, color: '#C2A56D' }}>
                      {totalPrice.toLocaleString()}₫
                    </Typography>
                  </Box>
                  <Box sx={{ textAlign: 'right', borderLeft: '1px solid rgba(255,255,255,0.1)', pl: 3 }}>
                     <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)', display: 'block' }}>CỌC TRƯỚC (30%)</Typography>
                     <Typography variant="h6" sx={{ fontWeight: 700 }}>{(totalPrice * 0.3).toLocaleString()}₫</Typography>
                  </Box>
                </Stack>
              </MotionBox>
            )}
          </AnimatePresence>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ p: 4, pt: 1 }}>
        <Button 
          fullWidth variant="contained" 
          onClick={handleSubmit}
          sx={{ 
            bgcolor: "#C2A56D", borderRadius: "14px", py: 2, fontWeight: 800,
            textTransform: 'uppercase', letterSpacing: 1,
            "&:hover": { bgcolor: "#1C1B19", color: '#C2A56D' }
          }}
        >
          Tiến hành đặt phòng
        </Button>
      </DialogActions>
    </Dialog>
  );
}