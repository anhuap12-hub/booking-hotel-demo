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

  // Logic tính toán giá
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
        borderRadius: "24px",
        overflow: "hidden",
        mb: 3,
        bgcolor: "#FFF",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 10px 30px rgba(0,0,0,0.03)",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": { 
          transform: "translateY(-6px)",
          boxShadow: "0 20px 45px rgba(28,27,25,0.12)",
          "& .room-image": { transform: "scale(1.1)" }
        },
      }}
    >
      {/* KHỐI ẢNH PHÒNG */}
      <Box sx={{ width: { md: 360 }, position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          className="room-image"
          sx={{ 
            height: { xs: 240, md: "100%" },
            transition: "transform 0.8s ease"
          }}
          image={room.photos?.[0]?.url || "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"}
        />

        {/* Badge Giảm giá */}
        {hasDiscount && (
          <Box sx={{ 
            position: "absolute", top: 16, left: 16, 
            bgcolor: "#1C1B19", color: "#C2A56D",
            px: 1.5, py: 0.5, borderRadius: "8px",
            fontWeight: 900, fontSize: "0.75rem",
            boxShadow: "0 4px 10px rgba(0,0,0,0.3)"
          }}>
            -{discount}%
          </Box>
        )}

        {/* Overlay khi hết phòng/bảo trì */}
        {!isAvailable && (
          <Box sx={{
            position: "absolute", top: 0, left: 0, right: 0, bottom: 0,
            bgcolor: "rgba(28,27,25,0.75)",
            display: "flex", alignItems: "center", justifyContent: "center",
            backdropFilter: "blur(4px)", zIndex: 2
          }}>
            <Chip 
              icon={<InfoOutlinedIcon style={{ color: '#C2A56D' }} />} 
              label={isMaintenance ? "ĐANG BẢO TRÌ" : "HẾT PHÒNG"} 
              sx={{ color: '#C2A56D', fontWeight: 800, border: '2px solid #C2A56D', py: 2 }} 
              variant="outlined" 
            />
          </Box>
        )}
      </Box>

      {/* KHỐI NỘI DUNG */}
      <CardContent sx={{ 
        flex: 1, 
        p: { xs: 3, md: "32px 40px" }, 
        display: 'flex', 
        flexDirection: 'column' 
      }}>
        
        {/* Loại phòng & Chính sách */}
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="overline" sx={{ fontWeight: 800, color: "#C2A56D", letterSpacing: 2 }}>
            {room.type || "STANDARD"}
          </Typography>
          
          <Stack direction="row" spacing={0.5} alignItems="center" sx={{ opacity: 0.8 }}>
            <VerifiedUserOutlinedIcon sx={{ fontSize: 14, color: "#72716E" }} />
            <Typography variant="caption" sx={{ color: "#72716E", fontWeight: 600 }}>
              Hoàn {room.cancellationPolicy?.refundPercent || 100}% phí
            </Typography>
          </Stack>
        </Stack>

        {/* Tên phòng */}
        <Typography variant="h4" sx={{ 
          fontFamily: "'Playfair Display', serif", 
          fontWeight: 800, color: "#1C1B19",
          fontSize: { xs: "1.5rem", md: "1.8rem" },
          mb: 1.5
        }}>
          {room.name}
        </Typography>

        {/* Sức chứa */}
        <Stack direction="row" spacing={1} alignItems="center" mb={2}>
          <PeopleOutlineIcon sx={{ fontSize: 18, color: "#A8A7A1" }} />
          <Typography variant="body2" sx={{ color: "#72716E", fontWeight: 500 }}>
            Sức chứa tối đa: {room.maxPeople} khách
          </Typography>
        </Stack>

        {/* Mô tả: Giới hạn 2 dòng */}
        <Typography variant="body2" sx={{ 
          color: "#72716E", 
          lineHeight: 1.7,
          mb: 3,
          display: "-webkit-box",
          WebkitLineClamp: 2,
          WebkitBoxOrient: "vertical",
          overflow: "hidden",
          textOverflow: "ellipsis",
          minHeight: "2.8em" // Giữ chỗ cho 2 dòng để card không bị nhảy layout
        }}>
          {room.description || "Tận hưởng không gian nghỉ dưỡng tinh tế với thiết kế hiện đại, trang thiết bị cao cấp mang lại sự thoải mái tuyệt đối cho quý khách."}
        </Typography>

        {/* Tiện ích nổi bật */}
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: { xs: 3, md: 4 } }}>
          {room.amenities?.slice(0, 3).map((item, index) => (
            <Chip 
              key={index} 
              label={item} 
              size="small" 
              sx={{ 
                fontSize: '0.65rem', fontWeight: 700,
                bgcolor: "#F9F8F6", color: "#1C1B19",
                border: "1px solid #EFE7DD", borderRadius: '6px'
              }} 
            />
          ))}
          {room.amenities?.length > 3 && (
            <Typography variant="caption" sx={{ color: '#A8A7A1', fontWeight: 600, alignSelf: 'center', ml: 0.5 }}>
              +{room.amenities.length - 3} tiện ích
            </Typography>
          )}
        </Box>

        {/* Footer: Giá & Nút bấm */}
        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ mb: 3, opacity: 0.6 }} />
          
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
            <Box>
              {hasDiscount && (
                <Typography sx={{ textDecoration: "line-through", color: "#A8A7A1", fontSize: "0.85rem", fontWeight: 500 }}>
                  {room.price?.toLocaleString()}₫
                </Typography>
              )}
              <Typography sx={{ fontSize: "1.6rem", fontWeight: 900, color: "#1C1B19", lineHeight: 1 }}>
                {finalPrice?.toLocaleString()}₫
                <Typography component="span" sx={{ fontSize: "0.85rem", color: "#72716E", ml: 0.5, fontWeight: 500 }}>/đêm</Typography>
              </Typography>
            </Box>

            <Stack direction="row" spacing={1.5}>
              <Button
                variant="text"
                onClick={(e) => { e.stopPropagation(); handleDetail(); }}
                sx={{ 
                  textTransform: "none", fontWeight: 700, color: "#1C1B19",
                  px: 2, "&:hover": { bgcolor: "#F9F8F6" }
                }}
              >
                Chi tiết
              </Button>
              <Button
                variant="contained"
                disabled={!isAvailable}
                onClick={handleBook}
                sx={{ 
                  textTransform: "none", borderRadius: "12px", 
                  fontWeight: 700, px: 4, py: 1.2,
                  bgcolor: "#1C1B19", color: "#C2A56D",
                  boxShadow: "0 10px 20px rgba(28,27,25,0.15)",
                  "&:hover": { bgcolor: "#2b2a28", transform: "translateY(-2px)" },
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