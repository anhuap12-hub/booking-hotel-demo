import { Box, Typography, Grid, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const MotionBox = motion(Box);

const DESTINATIONS = [
  {
    city: "Buôn Ma Thuột",
    image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=600&q=80",
    desc: "Cổ kính & Trầm mặc",
  },
  {
    city: "TP. Hồ Chí Minh",
    image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=600&q=80",
    desc: "Năng động & Phóng khoáng",
  },
  {
    city: "Đà Nẵng",
    image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=600&q=80",
    desc: "Biển xanh & Cầu rồng",
  },
  {
    city: "Đà Lạt",
    image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80",
    desc: "Sương mù & Tình yêu",
  },
];

export default function TrendingDestinations() {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  const handleClick = (city) => {
  updateSearch({ city: city }); 
  navigate(`/hotels`); 
  window.scrollTo({ top: 0, behavior: "smooth" });
};

  return (
    <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 8 }, mb: 8 }}>
      {/* HEADER SECTION - Gọn gàng hơn */}
      <Stack 
        direction={{ xs: "column", md: "row" }} 
        justifyContent="space-between" 
        alignItems={{ xs: "flex-start", md: "center" }} 
        sx={{ mb: 4 }}
        spacing={2}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "2rem", md: "2.5rem" },
              fontWeight: 900,
              color: "#1C1B19",
              lineHeight: 1.2,
            }}
          >
            Điểm đến <Box component="span" sx={{ color: "#C2A56D", fontStyle: "italic", fontWeight: 400 }}>Thịnh hành</Box>
          </Typography>
        </Box>
        <Typography 
          sx={{ 
            color: "#72716E", 
            fontSize: "0.9rem", 
            maxWidth: "400px", 
            lineHeight: 1.5,
            borderLeft: { md: "2px solid #C2A56D" },
            pl: { md: 2 }
          }}
        >
          Khám phá những tọa độ lưu trú dẫn đầu xu hướng hiện nay.
        </Typography>
      </Stack>

      {/* GRID SECTION - 4 Card hàng ngang, Chiều cao vừa phải */}
      <Grid container spacing={2.5}>
        {DESTINATIONS.map((d, idx) => (
          <Grid item xs={12} sm={6} md={3} key={d.city}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onClick={() => handleClick(d.city)}
              sx={{
                height: { xs: 220, md: 320 }, // GIẢM CHIỀU CAO TỪ 450 XUỐNG 320
                borderRadius: "24px",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                bgcolor: "#f0f0f0",
                "&:hover .dest-img": { transform: "scale(1.1)" },
                "&:hover .dest-overlay": { background: "linear-gradient(to top, rgba(28,27,25,0.9) 0%, transparent 60%)" },
                "&:hover .dest-btn": { opacity: 1, transform: "translateX(0)" },
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
                  transition: "transform 0.8s ease-in-out",
                }}
              />

              {/* OVERLAY */}
              <Box
                className="dest-overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 40%)",
                  transition: "0.4s",
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
                  p: 3,
                  zIndex: 2,
                  color: "#fff",
                }}
              >
                <Typography variant="overline" sx={{ letterSpacing: "0.1em", opacity: 0.8, fontSize: "0.7rem" }}>
                  VIỆT NAM
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: "1.4rem", // Chỉnh font nhỏ lại cho cân đối card
                    lineHeight: 1.2,
                    mb: 0.5,
                  }}
                >
                  {d.city}
                </Typography>
                
                {/* Nút giả xuất hiện khi hover - Chuyển sang trượt ngang cho tinh tế */}
                <Stack 
                  className="dest-btn"
                  direction="row" 
                  alignItems="center" 
                  spacing={1}
                  sx={{ 
                    opacity: 0, 
                    transform: "translateX(-10px)", 
                    transition: "0.3s",
                    color: "#C2A56D"
                  }}
                >
                  <Typography sx={{ fontWeight: 700, fontSize: "0.75rem", textTransform: "uppercase" }}>
                    Xem ngay
                  </Typography>
                  <ArrowForwardIcon sx={{ fontSize: 14 }} />
                </Stack>
              </Box>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}