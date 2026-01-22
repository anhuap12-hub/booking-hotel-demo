import { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, CircularProgress, Paper, Stack, Divider, 
  Chip, Button,  Fade, IconButton
} from "@mui/material";

import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HotelIcon from "@mui/icons-material/Hotel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BedIcon from "@mui/icons-material/Bed";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import FlashOnIcon from '@mui/icons-material/FlashOn';

import { motion, AnimatePresence } from "framer-motion";
import { getAllHotels } from "../../api/hotel.api";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

/* ================= COMPONENT: DEAL CARD (PREMIUM ROW) ================= */
const DealHotelRow = ({ hotel }) => {
  const navigate = useNavigate();
 
  
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
        p: 0, // Đưa padding vào trong để ảnh tràn viền nhẹ
        mb: 4,
        display: "flex",
        flexDirection: { xs: "column", sm: "row" },
        overflow: "hidden",
        borderRadius: "24px",
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        border: `1px solid rgba(194, 165, 109, 0.2)`,
        bgcolor: "#fff",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(28, 27, 25, 0.08)",
          transform: "translateY(-4px)",
          borderColor: "#C2A56D",
          "& .hotel-img": { transform: "scale(1.08)" },
          "& .btn-view": { bgcolor: "#1C1B19", color: "#C2A56D" }
        },
      }}
      onClick={() => navigate(`/hotels/${hotel._id}`)}
    >
      {/* IMAGE SECTION */}
      <Box sx={{ width: { xs: "100%", sm: 300 }, height: { xs: 200, sm: "auto" }, overflow: "hidden", position: "relative" }}>
        <Box 
          className="hotel-img"
          component="img" 
          src={hotel.photos?.[0]?.url} 
          sx={{ 
            width: "100%", height: "100%", objectFit: "cover",
            transition: "transform 0.6s ease"
          }} 
        />
        <Box sx={{ 
          position: "absolute", top: 16, left: 16, 
          bgcolor: "#1C1B19", color: "#C2A56D", 
          px: 2, py: 0.8, borderRadius: "10px", 
          fontWeight: 800, fontSize: "0.7rem",
          display: 'flex', alignItems: 'center', gap: 0.5,
          border: '1px solid #C2A56D'
        }}>
          <FlashOnIcon sx={{ fontSize: 14 }} /> {priceDisplay.discount}% GIẢM GIÁ
        </Box>
      </Box>

      {/* CONTENT SECTION */}
      <Box sx={{ flex: 1, p: 4, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start">
          <Box>
            <Typography variant="h5" sx={{ 
              color: "#1C1B19", mb: 1, 
              fontFamily: "'Playfair Display', serif", fontWeight: 800 
            }}>
              {hotel.name}
            </Typography>
            <Stack direction="row" spacing={2} alignItems="center" mb={2}>
              <Stack direction="row" spacing={0.5} alignItems="center">
                <StarIcon sx={{ fontSize: 18, color: "#C2A56D" }} />
                <Typography variant="body2" fontWeight={800}>{hotel.rating}</Typography>
              </Stack>
              <Typography variant="body2" color="#A8A7A1" fontWeight={500}>
                • {hotel.city}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Typography variant="body2" sx={{ color: "#72716E", lineHeight: 1.7, mb: 3 }}>
          {hotel.desc?.substring(0, 120)}...
        </Typography>

        <Box sx={{ mt: "auto", display: "flex", alignItems: "flex-end", justifyContent: "space-between" }}>
          <Box>
            <Typography variant="caption" sx={{ textDecoration: "line-through", color: "#A8A7A1", display: "block", mb: 0.5 }}>
              {priceDisplay.original.toLocaleString()}₫
            </Typography>
            <Typography variant="h4" sx={{ color: "#1C1B19", fontWeight: 900, display: 'flex', alignItems: 'baseline' }}>
              {priceDisplay.final.toLocaleString()}₫
              <Typography component="span" sx={{ fontSize: "0.8rem", color: "#72716E", fontWeight: 500, ml: 1 }}>/ đêm</Typography>
            </Typography>
          </Box>
          <Button 
            className="btn-view"
            variant="outlined" 
            endIcon={<ArrowForwardIcon />} 
            sx={{ 
              borderRadius: "12px", px: 3, py: 1.2,
              borderColor: "#1C1B19", color: "#1C1B19",
              transition: "0.3s"
            }}
          >
            Trải nghiệm ngay
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
    <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh", px: { xs: 2, md: 8 }, py: 10 }}>
      
      {/* HEADER SECTION */}
      <Container maxWidth="xl">
        <Box mb={10} textAlign="center">
          <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" mb={2}>
              <LocalOfferOutlinedIcon sx={{ color: "#C2A56D", fontSize: 40 }} />
              <Typography variant="h2" sx={{ 
                fontFamily: "'Playfair Display', serif", 
                fontWeight: 900, color: "#1C1B19" 
              }}>
                Tuyệt Phẩm Ưu Đãi
              </Typography>
            </Stack>
            <Typography variant="h6" sx={{ color: "#72716E", fontWeight: 400, maxWidth: 700, mx: "auto" }}>
              Những hành trình xa hoa giờ đây nằm trong tầm tay bạn với các đặc quyền giới hạn dành riêng cho giới tinh hoa.
            </Typography>
          </MotionBox>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "1fr 380px" }, gap: 10 }}>
          
          {/* LEFT: DEAL LIST */}
          <Box>
            {loading ? (
              <Box textAlign="center" py={10}><CircularProgress sx={{ color: '#C2A56D' }} /></Box>
            ) : deals.length > 0 ? (
              <>
                <AnimatePresence>
                  {visibleDeals.map((hotel, i) => (
                    <MotionBox key={hotel._id} initial={{ opacity: 0, x: -30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }}>
                      <DealHotelRow hotel={hotel} />
                    </MotionBox>
                  ))}
                </AnimatePresence>

                {deals.length > 5 && (
                  <Button 
                    fullWidth 
                    onClick={() => setShowAll(!showAll)} 
                    sx={{ 
                      py: 2.5, mt: 2, color: "#1C1B19", fontWeight: 800, 
                      border: '1px solid rgba(28, 27, 25, 0.1)', borderRadius: '16px',
                      '&:hover': { bgcolor: 'rgba(194, 165, 109, 0.05)' }
                    }}
                  >
                    {showAll ? "THU GỌN DANH SÁCH" : `XEM THÊM ${deals.length - 5} ƯU ĐÃI TUYỆT VỜI KHÁC`}
                  </Button>
                )}
              </>
            ) : (
              <Paper sx={{ p: 10, textAlign: "center", borderRadius: "32px", border: `2px dashed rgba(194, 165, 109, 0.3)`, bgcolor: "transparent" }}>
                <HotelIcon sx={{ fontSize: 80, color: "rgba(194, 165, 109, 0.2)", mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>Sớm ra mắt ưu đãi mới</Typography>
                <Typography variant="body1" color="#A8A7A1">Các đặc quyền mới đang được đội ngũ quản gia chuẩn bị.</Typography>
              </Paper>
            )}
          </Box>

          {/* RIGHT: SIDEBAR */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Stack spacing={5} sx={{ position: "sticky", top: 120 }}>
              
              {/* Premium Quote Card */}
              <Paper sx={{ 
                p: 5, bgcolor: "#1C1B19", color: "#C2A56D", 
                borderRadius: "32px", position: "relative",
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(0,0,0,0.2)'
              }}>
                <FormatQuoteIcon sx={{ position: "absolute", top: -10, right: -10, fontSize: 120, opacity: 0.1, color: "#C2A56D" }} />
                <Typography variant="h5" sx={{ mb: 3, fontStyle: "italic", lineHeight: 1.6, position: 'relative', zIndex: 1 }}>
                  "Sự sang trọng thực sự không nằm ở mức giá, mà ở cảm giác bạn được trân trọng trong từng khoảnh khắc."
                </Typography>
                <Typography variant="body2" sx={{ color: "#A8A7A1", fontWeight: 800, letterSpacing: 2 }}>— COFFEE STAY ELITE</Typography>
              </Paper>

              {/* Service Commitments */}
              <Box>
                <Typography variant="h6" sx={{ mb: 4, fontWeight: 800, color: "#1C1B19" }}>Đặc Quyền Của Bạn</Typography>
                <Stack spacing={4}>
                  {[
                    { icon: <CheckCircleIcon sx={{ color: "#10b981" }} />, title: "Giá Tốt Nhất Hệ Thống", desc: "Cam kết mức giá ưu đãi nhất so với bất kỳ đại lý nào." },
                    { icon: <BedIcon sx={{ color: "#C2A56D" }} />, title: "Kiểm Định Tận Nơi", desc: "Đội ngũ chuyên gia luôn trực tiếp khảo sát từng căn phòng." },
                    { icon: <AccessTimeIcon sx={{ color: "#1C1B19" }} />, title: "Hỗ Trợ Ưu Tiên 24/7", desc: "Đường dây nóng riêng dành cho các giao dịch đặc quyền." }
                  ].map((item, idx) => (
                    <Stack key={idx} direction="row" spacing={3} alignItems="flex-start">
                      <Avatar sx={{ bgcolor: 'rgba(194, 165, 109, 0.1)', color: '#C2A56D' }}>
                        {item.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={800} color="#1C1B19">{item.title}</Typography>
                        <Typography variant="body2" color="#72716E" sx={{ mt: 0.5 }}>{item.desc}</Typography>
                      </Box>
                    </Stack>
                  ))}
                </Stack>
              </Box>

            </Stack>
          </Box>
        </Box>
      </Container>
    </Box>
  );
}