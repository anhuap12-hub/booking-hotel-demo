import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Divider,
  Chip,
  CircularProgress,
} from "@mui/material";
import PaymentsIcon from "@mui/icons-material/Payments";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline";
import VerifiedUserIcon from '@mui/icons-material/VerifiedUser';
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkAvailability } from "../../api/booking.api";

const BLUE = "#0056b3";
const TEXT_PRIMARY = "#0F172A";
const TEXT_SECONDARY = "#64748B";

export default function RoomBookingCard({ room, selectedDates }) {
  const navigate = useNavigate();
  const [isBooked, setIsBooked] = useState(false);
  const [checking, setChecking] = useState(false);

  const price = room?.price || 0;
  const discount = room?.discount || 0;
  const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

  useEffect(() => {
    const checkRoom = async () => {
      if (room?._id && selectedDates?.checkIn && selectedDates?.checkOut) {
        try {
          setChecking(true);
          const res = await checkAvailability(room._id, selectedDates.checkIn, selectedDates.checkOut);
          if (res.data) setIsBooked(!res.data.available);
        } catch (err) {
          setIsBooked(false);
        } finally {
          setChecking(false);
        }
      }
    };
    checkRoom();
  }, [room?._id, selectedDates]);

  const currentStatus = room?.status?.toLowerCase();
  const isAvailable = currentStatus === "active" || currentStatus === "available";

  const getStatusDisplay = () => {
    if (currentStatus === "maintenance") return { text: "Bảo trì định kỳ", color: "#F59E0B" };
    if (!isAvailable) return { text: "Ngừng nhận khách", color: "#EF4444" };
    if (isBooked) return { text: "Đã hết chỗ", color: "#EF4444" };
    return { text: "Sẵn sàng đón khách", color: "#10B981" }; // Xanh lá cho trạng thái sẵn sàng
  };

  const statusInfo = getStatusDisplay();

  const handleBooking = () => {
    if (room?._id && !isBooked && isAvailable) {
      navigate(`/booking-info/${room._id}`, {
        state: { room: { ...room, finalPrice }, ...selectedDates },
      });
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3.5,
        borderRadius: "20px",
        border: "1px solid BLUE",
        position: "sticky",
        top: 130,
        bgcolor: "#FFF",
        boxShadow: "0 10px 25px -5px rgba(0,0,0,0.05)",
      }}
    >
      <Box mb={3}>
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1, color: BLUE, fontSize: "1rem" }}>
          Giá mỗi đêm
        </Typography>
        <Stack direction="row" spacing={1} alignItems="baseline" mt={0.5}>
          <Typography sx={{ fontSize: "1.5rem", fontWeight: 700, color: TEXT_PRIMARY }}>
            {finalPrice.toLocaleString("vi-VN")}₫ / Đêm
          </Typography>
        </Stack>
        
        {discount > 0 && (
          <Stack direction="row" spacing={1} alignItems="center" mt={1}>
            <Typography variant="body2" sx={{ textDecoration: "line-through", color: "#94A3B8" }}>
              {price.toLocaleString("vi-VN")}₫
            </Typography>
            <Chip 
              label={`Giảm ${discount}%`} 
              size="small" 
              sx={{ bgcolor: "#EFF6FF", color: BLUE, fontWeight: 700, borderRadius: "6px" }} 
            />
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 2.5 }} />

      {isBooked && isAvailable && !checking && (
        <Box sx={{ bgcolor: "#FEF2F2", p: 2, borderRadius: "12px", mb: 2.5, border: "1px solid #FCA5A5" }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <ErrorOutlineIcon sx={{ color: "#EF4444", fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: "#EF4444", fontWeight: 600 }}>
              Phòng đã được đặt trong giai đoạn này.
            </Typography>
          </Stack>
        </Box>
      )}

      <Stack spacing={2} mb={4}>
        <Row label="Số khách tối đa:" value={
          <Typography variant="body2" sx={{ fontWeight: 700, color: statusInfo.color }} ml={-5}>
            {`${room?.maxPeople || 0} khách`}
          </Typography>}
        />
        
        <Row label="Trạng thái:" value={
          <Typography variant="body2" sx={{ fontWeight: 700, color: statusInfo.color }} ml={1}>
            {statusInfo.text}
          </Typography>
        } />
      </Stack>

      <Button
        fullWidth size="large" variant="contained"
        disabled={!isAvailable || isBooked || checking}
        onClick={handleBooking}
        sx={{
          py: 1.8, fontWeight: 700, borderRadius: "12px", textTransform: "none", fontSize: "1rem",
          bgcolor: BLUE, boxShadow: "none",
          "&:hover": { bgcolor: "#004494", boxShadow: "none" },
        }}
      >
        {checking ? <CircularProgress size={24} sx={{ color: "#FFF" }} /> : "Đặt phòng ngay"}
      </Button>

      <Divider sx={{ my: 4 }} />

      <Stack spacing={2.5}>
        <PolicyItem icon={<CancelIcon sx={{ color: BLUE }} />} title="Hủy miễn phí linh hoạt" desc="Trước 24h nhận phòng" />
        <PolicyItem icon={<VerifiedUserIcon sx={{ color: BLUE }} />} title="Thanh toán bảo mật" desc="Xác nhận tức thì qua Banking" />
      </Stack>
    </Paper>
  );
}

function Row({ label, value }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" sx={{ color: TEXT_SECONDARY }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 600, color: TEXT_PRIMARY }}>{value}</Typography>
    </Box>
  );
}

function PolicyItem({ icon, title, desc }) {
  return (
    <Box sx={{ display: 'flex', gap: 2 }}>
      {icon}
      <Box>
        <Typography variant="caption" sx={{ fontWeight: 700, color: TEXT_PRIMARY, display: "block" }}>{title}</Typography>
        <Typography variant="caption" sx={{ color: TEXT_SECONDARY }}>{desc}</Typography>
      </Box>
    </Box>
  );
}