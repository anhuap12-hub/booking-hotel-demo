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
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { checkAvailability } from "../../api/booking.api";

export default function RoomBookingCard({ room, selectedDates }) {
  const navigate = useNavigate();
  const [isBooked, setIsBooked] = useState(false);
  const [checking, setChecking] = useState(false);

  // 1. Logic tính toán giá
  const price = room?.price || 0;
  const discount = room?.discount || 0;
  const finalPrice = discount > 0 ? Math.round(price * (1 - discount / 100)) : price;

  // 2. Kiểm tra tính khả dụng khi ngày hoặc ID phòng thay đổi
 useEffect(() => {
    const checkRoom = async () => {
      if (room?._id && selectedDates?.checkIn && selectedDates?.checkOut) {
        try {
          setChecking(true);
          
          // DEBUG LOG
          console.log("--- 🔍 FRONTEND: Start Checking Room ---");
          console.log("🆔 Room ID:", room._id);
          console.log("📅 Dates:", selectedDates);

          const res = await checkAvailability(
            room._id,
            selectedDates.checkIn,
            selectedDates.checkOut
          );

          // DEBUG LOG KẾT QUẢ
          console.log("✅ SERVER RESPONSE:", res.data);

          if (res.data) {
            // Lưu ý: Đảm bảo server trả về trường 'available'
            setIsBooked(!res.data.available); 
            if(!res.data.available) {
               console.warn("⚠️ Cảnh báo: Phòng này đã có người đặt!");
            }
          }
        } catch (err) {
          // DEBUG LOG LỖI
          console.error("❌ API ERROR DETAIL:");
          console.error("- Message:", err.message);
          if (err.response) {
            console.error("- Server Status:", err.response.status);
            console.error("- Server Data:", err.response.data);
          }
          
          setIsBooked(false); 
        } finally {
          setChecking(false);
          console.log("--- 🏁 End Checking ---");
        }
      }
    };
    checkRoom();
  }, [room?._id, selectedDates]);

  // 3. Xử lý trạng thái hiển thị
  const currentStatus = room?.status?.toLowerCase();
  const isAvailable = currentStatus === "active" || currentStatus === "available";
  const isMaintenance = currentStatus === "maintenance";

  const getStatusDisplay = () => {
    if (isMaintenance) return { text: "Đang bảo trì", color: "warning.main" };
    if (!isAvailable) return { text: "Ngừng nhận khách", color: "error.main" };
    if (isBooked) return { text: "Hết chỗ ngày đã chọn", color: "error.main" };
    return { text: "Còn phòng", color: "success.main" };
  };

  const statusInfo = getStatusDisplay();

  // 4. Hàm xử lý đặt phòng
  const handleBooking = () => {
    if (room?._id && !isBooked && isAvailable) {
      navigate(`/booking-info/${room._id}`, {
        state: {
          room: { ...room, finalPrice },
          ...selectedDates 
        },
      });
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid #eee",
        position: "sticky",
        top: 24,
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      }}
    >
      <Box mb={2}>
        <Typography variant="caption" color="text.secondary" fontWeight={600}>
          GIÁ MỖI ĐÊM
        </Typography>
        <Stack direction="row" spacing={1} alignItems="baseline" mt={0.5}>
          <Typography variant="h4" fontWeight={800} color="primary.main">
            {finalPrice.toLocaleString("vi-VN")}₫
          </Typography>
          <Typography color="text.secondary" variant="body2">/đêm</Typography>
        </Stack>
        {discount > 0 && (
          <Stack direction="row" spacing={1} alignItems="center" mt={0.5}>
            <Typography variant="body2" sx={{ textDecoration: "line-through", color: "text.disabled" }}>
              {price.toLocaleString("vi-VN")}₫
            </Typography>
            <Chip label={`-${discount}%`} size="small" color="error" sx={{ fontWeight: 700, height: 20 }} />
          </Stack>
        )}
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* THÔNG BÁO LỖI NẾU TRÙNG LỊCH */}
      {isBooked && isAvailable && !checking && (
        <Box sx={{ bgcolor: "#FFF4F4", p: 1.5, borderRadius: 2, mb: 2, border: "1px solid #FFCDD2" }}>
          <Stack direction="row" spacing={1} alignItems="center">
            <ErrorOutlineIcon color="error" fontSize="small" />
            <Typography variant="body2" color="error" fontWeight={700}>
              Phòng đã có khách đặt ngày này
            </Typography>
          </Stack>
        </Box>
      )}

      {/* ROOM INFO */}
      <Stack spacing={1.5} mb={3}>
        <Row label="Số khách tối đa" value={`${room?.maxPeople || 0} người`} />
        <Row label="Tình trạng" value={
          <Typography variant="body2" fontWeight={700} sx={{ color: statusInfo.color }}>
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
          py: 1.8,
          fontWeight: 800,
          borderRadius: 2.5,
          textTransform: "none",
          fontSize: "1rem",
          transition: "all 0.2s ease",
          bgcolor: isBooked ? "error.light" : "primary.main",
          "&:disabled": {
            bgcolor: isBooked ? "#ffebee" : "#ebebeb",
            color: isBooked ? "error.main" : "#9e9e9e",
            border: isBooked ? "1px solid #ffcdd2" : "none"
          }
        }}
      >
        {checking ? (
          <CircularProgress size={24} color="inherit" />
        ) : isBooked ? (
          "PHÒNG ĐÃ ĐẶT"
        ) : isAvailable ? (
          "ĐẶT PHÒNG NGAY"
        ) : (
          "KHÔNG KHẢ DỤNG"
        )}
      </Button>

      {(!isAvailable || isBooked) && !checking && (
        <Stack direction="row" spacing={0.5} justifyContent="center" alignItems="center" mt={1.5}>
          <InfoOutlinedIcon sx={{ fontSize: 14, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">
            Vui lòng chọn ngày khác trên lịch
          </Typography>
        </Stack>
      )}

      <Divider sx={{ my: 3 }} />

      {/* POLICY SECTION */}
      <Stack spacing={1.5}>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <CancelIcon fontSize="small" sx={{ color: "text.disabled" }} />
          <Box>
            <Typography variant="caption" fontWeight={700} display="block">Hủy miễn phí</Typography>
            <Typography variant="caption" color="text.secondary">
              Trước {room?.cancellationPolicy?.freeCancelBeforeHours || 24}h nhận phòng
            </Typography>
          </Box>
        </Box>
        <Box sx={{ display: 'flex', gap: 1.5 }}>
          <PaymentsIcon fontSize="small" sx={{ color: "text.disabled" }} />
          <Box>
            <Typography variant="caption" fontWeight={700} display="block">Thanh toán an toàn</Typography>
            <Typography variant="caption" color="text.secondary">Tự động xác nhận qua VietQR</Typography>
          </Box>
        </Box>
      </Stack>
    </Paper>
  );
}

function Row({ label, value }) {
  return (
    <Box display="flex" justifyContent="space-between" alignItems="center">
      <Typography variant="body2" color="text.secondary">{label}</Typography>
      {typeof value === "string" ? (
        <Typography variant="body2" fontWeight={600}>{value}</Typography>
      ) : (
        value
      )}
    </Box>
  );
}