import { useEffect, useState, useMemo } from "react";
import { Box, Container, Stack, Fade, CircularProgress } from "@mui/material";
import HeroBanner from "../../components/Home/HeroBanner";
import QuickStats from "../../components/Home/QuickStats";
import WhyBook from "../../components/Home/WhyBook";
import HotelSuggestion from "../../components/Home/HotelSuggestion";
import CityHotelSections from "../../components/Home/CityHotelSections";
import { getAllHotels } from "../../api/hotel.api";
import { NAVBAR_HEIGHT } from "../../components/Layout/Navbar";
import Recommendation from "../../components/Common/Recommendation";

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getAllHotels();
        setHotels(res.data?.data || []);
      } catch (err) { 
        console.error(err); 
      } finally { 
        setLoading(false); 
      }
    };
    loadData();
  }, []);

  const { cities, citiesSorted } = useMemo(() => {
    const allCities = [...new Set(hotels.map(h => h.city).filter(Boolean))];
    const allAmenities = [...new Set(hotels.flatMap(h => h.amenities || []))];
    const byCity = hotels.reduce((acc, h) => {
      const cityName = h.city || "Khác";
      if (!acc[cityName]) acc[cityName] = [];
      acc[cityName].push(h);
      return acc;
    }, {});
    const sorted = Object.entries(byCity)
      .sort((a, b) => b[1].length - a[1].length)
      .slice(0, 3);
    return { cities: allCities, amenities: allAmenities, citiesSorted: sorted };
  }, [hotels]);

  return (
    <Box sx={{ bgcolor: "#FDFCFB", minHeight: "100vh" }}>
      {/* 1. KHOẢNG ĐỆM NAVBAR */}
      <Box sx={{ height: `${NAVBAR_HEIGHT}px`, bgcolor: "#1C1B19" }} />

      {/* 2. HERO BANNER & STATS */}
      <HeroBanner />
      {/* Giảm nhẹ margin bottom của QuickStats nếu component này có margin trong nội bộ */}
      <QuickStats hotels={hotels} cities={cities} />

      {/* 3. MAIN CONTENT LAYOUT */}
      {/* ĐÃ THU NHỎ PY: TỪ 10 XUỐNG CÒN 5 Ở MÀN HÌNH LỚN */}
      <Container maxWidth="xl" sx={{ py: { xs: 4, md: 5 } }}>
        {/* ĐÃ THU NHỎ SPACING: TỪ 10 XUỐNG CÒN 4 KHI LOADING */}
        <Stack spacing={4}>
          {loading ? (
            <Box sx={{ display: "flex", justifyContent: "center", py: 6 }}>
              <CircularProgress sx={{ color: "#C2A56D" }} />
            </Box>
          ) : (
            <Fade in timeout={800}>
              {/* ĐÃ THU NHỎ SPACING GIỮA CÁC SECTIONS: TỪ 12 XUỐNG CÒN 6 (tương đương 48px) */}
              <Stack spacing={6}>                  
                {/* Section Gợi ý khách sạn - Nằm trọn chiều ngang Container */}
                <Box sx={{ 
                  p: { xs: 2, md: 4 }, // Thu hẹp bớt padding trong của box đen này để gọn gàng hơn
                  bgcolor: "#1C1B19", 
                  borderRadius: { xs: "20px", md: "40px" },
                  color: "white" 
                }}>
                  <HotelSuggestion hotels={hotels} />
                </Box>

                {/* Section Gợi ý khách sạn - Recommendation */}
                <Box sx={{ width: '100%' }}>
                  <Recommendation />
                </Box>

                {/* Section Khách sạn theo thành phố */}
                <CityHotelSections citiesSorted={citiesSorted} />
              </Stack>
            </Fade>
          )}
        </Stack>
      </Container>

      {/* 4. WHY BOOK SECTION */}
      {/* ĐÃ THU NHỎ PY: TỪ 10 XUỐNG CÒN 6 ĐỂ ĐÍT TRANG GẦN LẠI */}
      <Box sx={{ bgcolor: "white", py: 6 }}>
        <WhyBook />
      </Box>
    </Box>
  );
}