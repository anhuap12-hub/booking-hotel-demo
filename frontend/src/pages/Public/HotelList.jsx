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
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { 
  LocationOn, 
  Star, 
  FilterList, 
  SearchOff, 
  CalendarMonth, 
  Search 
} from "@mui/icons-material";

import HeroBanner from "../../components/Home/HeroBanner";
import FilterSidebar from "../../components/Common/FilterSidebar";
import { getAllHotels } from "../../api/hotel.api";
import { useSearch } from "../../context/SearchContext";
import { normalizeText } from "../../utils/normalizeText";

/* ================= QUOTES ================= */
const QUOTES = [
  {
    text: "“Sự sang trọng thực sự không nằm ở mức giá, mà ở cảm giác bạn được trân trọng.”",
    author: "— COFFEE STAY ELITE",
  },
];

/* ================= COMPONENT: HOTEL ROW ================= */
const HotelRow = ({ hotel }) => {
  const navigate = useNavigate();

  const priceInfo = useMemo(() => {
    if (!hotel.rooms?.length) return null;
    return hotel.rooms
      .map((r) => ({
        orig: r.price,
        curr: r.price * (1 - (r.discount || 0) / 100),
        disc: r.discount || 0,
      }))
      .sort((a, b) => a.curr - b.curr)[0];
  }, [hotel.rooms]);

  const handleNavigate = () => navigate(`/hotels/${hotel._id}`);

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0, mb: { xs: 3, md: 4 }, borderRadius: "24px", display: "flex", overflow: "hidden",
        border: "1px solid rgba(194, 165, 109, 0.2)",
        flexDirection: { xs: "column", sm: "row" },
        transition: "all 0.4s ease",
        cursor: 'pointer',
        "&:hover": {
          boxShadow: "0 20px 40px rgba(28, 27, 25, 0.08)",
          transform: "translateY(-4px)",
          borderColor: "#C2A56D",
          "& .hotel-img": { transform: "scale(1.08)" },
        },
      }}
      onClick={handleNavigate}
    >
      <Box sx={{ width: { xs: "100%", sm: 240, md: 280 }, height: { xs: 220, sm: "auto" }, overflow: "hidden", position: "relative" }}>
        <Box
          className="hotel-img"
          component="img"
          src={hotel.photos?.[0]?.url || "https://via.placeholder.com/400x300"}
          alt={hotel.name}
          sx={{ width: "100%", height: "100%", objectFit: "cover", transition: "0.6s" }}
        />
        {priceInfo?.disc > 0 && (
          <Box sx={{ 
            position: "absolute", top: 12, left: 12, bgcolor: "#1C1B19", color: "#C2A56D", 
            px: 1.5, py: 0.5, borderRadius: "8px", fontWeight: 800, fontSize: "0.7rem", border: "1px solid #C2A56D" 
          }}>
            -{priceInfo.disc}% OFF
          </Box>
        )}
      </Box>

      <Box sx={{ flex: 1, p: { xs: 2.5, md: 3.5 }, display: "flex", flexDirection: "column" }}>
        <Box mb={1.5}>
          <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, color: "#1C1B19", fontSize: { xs: "1.25rem", md: "1.5rem" } }}>
            {hotel.name}
          </Typography>
          <Stack direction="row" spacing={2} alignItems="center" mt={0.5}>
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Star sx={{ fontSize: 18, color: "#C2A56D" }} />
              <Typography fontWeight={800}>{hotel.rating || "Mới"}</Typography>
            </Stack>
            <Typography variant="body2" sx={{ color: "#A8A7A1", display: 'flex', alignItems: 'center' }}>
              <LocationOn sx={{ fontSize: 16, mr: 0.5 }} /> {hotel.city}
            </Typography>
          </Stack>
        </Box>

        <Typography variant="body2" sx={{ color: "#72716E", mb: 3, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {hotel.desc}
        </Typography>

        <Box sx={{ mt: "auto", pt: 2, borderTop: "1px dashed rgba(194, 165, 109, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Box>
            {priceInfo?.disc > 0 && (
              <Typography variant="caption" sx={{ textDecoration: "line-through", color: "#A8A7A1" }}>
                {priceInfo.orig.toLocaleString()}₫
              </Typography>
            )}
            <Typography variant="h5" sx={{ fontWeight: 900, color: "#1C1B19" }}>
              {priceInfo ? `${priceInfo.curr.toLocaleString()}₫` : "Liên hệ"}
              <Typography component="span" sx={{ fontSize: "0.75rem", color: "#72716E", ml: 0.5 }}>/đêm</Typography>
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{ 
              bgcolor: "#1C1B19", color: "#C2A56D", borderRadius: "10px", px: { xs: 2, md: 3 },
              textTransform: 'none', fontWeight: 700, "&:hover": { bgcolor: "#C2A56D", color: "#1C1B19" }
            }}
          >
            Chi tiết
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

/* ================= MAIN COMPONENT ================= */
export default function HotelList() {
  const { search, handleSearch } = useSearch(); // Thêm handleSearch
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000000, 
    city: "",
    types: [],
    rating: null,
    amenities: [],
    onlyDiscount: false,
  });

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    const fetchHotels = async () => {
      try {
        const res = await getAllHotels(search);
        if (isMounted) {
          setHotels(res.data?.data || []);
        }
      } catch (err) {
        console.error("Error fetching hotels:", err);
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    fetchHotels();

    return () => { isMounted = false; };
  }, [search]); 

  const filteredHotels = useMemo(() => {
    const keyword = normalizeText(search.keyword || "");
    const cityFilter = normalizeText(filters.city || "");

    return hotels.filter((h) => {
      if (h.status !== "active") return false;

      const prices = h.rooms?.map((r) => {
        const basePrice = Number(r.price) || 0;
        const discount = Number(r.discount) || 0;
        return basePrice * (1 - discount / 100);
      }) || [];
      
      const minRoomPrice = prices.length ? Math.min(...prices) : 0;
      const matchesPrice = minRoomPrice >= filters.minPrice && minRoomPrice <= filters.maxPrice;
      const matchesKeyword = !keyword || 
        normalizeText(h.name).includes(keyword) || 
        normalizeText(h.city).includes(keyword);

      const matchesCity = !cityFilter || normalizeText(h.city).includes(cityFilter);
      const matchesType = !filters.types.length || filters.types.includes(h.type);
      const matchesAmenities = !filters.amenities.length || 
        filters.amenities.every((a) => h.amenities?.includes(a));

      return matchesKeyword && matchesCity && matchesPrice && matchesType && matchesAmenities;
    });
  }, [hotels, filters, search.keyword]);

  const cities = useMemo(() => [...new Set(hotels.map((h) => h.city).filter(Boolean))], [hotels]);
  const amenities = useMemo(() => [...new Set(hotels.flatMap((h) => h.amenities || []))], [hotels]);

  return (
    <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh" }}>
      <HeroBanner />

      <Container maxWidth="xl" sx={{ mt: { xs: 4, md: 8 }, pb: 10 }}>
        {/* HEADER & SEARCH BAR */}
        <Box sx={{ mb: { xs: 4, md: 6 } }}>
          <Stack 
            direction={{ xs: "column", md: "row" }} 
            justifyContent="space-between" 
            alignItems={{ xs: "flex-start", md: "center" }}
            spacing={3}
          >
            <Box>
              <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, fontSize: { xs: "2rem", md: "3rem" } }}>
                {search.keyword ? `Kết quả cho "${search.keyword}"` : "Điểm Đến Lý Tưởng"}
              </Typography>
              
              {search.checkIn && search.checkOut && (
                <Stack direction="row" spacing={1} alignItems="center" sx={{ mt: 1, color: "#C2A56D" }}>
                  <CalendarMonth sx={{ fontSize: 20 }} />
                  <Typography variant="subtitle1" fontWeight={600}>
                    {search.checkIn} — {search.checkOut}
                  </Typography>
                </Stack>
              )}
            </Box>

            {/* THANH TÌM KIẾM MỚI THÊM VÀO */}
            <TextField
              variant="outlined"
              placeholder="Tìm theo tên khách sạn hoặc địa điểm..."
              value={search.keyword || ""}
              onChange={(e) => handleSearch({ ...search, keyword: e.target.value })}
              sx={{
                width: { xs: "100%", md: "400px" },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "12px",
                  bgcolor: "#fff",
                  "& fieldset": { borderColor: "rgba(194, 165, 109, 0.3)" },
                  "&:hover fieldset": { borderColor: "#C2A56D" },
                }
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search sx={{ color: "#C2A56D" }} />
                  </InputAdornment>
                ),
              }}
            />
          </Stack>

          <Typography variant="body1" sx={{ color: "#72716E", mt: 2 }}>
            Tìm thấy <b style={{color: '#1C1B19'}}>{filteredHotels.length}</b> lựa chọn cho hành trình của bạn.
          </Typography>
        </Box>

        <Box sx={{ 
          display: "grid", 
          gridTemplateColumns: { xs: "1fr", lg: "280px 1fr 300px" }, 
          gap: { xs: 4, md: 5 },
          alignItems: "flex-start" 
        }}>
          
          <Box sx={{ position: { lg: "sticky" }, top: 100, order: { xs: 2, lg: 1 } }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", border: "1px solid rgba(194, 165, 109, 0.2)" }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <FilterList sx={{ color: '#C2A56D' }} />
                <Typography fontWeight={800}>Bộ lọc chi tiết</Typography>
              </Stack>
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                cities={cities}
                amenities={amenities} 
              />
            </Paper>
          </Box>

          <Box sx={{ order: { xs: 1, lg: 2 } }}>
            {loading ? (
              <Stack alignItems="center" py={10}><CircularProgress sx={{ color: "#C2A56D" }} /></Stack>
            ) : filteredHotels.length ? (
              <Fade in timeout={1000}>
                <Box>
                  {filteredHotels.map((h) => <HotelRow key={h._id} hotel={h} />)}
                </Box>
              </Fade>
            ) : (
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: "24px", border: "2px dashed #C2A56D", bgcolor: 'transparent' }}>
                <SearchOff sx={{ fontSize: 48, color: '#A8A7A1', mb: 2 }} />
                <Typography variant="h6">Không tìm thấy kết quả</Typography>
                <Button 
                  sx={{ mt: 2, color: '#C2A56D' }} 
                  onClick={() => {
                    setFilters({
                      minPrice: 0, maxPrice: 10000000, city: "", types: [], 
                      rating: null, amenities: [], onlyDiscount: false
                    });
                    handleSearch({ ...search, keyword: "" }); // Reset cả thanh tìm kiếm
                  }}
                >
                  Xóa bộ lọc
                </Button>
              </Paper>
            )}
          </Box>

          <Stack spacing={3} sx={{ position: "sticky", top: 100, display: { xs: "none", lg: "flex" }, order: 3 }}>
            <Paper sx={{ p: 3, borderRadius: "20px", bgcolor: "#1C1B19", color: "#C2A56D" }}>
              <Typography variant="subtitle1" fontWeight={800}>Elite Membership</Typography>
              <Typography variant="body2" sx={{ opacity: 0.8, my: 1.5 }}>Nhận ngay ưu đãi 10% cho thành viên mới.</Typography>
              <Button fullWidth variant="contained" sx={{ bgcolor: "#C2A56D", color: "#1C1B19", fontWeight: 700 }}>Đăng ký</Button>
            </Paper>
            {QUOTES.map((q, i) => (
              <Paper key={i} sx={{ p: 3, borderRadius: "20px", border: "1px solid rgba(194, 165, 109, 0.1)" }}>
                <Typography variant="body2" sx={{ fontStyle: 'italic', mb: 1.5 }}>{q.text}</Typography>
                <Typography variant="caption" fontWeight={700} color="#C2A56D">{q.author}</Typography>
              </Paper>
            ))}
          </Stack>
        </Box>
      </Container>
    </Box>
  );
}