import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Divider,
  Chip,
  Button,
  useTheme,
} from "@mui/material";

import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HotelIcon from "@mui/icons-material/Hotel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BedIcon from "@mui/icons-material/Bed";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";

import { motion, AnimatePresence } from "framer-motion";
import { getAllHotels } from "../../api/hotel.api";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

/* ================= COMPONENT: DEAL CARD (HORIZONTAL) ================= */
const DealHotelRow = ({ hotel }) => {
  const navigate = useNavigate();
  const theme = useTheme();
  
  const priceDisplay = useMemo(() => {
    const discountedRooms = hotel.rooms.filter(r => r.discount > 0);
    const bestRoom = discountedRooms.reduce((min, cur) => {
      const curFinal = cur.price * (1 - cur.discount / 100);
      const minFinal = min.price * (1 - min.discount / 100);
      return curFinal < minFinal ? cur : min;
    }, discountedRooms[0]);

    return {
      original: bestRoom.price,
      final: Math.round(bestRoom.price * (1 - bestRoom.discount / 100)),
      discount: bestRoom.discount,
      roomName: bestRoom.type
    };
  }, [hotel.rooms]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 2.5,
        mb: 3,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        gap: 3,
        transition: "0.3s",
        border: `1px solid ${theme.palette.divider}`,
        "&:hover": {
          boxShadow: theme.shadows[4],
          transform: "translateX(8px)",
          borderColor: theme.palette.primary.main,
        },
      }}
      onClick={() => navigate(`/hotels/${hotel._id}`)}
    >
      {/* IMAGE */}
      <Box sx={{ width: { xs: "100%", sm: 260 }, height: 180, borderRadius: 3, overflow: "hidden", position: "relative", flexShrink: 0 }}>
        <Box component="img" src={hotel.photos?.[0]?.url} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
        <Box sx={{ position: "absolute", top: 12, left: 12, bgcolor: theme.palette.error.main, color: "#fff", px: 1.5, py: 0.5, borderRadius: 2, fontWeight: 800, fontSize: "0.75rem" }}>
          -{priceDisplay.discount}% OFF
        </Box>
      </Box>

      {/* INFO */}
      <Box sx={{ flex: 1, display: "flex", flexDirection: "column" }}>
        <Box>
          {/* Dùng h6 để kích hoạt Playfair Display */}
          <Typography variant="h6" sx={{ color: theme.palette.text.primary, mb: 0.5, lineHeight: 1.3 }}>
            {hotel.name}
          </Typography>
          <Stack direction="row" spacing={1} alignItems="center" mb={1.5}>
            <StarIcon sx={{ fontSize: 16, color: "#fbbf24" }} />
            <Typography variant="body2" fontWeight={700}>{hotel.rating}/10</Typography>
            <Typography variant="body2" color="text.secondary">• {hotel.city}</Typography>
          </Stack>
        </Box>

        <Typography variant="body2" color="text.secondary" sx={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden", mb: 2 }}>
          {hotel.desc || `Tận hưởng ưu đãi tuyệt vời cho hạng phòng ${priceDisplay.roomName} tại ${hotel.city}.`}
        </Typography>

        <Box sx={{ mt: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="caption" sx={{ textDecoration: "line-through", color: "text.secondary", display: "block" }}>
              {priceDisplay.original.toLocaleString()}đ
            </Typography>
            <Typography variant="h5" sx={{ color: theme.palette.error.main, fontWeight: 700 }}>
              {priceDisplay.final.toLocaleString()}đ
              <Box component="span" sx={{ fontSize: "0.75rem", color: "text.secondary", fontWeight: 400, ml: 0.5 }}>/đêm</Box>
            </Typography>
          </Box>
          <Button variant="contained" endIcon={<ArrowForwardIcon />} sx={{ borderRadius: 2, fontWeight: 700 }}>
            Xem chi tiết
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

/* ================= MAIN PAGE ================= */
export default function Deals() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAll, setShowAll] = useState(false);
  const theme = useTheme();

  useEffect(() => {
    getAllHotels()
      .then((res) => setHotels(res.data?.data || []))
      .finally(() => setLoading(false));
  }, []);

  const deals = useMemo(() => {
    return hotels
      .map((hotel) => {
        if (!hotel.rooms?.length) return null;
        const discountedRooms = hotel.rooms.filter(r => r.discount > 0);
        if (!discountedRooms.length) return null;
        const maxDiscount = Math.max(...discountedRooms.map(r => r.discount));
        return { ...hotel, _bestDiscount: maxDiscount };
      })
      .filter(Boolean)
      .sort((a, b) => b._bestDiscount - a._bestDiscount);
  }, [hotels]);

  const visibleDeals = useMemo(() => (showAll ? deals : deals.slice(0, 5)), [deals, showAll]);

  return (
    <Box sx={{ bgcolor: theme.palette.background.default, minHeight: "100vh", px: { xs: 2, md: 8 }, py: 8 }}>
      
      {/* HEADER SECTION */}
      <Box mb={8}>
        <Stack direction="row" spacing={2} alignItems="center" mb={1}>
          <LocalOfferIcon sx={{ color: theme.palette.error.main, fontSize: 32 }} />
          {/* Dùng h2 cho Font Playfair Display */}
          <Typography variant="h2" sx={{ fontSize: { xs: "2rem", md: "3rem" } }}>
            Ưu đãi Đặc quyền
          </Typography>
        </Stack>
        <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 600 }}>
          Săn ngay những deal khách sạn giá tốt nhất. Số lượng có hạn, dành riêng cho thành viên Coffee Stay.
        </Typography>
      </Box>

      <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 360px" }, gap: 8 }}>
        
        {/* LEFT: DEAL LIST */}
        <Box>
          {loading ? (
            <Box textAlign="center" py={10}><CircularProgress color="primary" /></Box>
          ) : deals.length > 0 ? (
            <>
              <AnimatePresence>
                {visibleDeals.map((hotel, i) => (
                  <MotionBox key={hotel._id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }}>
                    <DealHotelRow hotel={hotel} />
                  </MotionBox>
                ))}
              </AnimatePresence>

              {deals.length > 5 && (
                <Button fullWidth onClick={() => setShowAll(!showAll)} sx={{ py: 2, mt: 2, color: theme.palette.primary.main, fontWeight: 700 }}>
                  {showAll ? "Thu gọn danh sách" : `Khám phá thêm ${deals.length - 5} ưu đãi khác`}
                </Button>
              )}
            </>
          ) : (
            <Paper sx={{ p: 8, textAlign: "center", border: `2px dashed ${theme.palette.divider}`, bgcolor: "transparent" }}>
              <HotelIcon sx={{ fontSize: 64, color: theme.palette.divider, mb: 2 }} />
              <Typography variant="h5">Chưa có ưu đãi mới</Typography>
              <Typography variant="body2" color="text.secondary">Chúng tôi đang cập nhật deal mới, hãy quay lại sau nhé.</Typography>
            </Paper>
          )}
        </Box>

        {/* RIGHT: SIDEBAR */}
        <Box sx={{ display: { xs: "none", lg: "block" } }}>
          <Stack spacing={4} sx={{ position: "sticky", top: 120 }}>
            
            {/* Quote Card */}
            <Paper sx={{ p: 4, bgcolor: theme.palette.primary.main, color: "#fff", position: "relative" }}>
              <FormatQuoteIcon sx={{ position: "absolute", top: 10, right: 10, fontSize: 48, opacity: 0.2 }} />
              <Typography variant="h5" sx={{ color: "#fff", mb: 2, fontStyle: "italic" }}>
                "Kỳ nghỉ lý tưởng không nhất thiết phải đắt nhất, mà phải là nơi khiến bạn thấy thuộc về nhất."
              </Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, fontWeight: 700 }}>— COFFEE STAY TEAM</Typography>
            </Paper>

            {/* Why choose us card */}
            <Paper sx={{ p: 4 }}>
              <Typography variant="h6" sx={{ mb: 3 }}>Vì sao chọn Coffee Stay?</Typography>
              <Stack spacing={3}>
                {[
                  { icon: <CheckCircleIcon sx={{ color: theme.palette.success.main }} />, title: "Giá tốt nhất", desc: "Cam kết giá thấp hơn 15% so với đại lý." },
                  { icon: <BedIcon sx={{ color: theme.palette.primary.main }} />, title: "Chất lượng kiểm định", desc: "Mọi phòng đều được đội ngũ chúng tôi khảo sát." },
                  { icon: <AccessTimeIcon sx={{ color: theme.palette.warning.main }} />, title: "Hỗ trợ tận tâm", desc: "Luôn có mặt 24/7 giải quyết mọi vấn đề." }
                ].map((item, idx) => (
                  <Stack key={idx} direction="row" spacing={2}>
                    {item.icon}
                    <Box>
                      <Typography variant="body2" fontWeight={800}>{item.title}</Typography>
                      <Typography variant="caption" color="text.secondary">{item.desc}</Typography>
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Paper>

          </Stack>
        </Box>
      </Box>
    </Box>
  );
}