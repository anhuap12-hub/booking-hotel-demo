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

function HotelCard({ hotel, compact = false }) {
  const navigate = useNavigate();

  /* ================= IMAGE ================= */
  const image =
    hotel.photos?.[0]?.url ||
    "https://via.placeholder.com/400x300?text=No+Image";

  /* ================= PRICE (CHUẨN DEAL LOGIC) ================= */
  const priceInfo = useMemo(() => {
    if (!hotel.rooms?.length) return null;

    // 1️⃣ Lấy các phòng có discount
    const discountedRooms = hotel.rooms.filter(
      r => typeof r.discount === "number" && r.discount > 0
    );

    // 2️⃣ Nếu có deal → chọn phòng có GIÁ SAU GIẢM THẤP NHẤT
    if (discountedRooms.length) {
      const bestRoom = discountedRooms.reduce((best, cur) => {
        const curFinal = cur.price * (1 - cur.discount / 100);
        const bestFinal = best.price * (1 - best.discount / 100);
        return curFinal < bestFinal ? cur : best;
      }, discountedRooms[0]);

      return {
        hasDeal: true,
        price: bestRoom.price,
        finalPrice: Math.round(
          bestRoom.price * (1 - bestRoom.discount / 100)
        ),
        discount: bestRoom.discount,
      };
    }

    // 3️⃣ Không có deal → lấy phòng rẻ nhất
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
    <Box
      onClick={() => navigate(`/hotels/${hotel._id}`)}
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        borderRadius: 3,
        overflow: "hidden",
        bgcolor: "#fff",
        border: "1px solid #eee",
        cursor: "pointer",
        transition: "0.25s ease",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 14px 28px rgba(0,0,0,.12)",
        },
      }}
    >
      {/* ================= IMAGE ================= */}
      <Box
        sx={{
          position: "relative",
          aspectRatio: compact ? "16 / 9" : "4 / 3",
          maxHeight: compact ? 200 : "none",
        }}
      >
        <Box
          component="img"
          src={image}
          alt={hotel.name}
          loading="lazy"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
          }}
        />

        {/* TAGS */}
        <Stack
          direction="row"
          spacing={0.5}
          sx={{ position: "absolute", top: 10, left: 10 }}
        >
          <Chip
            icon={<LocalFireDepartmentIcon sx={{ fontSize: 14 }} />}
            label="Hot"
            size="small"
            color="error"
          />

          {priceInfo?.discount > 0 && (
            <Chip
              icon={<DiscountIcon sx={{ fontSize: 14 }} />}
              label={`-${priceInfo.discount}%`}
              size="small"
              sx={{ bgcolor: "#fef3c7", fontWeight: 700 }}
            />
          )}
        </Stack>
      </Box>

      {/* ================= CONTENT ================= */}
      <Box sx={{ p: 2, display: "flex", flexDirection: "column", flexGrow: 1 }}>
        {/* NAME */}
        <Typography
          fontWeight={700}
          fontSize={compact ? "0.9rem" : "0.95rem"}
          mb={0.5}
          sx={{
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            overflow: "hidden",
            minHeight: 40,
          }}
        >
          {hotel.name}
        </Typography>

        {/* CITY + RATING */}
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="center"
          mb={0.5}
        >
          <Stack direction="row" spacing={0.5} alignItems="center">
            <LocationOnIcon sx={{ fontSize: 14, color: "text.secondary" }} />
            <Typography fontSize="0.75rem" color="text.secondary">
              {hotel.city}
            </Typography>
          </Stack>

          {typeof hotel.rating === "number" && (
            <Stack direction="row" spacing={0.25} alignItems="center">
              <StarIcon sx={{ fontSize: 14, color: "#facc15" }} />
              <Typography fontSize="0.75rem" fontWeight={600}>
                {hotel.rating}/10
              </Typography>
            </Stack>
          )}
        </Stack>

        {/* DESC */}
        {!compact && (
          <Typography
            fontSize="0.8rem"
            color="text.secondary"
            sx={{
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              overflow: "hidden",
              minHeight: 36,
            }}
          >
            {hotel.desc || "Khách sạn chất lượng, vị trí thuận tiện."}
          </Typography>
        )}

        <Divider sx={{ my: 1.2 }} />

        {/* PRICE + CTA */}
        <Stack direction="row" justifyContent="space-between" alignItems="end">
          {priceInfo ? (
            <Stack spacing={0.25}>
              <Typography fontSize="0.7rem" color="text.secondary">
                Giá từ
              </Typography>

              <Typography fontWeight={800} fontSize="1rem" color="error">
                {priceInfo.finalPrice.toLocaleString()}đ
              </Typography>

              {priceInfo.discount > 0 && (
                <Typography
                  fontSize="0.7rem"
                  sx={{
                    textDecoration: "line-through",
                    color: "text.secondary",
                  }}
                >
                  {priceInfo.price.toLocaleString()}đ
                </Typography>
              )}
            </Stack>
          ) : (
            <Typography fontWeight={700}>Liên hệ</Typography>
          )}

          <Button
            size="small"
            variant="contained"
            onClick={(e) => {
              e.stopPropagation();
              navigate(`/hotels/${hotel._id}`);
            }}
            sx={{
              borderRadius: 999,
              bgcolor: "#8B6F4E",
              px: 2,
              py: 0.6,
              fontSize: "0.75rem",
              fontWeight: 600,
              "&:hover": { bgcolor: "#7a5f41" },
            }}
          >
            Xem Thông Tin
          </Button>
        </Stack>
      </Box>
    </Box>
  );
}

export default memo(HotelCard);
