import { Container, Grid, Typography, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

export default function PropertiesByType({ properties = [] }) {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  const handleGlobalNavigate = (params = {}) => {
    updateSearch({
      city: "",
      types: [],
      rating: null,
      amenities: [],
      priceRange: null,
      ...params,
    });
    navigate("/hotels");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ mb: 12, mt: 4 }}>
      {/* 1. HEADER - Sạch sẽ trên nền trắng */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        mb={5}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.8rem", md: "2.8rem" },
              fontWeight: 900,
              color: "#1C1B19", // Chữ đen sang trọng
              lineHeight: 1.1,
            }}
          >
            Phong cách <br /> Lưu trú
          </Typography>
          <Box sx={{ width: 50, height: 3, bgcolor: "#C2A56D", mt: 2 }} />
        </Box>

        <Typography
          onClick={() => handleGlobalNavigate()}
          sx={{
            color: "#72716E",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 800,
            fontSize: "0.75rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            transition: "0.3s",
            borderBottom: "1px solid rgba(0,0,0,0.1)",
            pb: 0.5,
            "&:hover": { color: "#C2A56D", borderColor: "#C2A56D" },
          }}
        >
          Xem tất cả <ArrowForwardIcon sx={{ fontSize: 14 }} />
        </Typography>
      </Stack>

      {/* 2. GRID LAYOUT - Kiểu Landing Page */}
      <Grid container spacing={3}>
        {properties.map((p, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.7 }}
              onClick={() => handleGlobalNavigate({ types: [p.name] })}
              sx={{
                cursor: "pointer",
                position: "relative",
                height: 420, 
                borderRadius: "32px",
                overflow: "hidden",
                boxShadow: "0 10px 30px rgba(0,0,0,0.05)",
                "&:hover .prop-img": { transform: "scale(1.1)" },
                "&:hover .overlay": { 
                  background: "linear-gradient(to top, rgba(28,27,25,0.9) 0%, rgba(28,27,25,0.1) 60%)" 
                }
              }}
            >
              {/* Ảnh nền card */}
              <Box
                className="prop-img"
                component="img"
                src={p.img}
                alt={p.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 1s cubic-bezier(0.4, 0, 0.2, 1)",
                }}
              />

              {/* Lớp phủ chữ trắng đè lên ảnh */}
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to top, rgba(28,27,25,0.6) 0%, rgba(28,27,25,0) 40%)",
                  transition: "all 0.4s ease",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "flex-end",
                  p: 4,
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: "1.6rem",
                    color: "#FFFFFF",
                    mb: 0.5,
                  }}
                >
                  {cap(p.name)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "rgba(255,255,255,0.85)",
                    textTransform: "uppercase",
                    letterSpacing: "0.1em",
                  }}
                >
                  {p.count} chỗ nghỉ
                </Typography>
              </Box>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}