import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import PeopleOutlineIcon from "@mui/icons-material/PeopleOutline";
import ChevronRight from "@mui/icons-material/ChevronRight";
import { CheckCircleOutline } from "@mui/icons-material";
const BLUE = "#0056b3";

export default function RoomCard({ room, onBook }) {
  const navigate = useNavigate();

  const discount = room?.discount || 0;
  const hasDiscount = discount > 0;
  const price = room?.price || 0;
  const finalPrice = room?.finalPrice || (hasDiscount ? Math.round(price * (1 - discount / 100)) : price);
  const isAvailable = room?.status === "active";

  const handleDetail = () => navigate(`/rooms/${room?._id}`);

  return (
    <Card
      elevation={0} // Phẳng giống Recommendation
      onClick={handleDetail}
      sx={{
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        borderRadius: "16px",
        mb: 2,
        border: "1px solid #e0e0e0",
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": { borderColor: BLUE, boxShadow: "0 4px 12px rgba(0, 86, 179, 0.15)" },
      }}
    >
      {/* ẢNH: Đã chỉnh kích thước và bo góc khớp */}
      <Box 
  sx={{ 
    width: { xs: "100%", sm: 220 }, // Tăng nhẹ width để cân đối hơn trên desktop
    height: { xs: 200, sm: "auto" }, // Chiều cao linh hoạt
    overflow: "hidden", 
    // Bo góc chỉ ở cạnh trái (vì là card ngang)
    borderRadius: { xs: "16px 16px 0 0", sm: "16px 0 0 16px" }, 
    flexShrink: 0 
  }}
>
  <CardMedia
    component="img"
    image={room?.photos?.[0]?.url || "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&q=80&w=800"}
    alt={room?.name}
    sx={{ width: "100%", height: "100%", objectFit: "cover" }}
  />
</Box>

      {/* NỘI DUNG */}
      <CardContent sx={{ flex: 1, px: 2, py: 1.5, display: 'flex', flexDirection: 'column', gap: 0.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography variant="caption" sx={{ color: BLUE, fontWeight: 800, textTransform: "uppercase" }}>
            {room?.type || "Standard"}
          </Typography>
        </Box>

        <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#333", lineHeight: 1.2 }}>
          {room?.name}
        </Typography>

        <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: "text.secondary" }}>
          <PeopleOutlineIcon sx={{ fontSize: 13 }} />
          <Typography variant="caption">{room?.maxPeople} khách</Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", overflow: "hidden", WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical" }}>
          {room?.desc || "Chưa có mô tả cho loại phòng này."}
        </Typography>
<Stack direction="row" flexWrap="wrap" spacing={1.5} sx={{ mt: 0.5 }}>
          {(room?.amenities || []).slice(0, 3).map((item, i) => (
            <Stack key={i} direction="row" alignItems="center" spacing={0.3}>
              <CheckCircleOutline sx={{ fontSize: 12, color: BLUE }} />
              <Typography fontSize={11} color="text.secondary">{item}</Typography>
            </Stack>
          ))}
          {room?.amenities?.length > 3 && (
            <Typography fontSize={11} color="text.secondary" sx={{ fontStyle: 'italic' }}>
              +{room.amenities.length - 3} tiện ích khác
            </Typography>
          )}
        </Stack>
        <Box sx={{ mt: "auto", pt: 1, borderTop: "1px solid #eee", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            {hasDiscount && (
              <Typography sx={{ color: "text.secondary", textDecoration: "line-through", fontSize: "0.75rem" }}>
                {price.toLocaleString()}₫
              </Typography>
            )}
            <Typography variant="h6" fontWeight={800} color="#000" sx={{ lineHeight: 1 }}>
              {finalPrice.toLocaleString()}₫
              <Typography component="span" variant="caption" sx={{ ml: 0.5, color: "text.secondary" }}>/đêm</Typography>
            </Typography>
          </Box>

          <Button
            variant="contained"
            disabled={!isAvailable}
            endIcon={<ChevronRight />}
            onClick={(e) => { e.stopPropagation(); onBook?.(room); }}
            sx={{ 
              bgcolor: BLUE, 
              borderRadius: 2, 
              textTransform: "none", 
              fontSize: "0.75rem", 
              py: 0.5,
              boxShadow: "none"
            }}
          >
            {isAvailable ? "Đặt ngay" : "Hết phòng"}
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
}