import { Box, Typography, Grid, Container, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { motion } from "framer-motion";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";

const MotionBox = motion(Box);

const DESTINATIONS = [
  { city: "Buôn Ma Thuột", image: "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d?auto=format&fit=crop&w=400&q=80" },
  { city: "TP. Hồ Chí Minh", image: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?auto=format&fit=crop&w=400&q=80" },
  { city: "Đà Nẵng", image: "https://images.unsplash.com/photo-1559599101-f09722fb4948?auto=format&fit=crop&w=400&q=80" },
  { city: "Đà Lạt", image: "https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=400&q=80" },
  { city: "Nha Trang", image: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?auto=format&fit=crop&w=400&q=80" },
];

const fontStack = "'Inter', sans-serif";

export default function TrendingDestinations() {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  const handleClick = (city) => {
    updateSearch({ city: city });
    navigate(`/hotels`);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="lg" sx={{ mt: -16, mb: 6 }}>
      <Stack sx={{ mb: 3 }}>
        <Typography sx={{ 
          fontFamily: fontStack, 
          fontSize: "1.5rem", 
          fontWeight: 700, 
          color: "#1A1A1A" 
        }}>
          Điểm đến đang <Box component="span" sx={{ color: "#1A1A1A", fontWeight: 700 }}>thịnh hành</Box>
        </Typography>
      </Stack>

      <Grid container spacing={3}>
        {DESTINATIONS.map((d) => (
          // Thay đổi md={3} để hiển thị 4 card trên một hàng, giúp card nhỏ lại và gọn gàng hơn
          <Grid item xs={6} sm={4} md={3} key={d.city}>
            <MotionBox
              whileHover={{ y: -5 }}
              onClick={() => handleClick(d.city)}
              sx={{
                width: "100%",
                aspectRatio: "4/3", // Tỷ lệ ngang giúp card thấp và thanh thoát hơn
                borderRadius: "10px",
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                bgcolor: "#eee",
                boxShadow: "0 2px 8px rgba(0,0,0,0.08)"
              }}
            >
              <Box
                component="img"
                src={d.image}
                alt={d.city}
                sx={{ 
                    width: "100%", 
                    height: "100%", 
                    objectFit: "cover",
                    transition: "transform 0.4s ease" 
                }}
              />
              
              <Box sx={{
                position: "absolute", 
                bottom: 0, 
                left: 0, 
                right: 0, 
                p: 1.5,
                background: "linear-gradient(to top, rgba(0,0,0,0.6) 0%, transparent 100%)",
                color: "#fff"
              }}>
                <Typography sx={{ 
                  fontFamily: fontStack, 
                  fontWeight: 700, 
                  fontSize: "1rem" 
                }}>
                  {d.city}
                </Typography>
              </Box>
            </MotionBox>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}