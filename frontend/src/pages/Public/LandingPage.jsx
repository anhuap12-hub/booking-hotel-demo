import { useState, useEffect } from "react";
import { Box } from "@mui/material";
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
  const { user } = useAuth();

  useEffect(() => {
    const fetchHotels = async () => {
      try {
        const res = await getAllHotels();
        setHotels(res.data?.data || []);
      } catch (err) {
        console.error(err);
        setHotels([]);
      }
    };
    fetchHotels();
  }, []);


  useEffect(() => {
    if (user) return;
    if (sessionStorage.getItem("geniusShown")) return;

    const timer = setTimeout(() => {
      setShowGenius(true);
      sessionStorage.setItem("geniusShown", "true");
    }, 3000);

    return () => clearTimeout(timer);
  }, [user]);

  return (
    <Box>
      <HeroSection />
      <SearchForm />

      <DealsSection />

      <TrendingDestinations
        cities={[...new Set(hotels.map((h) => h.city))].map((city) => ({
          name: city,
          properties: hotels.filter((h) => h.city === city).length,
          img: hotels.find((h) => h.city === city)?.photos?.[0]?.url,
        }))}
      />

      <PropertiesByType
        properties={[...new Set(hotels.map((h) => h.type))].map((type) => ({
          name: type,
          count: hotels.filter((h) => h.type === type).length,
          img: hotels.find((h) => h.type === type)?.photos?.[0]?.url,
        }))}
      />

      <WeekendDeals
        hotels={hotels.slice(0, 6).map((h) => ({
          ...h,
          img: h.photos?.[0]?.url,
        }))}
      />

      <ContactCTA />

      <GeniusModal open={showGenius} onClose={() => setShowGenius(false)} />
    </Box>
  );
}
