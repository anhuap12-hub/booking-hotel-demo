import { Box, Typography, Grid, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const MotionBox = motion(Box);

const DESTINATIONS = [
  {
    city: "Hà Nội",
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d",
    desc: "Cổ kính & Trầm mặc",
  },
  {
    city: "TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
    desc: "Năng động & Phóng khoáng",
  },
  {
    city: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948",
    desc: "Biển xanh & Cầu rồng",
  },
  {
    city: "Đà Lạt",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    desc: "Sương mù & Tình yêu",
  },
];

export default function TrendingDestinations() {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  const handleClick = (city) => {
    updateSearch({ city });
    navigate(`/hotels?city=${encodeURIComponent(city)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 8, md: 12 }, mb: 10 }}>
      {/* HEADER SECTION */}
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        justifyContent="space-between" 
        alignItems={{ xs: "flex-start", md: "flex-end" }} 
        sx={{ mb: 6 }}
        spacing={2}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "2.2rem", md: "3rem" },
              fontWeight: 900,
              color: "#1C1B19",
              lineHeight: 1,
            }}
          >
            Điểm đến <br /> 
            <Box component="span" sx={{ color: "#C2A56D", fontStyle: "italic", fontWeight: 400 }}>Thịnh hành</Box>
          </Typography>
        </Box>
        <Typography 
          sx={{ 
            color: "#72716E", 
            fontSize: "0.95rem", 
            maxWidth: "350px", 
            lineHeight: 1.6,
            borderLeft: { md: "2px solid #C2A56D" },
            pl: { md: 3 }
          }}
        >
          Khám phá những tọa độ lưu trú dẫn đầu xu hướng, nơi phong cách sống và nghệ thuật giao thoa.
        </Typography>
      </Stack>

      {/* GRID SECTION - Cố định 4 cột trên Desktop */}
      <Grid container spacing={2}>
        {DESTINATIONS.map((d, idx) => (
          <Grid item xs={12} sm={6} md={3} key={d.city}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              onClick={() => handleClick(d.city)}
              sx={{
                height: { xs: 250, md: 450 }, // Chiều cao thanh thoát
                borderRadius: "32px",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                bgcolor: "#f0f0f0",
                "&:hover .dest-img": { transform: "scale(1.1)" },
                "&:hover .dest-overlay": { background: "linear-gradient(to top, #1C1B19 0%, transparent 40%)" },
                "&:hover .dest-btn": { opacity: 1, transform: "translateY(0)" },
              }}
            >
              {/* IMAGE */}
              <Box
                className="dest-img"
                component="img"
                src={d.image}
                alt={d.city}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 1.2s cubic-bezier(0.16, 1, 0.3, 1)",
                }}
              />

              {/* OVERLAY */}
              <Box
                className="dest-overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(28,27,25,0.6) 0%, transparent 50%)",
                  transition: "0.5s",
                  zIndex: 1,
                }}
              />

              {/* CONTENT */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 0,
                  left: 0,
                  right: 0,
                  p: 4,
                  zIndex: 2,
                  color: "#fff",
                }}
              >
                <Typography variant="overline" sx={{ letterSpacing: "0.2em", opacity: 0.8 }}>
                  Việt Nam
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: "1.8rem",
                    lineHeight: 1.2,
                    mb: 1,
                  }}
                >
                  {d.city}
                </Typography>
                
                {/* Nút giả xuất hiện khi hover */}
                <Stack 
                  className="dest-btn"
                  direction="row" 
                  alignItems="center" 
                  spacing={1}
                  sx={{ 
                    opacity: 0, 
                    transform: "translateY(10px)", 
                    transition: "0.4s",
                    color: "#C2A56D"
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: "0.8rem", textTransform: "uppercase" }}>
                    Khám phá ngay
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 16 }} />
                </Stack>
              </Box>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}