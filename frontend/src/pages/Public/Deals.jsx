import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Divider,
  Button,
  Container,
  Avatar,
} from "@mui/material";

// Icons
import LocalOfferOutlinedIcon from "@mui/icons-material/LocalOfferOutlined";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import HotelIcon from "@mui/icons-material/Hotel";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import BedIcon from "@mui/icons-material/Bed";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import StarIcon from "@mui/icons-material/Star";
import FlashOnIcon from "@mui/icons-material/FlashOn";

import { motion, AnimatePresence } from "framer-motion";
import { getAllHotels } from "../../api/hotel.api";
import { useNavigate } from "react-router-dom";

const MotionBox = motion(Box);

/* ================= COMPONENT: DEAL CARD (PREMIUM ROW) ================= */
const DealHotelRow = ({ hotel }) => {
  const navigate = useNavigate();

  const priceDisplay = useMemo(() => {
    if (!hotel.rooms || hotel.rooms.length === 0) return null;
    
    const discountedRooms = hotel.rooms.filter((r) => r.discount > 0);
    if (discountedRooms.length === 0) return null;

    // Tìm phòng có giá sau giảm thấp nhất để hiển thị "Giá từ..."
    const bestRoom = discountedRooms.reduce((min, cur) => {
      const curFinal = cur.price * (1 - cur.discount / 100);
      const minFinal = min.price * (1 - min.discount / 100);
      return curFinal < minFinal ? cur : min;
    }, discountedRooms[0]);

    return {
      original: bestRoom.price,
      final: Math.round(bestRoom.price * (1 - bestRoom.discount / 100)),
      discount: bestRoom.discount,
      roomName: bestRoom.type,
    };
  }, [hotel.rooms]);

  if (!priceDisplay) return null;

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        mb: 3,
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        overflow: "hidden",
        borderRadius: "32px",
        transition: "all 0.5s cubic-bezier(0.2, 1, 0.3, 1)",
        border: `1px solid rgba(28, 27, 25, 0.05)`,
        bgcolor: "#fff",
        cursor: "pointer",
        "&:hover": {
          boxShadow: "0 30px 60px rgba(28, 27, 25, 0.12)",
          transform: "translateY(-4px)",
          borderColor: "#C2A56D",
          "& .hotel-img": { transform: "scale(1.1)" },
          "& .btn-view": { bgcolor: "#1C1B19", color: "#C2A56D", borderColor: "#1C1B19" },
        },
      }}
      onClick={() => navigate(`/hotels/${hotel._id}`)}
    >
      {/* IMAGE SECTION */}
      <Box sx={{ width: { xs: "100%", md: "350px" }, position: "relative", overflow: "hidden" }}>
        <Box
          className="hotel-img"
          component="img"
          src={hotel.photos?.[0]?.url || "https://via.placeholder.com/400x300"}
          sx={{
            width: "100%",
            height: "100%",
            minHeight: { xs: 220, md: "100%" },
            objectFit: "cover",
            transition: "transform 1.5s cubic-bezier(0.2, 1, 0.3, 1)",
          }}
        />
        <Box
          sx={{
            position: "absolute",
            top: 20,
            left: 20,
            bgcolor: "#C2A56D",
            color: "#1C1B19",
            px: 2,
            py: 0.8,
            borderRadius: "100px",
            fontWeight: 900,
            fontSize: "0.7rem",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            boxShadow: "0 8px 16px rgba(0,0,0,0.2)",
          }}
        >
          <FlashOnIcon sx={{ fontSize: 14 }} /> -{priceDisplay.discount}% ƯU ĐÃI
        </Box>
      </Box>

      {/* CONTENT SECTION */}
      <Box sx={{ flex: 1, p: { xs: 3, md: 4 }, display: "flex", flexDirection: "column" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Box>
            <Typography
              variant="h5"
              sx={{
                color: "#1C1B19",
                fontFamily: "'Playfair Display', serif",
                fontWeight: 800,
                mb: 0.5,
              }}
            >
              {hotel.name}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <StarIcon sx={{ fontSize: 16, color: "#C2A56D" }} />
              <Typography variant="body2" fontWeight={800}>
                {hotel.rating}
              </Typography>
              <Typography variant="body2" color="#A8A7A1">
                • {hotel.city}
              </Typography>
            </Stack>
          </Box>
        </Stack>

        <Typography
          variant="body2"
          sx={{ color: "#72716E", lineHeight: 1.7, mb: 3, mt: 1 }}
        >
          {hotel.desc?.substring(0, 140)}...
        </Typography>

        <Box
          sx={{
            mt: "auto",
            display: "flex",
            alignItems: "flex-end",
            justifyContent: "space-between",
          }}
        >
          <Box>
            <Typography
              variant="caption"
              sx={{ textDecoration: "line-through", color: "#A8A7A1", display: "block" }}
            >
              {priceDisplay.original.toLocaleString()}₫
            </Typography>
            <Typography variant="h4" sx={{ color: "#1C1B19", fontWeight: 900 }}>
              {priceDisplay.final.toLocaleString()}₫
              <Typography
                component="span"
                sx={{ fontSize: "0.8rem", color: "#72716E", fontWeight: 500, ml: 1 }}
              >
                / đêm
              </Typography>
            </Typography>
          </Box>
          <Button
            className="btn-view"
            variant="outlined"
            endIcon={<ArrowForwardIcon />}
            sx={{
              borderRadius: "100px",
              px: 3,
              py: 1,
              borderColor: "#1C1B19",
              color: "#1C1B19",
              textTransform: "none",
              fontWeight: 700,
              transition: "0.3s",
            }}
          >
            Xem phòng
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
      .catch((err) => console.error("❌ Fetch deals failed:", err))
      .finally(() => setLoading(false));
  }, []);

  const deals = useMemo(() => {
    return hotels
      .map((hotel) => {
        if (!hotel.rooms?.length) return null;
        const discountedRooms = hotel.rooms.filter((r) => r.discount > 0);
        if (!discountedRooms.length) return null;
        const maxDiscount = Math.max(...discountedRooms.map((r) => r.discount));
        return { ...hotel, _bestDiscount: maxDiscount };
      })
      .filter(Boolean)
      .sort((a, b) => b._bestDiscount - a._bestDiscount);
  }, [hotels]);

  const visibleDeals = useMemo(() => (showAll ? deals : deals.slice(0, 5)), [deals, showAll]);

  return (
    <Box sx={{ bgcolor: "#FDFCFB", minHeight: "100vh", py: 10 }}>
      <Container maxWidth="xl">
        {/* HEADER SECTION */}
        <Box mb={10} textAlign="center">
          <MotionBox initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            <Stack direction="row" spacing={2} alignItems="center" justifyContent="center" mb={2}>
              <LocalOfferOutlinedIcon sx={{ color: "#C2A56D", fontSize: 40 }} />
              <Typography
                variant="h2"
                sx={{
                  fontFamily: "'Playfair Display', serif",
                  fontWeight: 900,
                  color: "#1C1B19",
                  fontSize: { xs: "2.5rem", md: "3.5rem" },
                }}
              >
                Tuyệt Phẩm Ưu Đãi
              </Typography>
            </Stack>
            <Typography
              variant="h6"
              sx={{ color: "#72716E", fontWeight: 400, maxWidth: 700, mx: "auto", px: 2 }}
            >
              Khám phá các đặc quyền giới hạn và mức giá ưu tiên dành riêng cho thành viên Coffee Stay Elite.
            </Typography>
          </MotionBox>
        </Box>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "1fr 400px" },
            gap: { xs: 6, lg: 10 },
          }}
        >
          {/* LEFT: DEAL LIST */}
          <Box>
            {loading ? (
              <Box textAlign="center" py={10}>
                <CircularProgress sx={{ color: "#C2A56D" }} />
              </Box>
            ) : deals.length > 0 ? (
              <>
                <AnimatePresence>
                  {visibleDeals.map((hotel, i) => (
                    <MotionBox
                      key={hotel._id}
                      initial={{ opacity: 0, x: -30 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.1 }}
                    >
                      <DealHotelRow hotel={hotel} />
                    </MotionBox>
                  ))}
                </AnimatePresence>

                {deals.length > 5 && (
                  <Button
                    fullWidth
                    onClick={() => setShowAll(!showAll)}
                    sx={{
                      py: 2.5,
                      mt: 2,
                      color: "#1C1B19",
                      fontWeight: 800,
                      border: "1px solid rgba(28, 27, 25, 0.1)",
                      borderRadius: "16px",
                      "&:hover": { bgcolor: "rgba(194, 165, 109, 0.05)" },
                    }}
                  >
                    {showAll ? "THU GỌN DANH SÁCH" : `XEM THÊM ${deals.length - 5} ƯU ĐÃI KHÁC`}
                  </Button>
                )}
              </>
            ) : (
              <Paper
                sx={{
                  p: 10,
                  textAlign: "center",
                  borderRadius: "32px",
                  border: `2px dashed rgba(194, 165, 109, 0.3)`,
                  bgcolor: "transparent",
                }}
              >
                <HotelIcon sx={{ fontSize: 80, color: "rgba(194, 165, 109, 0.2)", mb: 3 }} />
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 1 }}>
                  Sớm ra mắt ưu đãi mới
                </Typography>
                <Typography variant="body1" color="#A8A7A1">
                  Đội ngũ quản gia đang chuẩn bị các đặc quyền tốt nhất cho bạn.
                </Typography>
              </Paper>
            )}
          </Box>

          {/* RIGHT: SIDEBAR */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
            <Stack spacing={5} sx={{ position: "sticky", top: 120 }}>
              {/* Premium Quote Card */}
              <Paper
                sx={{
                  p: 5,
                  bgcolor: "#1C1B19",
                  color: "#C2A56D",
                  borderRadius: "32px",
                  position: "relative",
                  overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)",
                }}
              >
                <FormatQuoteIcon
                  sx={{
                    position: "absolute",
                    top: -10,
                    right: -10,
                    fontSize: 120,
                    opacity: 0.1,
                    color: "#C2A56D",
                  }}
                />
                <Typography
                  variant="h5"
                  sx={{ mb: 3, fontStyle: "italic", lineHeight: 1.6, position: "relative", zIndex: 1 }}
                >
                  "Sự sang trọng thực sự không nằm ở mức giá, mà ở cách bạn được trân trọng."
                </Typography>
                <Typography variant="body2" sx={{ color: "#A8A7A1", fontWeight: 800, letterSpacing: 2 }}>
                  — COFFEE STAY ELITE
                </Typography>
              </Paper>

              {/* Service Commitments */}
              <Box>
                <Typography variant="h6" sx={{ mb: 4, fontWeight: 800, color: "#1C1B19" }}>
                  Đặc Quyền Thành Viên
                </Typography>
                <Stack spacing={4}>
                  {[
                    {
                      icon: <CheckCircleIcon />,
                      title: "Giá Tốt Nhất Hệ Thống",
                      desc: "Cam kết mức giá cạnh tranh nhất cho phân khúc cao cấp.",
                      color: "#10b981",
                    },
                    {
                      icon: <BedIcon />,
                      title: "Kiểm Định Tận Nơi",
                      desc: "Tất cả phòng nghỉ đều được khảo sát thực tế bởi Coffee Stay.",
                      color: "#C2A56D",
                    },
                    {
                      icon: <AccessTimeIcon />,
                      title: "Hỗ Trợ Ưu Tiên 24/7",
                      desc: "Đội ngũ chuyên viên tư vấn luôn sẵn sàng phục vụ.",
                      color: "#1C1B19",
                    },
                  ].map((item, idx) => (
                    <Stack key={idx} direction="row" spacing={3} alignItems="flex-start">
                      <Avatar
                        sx={{
                          bgcolor: "rgba(194, 165, 109, 0.1)",
                          color: item.color,
                          width: 48,
                          height: 48,
                        }}
                      >
                        {item.icon}
                      </Avatar>
                      <Box>
                        <Typography variant="body1" fontWeight={800} color="#1C1B19">
                          {item.title}
                        </Typography>
                        <Typography variant="body2" color="#72716E" sx={{ mt: 0.5 }}>
                          {item.desc}
                        </Typography>
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