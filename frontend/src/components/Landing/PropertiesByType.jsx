import { Box, Typography, Grid, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

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
    <Container maxWidth="lg" sx={{ mt: { xs: 6, md: 8 }, mb: 8 }}>
      {/* HEADER SECTION - Đồng bộ với Trending */}
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
            Phong cách <Box component="span" sx={{ color: "#C2A56D", fontStyle: "italic", fontWeight: 400 }}>Lưu trú</Box>
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
          Lựa chọn không gian nghỉ dưỡng phù hợp với cá tính và nhu cầu của riêng bạn.
        </Typography>
      </Stack>

      {/* GRID SECTION - Đồng bộ chiều cao và hiệu ứng với Trending */}
      <Grid container spacing={2.5}>
        {properties.map((p, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.6 }}
              onClick={() => handleGlobalNavigate({ types: [p.name] })}
              sx={{
                height: { xs: 220, md: 320 }, // Chiều cao 320px giống Trending
                borderRadius: "24px",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                bgcolor: "#f0f0f0",
                "&:hover .prop-img": { transform: "scale(1.1)" },
                "&:hover .prop-overlay": { background: "linear-gradient(to top, rgba(28,27,25,0.9) 0%, transparent 60%)" },
                "&:hover .prop-btn": { opacity: 1, transform: "translateX(0)" },
              }}
            >
              {/* IMAGE */}
              <Box
                className="prop-img"
                component="img"
                src={p.img}
                alt={p.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 0.8s ease-in-out",
                }}
              />

              {/* OVERLAY - Gradient nhẹ giống Trending */}
              <Box
                className="prop-overlay"
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
                  {p.count} CHỖ NGHỈ
                </Typography>
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: "1.4rem", 
                    lineHeight: 1.2,
                    mb: 0.5,
                  }}
                >
                  {cap(p.name)}
                </Typography>
                
                {/* NÚT "XEM NGAY" TRƯỢT NGANG KHI HOVER */}
                <Stack 
                  className="prop-btn"
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
                    Khám phá
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