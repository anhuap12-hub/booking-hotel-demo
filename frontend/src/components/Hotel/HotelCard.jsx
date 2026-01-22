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
      whileHover={{ y: -8 }}
      transition={{ duration: 0.3, ease: "easeOut" }}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: "24px", // Bo góc lớn hơn cho hiện đại
        overflow: "hidden",
        bgcolor: "#fff",
        border: "1px solid #F1F0EE",
        cursor: "pointer",
        boxShadow: "0 4px 20px rgba(28, 27, 25, 0.04)",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(28, 27, 25, 0.08)",
          "& .hotel-image": { transform: "scale(1.1)" },
          "& .cta-button": { bgcolor: "#1C1B19", color: "#C2A56D" }
        },
      }}
    >
      {/* ================= IMAGE SECTION ================= */}
      <Box sx={{ position: "relative", overflow: "hidden", aspectRatio: compact ? "16 / 10" : "4 / 3" }}>
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
            transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
          }}
        />

        {/* TAGS */}
        <Stack direction="row" spacing={1} sx={{ position: "absolute", top: 16, left: 16 }}>
          <Chip
            icon={<LocalFireDepartmentIcon sx={{ fontSize: "12px !important", color: "#fff" }} />}
            label="Phổ biến"
            size="small"
            sx={{ bgcolor: "#1C1B19", color: "#fff", fontWeight: 700, fontSize: "10px", height: "24px" }}
          />
          {priceInfo?.discount > 0 && (
            <Chip
              icon={<DiscountIcon sx={{ fontSize: "12px !important" }} />}
              label={`Giảm ${priceInfo.discount}%`}
              size="small"
              sx={{ bgcolor: "#C2A56D", color: "#fff", fontWeight: 700, fontSize: "10px", height: "24px" }}
            />
          )}
        </Stack>
      </Box>

      {/* ================= CONTENT SECTION ================= */}
      <Box sx={{ p: 2.5, display: "flex", flexDirection: "column", flexGrow: 1 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 800,
              fontSize: compact ? "1rem" : "1.15rem",
              lineHeight: 1.3,
              color: "#1C1B19",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 42,
            }}
          >
            {hotel.name}
          </Typography>
        </Stack>

        <Stack direction="row" spacing={2} mb={2}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocationOnIcon sx={{ fontSize: 14, color: "#C2A56D" }} />
            <Typography fontSize="0.8rem" color="#72716E" fontWeight={500}>
              {hotel.city}
            </Typography>
          </Stack>
          {typeof hotel.rating === "number" && (
            <Stack direction="row" spacing={0.5} alignItems="center">
              <StarIcon sx={{ fontSize: 14, color: "#C2A56D" }} />
              <Typography fontSize="0.8rem" fontWeight={700} color="#1C1B19">
                {hotel.rating}/10
              </Typography>
            </Stack>
          )}
        </Stack>

        {!compact && (
          <Typography
            variant="body2"
            sx={{
              color: "#72716E",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              fontSize: "0.85rem",
              lineHeight: 1.6,
              mb: 2
            }}
          >
            {hotel.desc || "Khám phá không gian lưu trú sang trọng tại tâm điểm thành phố."}
          </Typography>
        )}

        <Box sx={{ mt: "auto" }}>
          <Divider sx={{ mb: 2, borderColor: "#F1F0EE" }} />
          
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography fontSize="0.7rem" color="#72716E" fontWeight={600} sx={{ textTransform: "uppercase", letterSpacing: "0.05em" }}>
                Giá mỗi đêm
              </Typography>
              <Stack direction="row" alignItems="center" spacing={1}>
                <Typography fontWeight={900} fontSize="1.1rem" color="#1C1B19">
                  {priceInfo?.finalPrice.toLocaleString()}đ
                </Typography>
                {priceInfo?.discount > 0 && (
                  <Typography
                    fontSize="0.8rem"
                    sx={{ textDecoration: "line-through", color: "#A8A7A1", fontWeight: 500 }}
                  >
                    {priceInfo.price.toLocaleString()}đ
                  </Typography>
                )}
              </Stack>
            </Box>

            <Button
              className="cta-button"
              variant="outlined"
              sx={{
                borderRadius: "12px",
                borderColor: "#F1F0EE",
                color: "#1C1B19",
                fontSize: "0.75rem",
                fontWeight: 800,
                px: 2,
                py: 1,
                textTransform: "none",
                transition: "0.3s",
                "&:hover": { borderColor: "#1C1B19" }
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