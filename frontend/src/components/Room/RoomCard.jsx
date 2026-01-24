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

/* ... các imports giữ nguyên ... */

export default function RoomCard({ room, onBook }) {
  const navigate = useNavigate();

  // Đảm bảo không lỗi nếu các object lồng nhau bị undefined
  const discount = room?.discount || 0;
  const hasDiscount = discount > 0;
  
  // Tính giá cuối cùng (Safe-check)
  const price = room?.price || 0;
  const finalPrice = room?.finalPrice || (hasDiscount 
    ? Math.round(price * (1 - discount / 100)) 
    : price);

  const isAvailable = room?.status === "active";
  const statusLabel = {
    active: "Còn phòng",
    maintenance: "Đang bảo trì",
    inactive: "Ngưng phục vụ"
  };

  const handleDetail = () => {
    // Chỉ chuyển trang nếu không phải đang click vào nút Đặt ngay
    navigate(`/rooms/${room?._id}`);
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
        border: "1px solid rgba(0,0,0,0.08)",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        cursor: "pointer",
        "&:hover": { 
          transform: "translateY(-4px)",
          boxShadow: "0 15px 35px rgba(0,0,0,0.12)",
          "& .room-img": { transform: "scale(1.05)" } // Hiệu ứng zoom nhẹ ảnh
        },
      }}
    >
      {/* KHỐI ẢNH */}
      <Box sx={{ width: { md: 320 }, position: "relative", overflow: "hidden" }}>
        <CardMedia
          component="img"
          className="room-img"
          sx={{ 
            height: { xs: 220, md: "100%" }, 
            objectFit: "cover",
            transition: "transform 0.5s ease" 
          }}
          // Fallback ảnh nếu data lỗi hoặc trống
          image={room?.photos?.[0]?.url || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800"}
          alt={room?.name}
        />
        {hasDiscount && (
          <Box sx={{ 
            position: "absolute", top: 12, left: 12, 
            bgcolor: "#E31837", color: "#fff",
            px: 1.5, py: 0.5, borderRadius: "6px",
            fontWeight: 800, fontSize: "0.7rem",
            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
            zIndex: 1
          }}>
            ƯU ĐÃI {discount}%
          </Box>
        )}
      </Box>

      {/* KHỐI NỘI DUNG */}
      <CardContent sx={{ flex: 1, p: { xs: 2, md: 3 }, display: 'flex', flexDirection: 'column' }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="overline" color="primary" fontWeight={800} sx={{ letterSpacing: 1.2, lineHeight: 1 }}>
            {room?.type || "Standard"}
          </Typography>
          <Chip 
            label={statusLabel[room?.status] || "N/A"} 
            size="small" 
            color={isAvailable ? "success" : "default"}
            sx={{ fontWeight: 600, fontSize: '0.7rem' }}
            variant="outlined"
          />
        </Stack>

        <Typography variant="h5" fontWeight={700} sx={{ fontFamily: "'Playfair Display', serif", mb: 1 }}>
          {room?.name}
        </Typography>

        <Stack direction="row" spacing={2} mb={2} color="text.secondary">
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <PeopleOutlineIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" fontWeight={500}>{room?.maxPeople} khách</Typography>
          </Box>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <VerifiedUserOutlinedIcon sx={{ fontSize: 18 }} />
            <Typography variant="body2" fontWeight={500}>
              Hoàn {room?.cancellationPolicy?.refundPercent || 0}% phí
            </Typography>
          </Box>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ 
          mb: 3, 
          display: "-webkit-box", 
          WebkitLineClamp: 2, 
          WebkitBoxOrient: "vertical", 
          overflow: "hidden", 
          minHeight: '3em',
          lineHeight: 1.6
        }}>
          {room?.desc || "Chưa có mô tả cho loại phòng này."}
        </Typography>

        <Box sx={{ mt: 'auto' }}>
          <Divider sx={{ mb: 2, borderStyle: 'dashed' }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Box>
              {hasDiscount && (
                <Typography sx={{ textDecoration: "line-through", color: "text.disabled", fontSize: "0.85rem", fontWeight: 500 }}>
                  {price.toLocaleString()}₫
                </Typography>
              )}
              <Typography variant="h5" fontWeight={900} color="error.main" sx={{ display: 'flex', alignItems: 'baseline' }}>
                {finalPrice.toLocaleString()}₫
                <Typography component="span" variant="caption" color="text.secondary" sx={{ ml: 0.5, fontWeight: 600 }}>/ĐÊM</Typography>
              </Typography>
            </Box>

            <Button
              variant="contained"
              disabled={!isAvailable}
              onClick={(e) => {
                e.stopPropagation();
                onBook?.(room);
              }}
              sx={{ 
                borderRadius: "12px", 
                px: 3, 
                py: 1,
                fontWeight: 700,
                textTransform: 'none',
                bgcolor: "#1C1B19", 
                color: "#C2A56D",
                boxShadow: "0 4px 14px rgba(0,0,0,0.15)",
                "&:hover": { bgcolor: "#000", transform: "translateY(-2px)" },
                "&:disabled": { bgcolor: "#eee" }
              }}
            >
              {isAvailable ? "Đặt ngay" : "Hết phòng"}
            </Button>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
}