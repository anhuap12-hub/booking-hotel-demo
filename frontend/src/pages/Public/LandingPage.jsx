import { useState, useEffect, useMemo } from "react";
import { Box, Container, Stack, Fade} from "@mui/material";
import { useAuth } from "../../context/AuthContext";

import HeroSection from "../../components/Landing/HeroSection";
import DealsSection from "../../components/Landing/DealsSection";
import TrendingDestinations from "../../components/Landing/TrendingDestinations";
import PropertiesByType from "../../components/Landing/PropertiesByType";
import WeekendDeals from "../../components/Landing/WeekendDeals";
import ContactCTA from "../../components/Landing/ContactCTA";
import GeniusModal from "../../components/Common/GeniusModal";
import SearchForm from "../../components/Landing/SearchForm";
import { getAllHotels } from "../../api/hotel.api";

export default function LandingPage() {
  const [hotels, setHotels] = useState([]);
  const [showGenius, setShowGenius] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  /* ================= FETCH DATA ================= */
  useEffect(() => {
    const fetchHotels = async () => {
      try {
        setLoading(true);
        const res = await getAllHotels();
        setHotels(res.data?.data || []);
      } catch (err) {
        console.error("Landing Page fetch error:", err);
        setHotels([]);
      } finally {
        setLoading(false);
      }
    };
    fetchHotels();
  }, []);

  /* ================= MODAL LOGIC ================= */
  useEffect(() => {
    if (user) return;
    if (sessionStorage.getItem("geniusShown")) return;

    const timer = setTimeout(() => {
      setShowGenius(true);
      sessionStorage.setItem("geniusShown", "true");
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]);

  /* ================= DATA TRANSFORMATION ================= */
  const cityData = useMemo(() => {
    return [...new Set(hotels.map((h) => h.city))].map((city) => ({
      name: city,
      properties: hotels.filter((h) => h.city === city).length,
      img: hotels.find((h) => h.city === city)?.photos?.[0]?.url,
    }));
  }, [hotels]);

  const propertyTypes = useMemo(() => {
    return [...new Set(hotels.map((h) => h.type))].map((type) => ({
      name: type,
      count: hotels.filter((h) => h.type === type).length,
      img: hotels.find((h) => h.type === type)?.photos?.[0]?.url,
    }));
  }, [hotels]);

  const weekendHotels = useMemo(() => {
    return hotels.slice(0, 6).map((h) => ({
      ...h,
      img: h.photos?.[0]?.url,
    }));
  }, [hotels]);

  return (
    <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh", overflowX: "hidden" }}>
      {/* 1. HERO & SEARCH - Đè lớp tinh tế */}
      <Box sx={{ position: "relative" }}>
        <HeroSection />
        <Container maxWidth="lg" sx={{ mt: { xs: -5, md: -8 }, position: "relative", zIndex: 10 }}>
          <Box sx={{ 
            p: 1, 
            bgcolor: "white", 
            borderRadius: "20px", 
            boxShadow: "0 25px 50px rgba(28, 27, 25, 0.1)",
            border: "1px solid rgba(194, 165, 109, 0.2)"
          }}>
            <SearchForm />
          </Box>
        </Container>
      </Box>

      {/* 2. NỘI DUNG CHÍNH - Phân cấp rõ ràng bằng Stack */}
      <Container maxWidth="xl" sx={{ py: 8 }}>
        <Stack spacing={12}>
          
          <Fade in={!loading} timeout={1000}>
            <Box>
              <DealsSection />
            </Box>
          </Fade>

          <Box sx={{ position: "relative" }}>
            <TrendingDestinations cities={cityData} />
          </Box>

          <Box sx={{ 
            py: 10, 
            px: { xs: 2, md: 6 }, 
            bgcolor: "#1C1B19", 
            borderRadius: "40px", 
            color: "white" 
          }}>
            <PropertiesByType properties={propertyTypes} />
          </Box>

          <Box>
            <WeekendDeals hotels={weekendHotels} />
          </Box>

        </Stack>
      </Container>

      {/* 3. CTA & FOOTER AREA */}
      <Box sx={{ mt: 10, bgcolor: "white", borderTop: "1px solid rgba(194, 165, 109, 0.1)" }}>
        <ContactCTA />
      </Box>

      {/* MODAL KHUYẾN MÃI */}
      <GeniusModal open={showGenius} onClose={() => setShowGenius(false)} />
    </Box>
  );
}