import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleIcon from "@mui/icons-material/People";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import InfoIcon from "@mui/icons-material/Info";

export default function RoomCard({ room, onBook }) {
  const navigate = useNavigate();

  /* ================= LOGIC DỮ LIỆU ================= */
  const discount = room?.discount || 0;
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount
    ? Math.round(room.price * (1 - discount / 100))
    : room.price;

  // Trạng thái từ Schema: active, maintenance, inactive
  const isAvailable = room.status === "active";
  const isMaintenance = room.status === "maintenance";

  /* ================= HANDLERS ================= */
  const handleDetail = () => navigate(`/rooms/${room._id}`);
  const handleBook = (e) => {
    e.stopPropagation(); // Ngăn việc trigger nhảy vào trang chi tiết
    onBook?.(room);
  };

  return (
    <Card
      onClick={handleDetail}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        borderRadius: 4,
        overflow: "hidden",
        mb: 3,
        boxShadow: "0 4px 20px rgba(0,0,0,.08)",
        transition: "0.3s",
        cursor: "pointer",
        "&:hover": { boxShadow: "0 8px 30px rgba(0,0,0,.12)" },
      }}
    >
      {/* ẢNH PHÒNG */}
      <Box sx={{ width: { md: 320 }, position: "relative" }}>
        <CardMedia
          component="img"
          sx={{ height: { xs: 220, md: "100%" } }}
          image={room.photos?.[0]?.url || "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"}
        />

        {/* NHÃN GIẢM GIÁ */}
        {hasDiscount && (
          <Chip
            label={`-${discount}%`}
            size="small"
            color="error"
            sx={{ position: "absolute", top: 12, left: 12, fontWeight: 700 }}
          />
        )}

        {/* NHÃN TRẠNG THÁI (Schema: status) */}
        {!isAvailable && (
          <Box
            sx={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              bgcolor: "rgba(0,0,0,0.5)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <Chip 
              icon={<InfoIcon style={{ color: '#fff' }} />} 
              label={isMaintenance ? "ĐANG BẢO TRÌ" : "HẾT PHÒNG"} 
              sx={{ color: '#fff', fontWeight: 700, border: '1px solid #fff' }} 
              variant="outlined" 
            />
          </Box>
        )}
      </Box>

      {/* NỘI DUNG */}
      <CardContent sx={{ flex: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography
            variant="caption"
            color="primary"
            sx={{ textTransform: "uppercase", fontWeight: 800, letterSpacing: 1 }}
          >
            {room.type}
          </Typography>
          
          {/* Chính sách hoàn tiền từ Schema: cancellationPolicy */}
          <Stack direction="row" spacing={0.5} alignItems="center">
            <CheckCircleIcon sx={{ fontSize: 14, color: "#2e7d32" }} />
            <Typography variant="caption" sx={{ color: "#2e7d32", fontWeight: 600 }}>
              Hoàn {room.cancellationPolicy?.refundPercent}%
            </Typography>
          </Stack>
        </Stack>

        <Typography variant="h5" fontWeight={700} mb={1}>
          {room.name}
        </Typography>

        <Stack direction="row" spacing={2} mb={2}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <PeopleIcon sx={{ fontSize: 18, color: "text.secondary" }} />
            <Typography variant="body2" color="text.secondary">
              Tối đa {room.maxPeople} người
            </Typography>
          </Stack>
        </Stack>

        {/* TIỆN NGHI (Schema: amenities) - Chỉ hiện 4 cái đầu để tránh quá dài */}
        {room.amenities?.length > 0 && (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, mb: 2 }}>
            {room.amenities.slice(0, 4).map((item, index) => (
              <Chip 
                key={index} 
                label={item} 
                size="small" 
                variant="outlined" 
                sx={{ fontSize: '0.7rem', height: 20 }} 
              />
            ))}
            {room.amenities.length > 4 && (
              <Typography variant="caption" sx={{ color: 'text.secondary', ml: 0.5 }}>
                +{room.amenities.length - 4} khác
              </Typography>
            )}
          </Box>
        )}

        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ mb: 2 }} />
          
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <Box>
              {hasDiscount && (
                <Typography sx={{ textDecoration: "line-through", color: "text.disabled", fontSize: 13 }}>
                  {room.price.toLocaleString()} ₫
                </Typography>
              )}
              <Typography variant="h5" fontWeight={800} color="primary">
                {finalPrice.toLocaleString()} ₫
                <Typography component="span" variant="body2" color="text.secondary"> /đêm</Typography>
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                onClick={(e) => { e.stopPropagation(); handleDetail(); }}
                sx={{ textTransform: "none", borderRadius: 2 }}
              >
                Chi tiết
              </Button>
              <Button
                variant="contained"
                disabled={!isAvailable}
                onClick={handleBook}
                sx={{ textTransform: "none", borderRadius: 2, fontWeight: 700 }}
              >
                {isAvailable ? "Đặt ngay" : "Hết phòng"}
              </Button>
            </Stack>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}