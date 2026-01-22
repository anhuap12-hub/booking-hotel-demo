import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Button,
  Container,
  Fade,
  Avatar,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocationOn, Star, FilterList, KeyboardArrowRight } from "@mui/icons-material";

import HeroBanner from "../../components/Home/HeroBanner";
import FilterSidebar from "../../components/Common/FilterSidebar";
import WhyBook from "../../components/Home/WhyBook";
import { getAllHotels } from "../../api/hotel.api";
import { useSearch } from "../../context/SearchContext";
import { normalizeText } from "../../utils/normalizeText";

/* ================= QUOTES & ELITE DATA ================= */
const QUOTES = [
  {
    text: "“Sự sang trọng thực sự không nằm ở mức giá, mà ở cảm giác bạn được trân trọng.”",
    author: "— COFFEE STAY ELITE",
  },
  {
    text: "“Kỳ nghỉ lý tưởng là nơi khiến tâm hồn bạn tìm thấy sự thuộc về.”",
    author: "— TRAVELER NOTES",
  },
];

/* ================= COMPONENT: HOTEL ROW ================= */
const HotelRow = ({ hotel }) => {
  const navigate = useNavigate();

  const price = useMemo(() => {
    if (!hotel.rooms?.length) return null;
    return hotel.rooms
      .map((r) => ({
        orig: r.price,
        curr: r.price * (1 - (r.discount || 0) / 100),
        disc: r.discount || 0,
      }))
      .sort((a, b) => a.curr - b.curr)[0];
  }, [hotel.rooms]);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0,
        mb: 4,
        borderRadius: "24px",
        display: "flex",
        overflow: "hidden",
        border: "1px solid rgba(194, 165, 109, 0.2)",
        flexDirection: { xs: "column", md: "row" },
        transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(28, 27, 25, 0.08)",
          transform: "translateY(-4px)",
          borderColor: "#C2A56D",
          "& img": { transform: "scale(1.08)" },
        },
      }}
    >
      {/* Hình ảnh với hiệu ứng Zoom */}
      <Box sx={{ width: { xs: "100%", md: 280 }, height: { xs: 200, md: "auto" }, overflow: "hidden", position: "relative" }}>
        <Box
          component="img"
          src={hotel.photos?.[0]?.url || "https://via.placeholder.com/400x300"}
          alt={hotel.name}
          sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "0.6s" }}
        />
        {price?.disc > 0 && (
          <Box sx={{ 
            position: "absolute", top: 16, left: 16, bgcolor: "#1C1B19", color: "#C2A56D", 
            px: 1.5, py: 0.5, borderRadius: "8px", fontWeight: 800, fontSize: "0.7rem",
            border: "1px solid #C2A56D" 
          }}>
            -{price.disc}% OFF
          </Box>
        )}
      </Box>

      {/* Nội dung chi tiết */}
      <Box sx={{ flex: 1, p: 3.5, display: "flex", flexDirection: "column" }}>
        <Box mb={2}>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#1C1B19", mb: 1 }}>
            {hotel.name}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Star sx={{ fontSize: 18, color: "#C2A56D" }} />
              <Typography fontWeight={800} sx={{ color: "#1C1B19" }}>{hotel.rating}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#A8A7A1", fontWeight: 500 }}>
              <LocationOn sx={{ fontSize: 16, mr: 0.5, verticalAlign: "text-bottom" }} />
              {hotel.city}
            </Typography>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ color: "#72716E", lineHeight: 1.6, mb: 3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {hotel.desc}
        </Typography>

        <Box sx={{ mt: "auto", pt: 2, borderTop: "1px dashed rgba(194, 165, 109, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <Box>
            {price?.disc > 0 && (
              <Typography variant="caption" sx={{ textDecoration: "line-through", color: "#A8A7A1", display: "block" }}>
                {price.orig.toLocaleString()}₫
              </Typography>
            )}
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#1C1B19", display: 'flex', alignItems: 'baseline' }}>
              {price?.curr.toLocaleString()}₫
              <Typography component="span" sx={{ fontSize: "0.8rem", color: "#72716E", fontWeight: 500, ml: 1 }}>/ đêm</Typography>
            </Typography>
          </Box>
          <Button
            variant="contained"
            onClick={() => navigate(`/hotels/${hotel._id}`)}
            endIcon={<KeyboardArrowRight />}
            sx={{ 
              bgcolor: "#1C1B19", color: "#C2A56D", borderRadius: "12px", px: 3, py: 1, fontWeight: 700,
              textTransform: 'none',
              "&:hover": { bgcolor: "#C2A56D", color: "#1C1B19" }
            }}
          >
            Xem Thông Tin
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

/* ================= MAIN COMPONENT ================= */
export default function HotelList() {
  const { search } = useSearch();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    minPrice: search.minPrice ?? 0,
    maxPrice: search.maxPrice ?? 5000000,
    city: search.city ?? "",
    types: search.types ?? [],
    rating: search.rating ?? null,
    amenities: search.amenities ?? [],
    onlyDiscount: false,
  });

  useEffect(() => {
    setLoading(true);
    getAllHotels()
      .then((res) => setHotels(res.data?.data || []))
      .finally(() => setLoading(false));
  }, []);

  const filteredHotels = useMemo(() => {
    const keyword = normalizeText(search.keyword || "");
    const citySearch = normalizeText(filters.city || "");

    return hotels.filter((h) => {
      const hotelName = normalizeText(h.name);
      const hotelCity = normalizeText(h.city);
      const hotelDesc = normalizeText(h.desc || "");

      const prices = h.rooms?.map((r) => r.price * (1 - (r.discount || 0) / 100)) || [];
      const minRoomPrice = prices.length ? Math.min(...prices) : 0;

      const matchKeyword = !keyword || hotelName.includes(keyword) || hotelCity.includes(keyword) || hotelDesc.includes(keyword);
      const matchCity = !citySearch || hotelCity.includes(citySearch);
      const matchPrice = minRoomPrice >= filters.minPrice && minRoomPrice <= filters.maxPrice;
      const matchType = !filters.types.length || filters.types.includes(h.type);
      const matchRating = !filters.rating || h.rating >= filters.rating;
      const matchAmenities = !filters.amenities.length || filters.amenities.every((a) => h.amenities?.includes(a));
      const matchDiscount = filters.onlyDiscount ? h.rooms?.some((r) => r.discount > 0) : true;

      return matchKeyword && matchCity && matchPrice && matchType && matchRating && matchAmenities && matchDiscount;
    });
  }, [hotels, filters, search.keyword]);

  const cities = useMemo(() => [...new Set(hotels.map((h) => h.city).filter(Boolean))], [hotels]);
  const amenities = useMemo(() => [...new Set(hotels.flatMap((h) => h.amenities || []))], [hotels]);

  return (
    <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh" }}>
      <HeroBanner />

      <Container maxWidth="xl" sx={{ mt: 8, pb: 10 }}>
        {/* Header Section */}
        <Box sx={{ mb: 6 }}>
          <Fade in timeout={800}>
            <Box>
              <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, color: "#1C1B19", mb: 2 }}>
                Điểm Đến Lý Tưởng
              </Typography>
              <Typography variant="h6" sx={{ color: "#72716E", fontWeight: 400 }}>
                Khám phá <span style={{ color: "#C2A56D", fontWeight: 800 }}>{filteredHotels.length}</span> không gian nghỉ dưỡng tinh tuyển 
                {search.keyword && <> dành cho <span style={{ color: "#1C1B19", fontStyle: 'italic' }}>“{search.keyword}”</span></>}
              </Typography>
            </Box>
          </Fade>
        </Box>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "300px 1fr 320px" }, gap: 5, alignItems: "flex-start" }}>
          
          {/* CỘT TRÁI: BỘ LỌC */}
          <Box sx={{ position: "sticky", top: 100 }}>
            <Paper elevation={0} sx={{ p: 4, borderRadius: "24px", border: "1px solid rgba(194, 165, 109, 0.2)", bgcolor: '#fff' }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={3}>
                <FilterList sx={{ color: '#C2A56D' }} />
                <Typography variant="h6" fontWeight={800}>Bộ lọc tìm kiếm</Typography>
              </Stack>
              <FilterSidebar
                filters={filters}
                setFilters={setFilters}
                cities={cities}
                amenities={amenities}
                showPrice={true}
              />
            </Paper>
          </Box>

          {/* CỘT GIỮA: DANH SÁCH KHÁCH SẠN */}
          <Box>
            {loading ? (
              <Stack alignItems="center" py={10}><CircularProgress sx={{ color: "#C2A56D" }} /></Stack>
            ) : filteredHotels.length ? (
              <Fade in timeout={1000}>
                <Box>
                  {filteredHotels.map((h) => <HotelRow key={h._id} hotel={h} />)}
                </Box>
              </Fade>
            ) : (
              <Paper sx={{ p: 8, textAlign: "center", borderRadius: "24px", border: "1px dashed #C2A56D", bgcolor: 'transparent' }}>
                <Typography variant="h6" color="#1C1B19" mb={2}>Không tìm thấy không gian phù hợp</Typography>
                <Button 
                  variant="outlined" 
                  onClick={() => setFilters({ minPrice: 0, maxPrice: 5000000, city: "", types: [], rating: null, amenities: [], onlyDiscount: false })}
                  sx={{ color: "#1C1B19", borderColor: "#1C1B19", borderRadius: '10px' }}
                >
                  Xóa tất cả bộ lọc
                </Button>
              </Paper>
            )}
          </Box>

          {/* CỘT PHẢI: QUOTES & ELITE CARD */}
          <Stack spacing={4} sx={{ position: "sticky", top: 100, display: { xs: "none", lg: "flex" } }}>
            {/* Elite Card */}
            <Paper sx={{ 
              p: 4, borderRadius: "24px", bgcolor: "#1C1B19", color: "#C2A56D",
              position: 'relative', overflow: 'hidden',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}>
              <Box sx={{ position: 'relative', zIndex: 1 }}>
                <Typography variant="h6" fontWeight={800} mb={1}>Coffee Stay Elite</Typography>
                <Typography variant="body2" sx={{ opacity: 0.8, mb: 3 }}>Nhận đặc quyền giảm giá 10% và ưu tiên nhận phòng sớm.</Typography>
                <Button fullWidth sx={{ bgcolor: "#C2A56D", color: "#1C1B19", fontWeight: 800, borderRadius: '10px', "&:hover": { bgcolor: '#fff' } }}>
                  Đăng ký ngay
                </Button>
              </Box>
              <Box sx={{ position: 'absolute', bottom: -20, right: -20, fontSize: 100, opacity: 0.05, color: '#fff', transform: 'rotate(-15deg)' }}>
                ★
              </Box>
            </Paper>

            {/* Inspirational Quotes */}
            {QUOTES.map((q, i) => (
              <Paper key={i} elevation={0} sx={{ 
                p: 4, borderRadius: "24px", bgcolor: "#fff", border: "1px solid rgba(194, 165, 109, 0.2)",
                position: "relative"
              }}>
                <Typography sx={{ 
                  fontSize: 16, fontStyle: "italic", mb: 2, color: "#1C1B19", 
                  fontFamily: "'Playfair Display', serif", lineHeight: 1.6 
                }}>
                  {q.text}
                </Typography>
                <Typography variant="caption" sx={{ color: "#C2A56D", fontWeight: 800, letterSpacing: 1 }}>
                  {q.author}
                </Typography>
              </Paper>
            ))}
          </Stack>
        </Box>

        <Box sx={{ mt: 10 }}>
          <WhyBook />
        </Box>
      </Container>
    </Box>
  );
}