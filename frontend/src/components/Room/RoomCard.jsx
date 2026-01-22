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
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import VerifiedUserOutlinedIcon from '@mui/icons-material/VerifiedUserOutlined';
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

export default function RoomCard({ room, onBook }) {
  const navigate = useNavigate();

  const discount = room?.discount || 0;
  const hasDiscount = discount > 0;
  const finalPrice = hasDiscount
    ? Math.round(room.price * (1 - discount / 100))
    : room.price;

  const isAvailable = room.status === "active";
  const isMaintenance = room.status === "maintenance";

  const handleDetail = () => navigate(`/rooms/${room._id}`);
  const handleBook = (e) => {
    e.stopPropagation();
    onBook?.(room);
  };

  return (
    <Card
      onClick={handleDetail}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        borderRadius: "20px",
        overflow: "hidden",
        mb: 3,
        bgcolor: "#FFF",
        border: "1px solid rgba(0,0,0,0.05)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.04)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": { 
          transform: "translateY(-4px)",
          boxShadow: "0 20px 40px rgba(28,27,25,0.12)",
          "& .room-image": { transform: "scale(1.08)" }
        },
      }}
    >
      {/* ẢNH PHÒNG VỚI HIỆU ỨNG ZOOM */}
      <Box sx={{ width: { md: 340 }, position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          className="room-image"
          sx={{ 
            height: { xs: 240, md: "100%" },
            transition: "transform 0.6s ease"
          }}
          image={room.photos?.[0]?.url || "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"}
        />

        {hasDiscount && (
          <Chip
            label={`-${discount}%`}
            size="small"
            sx={{ 
              position: "absolute", top: 16, left: 16, 
              fontWeight: 800, bgcolor: "#1C1B19", color: "#C2A56D",
              borderRadius: "6px"
            }}
          />
        )}

        {!isAvailable && (
          <Box
            sx={{
              position: "absolute",
              top: 0, left: 0, right: 0, bottom: 0,
              bgcolor: "rgba(28,27,25,0.7)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              backdropFilter: "blur(4px)"
            }}
          >
            <Chip 
              icon={<InfoOutlinedIcon style={{ color: '#C2A56D' }} />} 
              label={isMaintenance ? "ĐANG BẢO TRÌ" : "HẾT PHÒNG"} 
              sx={{ color: '#C2A56D', fontWeight: 700, border: '1px solid #C2A56D' }} 
              variant="outlined" 
            />
          </Box>
        )}
      </Box>

      {/* NỘI DUNG CHI TIẾT */}
      <CardContent sx={{ flex: 1, p: { xs: 3, md: 4 }, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1.5}>
          <Typography
            variant="caption"
            sx={{ 
              textTransform: "uppercase", 
              fontWeight: 700, 
              letterSpacing: 1.5, 
              color: "#C2A56D" 
            }}
          >
            {room.type}
          </Typography>
          
          <Stack direction="row" spacing={0.5} alignItems="center">
            <VerifiedUserOutlinedIcon sx={{ fontSize: 16, color: "#72716E" }} />
            <Typography variant="caption" sx={{ color: "#72716E", fontWeight: 500 }}>
              Hoàn {room.cancellationPolicy?.refundPercent}% phí
            </Typography>
          </Stack>
        </Stack>

        <Typography 
          variant="h5" 
          sx={{ 
            fontFamily: "'Playfair Display', serif", 
            fontWeight: 800, 
            color: "#1C1B19",
            mb: 1.5 
          }}
        >
          {room.name}
        </Typography>

        <Stack direction="row" spacing={3} mb={3}>
          <Stack direction="row" spacing={1} alignItems="center">
            <PeopleOutlineIcon sx={{ fontSize: 18, color: "#A8A7A1" }} />
            <Typography variant="body2" sx={{ color: "#72716E", fontWeight: 500 }}>
              Sức chứa: {room.maxPeople} khách
            </Typography>
          </Stack>
        </Stack>

        {/* TIỆN NGHI (AMENITIES) */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 3 }}>
          {room.amenities?.slice(0, 3).map((item, index) => (
            <Chip 
              key={index} 
              label={item} 
              size="small" 
              sx={{ 
                fontSize: '0.75rem', 
                bgcolor: "#F9F8F6", 
                color: "#1C1B19",
                border: "1px solid #EFE7DD",
                fontWeight: 500
              }} 
            />
          ))}
          {room.amenities?.length > 3 && (
            <Typography variant="caption" sx={{ color: '#A8A7A1', alignSelf: 'center' }}>
              +{room.amenities.length - 3} tiện ích khác
            </Typography>
          )}
        </Box>

        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ mb: 3, borderColor: "rgba(0,0,0,0.05)" }} />
          
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              {hasDiscount && (
                <Typography sx={{ textDecoration: "line-through", color: "#A8A7A1", fontSize: 14 }}>
                  {room.price.toLocaleString()}₫
                </Typography>
              )}
              <Typography sx={{ fontSize: "1.5rem", fontWeight: 800, color: "#1C1B19" }}>
                {finalPrice.toLocaleString()}₫
                <Typography component="span" sx={{ fontSize: "0.9rem", color: "#72716E", ml: 0.5 }}>/đêm</Typography>
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="text"
                onClick={(e) => { e.stopPropagation(); handleDetail(); }}
                sx={{ 
                  textTransform: "none", 
                  fontWeight: 700, 
                  color: "#1C1B19",
                  "&:hover": { bgcolor: "rgba(0,0,0,0.04)" }
                }}
              >
                Chi tiết
              </Button>
              <Button
                variant="contained"
                disabled={!isAvailable}
                onClick={handleBook}
                sx={{ 
                  textTransform: "none", 
                  borderRadius: "12px", 
                  fontWeight: 700,
                  px: 4,
                  bgcolor: "#1C1B19",
                  color: "#C2A56D",
                  "&:hover": { bgcolor: "#2b2a28" },
                  "&:disabled": { bgcolor: "#F1F0EE", color: "#A8A7A1" }
                }}
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