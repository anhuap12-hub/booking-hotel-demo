import { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { Box, CircularProgress, Container } from "@mui/material";

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

  /* ================= FETCH HOTELS (CHỈ DÙNG ĐỂ SHOW UI) ================= */
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

  /* ================= DATA PHỤC VỤ HOME UI ================= */
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

  /* ================= FILTER HANDLER (CHỈ SET CONTEXT + REDIRECT) ================= */
  const handleFilterChange = (payload) => {
    updateSearch(prev => ({
      ...prev,
      ...payload,
    }));

    navigate("/hotels");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <HeroBanner />

      <Container maxWidth="xl">
        <Box
          sx={{
            display: "flex",
            py: 5,
            gap: 4,
            alignItems: "flex-start",
          }}
        >
          {/* ================= FILTER (CHỈ CHỌN – KHÔNG FILTER Ở HOME) ================= */}
          <Box
            component="aside"
            sx={{
              width: 300,
              flexShrink: 0,
              position: "sticky",
              top: 100,
            }}
          >
            <FilterSidebar
              filters={{}}               // ❗ Home KHÔNG dùng state filter
              setFilters={handleFilterChange}
              cities={cities}
              amenities={amenities}
              showPrice={false}          // ❗ Ẩn filter giá ở Home
            />
          </Box>

          {/* ================= MAIN CONTENT ================= */}
          <Box component="main" sx={{ flex: 1, minWidth: 0 }}>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
                <CircularProgress />
              </Box>
            ) : (
              <>
                <QuickStats hotels={hotels} cities={cities} />

                <Box sx={{ mt: 4 }}>
                  <HotelSuggestion hotels={hotels} />
                </Box>

                <CityHotelSections citiesSorted={citiesSorted} />
              </>
            )}
          </Box>
        </Box>
      </Container>

      <WhyBook />
    </>
  );
}
