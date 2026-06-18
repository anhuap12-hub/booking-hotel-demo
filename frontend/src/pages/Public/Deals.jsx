import { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, CircularProgress, Paper, Stack, Button, Container
} from "@mui/material";

// Icons
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { motion } from "framer-motion";
import { getAllHotels } from "../../api/hotel.api";
import { useNavigate } from "react-router-dom";

const BLUE = "#0056b3";

/* ================= COMPONENT: DEAL CARD (PREMIUM ROW) ================= */
const DealHotelRow = ({ hotel }) => {
  const navigate = useNavigate();

  const priceDisplay = useMemo(() => {
    if (!hotel.rooms || hotel.rooms.length === 0) return null;
    const discountedRooms = hotel.rooms.filter((r) => r.discount > 0);
    if (discountedRooms.length === 0) return null;

    const bestRoom = discountedRooms.reduce((min, cur) => {
      const curFinal = cur.price * (1 - cur.discount / 100);
      const minFinal = min.price * (1 - min.discount / 100);
      return curFinal < minFinal ? cur : min;
    }, discountedRooms[0]);

    return {
      original: bestRoom.price,
      final: Math.round(bestRoom.price * (1 - bestRoom.discount / 100)),
      discount: bestRoom.discount,
    };
  }, [hotel.rooms]);

  if (!priceDisplay) return null;

  return (
    <Paper
      elevation={0}
      onClick={() => navigate(`/hotels/${hotel._id}`)}
      sx={{
        p: 1.5,
        mb: 2,
        borderRadius: "16px",
        display: "flex",
        alignItems: "stretch",
        border: "1px solid #e0e0e0",
        flexDirection: { xs: "column", sm: "row" },
        transition: "all 0.3s ease",
        cursor: "pointer",
        "&:hover": { borderColor: BLUE, boxShadow: "0 4px 12px rgba(0, 86, 179, 0.15)" },
      }}
    >
      <Box sx={{ width: { xs: "100%", sm: 200 }, height: 160, overflow: "hidden", borderRadius: "12px", flexShrink: 0, position: "relative" }}>
        <Box component="img" src={hotel.photos?.[0]?.url} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <Box sx={{ position: "absolute", top: 8, left: 8, bgcolor: BLUE, color: "#fff", px: 1, py: 0.3, borderRadius: "6px", fontSize: "0.7rem", fontWeight: 700 }}>
          -{priceDisplay.discount}%
        </Box>
      </Box>

      <Box sx={{ flex: 1, px: 2, py: 0.5, display: "flex", flexDirection: "column", minWidth: 0, gap: 0.5 }}>
        <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
          <Typography variant="subtitle1" fontWeight={700} sx={{ color: "#333", lineHeight: 1.2 }}>{hotel.name}</Typography>
          {hotel.rating > 0 && (
            <Box sx={{ display: "flex", alignItems: "center", bgcolor: "#fff9c4", px: 1, py: 0.2, borderRadius: "6px", border: "1px solid #fbc02d", ml: 1, flexShrink: 0 }}>
              <StarIcon sx={{ fontSize: 13, color: "#fbc02d", mr: 0.3 }} />
              <Typography fontSize={11} fontWeight={700} color="#856404">{hotel.rating.toFixed(1)}</Typography>
            </Box>
          )}
        </Box>

        <Stack direction="row" alignItems="center" spacing={0.5}>
          <LocationOnIcon sx={{ fontSize: 13, color: "text.secondary" }} />
          <Typography variant="caption" color="text.secondary">{hotel.city}</Typography>
        </Stack>

        <Typography variant="body2" color="text.secondary" sx={{ fontSize: "0.8rem", overflow: "hidden", WebkitLineClamp: 2, display: "-webkit-box", WebkitBoxOrient: "vertical", minHeight: "2.4em" }}>
          {hotel.desc ? hotel.desc.split(/[.!?]/)[0] + "." : ""}
        </Typography>

        <Box sx={{ mt: "auto", display: "flex", justifyContent: "space-between", alignItems: "center", pt: 1, borderTop: "1px solid #eee" }}>
          <Box>
            <Typography variant="caption" sx={{ color: "text.secondary", textDecoration: "line-through", mr: 1, display: "block", fontSize: "0.75rem" }}>
              {priceDisplay.original.toLocaleString()}₫
            </Typography>
            <Typography variant="h6" fontWeight={800} color="#000" sx={{ lineHeight: 1 }}>
              {priceDisplay.final.toLocaleString()}₫
              <Typography component="span" variant="caption" sx={{ ml: 0.5, color: "text.secondary" }}>/đêm</Typography>
            </Typography>
          </Box>
          <Button variant="contained" endIcon={<ChevronRightIcon />} sx={{ bgcolor: BLUE, borderRadius: 2, textTransform: "none", fontSize: "0.75rem", py: 0.5 }}>
            Chi tiết
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

/* ================= MAIN PAGE: DEALS ================= */
export default function Deals() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);

  useEffect(() => {
    getAllHotels().then(res => setHotels(res.data?.data || [])).finally(() => setLoading(false));
  }, []);

  const deals = useMemo(() => hotels.filter(h => h.rooms?.some(r => r.discount > 0)), [hotels]);
  const visibleDeals = useMemo(() => (showAll ? deals : deals.slice(0, 5)), [deals, showAll]);

  return (
    <Box sx={{ bgcolor: "#FDFCFB", minHeight: "100vh", py: 4 }}>
      <Container maxWidth="lg">
        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 350px" }, gap: 6 }}>
          <Box>
            <Typography variant="h5" sx={{ fontWeight: 700, mb: 3 }}>Ưu đãi đặc biệt</Typography>
            {loading ? <CircularProgress /> : visibleDeals.map(h => <DealHotelRow key={h._id} hotel={h} />)}
          </Box>

          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Stack spacing={4} sx={{ position: "sticky", top: 100 }}>
              <Paper sx={{ p: 4, bgcolor: BLUE, color: "#fff", borderRadius: "24px" }}>
                <FormatQuoteIcon sx={{ color: "rgba(255,255,255,0.6)", fontSize: 40, mb: 1 }} />
                <Typography sx={{ fontStyle: "italic", mb: 2 }}>"Mang tới cho bạn nơi dừng chân tốt nhất, vi vu không lo nghĩ."</Typography>
                <Typography sx={{ fontSize: "0.8rem", fontWeight: 800, opacity: 0.8 }}>— COFFEE STAY ELITE</Typography>
              </Paper>
              <Stack spacing={2}>
                <Typography sx={{ fontWeight: 700 }}>Chính sách khách sạn</Typography>
                {[{t: "Giá Tốt Nhất"}, {t: "Kiểm Định Tận Nơi"}, {t: "Hỗ Trợ 24/7"}].map((i, k) => (
                  <Stack key={k} direction="row" spacing={1} alignItems="center">
                    <CheckCircleIcon sx={{ color: BLUE, fontSize: 20 }} />
                    <Typography sx={{ fontSize: "0.9rem" }}>{i.t}</Typography>
                  </Stack>
                ))}
              </Stack>
            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}