import {
  Box,
  Typography,
  Chip,
  Button,
  Stack,
  Divider,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import LocalFireDepartmentIcon from "@mui/icons-material/LocalFireDepartment";
import DiscountIcon from "@mui/icons-material/Discount";
import { useNavigate } from "react-router-dom";
import { memo, useMemo } from "react";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

function HotelCard({ hotel, compact = false }) {
  const navigate = useNavigate();

  /* ================= IMAGE LOGIC ================= */
  const image =
    hotel.photos?.[0]?.url ||
    "https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&q=80&w=600";

  /* ================= PRICE LOGIC (GIỮ NGUYÊN) ================= */
  const priceInfo = useMemo(() => {
    if (!hotel.rooms?.length) return null;
    const discountedRooms = hotel.rooms.filter(
      r => typeof r.discount === "number" && r.discount > 0
    );

    if (discountedRooms.length) {
      const bestRoom = discountedRooms.reduce((best, cur) => {
        const curFinal = cur.price * (1 - cur.discount / 100);
        const bestFinal = best.price * (1 - best.discount / 100);
        return curFinal < bestFinal ? cur : best;
      }, discountedRooms[0]);

      return {
        hasDeal: true,
        price: bestRoom.price,
        finalPrice: Math.round(bestRoom.price * (1 - bestRoom.discount / 100)),
        discount: bestRoom.discount,
      };
    }

    const cheapestRoom = hotel.rooms.reduce(
      (min, cur) => (cur.price < min.price ? cur : min),
      hotel.rooms[0]
    );

    return {
      hasDeal: false,
      price: cheapestRoom.price,
      finalPrice: cheapestRoom.price,
      discount: 0,
    };
  }, [hotel.rooms]);

  return (
    <MotionBox
      onClick={() => navigate(`/hotels/${hotel._id}`)}
      whileHover={{ y: -10 }}
      transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "28px", 
        overflow: "hidden",
        bgcolor: "#fff",
        border: "1px solid #F1F0EE",
        cursor: "pointer",
        position: "relative",
        boxShadow: "0 4px 20px rgba(28, 27, 25, 0.04)",
        "&:hover": {
          boxShadow: "0 30px 60px rgba(28, 27, 25, 0.12)",
          "& .hotel-image": { transform: "scale(1.08)" },
          "& .cta-button": { 
            bgcolor: "#1C1B19", 
            color: "#C2A56D",
            borderColor: "#1C1B19"
          }
        },
      }}
    >
      {/* ================= IMAGE SECTION ================= */}
      <Box sx={{ position: "relative", overflow: "hidden", aspectRatio: compact ? "16 / 10" : "1 / 1" }}>
        <Box
          className="hotel-image"
          component="img"
          src={image}
          alt={hotel.name}
          loading="lazy"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.8s cubic-bezier(0.2, 0, 0.2, 1)",
          }}
        />
        
        {/* Shadow Overlay cho Chip */}
        <Box sx={{ 
          position: "absolute", top: 0, left: 0, width: "100%", height: "40%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, transparent 100%)",
          zIndex: 1
        }} />

        {/* TAGS */}
        <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 20, left: 20, zIndex: 2 }}>
          <Chip
            icon={<LocalFireDepartmentIcon sx={{ fontSize: "14px !important", color: "#C2A56D !important" }} />}
            label="LUXURY"
            size="small"
            sx={{ 
              bgcolor: "rgba(28, 27, 25, 0.85)", 
              color: "#fff", 
              fontWeight: 800, 
              fontSize: "10px", 
              height: "26px",
              backdropFilter: "blur(4px)",
              letterSpacing: "0.1em"
            }}
          />
          {priceInfo?.discount > 0 && (
            <Chip
              icon={<DiscountIcon sx={{ fontSize: "14px !important", color: "#fff !important" }} />}
              label={`-${priceInfo.discount}%`}
              size="small"
              sx={{ bgcolor: "#C2A56D", color: "#fff", fontWeight: 800, fontSize: "10px", height: "26px" }}
            />
          )}
        </Stack>
      </Box>

      {/* ================= CONTENT SECTION ================= */}
      <Box sx={{ p: 3, display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: compact ? "1.1rem" : "1.3rem",
            lineHeight: 1.2,
            color: "#1C1B19",
            mb: 1.5,
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: compact ? 40 : 50,
          }}
        >
          {hotel.name}
        </Typography>

        <Stack direction="row" spacing={2} mb={2.5}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocationOnIcon sx={{ fontSize: 16, color: "#C2A56D" }} />
            <Typography fontSize="0.85rem" color="#72716E" fontWeight={600}>
              {hotel.city}
            </Typography>
          </Stack>
          {typeof hotel.rating === "number" && (
  <Stack direction="row" spacing={0.5} alignItems="center">
    <Box sx={{ 
      bgcolor: "#1C1B19", 
      color: "#C2A56D", 
      px: 0.8, 
      py: 0.2, 
      borderRadius: "6px 6px 6px 0", 
      fontWeight: 900, 
      fontSize: "0.85rem" 
    }}>
      {hotel.rating > 0 ? hotel.rating.toFixed(1) : "NEW"}
    </Box>
    <Stack sx={{ ml: 0.5 }}>
      <Typography fontSize="0.75rem" fontWeight={800} color="#1C1B19" lineHeight={1}>
        {hotel.rating >= 9 ? "Tuyệt vời" : hotel.rating >= 8 ? "Rất tốt" : "Hài lòng"}
      </Typography>
      <Typography fontSize="0.65rem" color="#A8A7A1">
        {hotel.reviews || 0} đánh giá
      </Typography>
    </Stack>
  </Stack>
)}
        </Stack>

        <Box sx={{ mt: "auto" }}>
          <Divider sx={{ mb: 2.5, borderColor: "#F1F0EE" }} />
          
          <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
            <Box>
              <Typography fontSize="0.65rem" color="#A8A7A1" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: "0.15em", mb: 0.5 }}>
                Giá từ
              </Typography>
              <Stack direction="row" alignItems="baseline" spacing={1}>
                <Typography fontWeight={900} fontSize="1.25rem" color="#1C1B19">
                  {priceInfo?.finalPrice.toLocaleString()}
                </Typography>
                <Typography fontSize="0.8rem" fontWeight={700} color="#1C1B19">VNĐ</Typography>
                {priceInfo?.discount > 0 && (
                  <Typography
                    fontSize="0.85rem"
                    sx={{ textDecoration: "line-through", color: "#BCBBB9", fontWeight: 500, ml: 1 }}
                  >
                    {priceInfo.price.toLocaleString()}
                  </Typography>
                )}
              </Stack>
            </Box>

            <Button
              className="cta-button"
              variant="outlined"
              sx={{
                borderRadius: "100px",
                borderColor: "#1C1B19",
                color: "#1C1B19",
                fontSize: "0.7rem",
                fontWeight: 900,
                px: 3,
                py: 1,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                transition: "all 0.3s ease",
              }}
            >
              Chi tiết
            </Button>
          </Stack>
        </Box>
      </Box>
    </MotionBox>
  );
}

export default memo(HotelCard);