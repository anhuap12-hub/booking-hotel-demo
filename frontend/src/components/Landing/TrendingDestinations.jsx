import { Box, Typography, Grid, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const DESTINATIONS = [
  {
    city: "Hà Nội",
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d",
    desc: "Nét cổ kính giữa lòng thủ đô",
  },
  {
    city: "TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
    desc: "Năng động và không ngủ",
  },
  {
    city: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948",
    desc: "Thành phố của những cây cầu",
  },
  {
    city: "Đà Lạt",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
    desc: "Bản tình ca cao nguyên",
  },
];

export default function TrendingDestinations() {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  const handleClick = (city) => {
    updateSearch({
      keyword: "",
      city,
      price: [0, 5_000_000],
      types: [],
      rating: null,
      amenities: [],
    });
    navigate(`/hotels?city=${encodeURIComponent(city)}`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 15, mb: 10 }}>
      {/* HEADER SECTION */}
      <Stack direction="row" justifyContent="space-between" alignItems="flex-end" sx={{ mb: 6 }}>
        <Box>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 800,
              color: "#1C1B19",
              lineHeight: 1.2,
            }}
          >
            Hành trình <br /> 
            <Box component="span" sx={{ color: "#C2A56D" }}>Cảm hứng</Box>
          </Typography>
        </Box>
        <Typography 
          sx={{ 
            color: "#72716E", 
            fontSize: "0.9rem", 
            maxWidth: "250px", 
            textAlign: "right",
            display: { xs: "none", md: "block" }
          }}
        >
          Khám phá những điểm đến được Coffee Stay tuyển chọn dựa trên trải nghiệm văn hóa địa phương.
        </Typography>
      </Stack>

      {/* GRID SECTION */}
      <Grid container spacing={3}>
        {DESTINATIONS.map((d, idx) => (
          <Grid 
            item 
            xs={12} 
            sm={6} 
            md={idx % 4 === 0 || idx % 4 === 3 ? 3.5 : 2.5} // Tạo nhịp điệu lớn nhỏ cho grid
            key={d.city}
          >
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onClick={() => handleClick(d.city)}
              sx={{
                height: { xs: 300, md: 400 },
                borderRadius: "24px",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                transition: "all 0.5s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": {
                  boxShadow: "0 25px 50px rgba(0,0,0,0.15)",
                },
              }}
            >
              {/* IMAGE */}
              <Box
                component="img"
                src={d.image}
                alt={d.city}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 1s ease",
                  "&:hover": {
                    transform: "scale(1.1)",
                  },
                }}
              />

              {/* LỚP PHỦ MÀU (GRADIENT) */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(28,27,25,0.8) 0%, rgba(28,27,25,0) 60%)",
                  zIndex: 1,
                }}
              />

              {/* THÔNG TIN */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 30,
                  left: 25,
                  right: 25,
                  zIndex: 2,
                  color: "#fff",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "1.5rem",
                    mb: 0.5,
                  }}
                >
                  {d.city}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.8rem",
                    color: "rgba(255,255,255,0.7)",
                    letterSpacing: "0.05em",
                  }}
                >
                  {d.desc}
                </Typography>
              </Box>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}