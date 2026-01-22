// src/pages/Home/Home.jsx
import { useEffect, useState, useMemo } from "react";
import { Box, Container, Stack, Fade, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";
import HeroBanner from "../../components/Home/HeroBanner";
import QuickStats from "../../components/Home/QuickStats";
import WhyBook from "../../components/Home/WhyBook";
import FilterSidebar from "../../components/Common/FilterSidebar";
import HotelSuggestion from "../../components/Home/HotelSuggestion";
import CityHotelSections from "../../components/Home/CityHotelSections";
import { getAllHotels } from "../../api/hotel.api";
import { useSearch } from "../../context/SearchContext";
import { NAVBAR_HEIGHT } from "../../components/Layout/Navbar";

export default function Home() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const { updateSearch } = useSearch();

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getAllHotels();
        setHotels(res.data?.data || []);
      } catch (err) { console.error(err); } 
      finally { setLoading(false); }
    };
    loadData();
  }, []);

  // ... (Logic useMemo cities, amenities giữ nguyên như cũ) ...
  const { cities, amenities, citiesSorted } = useMemo(() => {
    const allCities = [...new Set(hotels.map(h => h.city).filter(Boolean))];
    const allAmenities = [...new Set(hotels.flatMap(h => h.amenities || []))];
    const byCity = hotels.reduce((acc, h) => {
      const cityName = h.city || "Khác";
      if (!acc[cityName]) acc[cityName] = [];
      acc[cityName].push(h);
      return acc;
    }, {});
    const sorted = Object.entries(byCity).sort((a, b) => b[1].length - a[1].length).slice(0, 3);
    return { cities: allCities, amenities: allAmenities, citiesSorted: sorted };
  }, [hotels]);

  return (
    <Box sx={{ bgcolor: "#FDFCFB", minHeight: "100vh" }}>
      {/* 1. KHOẢNG ĐỆM NAVBAR - Để không bị hở trắng phía dưới Navbar */}
      <Box sx={{ height: `${NAVBAR_HEIGHT}px`, bgcolor: "#1C1B19" }} />

      {/* 2. HERO BANNER - Tràn ngang 100% */}
      <HeroBanner />
      <QuickStats hotels={hotels} cities={cities} />
      {/* 3. MAIN CONTENT LAYOUT */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 10 } }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "300px 1fr" },
            gap: 6,
          }}
        >
          {/* SIDEBAR */}
          <Box sx={{ display: { xs: "none", lg: "block" } }}>
             <Box sx={{ position: "sticky", top: NAVBAR_HEIGHT + 20 }}>
                <FilterSidebar 
                  cities={cities} 
                  amenities={amenities} 
                  setFilters={(p) => updateSearch(prev => ({...prev, ...p}))} 
                />
             </Box>
          </Box>

          {/* CONTENT AREA */}
          <Stack spacing={10}>
            {loading ? <CircularProgress sx={{ m: "auto", color: "#C2A56D" }} /> : (
              <Fade in timeout={800}>
                <Stack spacing={12}>                  
                  {/* Luxury Section giống Landing Page */}
                  <Box sx={{ 
                    p: { xs: 3, md: 6 }, 
                    bgcolor: "#1C1B19", 
                    borderRadius: "40px",
                    color: "white" 
                  }}>
                    <HotelSuggestion hotels={hotels} />
                  </Box>

                  <CityHotelSections citiesSorted={citiesSorted} />
                </Stack>
              </Fade>
            )}
          </Stack>
        </Box>
      </Container>

      <Box sx={{ bgcolor: "white", py: 10 }}>
        <WhyBook />
      </Box>
    </Box>
  );
}