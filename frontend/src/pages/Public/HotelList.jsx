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
import { LocationOn, Star, FilterList, SearchOff, Search } from "@mui/icons-material";

import HeroBanner from "../../components/Home/HeroBanner";
import FilterSidebar from "../../components/Common/FilterSidebar";
import { getAllHotels } from "../../api/hotel.api";
import { useSearch } from "../../context/SearchContext";
import { normalizeText } from "../../utils/normalizeText";

/* ================= COMPONENT: HOTEL ROW (Giữ nguyên) ================= */
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

  return (
    <Paper
      elevation={0}
      sx={{
        p: 0, mb: 4, borderRadius: "24px", display: "flex", overflow: "hidden",
        border: "1px solid rgba(194, 165, 109, 0.2)",
        flexDirection: { xs: "column", sm: "row" },
        transition: "all 0.4s ease",
        cursor: 'pointer',
        "&:hover": { transform: "translateY(-4px)", borderColor: "#C2A56D", boxShadow: "0 20px 40px rgba(28, 27, 25, 0.08)" },
      }}
      onClick={() => navigate(`/hotels/${hotel._id}`)}
    >
      <Box sx={{ width: { xs: "100%", sm: 240, md: 280 }, height: { xs: 220, sm: "auto" }, overflow: "hidden" }}>
        <Box component="img" src={hotel.photos?.[0]?.url || "https://via.placeholder.com/400x300"} sx={{ width: "100%", height: "100%", objectFit: "cover" }} />
      </Box>
      <Box sx={{ flex: 1, p: 3, display: "flex", flexDirection: "column" }}>
        <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800 }}>{hotel.name}</Typography>
        <Stack direction="row" spacing={2} alignItems="center" mb={2}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Star sx={{ fontSize: 18, color: "#C2A56D" }} />
            <Typography fontWeight={800}>{hotel.rating || "Mới"}</Typography>
          </Stack>
          <Typography variant="body2" color="#A8A7A1"><LocationOn sx={{ fontSize: 16 }} /> {hotel.city}</Typography>
        </Stack>
        <Typography variant="body2" color="#72716E" sx={{ mb: 2, display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>
          {hotel.desc}
        </Typography>
        <Box sx={{ mt: "auto", pt: 2, borderTop: "1px dashed rgba(194, 165, 109, 0.2)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <Typography variant="h5" fontWeight={900}>
            {priceInfo ? `${priceInfo.curr.toLocaleString()}₫` : "Liên hệ"}
            <Typography component="span" variant="caption">/đêm</Typography>
          </Typography>
          <Button variant="contained" sx={{ bgcolor: "#1C1B19", color: "#C2A56D", borderRadius: "10px", textTransform: 'none' }}>Chi tiết</Button>
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

  // GIỐNG ADMIN: Dùng state tại chỗ cho SearchTerm
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000000,
    city: "",
    types: [],
    amenities: [],
  });

  useEffect(() => {
    let isMounted = true;
    const fetchHotels = async () => {
      try {
        const res = await getAllHotels(search);
        if (isMounted) setHotels(res.data?.data || []);
      } catch (err) {
        console.error("Error:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHotels();
    return () => { isMounted = false; };
  }, [search]);

  // GIỐNG ADMIN: Logic Filter dùng useMemo
  const filteredHotels = useMemo(() => {
    return hotels.filter((hotel) => {
      if (hotel.status !== "active") return false;

      // 1. Search theo tên (giống Admin)
      const matchesName = normalizeText(hotel.name || "").includes(normalizeText(searchTerm));
      
      // 2. Filter theo Sidebar
      const prices = hotel.rooms?.map((r) => (r.price || 0) * (1 - (r.discount || 0) / 100)) || [];
      const minRoomPrice = prices.length ? Math.min(...prices) : 0;
      const matchesPrice = minRoomPrice >= filters.minPrice && minRoomPrice <= filters.maxPrice;
      const matchesCity = !filters.city || normalizeText(hotel.city).includes(normalizeText(filters.city));
      const matchesType = !filters.types.length || filters.types.includes(hotel.type);

      return matchesName && matchesPrice && matchesCity && matchesType;
    });
  }, [hotels, searchTerm, filters]);

  const uniqueCities = useMemo(() => [...new Set(hotels.map((h) => h.city).filter(Boolean))], [hotels]);

  return (
    <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh" }}>
      <HeroBanner />
      <Container maxWidth="xl" sx={{ mt: 6, pb: 10 }}>
        
        {/* THANH SEARCH ĐƯỢC ĐƯA LÊN ĐẦU GIỐNG ADMIN */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between" alignItems="center" mb={6}>
          <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>
             Điểm Đến Lý Tưởng
          </Typography>
          
          <TextField
            placeholder="Tìm theo tên khách sạn..."
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{ 
              width: { xs: "100%", md: 400 }, 
              "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } 
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

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" }, gap: 5 }}>
          {/* SIDEBAR BÊN TRÁI */}
          <Box sx={{ position: "sticky", top: 100, alignSelf: "start" }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", border: "1px solid rgba(194, 165, 109, 0.2)" }}>
              <Stack direction="row" spacing={1} alignItems="center" mb={2}>
                <FilterList sx={{ color: '#C2A56D' }} />
                <Typography fontWeight={800}>Bộ lọc</Typography>
              </Stack>
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                cities={uniqueCities} 
              />
            </Paper>
          </Box>

          {/* DANH SÁCH KHÁCH SẠN */}
          <Box>
            {loading ? (
              <Stack alignItems="center" py={10}><CircularProgress sx={{ color: "#C2A56D" }} /></Stack>
            ) : filteredHotels.length > 0 ? (
              <Fade in timeout={800}>
                <Box>{filteredHotels.map((h) => <HotelRow key={h._id} hotel={h} />)}</Box>
              </Fade>
            ) : (
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: "24px", border: "2px dashed #C2A56D", bgcolor: 'transparent' }}>
                <SearchOff sx={{ fontSize: 48, color: '#A8A7A1', mb: 2 }} />
                <Typography>Không tìm thấy khách sạn nào khớp với yêu cầu.</Typography>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}