import { Container, Grid, Typography, Box, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import ImageCard from "./ImageCard";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const cap = (s = "") => s.charAt(0).toUpperCase() + s.slice(1);

export default function PropertiesByType({ properties = [] }) {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  const handleClick = (type) => {
    updateSearch({
      types: [type],
      city: "",
      rating: null,
      amenities: [],
    });

    navigate("/hotels");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Container maxWidth="xl" sx={{ mb: 12, mt: 6 }}>
      {/* HEADER */}
      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        mb={4}
      >
        <Box>
          <Typography variant="h5" fontWeight={800}>
            Tìm theo loại chỗ nghỉ
          </Typography>
          <Typography fontSize={14} color="text.secondary">
            Từ khách sạn hạng sang đến căn hộ ấm cúng
          </Typography>
        </Box>

        <Typography
  fontSize={13}
  sx={{
    mt: { xs: 1.5, sm: 0 },
    color: "primary.main",
    cursor: "pointer",
    display: "flex",
    alignItems: "center",
    gap: 0.5,
    fontWeight: 600,
    "&:hover": { textDecoration: "underline" },
  }}
  onClick={() => {
    updateSearch({
      city: "",
      types: [],
      rating: null,
      amenities: [],
      priceRange: null,
    });

    navigate("/hotels");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }}
>
  Xem tất cả <ArrowForwardIosIcon sx={{ fontSize: 14 }} />
</Typography>
      </Stack>

      {/* GRID */}
      <Grid container spacing={3}>
        {properties.map((p, idx) => (
          <Grid item xs={6} sm={4} md={3} lg={2.4} key={idx}>
            <Box
              onClick={() => handleClick(p.name)}
              sx={{
                position: "relative",
                height: 210,
                borderRadius: 2,
                overflow: "hidden",
                cursor: "pointer",
                boxShadow: "0 14px 35px rgba(0,0,0,0.12)",
                transition: "all .35s ease",
                "&:hover": {
                  transform: "translateY(-6px)",
                  boxShadow: "0 22px 55px rgba(0,0,0,0.18)",
                },
                "&:hover img": {
                  transform: "scale(1.12)",
                },
              }}
            >
              {/* IMAGE */}
              <img
                src={p.img}
                alt={p.name}
                style={{
                  width: "100%",
                  height: "100%",
                  objectFit: "cover",
                  transition: "transform .6s ease",
                }}
              />

              {/* OVERLAY */}
              <Box
                sx={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(180deg, rgba(0,0,0,0.05) 30%, rgba(0,0,0,0.75) 100%)",
                }}
              />

              {/* CONTENT */}
              <Box
                sx={{
                  position: "absolute",
                  bottom: 16,
                  left: 16,
                  right: 16,
                  color: "#fff",
                }}
              >
                <Typography fontWeight={800} fontSize={18}>
                  {cap(p.name)}
                </Typography>
                <Typography fontSize={13} sx={{ opacity: 0.9 }}>
                  {p.count} chỗ nghỉ
                </Typography>
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
