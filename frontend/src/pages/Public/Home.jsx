import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Container, Stack, Fade } from "@mui/material";

import HeroBanner from "../../components/Home/HeroBanner";
import QuickStats from "../../components/Home/QuickStats";
import WhyBook from "../../components/Home/WhyBook";
import FilterSidebar from "../../components/Common/FilterSidebar";
import HotelSuggestion from "../../components/Home/HotelSuggestion";
import CityHotelSections from "../../components/Home/CityHotelSections";

import { getAllHotels } from "../../api/hotel.api";
import { useSearch } from "../../context/SearchContext";

const MAX_CITY = 3;

export default function Home() {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const res = await getAllHotels();
        setHotels(res.data?.data || []);
      } catch (err) {
        console.error("Fetch hotels error:", err);
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  const { cities, amenities, citiesSorted } = useMemo(() => {
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
      .slice(0, MAX_CITY);

    return {
      cities: allCities,
      amenities: allAmenities,
      citiesSorted: sorted,
    };
  }, [hotels]);

  const handleFilterChange = (payload) => {
    updateSearch(prev => ({ ...prev, ...payload }));
    navigate("/hotels");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh" }}>
      {/* 1. HERO BANNER - Điểm chạm xa hoa đầu tiên */}
      <HeroBanner />

      <Container maxWidth="xl" sx={{ mt: -8, position: 'relative', zIndex: 10 }}>
        <Box
          sx={{
            display: "flex",
            pb: 10,
            gap: { xs: 0, lg: 6 },
            flexDirection: { xs: "column", lg: "row" },
            alignItems: "flex-start",
          }}
        >
          {/* 2. FILTER SIDEBAR - Ebony Style */}
          <Box
            component="aside"
            sx={{
              width: { xs: "100%", lg: 320 },
              flexShrink: 0,
              position: { xs: "static", lg: "sticky" },
              top: 100,
              mb: { xs: 4, lg: 0 }
            }}
          >
            <Fade in timeout={1000}>
              <Box sx={{ 
                p: 1, 
                bgcolor: 'white', 
                borderRadius: '24px', 
                boxShadow: '0 20px 40px rgba(28, 27, 25, 0.05)',
                border: '1px solid rgba(194, 165, 109, 0.15)' 
              }}>
                <FilterSidebar
                  filters={{}}
                  setFilters={handleFilterChange}
                  cities={cities}
                  amenities={amenities}
                  showPrice={false}
                />
              </Box>
            </Fade>
          </Box>

          {/* 3. MAIN CONTENT */}
          <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <Stack alignItems="center" py={20}>
                <CircularProgress sx={{ color: '#C2A56D' }} thickness={2} size={50} />
              </Stack>
            ) : (
              <Fade in timeout={1200}>
                <Box>
                  {/* Stats - Dashboard cảm hứng thượng lưu */}
                  <QuickStats hotels={hotels} cities={cities} />

                  {/* Suggestion - Những bộ sưu tập giới hạn */}
                  <Box sx={{ 
                    mt: 8, 
                    p: 4, 
                    bgcolor: '#1C1B19', 
                    borderRadius: '32px',
                    color: '#fff',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.15)'
                  }}>
                    <HotelSuggestion hotels={hotels} />
                  </Box>

                  {/* City Sections - Hành trình qua các thành phố */}
                  <Box sx={{ mt: 10 }}>
                    <CityHotelSections citiesSorted={citiesSorted} />
                  </Box>
                </Box>
              </Fade>
            )}
          </Box>
        </Box>
      </Container>

      {/* 4. WHY BOOK - Cam kết chất lượng */}
      <Box sx={{ bgcolor: "#fff", borderTop: '1px solid rgba(194, 165, 109, 0.1)' }}>
        <WhyBook />
      </Box>
    </Box>
  );
}