import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
  Divider,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import SquareFootIcon from "@mui/icons-material/SquareFoot";
import BedIcon from "@mui/icons-material/Bed";
import PeopleIcon from "@mui/icons-material/People";

export default function RoomCard({ room, onBook }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);

  // Logic tính giá giảm
  const discountPercent = room.discountPercent || room.discount || 0;
  const hasDiscount = discountPercent > 0;
  const finalPrice = hasDiscount
    ? Math.round(room.price * (1 - discountPercent / 100))
    : room.price;

  const handleBookClick = (e) => {
    e.stopPropagation(); // Ngăn sự kiện click lan ra Card
    if (!user) {
      setOpenLogin(true);
      return;
    }
    onBook(room);
  };

  const handleViewDetail = () => {
    navigate(`/rooms/${room._id}`);
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" }, // Mobile dọc, Desktop ngang
          borderRadius: 4,
          overflow: "hidden",
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)",
          transition: "transform 0.2s",
          "&:hover": { transform: "translateY(-4px)" },
          mb: 2,
        }}
      >
        {/* PHẦN HÌNH ẢNH */}
        <Box sx={{ position: "relative", width: { md: 320 }, minWidth: { md: 320 } }}>
          <CardMedia
            component="img"
            sx={{ height: "100%", minHeight: 220, cursor: 'pointer' }}
            image={room.photos?.[0]?.url || "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"}
            alt={room.name}
            onClick={handleViewDetail}
          />
          {hasDiscount && (
            <Chip
              label={`Ưu đãi ${discountPercent}%`}
              size="small"
              sx={{
                position: "absolute",
                top: 16,
                left: 16,
                bgcolor: "#E63946",
                color: "#fff",
                fontWeight: 700,
              }}
            />
          )}
          {room.status === "maintenance" && (
            <Box sx={{ position: 'absolute', inset: 0, bgcolor: 'rgba(255,255,255,0.7)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <Chip label="Đang bảo trì" color="error" />
            </Box>
          )}
        </Box>

        {/* PHẦN NỘI DUNG */}
        <CardContent sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
            <Box>
              <Typography variant="caption" sx={{ color: "primary.main", fontWeight: 700, textTransform: "uppercase", letterSpacing: 1 }}>
                {room.type}
              </Typography>
              <Typography
                variant="h5"
                sx={{
                  fontFamily: "Playfair Display, serif",
                  fontWeight: 700,
                  mt: 0.5,
                  cursor: 'pointer',
                  "&:hover": { color: 'primary.main' }
                }}
                onClick={handleViewDetail}
              >
                {room.name}
              </Typography>
            </Box>
          </Stack>

          {/* CÁC THÔNG SỐ SCHEMA */}
          <Stack direction="row" spacing={3} sx={{ mt: 2, mb: 2 }}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <PeopleIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2">{room.maxPeople} khách</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <SquareFootIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2">{room.area}m²</Typography>
            </Stack>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <BedIcon sx={{ fontSize: 18, color: "text.secondary" }} />
              <Typography variant="body2">{room.bed} giường</Typography>
            </Stack>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              mb: 2,
            }}
          >
            Tiện nghi: {room.amenities?.join(" · ")}
          </Typography>

          <Box sx={{ mt: "auto", pt: 2, borderTop: "1px solid #f0f0f0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              {hasDiscount && (
                <Typography sx={{ fontSize: 14, color: "text.secondary", textDecoration: "line-through" }}>
                  {room.price?.toLocaleString()} ₫
                </Typography>
              )}
              <Typography variant="h6" sx={{ fontWeight: 800, color: "#1a1a1a" }}>
                {finalPrice?.toLocaleString()} ₫
                <Typography component="span" variant="body2" sx={{ fontWeight: 400, ml: 0.5 }}>/ đêm</Typography>
              </Typography>
            </Box>

            <Stack direction="row" spacing={1}>
              <Button
                variant="outlined"
                color="inherit"
                onClick={handleViewDetail}
                sx={{ borderRadius: 2, textTransform: 'none', fontWeight: 600 }}
              >
                Chi tiết
              </Button>
              <Button
                variant="contained"
                disabled={room.status !== "available"}
                onClick={handleBookClick}
                sx={{
                  borderRadius: 2,
                  textTransform: 'none',
                  fontWeight: 600,
                  px: 3,
                  boxShadow: 'none'
                }}
              >
                Đặt ngay
              </Button>
            </Stack>
          </Box>
        </CardContent>
      </Card>

      {/* DIALOG YÊU CẦU ĐĂNG NHẬP (Giữ nguyên như cũ) */}
      <Dialog open={openLogin} onClose={() => setOpenLogin(false)} maxWidth="xs" fullWidth>
         {/* ... (Nội dung Dialog giữ nguyên) ... */}
      </Dialog>
    </>
  );
}