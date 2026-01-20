import {
  Container,
  Typography,
  Paper,
  Box,
  Button,
  CircularProgress,
} from "@mui/material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useEffect, useMemo, useState } from "react";
import { getAllHotels } from "../../api/hotel.api";

const MotionPaper = motion(Paper);

export default function DealsSection() {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  /* ================= FETCH HOTELS ================= */
  useEffect(() => {
    getAllHotels()
      .then(res => {
        setHotels(res.data?.data || []);
      })
      .finally(() => setLoading(false));
  }, []);

  /* ================= DEAL LOGIC (GIỐNG Deals.jsx) ================= */
  const maxDiscount = useMemo(() => {
    if (!hotels.length) return 0;

    return hotels.reduce((max, hotel) => {
      if (!hotel.rooms?.length) return max;

      const discountedRooms = hotel.rooms.filter(
        r => typeof r.discount === "number" && r.discount > 0
      );

      if (!discountedRooms.length) return max;

      const hotelMaxDiscount = Math.max(
        ...discountedRooms.map(r => r.discount)
      );

      return Math.max(max, hotelMaxDiscount);
    }, 0);
  }, [hotels]);

  /* ================= NO DEAL ================= */
  if (!loading && maxDiscount === 0) return null;

  return (
    <Container maxWidth="xl" sx={{ mb: 10 }}>
      <Typography
        sx={{
          mb: 3,
          fontFamily: "Playfair Display, serif",
          fontSize: { xs: 22, md: 26 },
          fontWeight: 600,
          color: "#2b2a28",
        }}
      >
        Ưu đãi Genius
      </Typography>

      <MotionPaper
        initial={{ y: 40, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        sx={{
          borderRadius: 5,
          overflow: "hidden",
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          bgcolor: "#1f1e1c",
          color: "#f5f4f2",
        }}
      >
        {/* TEXT */}
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            gap: 2,
          }}
        >
          <Typography
            sx={{
              fontFamily: "Playfair Display, serif",
              fontSize: { xs: 26, md: 32 },
              fontWeight: 600,
              lineHeight: 1.25,
            }}
          >
            Đi trốn & tận hưởng
          </Typography>

          {loading ? (
            <CircularProgress size={20} sx={{ color: "#c7a76c" }} />
          ) : (
            <Typography
              sx={{
                fontSize: 15,
                lineHeight: 1.7,
                color: "rgba(255,255,255,0.75)",
                maxWidth: 420,
              }}
            >
              Ưu đãi đến <b>{maxDiscount}%</b> cho những không gian lưu trú mang
              phong vị riêng, được chọn lọc kỹ lưỡng.
            </Typography>
          )}

          <Button
            onClick={() => navigate("/deals")}
            sx={{
              mt: 1,
              alignSelf: "flex-start",
              px: 4,
              py: 1.3,
              borderRadius: 999,
              textTransform: "none",
              fontWeight: 500,
              bgcolor: "#c7a76c",
              color: "#1f1e1c",
              "&:hover": { bgcolor: "#d6b980" },
            }}
          >
            Khám phá ưu đãi
          </Button>
        </Box>

        {/* IMAGE */}
        <Box
          sx={{
            width: { xs: "100%", md: 360 },
            height: { xs: 220, md: "auto" },
            flexShrink: 0,
          }}
        >
          <Box
            component="img"
            src="https://images.pexels.com/photos/3601425/pexels-photo-3601425.jpeg?auto=compress&cs=tinysrgb&w=800"
            alt="deal"
            sx={{
              width: "100%",
              height: "100%",
              objectFit: "cover",
            }}
          />
        </Box>
      </MotionPaper>
    </Container>
  );
}
