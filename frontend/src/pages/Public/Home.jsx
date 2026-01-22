import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { 
  Box, 
  CircularProgress, 
  Container, 
  Stack, 
  Fade, 
  Typography 
} from "@mui/material";

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
    <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh", overflowX: "hidden" }}>
      {/* 1. HERO BANNER */}
      <HeroBanner />

      <Container maxWidth="xl" sx={{ mt: { xs: 4, lg: -8 }, position: 'relative', zIndex: 10 }}>
        {/* RESPONSIVE GRID SYSTEM */}
        <Box
          sx={{
            display: "grid",
            // xs: 1 cột (mobile), lg: 2 cột (desktop)
            gridTemplateColumns: { xs: "1fr", lg: "280px 1fr" }, 
            gap: { xs: 4, md: 6 },
            pb: 10,
          }}
        >
          {/* 2. SIDEBAR - Ẩn trên Mobile, hiện từ màn hình lớn (Desktop) */}
          <Box 
            component="aside" 
            sx={{ 
              display: { xs: "none", lg: "block" }, // Quan trọng để ko lỗi mobile
            }}
          >
            <Fade in={!loading} timeout={1000}>
              <Box sx={{ 
                position: "sticky", 
                top: 100,
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
          <Box component="main" sx={{ minWidth: 0, width: "100%" }}>
            {loading ? (
              <Stack alignItems="center" py={20}>
                <CircularProgress sx={{ color: '#C2A56D' }} thickness={2} size={50} />
              </Stack>
            ) : (
              <Fade in timeout={1200}>
                <Stack spacing={{ xs: 6, md: 10 }}>
                  
                  {/* Stats - Co giãn theo Container */}
                  <QuickStats hotels={hotels} cities={cities} />

                  {/* Suggestions - Khối Ebony */}
                  <Box sx={{ 
                    p: { xs: 3, md: 5 }, 
                    bgcolor: '#1C1B19', 
                    borderRadius: { xs: '24px', md: '40px' },
                    color: '#fff',
                    boxShadow: '0 30px 60px rgba(0,0,0,0.15)',
                    mx: { xs: -1, sm: 0 } // Mobile bung lụa hơn một chút
                  }}>
                    <Typography 
                      variant="h5" 
                      sx={{ 
                        mb: 4, 
                        fontFamily: "'Playfair Display', serif", 
                        color: '#C2A56D', 
                        fontWeight: 700,
                        fontSize: { xs: '1.2rem', md: '1.5rem' } 
                      }}
                    >
                      Tuyển tập không gian thượng lưu
                    </Typography>
                    <HotelSuggestion hotels={hotels} />
                  </Box>

                  {/* City Sections - Hiển thị Khách sạn theo Thành phố */}
                  <Box sx={{ width: "100%" }}>
                    <Typography 
                      variant="h4" 
                      sx={{ 
                        mb: 5, 
                        fontFamily: "'Playfair Display', serif", 
                        fontWeight: 900,
                        fontSize: { xs: '1.8rem', md: '2.5rem' },
                        textAlign: { xs: 'center', md: 'left' }
                      }}
                    >
                      Khám phá các điểm đến
                    </Typography>
                    <CityHotelSections citiesSorted={citiesSorted} />
                  </Box>

                </Stack>
              </Fade>
            )}
          </Box>
        </Box>
      </Container>

      {/* 4. WHY BOOK */}
      <Box sx={{ bgcolor: "#fff", py: { xs: 6, md: 10 }, borderTop: '1px solid rgba(194, 165, 109, 0.1)' }}>
        <WhyBook />
      </Box>
    </Box>
  );
}