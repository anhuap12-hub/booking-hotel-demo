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
    <Container maxWidth="lg" sx={{ mb: 10, mt: 8 }}>
      {/* HEADER - Thu gọn khoảng cách */}
      <Stack
        direction="row"
        justifyContent="space-between"
        alignItems="flex-end"
        mb={4}
      >
        <Box>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: { xs: "1.8rem", md: "2.5rem" },
              fontWeight: 900,
              color: "#1C1B19",
              lineHeight: 1.1,
            }}
          >
            Phong cách <br /> Lưu trú
          </Typography>
          <Box sx={{ width: 40, height: 3, bgcolor: "#C2A56D", mt: 1, borderRadius: 1 }} />
        </Box>

        <Typography
          onClick={() => handleGlobalNavigate()}
          sx={{
            color: "#72716E",
            cursor: "pointer",
            display: "flex",
            alignItems: "center",
            gap: 1,
            fontWeight: 700,
            fontSize: "0.8rem",
            textTransform: "uppercase",
            letterSpacing: "0.1em",
            transition: "0.3s",
            "&:hover": { color: "#C2A56D" },
          }}
        >
          Tất cả loại hình <ArrowForwardIcon sx={{ fontSize: 16 }} />
        </Typography>
      </Stack>

      {/* GRID LAYOUT - 4 Cột hàng ngang, Card thấp gọn */}
      <Grid container spacing={3}>
        {properties.map((p, idx) => (
          <Grid item xs={12} sm={6} md={3} key={idx}>
            <MotionBox
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1, duration: 0.5 }}
              onClick={() => handleGlobalNavigate({ types: [p.name] })}
              sx={{
                cursor: "pointer",
                "&:hover .prop-img": { transform: "scale(1.05)" },
                "&:hover .prop-name": { color: "#C2A56D" }
              }}
            >
              {/* IMAGE WRAPPER - Giảm chiều cao xuống 280px */}
              <Box sx={{ 
                height: 280, 
                borderRadius: "24px", 
                overflow: "hidden", 
                mb: 2,
                position: "relative",
                bgcolor: "#eee" 
              }}>
                <Box
                  className="prop-img"
                  component="img"
                  src={p.img}
                  alt={p.name}
                  sx={{
                    width: "100%",
                    height: "100%",
                    objectFit: "cover",
                    transition: "transform 0.6s ease-in-out",
                  }}
                />
              </Box>

              {/* INFO BELOW IMAGE - Thay vì đè lên ảnh */}
              <Box sx={{ px: 1 }}>
                <Typography
                  className="prop-name"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: "1.2rem",
                    color: "#1C1B19",
                    transition: "0.3s"
                  }}
                >
                  {cap(p.name)}
                </Typography>
                <Typography
                  sx={{
                    fontSize: "0.75rem",
                    fontWeight: 600,
                    color: "#72716E",
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
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