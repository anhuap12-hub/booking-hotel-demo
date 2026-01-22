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
          const res = await checkAvailability(
            room._id,
            selectedDates.checkIn,
            selectedDates.checkOut
          );
          if (res.data) {
            setIsBooked(!res.data.available); 
          }
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
  const isMaintenance = currentStatus === "maintenance";

  const getStatusDisplay = () => {
    if (isMaintenance) return { text: "Bảo trì định kỳ", color: "#ed6c02" };
    if (!isAvailable) return { text: "Ngừng nhận khách", color: "#d32f2f" };
    if (isBooked) return { text: "Đã hết chỗ", color: "#d32f2f" };
    return { text: "Sẵn sàng đón khách", color: "#C2A56D" };
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
        borderRadius: "24px",
        border: "1px solid rgba(194,165,109,0.2)",
        position: "sticky",
        top: 130, // Cách Navbar một khoảng đẹp
        bgcolor: "#FFF",
        boxShadow: "0 20px 50px rgba(28,27,25,0.08)",
      }}
    >
      {/* PRICE HEADER */}
      <Box mb={3}>
        <Typography variant="overline" sx={{ fontWeight: 700, letterSpacing: 1.5, color: "#C2A56D" }}>
          Giá ưu đãi hôm nay
        </Typography>
        <Stack direction="row" spacing={1} alignItems="baseline" mt={0.5}>
          <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: "#1C1B19" }}>
            {finalPrice.toLocaleString("vi-VN")}₫
          </Typography>
          <Typography sx={{ color: "#72716E", fontSize: "0.9rem", fontWeight: 500 }}>/ đêm</Typography>
        </Stack>
        
        {discount > 0 && (
          <Stack direction="row" spacing={1} alignItems="center" mt={1}>
            <Typography variant="body2" sx={{ textDecoration: "line-through", color: "#A8A7A1" }}>
              {price.toLocaleString("vi-VN")}₫
            </Typography>
            <Chip 
              label={`Tiết kiệm ${discount}%`} 
              size="small" 
              sx={{ 
                bgcolor: "#1C1B19", color: "#C2A56D", 
                fontWeight: 700, borderRadius: "6px", fontSize: "0.7rem" 
              }} 
            />
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 2.5, borderColor: "rgba(0,0,0,0.05)" }} />

      {/* ERROR ALERT (IF BOOKED) */}
      {isBooked && isAvailable && !checking && (
        <Box sx={{ bgcolor: "#FFF5F5", p: 2, borderRadius: "12px", mb: 2.5, border: "1px solid #FFE3E3" }}>
          <Stack direction="row" spacing={1.5} alignItems="center">
            <ErrorOutlineIcon sx={{ color: "#D32F2F", fontSize: 20 }} />
            <Typography variant="body2" sx={{ color: "#D32F2F", fontWeight: 600 }}>
              Tiếc quá, phòng đã được đặt trong giai đoạn này.
            </Typography>
          </Stack>
        </Box>
      )}

      {/* ROOM INFO ROWS */}
      <Stack spacing={2} mb={4}>
        <Row label="Số khách tối đa" value={`${room?.maxPeople || 0} khách`} />
        <Row label="Trạng thái" value={
          <Typography variant="body2" sx={{ fontWeight: 700, color: statusInfo.color }}>
            {statusInfo.text}
          </Typography>
        } />
      </Stack>

      {/* ACTION BUTTON */}
      <Button
        fullWidth
        size="large"
        variant="contained"
        disabled={!isAvailable || isBooked || checking}
        onClick={handleBooking}
        sx={{
          py: 2,
          fontWeight: 800,
          borderRadius: "14px",
          textTransform: "none",
          fontSize: "1.05rem",
          bgcolor: "#1C1B19", // Màu Ebony thương hiệu
          color: "#C2A56D",
          transition: "0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            bgcolor: "#2b2a28",
            boxShadow: "0 10px 20px rgba(0,0,0,0.2)",
            transform: "translateY(-2px)"
          },
          "&:disabled": {
            bgcolor: "#F1F0EE",
            color: "#A8A7A1"
          }
        }}
      >
        {checking ? (
          <CircularProgress size={24} sx={{ color: "#C2A56D" }} />
        ) : isBooked ? (
          "HẾT PHÒNG GIAI ĐOẠN NÀY"
        ) : isAvailable ? (
          "ĐẶT PHÒNG NGAY"
        ) : (
          "KHÔNG KHẢ DỤNG"
        )}
      </Button>

      {/* HELPER TEXT */}
      {(!isAvailable || isBooked) && !checking && (
        <Stack direction="row" spacing={1} justifyContent="center" alignItems="center" mt={2}>
          <InfoOutlinedIcon sx={{ fontSize: 16, color: "#72716E" }} />
          <Typography variant="caption" sx={{ color: "#72716E", fontWeight: 500 }}>
            Thử thay đổi ngày trên lịch để kiểm tra lại
          </Typography>
        </Stack>
      )}

      <Divider sx={{ my: 4, borderColor: "rgba(0,0,0,0.05)" }} />

      {/* POLICY SECTION */}
      <Stack spacing={2.5}>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <CancelIcon sx={{ color: "#C2A56D", fontSize: 20 }} />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#1C1B19", display: "block" }}>Hủy miễn phí linh hoạt</Typography>
            <Typography variant="caption" sx={{ color: "#72716E" }}>
              Trước {room?.cancellationPolicy?.freeCancelBeforeHours || 24}h nhận phòng
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
          <VerifiedUserIcon sx={{ color: "#C2A56D", fontSize: 20 }} />
          <Box>
            <Typography variant="caption" sx={{ fontWeight: 700, color: "#1C1B19", display: "block" }}>Thanh toán bảo mật</Typography>
            <Typography variant="caption" sx={{ color: "#72716E" }}>Xác nhận tức thì qua VietQR/Banking</Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

function Row({ label, value }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" sx={{ color: "#72716E", fontWeight: 500 }}>{label}</Typography>
      {typeof value === "string" ? (
        <Typography variant="body2" sx={{ fontWeight: 700, color: "#1C1B19" }}>{value}</Typography>
      ) : (
        value
      )}
    </Box>
  );
}