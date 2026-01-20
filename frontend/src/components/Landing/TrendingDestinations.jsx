import {
  Box,
  Typography,
  Grid,
  Paper,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";

/* ===== DATA ===== */
const DESTINATIONS = [
  {
    city: "Hà Nội",
    image:
      "https://images.unsplash.com/photo-1509021436665-8f07dbf5bf1d",
  },
  {
    city: "TP. Hồ Chí Minh",
    image:
      "https://images.unsplash.com/photo-1583417319070-4a69db38a482",
  },
  {
    city: "Đà Nẵng",
    image:
      "https://images.unsplash.com/photo-1559599101-f09722fb4948",
  },
  {
    city: "Đà Lạt",
    image:
      "https://images.unsplash.com/photo-1506744038136-46273834b3fb",
  },
];

export default function TrendingDestinations() {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  const handleClick = (city) => {
    updateSearch({
      keyword: "",
      city,
      price: [0, 2_000_000],
      types: [],
      rating: null,
      amenities: [],
    });

    navigate(`/hotels?city=${encodeURIComponent(city)}`);
  };

  return (
    <Container maxWidth="xl" sx={{ mt: 8 }}>
      {/* HEADER */}
      <Box mb={4}>
        <Typography variant="h5" fontWeight={800}>
          Điểm đến nổi bật
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={0.5}>
          Những thành phố được yêu thích nhất
        </Typography>
      </Box>

      {/* GRID */}
      <Grid container spacing={3}>
        {DESTINATIONS.map((d) => (
          <Grid item xs={12} sm={6} md={3} key={d.city}>
            <Paper
              onClick={() => handleClick(d.city)}
              elevation={0}
              sx={{
                height: 220,
                borderRadius: 3,
                overflow: "hidden",
                cursor: "pointer",
                position: "relative",
                border: "1px solid rgba(0,0,0,0.06)",
                transition: "all .25s ease",
                "&:hover img": {
                  transform: "scale(1.06)",
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
                  transition: "transform .4s ease",
                }}
              />

              {/* OVERLAY */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(0,0,0,.55), rgba(0,0,0,.05))",
                }}
              />

              {/* TEXT */}
              <Typography
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  color: "#fff",
                  fontWeight: 800,
                  fontSize: 18,
                  letterSpacing: 0.3,
                }}
              >
                {d.city}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
