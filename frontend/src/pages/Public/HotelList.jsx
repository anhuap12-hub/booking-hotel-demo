import { useEffect, useState, useMemo } from "react";
import {
  Box, Typography, CircularProgress, Paper, Stack, Container, Fade, TextField, InputAdornment,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { SearchOff, Search } from "@mui/icons-material";

import HeroBanner from "../../components/Home/HeroBanner";
import FilterSidebar from "../../components/Common/FilterSidebar";
import HotelRow from "../../components/Hotel/HotelRow"; // Đảm bảo đường dẫn này đúng
import { getAllHotels } from "../../api/hotel.api";
import { useSearch } from "../../context/SearchContext";
import { normalizeText } from "../../utils/normalizeText";

export default function HotelList() {
  const navigate = useNavigate();
  const { search } = useSearch();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // States cho Search Bar
  const [inputValue, setInputValue] = useState(""); 
  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState({
    minPrice: 0,
    maxPrice: 10000000,
    city: "",
    types: [],
    amenities: [],
  });

  // Debounce Search: Giảm tải việc filter liên tục khi đang gõ
  useEffect(() => {
    const handler = setTimeout(() => setSearchTerm(inputValue), 300);
    return () => clearTimeout(handler);
  }, [inputValue]);

  // Fetch dữ liệu từ API
  useEffect(() => {
    let isMounted = true;
    const fetchHotels = async () => {
      setLoading(true);
      try {
        const res = await getAllHotels(search);
        if (isMounted) setHotels(res.data?.data || []);
      } catch (err) {
        console.error("Lỗi khi tải danh sách khách sạn:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };
    fetchHotels();
    return () => { isMounted = false; };
  }, [search]);

  // Logic lọc dữ liệu: Đã tối ưu bằng cách đưa chuẩn hóa ra ngoài vòng lặp
  const filteredHotels = useMemo(() => {
    const term = normalizeText(searchTerm);
    const filterCity = normalizeText(filters.city);

    return hotels.filter((hotel) => {
      if (hotel.status !== "active") return false;

      // 1. Lọc theo Search Term (Tên hoặc Thành phố)
      const matchesSearch = !term || 
        normalizeText(hotel.name || "").includes(term) ||
        normalizeText(hotel.city || "").includes(term);

      // 2. Lọc theo Giá (Lấy giá thấp nhất của các phòng)
      const prices = hotel.rooms?.map((r) => (r.price || 0) * (1 - (r.discount || 0) / 100)) || [];
      const minRoomPrice = prices.length ? Math.min(...prices) : 0;
      const matchesPrice = minRoomPrice >= filters.minPrice && minRoomPrice <= filters.maxPrice;

      // 3. Lọc theo Thành phố (từ Sidebar)
      const matchesCity = !filters.city || normalizeText(hotel.city).includes(filterCity);

      // 4. Lọc theo Loại hình
      const matchesType = !filters.types.length || filters.types.includes(hotel.type);

      // 5. Lọc theo Tiện nghi (Phải thỏa mãn TẤT CẢ tiện nghi đã chọn)
      const matchesAmenities = !filters.amenities.length || 
        filters.amenities.every((a) => hotel.amenities?.includes(a));

      return matchesSearch && matchesPrice && matchesCity && matchesType && matchesAmenities;
    });
  }, [hotels, searchTerm, filters]);

  // Trích xuất dữ liệu động cho Sidebar
  const uniqueCities = useMemo(() => [...new Set(hotels.map((h) => h.city).filter(Boolean))], [hotels]);
  const allAmenities = useMemo(() => [...new Set(hotels.flatMap((h) => h.amenities || []))].filter(Boolean).sort(), [hotels]);

  return (
    <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh" }}>
      <HeroBanner />
      <Container maxWidth="xl" sx={{ mt: 6, pb: 10 }}>
        
        {/* Header & Search Bar */}
        <Stack direction={{ xs: "column", md: "row" }} spacing={3} justifyContent="space-between" alignItems="center" mb={6}>
          <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900 }}>
            Điểm Đến Lý Tưởng
          </Typography>
          <TextField
            placeholder="Tìm theo tên khách sạn..."
            size="small"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            sx={{ width: { xs: "100%", md: 400 }, "& .MuiOutlinedInput-root": { borderRadius: "12px", bgcolor: "#fff" } }}
            InputProps={{
              startAdornment: (<InputAdornment position="start"><Search sx={{ color: "#C2A56D" }} /></InputAdornment>),
            }}
          />
        </Stack>

        <Box sx={{ display: "grid", gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" }, gap: 5 }}>
          
          {/* Sidebar Bộ lọc */}
          <Box sx={{ position: "sticky", top: 100, alignSelf: "start" }}>
            <Paper elevation={0} sx={{ p: 3, borderRadius: "20px", border: "1px solid rgba(194, 165, 109, 0.2)" }}>
              <FilterSidebar 
                filters={filters} 
                setFilters={setFilters} 
                cities={uniqueCities} 
                amenities={allAmenities} 
              />
            </Paper>
          </Box>

          {/* Danh sách Hotel */}
          <Box>
            {loading ? (
              <Stack alignItems="center" py={10}>
                <CircularProgress sx={{ color: "#C2A56D" }} />
                <Typography sx={{ mt: 2, color: 'text.secondary' }}>Đang tìm phòng tốt nhất cho bạn...</Typography>
              </Stack>
            ) : filteredHotels.length > 0 ? (
              <Fade in timeout={800}>
                <Box>
                  {filteredHotels.map((h) => (
                    <HotelRow key={h._id} hotel={h} navigate={navigate} />
                  ))}
                </Box>
              </Fade>
            ) : (
              <Paper sx={{ p: 8, textAlign: "center", borderRadius: "24px", border: "2px dashed #C2A56D", bgcolor: 'transparent' }}>
                <SearchOff sx={{ fontSize: 60, color: '#A8A7A1', mb: 2 }} />
                <Typography variant="h6" fontWeight={700}>Rất tiếc!</Typography>
                <Typography color="text.secondary">Chúng tôi không tìm thấy khách sạn nào khớp với lựa chọn của bạn.</Typography>
                <Button 
                  onClick={() => setFilters({ minPrice: 0, maxPrice: 10000000, city: "", types: [], amenities: [] })}
                  sx={{ mt: 2, color: "#C2A56D" }}
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