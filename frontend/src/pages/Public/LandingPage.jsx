import { useState, useEffect, useMemo } from "react";
import { Box, Container, Stack, Fade, CircularProgress } from "@mui/material";
import { useAuth } from "../../context/AuthContext";

// Soát lỗi Import: Đảm bảo đúng đường dẫn các Component Landing
import HeroSection from "../../components/Landing/HeroSection";
import DealsSection from "../../components/Landing/DealsSection";
import TrendingDestinations from "../../components/Landing/TrendingDestinations";
import PropertiesByType from "../../components/Landing/PropertiesByType";
import WeekendDeals from "../../components/Landing/WeekendDeals";
import ContactCTA from "../../components/Landing/ContactCTA";
import GeniusModal from "../../components/Common/GeniusModal";

import { getAllHotels } from "../../api/hotel.api";

export default function LandingPage() {
  const [hotels, setHotels] = useState([]);
  const [showGenius, setShowGenius] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  /* ================= FETCH DATA (Giữ nguyên logic) ================= */
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

  /* ================= MODAL LOGIC (Giữ nguyên logic) ================= */
  useEffect(() => {
    if (user) return;
    if (sessionStorage.getItem("geniusShown")) return;

    const timer = setTimeout(() => {
      setShowGenius(true);
      sessionStorage.setItem("geniusShown", "true");
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]);

  /* ================= DATA TRANSFORMATION (Giữ nguyên logic) ================= */
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
    <Box sx={{ bgcolor: "#FDFCFB", minHeight: "100vh", overflowX: "hidden" }}>
      
      {/* 1. HERO & SEARCH - Tối ưu Responsive lớp đè */}
      <Box sx={{ position: "relative" }}>
        <HeroSection />
        <Container 
          maxWidth="lg" 
          sx={{ 
            mt: { xs: -4, md: -10 }, // Đẩy Form tìm kiếm lên đè Hero tinh tế hơn
            position: "relative", 
            zIndex: 10,
            px: { xs: 2, md: 0 }
          }}
        >
        </Container>
      </Box>

      {/* 2. MAIN CONTENT - Phân cấp Spacing theo thiết bị */}
      <Container maxWidth="xl" sx={{ py: { xs: 6, md: 12 } }}>
        <Stack spacing={{ xs: 8, md: 15 }}>
          
          {loading ? (
            <Stack alignItems="center"><CircularProgress sx={{ color: "#C2A56D" }} /></Stack>
          ) : (
            <Fade in timeout={1000}>
              <Box>
                {/* Khối Ưu Đãi */}
                <DealsSection />
              </Box>
            </Fade>
          )}

          {/* Điểm đến Xu hướng */}
          <Box sx={{ position: "relative" }}>
            <TrendingDestinations cities={cityData} />
          </Box>

          {/* Loại hình chỗ nghỉ  */}
          <PropertiesByType properties={propertyTypes} />

          {/* Ưu đãi cuối tuần */}
          <Box>
            <WeekendDeals hotels={weekendHotels} />
          </Box>

        </Stack>
      </Container>

      {/* 3. CTA AREA */}
      <Box sx={{ mt: 5, bgcolor: "white" }}>
        <ContactCTA />
      </Box>

      {/* MODAL KHUYẾN MÃI */}
      <GeniusModal open={showGenius} onClose={() => setShowGenius(false)} />
    </Box>
  );
}