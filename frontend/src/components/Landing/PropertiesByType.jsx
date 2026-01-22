import { Container, Grid, Typography, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
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
    <Container maxWidth="lg" sx={{ mb: 12, mt: 8 }}>
      {/* HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "flex-end" }}
        mb={5}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.75rem", md: "2.25rem" },
              fontWeight: 800,
              color: "#1C1B19",
              mb: 1,
            }}
          >
            Khám phá theo loại hình
          </Typography>
          <Typography sx={{ color: "#72716E", fontSize: "1rem" }}>
            Từ khách sạn hạng sang đến không gian nghệ thuật ấm cúng
          </Typography>
        </Box>

        <Typography
          onClick={() => handleGlobalNavigate()}
          sx={{
            mt: { xs: 2, sm: 0 },
            color: "#C2A56D",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 700,
            fontSize: "0.9rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            transition: "0.3s",
            "&:hover": { color: "#1C1B19", gap: 1.5 },
          }}
        >
          Tất cả <ArrowForwardIosIcon sx={{ fontSize: 12 }} />
        </Typography>
      </Stack>

      {/* GRID LAYOUT */}
      <Grid container spacing={3}>
        {properties.map((p, idx) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={idx}>
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onClick={() => handleGlobalNavigate({ types: [p.name] })}
              sx={{
                position: "relative",
                height: 280, // Tăng chiều cao để ảnh trông thanh thoát hơn
                borderRadius: "20px",
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 10px 30px rgba(28, 27, 25, 0.05)",
                "&:hover .overlay": {
                  background: "linear-gradient(180deg, rgba(28,27,25,0.1) 0%, rgba(28,27,25,0.85) 100%)",
                },
              }}
            >
              {/* IMAGE */}
              <Box
                component="img"
                src={p.img}
                alt={p.name}
                sx={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform 1.2s cubic-bezier(0.2, 1, 0.3, 1)",
                  "&:hover": { transform: "scale(1.15)" },
                }}
              />

              {/* OVERLAY */}
              <Box
                className="overlay"
                sx={{
                  position: "absolute",
                  inset: 0,
                  transition: "0.4s",
                  background: "linear-gradient(180deg, rgba(28,27,25,0) 40%, rgba(28,27,25,0.7) 100%)",
                }}
              />

              {/* CONTENT */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 20,
                  left: 20,
                  right: 20,
                  color: "#fff",
                }}
              >
                <Typography
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 700,
                    fontSize: "1.2rem",
                    mb: 0.5,
                  }}
                >
                  {cap(p.name)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    opacity: 0.8,
                    fontWeight: 500,
                    letterSpacing: "0.05em",
                    textTransform: "uppercase",
                  }}
                >
                  {p.count} địa điểm
                </Typography>
              </Box>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}