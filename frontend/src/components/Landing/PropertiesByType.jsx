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
    <Container maxWidth="lg" sx={{ mb: 15, mt: 10 }}>
      {/* HEADER */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        mb={6}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "2rem", md: "2.8rem" },
              fontWeight: 900,
              color: "#1C1B19",
              lineHeight: 1.1,
              mb: 2,
            }}
          >
            Phong cách <br /> Lưu trú
          </Typography>
          <Box sx={{ width: 40, height: 4, bgcolor: "#C2A56D", borderRadius: 1 }} />
        </Box>

        <Typography
          onClick={() => handleGlobalNavigate()}
          sx={{
            color: "#1C1B19",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 800,
            fontSize: "0.85rem",
            textTransform: "uppercase",
            letterSpacing: "0.15em",
            borderBottom: "2px solid #C2A56D",
            pb: 0.5,
            transition: "0.3s",
            "&:hover": { color: "#C2A56D", gap: 2 },
          }}
        >
          Tất cả <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Typography>
      </Stack>

      {/* PODS LAYOUT */}
      <Grid container spacing={4}>
        {properties.map((p, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <MotionBox
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              onClick={() => handleGlobalNavigate({ types: [p.name] })}
              sx={{
                position: "relative",
                height: { xs: 350, md: 420 }, // Chiều cao pod dọc
                borderRadius: "100px 100px 20px 20px", // Bo đầu tròn kiểu kén (Pod)
                overflow: "hidden",
                cursor: "pointer",
                bgcolor: "#F9F8F6",
                "&:hover .pod-image": { transform: "scale(1.1)" },
                "&:hover .pod-content": { bottom: 30, bgcolor: "#1C1B19", color: "#C2A56D" },
              }}
            >
              {/* IMAGE */}
              <Box
                className="pod-image"
                component="img"
                src={p.img}
                alt={p.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 1.5s cubic-bezier(0.2, 1, 0.3, 1)",
                }}
              />

              {/* GRADIENT OVERLAY */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background: "linear-gradient(to bottom, transparent 50%, rgba(28,27,25,0.4) 100%)",
                }}
              />

              {/* FLOATING CONTENT CARD */}
              <Box
                className="pod-content"
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: "50%",
                  transform: "translateX(-50%)",
                  width: "85%",
                  bgcolor: "rgba(255, 255, 255, 0.9)",
                  backdropFilter: "blur(10px)",
                  p: 2,
                  borderRadius: "16px",
                  textAlign: "center",
                  transition: "all 0.4s ease",
                  color: "#1C1B19",
                  boxShadow: "0 10px 30px rgba(0,0,0,0.1)",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: "1.1rem",
                    mb: 0.2,
                  }}
                >
                  {cap(p.name)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    opacity: 0.6,
                  }}
                >
                  {p.count} Options
                </Typography>
              </Box>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}