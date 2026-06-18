import { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, CircularProgress, Paper, Stack, Container, Fade, TextField, InputAdornment, Button
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SearchOff, Search } from "@mui/icons-material";
import HeroBanner from "../../components/Home/HeroBanner";
import FilterSidebar from "../../components/Common/FilterSidebar";
import HotelRow from "../../components/Hotel/HotelRow";
import { getAllHotels } from "../../api/hotel.api";
import { useSearch } from "../../context/SearchContext";
import { normalizeText } from "../../utils/normalizeText";

const PRIMARY_BLUE = "#003580";

export default function HotelList() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { search, resetSearch } = useSearch();
  const [inputValue, setInputValue] = useState(""); 

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
      setLoading(true);
      try {
        const res = await getAllHotels({}); 
        if (isMounted) setHotels(res.data?.data || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách khách sạn:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHotels();
    return () => { isMounted = false; };
  }, []);

  // Cập nhật bộ lọc khi context thay đổi
  useEffect(() => {
    if (search.city) {
      setInputValue(search.city);
      setFilters((prev) => ({ ...prev, city: search.city })); 
    }
  }, [search.city]);

  const filteredHotels = useMemo(() => {
    const term = normalizeText(inputValue); 

    return hotels.filter((hotel) => {
      if (hotel.status !== "active") return false;

      const matchesSearch = !term || 
        normalizeText(hotel.name || "").includes(term) ||
        normalizeText(hotel.city || "").includes(term);

      const prices = hotel.rooms?.map((r) => (r.price || 0) * (1 - (r.discount || 0) / 100)) || [];
      const minRoomPrice = prices.length ? Math.min(...prices) : 0;
      const matchesPrice = minRoomPrice >= filters.minPrice && minRoomPrice <= filters.maxPrice;

      const matchesType = !filters.types.length || filters.types.includes(hotel.type);
      const matchesAmenities = !filters.amenities.length || 
        filters.amenities.every((a) => hotel.amenities?.includes(a));

      return matchesSearch && matchesPrice && matchesType && matchesAmenities;
    });
  }, [hotels, inputValue, filters]);
  
  const uniqueCities = useMemo(() => [...new Set(hotels.map((h) => h.city).filter(Boolean))], [hotels]);
  const allAmenities = useMemo(() => [...new Set(hotels.flatMap((h) => h.amenities || []))].filter(Boolean).sort(), [hotels]);

  return (
    <Box sx={{ bgcolor: "#F5F5F5", minHeight: "100vh" }}>
      <HeroBanner />
      <Container maxWidth="xl" sx={{ mt: 6, pb: 10 }}>
        
        {/* Header & Search Bar */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between" alignItems="center" mb={6}>
          <Typography variant="h4" sx={{ fontWeight: 800, color: "#1a1a1a" }}>
            Kết quả tìm kiếm
          </Typography>
          <TextField
            placeholder="Tìm theo tên khách sạn..."
            size="small"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ 
              width: { xs: "100%", md: 400 }, 
              "& .MuiOutlinedInput-root": { 
                borderRadius: "8px", 
                bgcolor: "#fff",
                "&.Mui-focused fieldset": { borderColor: PRIMARY_BLUE }
              } 
            }}
            InputProps={{
              startAdornment: (<InputAdornment position="start"><Search sx={{ color: PRIMARY_BLUE }} /></InputAdornment>),
            }}
          />
        </Stack>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" }, gap: 4 }}>
          
          {/* Sidebar Bộ lọc */}
          <Box sx={{ position: "sticky", top: 20, alignSelf: "start" }}>
            <FilterSidebar 
              filters={filters} 
              setFilters={setFilters} 
              cities={uniqueCities} 
              amenities={allAmenities} 
            />
          </Box>

          {/* Danh sách Hotel */}
          <Box>
            {loading ? (
              <Stack alignItems="center" py={10}>
                <CircularProgress sx={{ color: PRIMARY_BLUE }} />
                <Typography sx={{ mt: 2, color: 'text.secondary' }}>Đang tải...</Typography>
              </Stack>
            ) : filteredHotels.length > 0 ? (
              <Fade in timeout={500}>
                <Box>
                  {filteredHotels.map((h) => (
                    <HotelRow key={h._id} hotel={h} navigate={navigate} />
                  ))}
                </Box>
              </Fade>
            ) : (
              <Paper sx={{ p: 6, textAlign: "center", borderRadius: 3, border: "none", bgcolor: '#fff' }}>
                <SearchOff sx={{ fontSize: 60, color: '#bdbdbd', mb: 2 }} />
                <Typography variant="h6" fontWeight={700} color="#333">Không tìm thấy kết quả</Typography>
                <Typography color="text.secondary" sx={{ mb: 3 }}>Vui lòng thay đổi bộ lọc để tìm được khách sạn phù hợp.</Typography>
                <Button 
                  variant="outlined"
                  onClick={() => {
                    setFilters({ minPrice: 0, maxPrice: 10000000, city: "", types: [], amenities: [] });
                    setInputValue(""); 
                    resetSearch();   
                    window.scrollTo({ top: 0, behavior: "smooth" });
                  }}
                  sx={{ borderColor: PRIMARY_BLUE, color: PRIMARY_BLUE, "&:hover": { borderColor: PRIMARY_BLUE, bgcolor: "#f0f5ff" } }}
                >
                  Xóa tất cả bộ lọc
                </Button>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}