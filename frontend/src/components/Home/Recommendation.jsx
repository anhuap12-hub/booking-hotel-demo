import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Card,
  CardMedia,
  CardContent,
  Button,
  CircularProgress,
} from "@mui/material";
import { getRecommendations } from "../../api/recommend.api.js"; 

export default function Recommendation() {
  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRecommendations();
        setHotels(res.data.data || []);
      } catch (err) {
        if (err.response?.status === 401) {
          setError("Bạn chưa đăng nhập. Vui lòng đăng nhập để xem gợi ý.");
        } else if (err.response?.status === 403) {
          setError("Vui lòng xác thực email trước khi tiếp tục.");
        } else {
          setError("Có lỗi xảy ra khi tải gợi ý.");
        }
        console.error("Recommendation error:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <Box textAlign="center" py={3}>
        <CircularProgress />
        <Typography variant="body2" mt={1}>
          Đang tải gợi ý...
        </Typography>
      </Box>
    );
  }

  if (error) {
    return (
      <Typography textAlign="center" py={3} color="error">
        {error}
      </Typography>
    );
  }

  if (hotels.length === 0) {
    return (
      <Typography textAlign="center" py={3}>
        Chưa có gợi ý nào.
      </Typography>
    );
  }

  return (
    <Box sx={{ mt: 5 }}>
      <Typography
        variant="h5"
        fontWeight={700}
        mb={3}
        sx={{ textAlign: "center", color: "#1C1B19" }}
      >
        Khách sạn gợi ý cho bạn
      </Typography>
      <Grid container spacing={3}>
        {hotels.map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel._id}>
            <Card
              sx={{
                borderRadius: 3,
                boxShadow: "0 6px 20px rgba(0,0,0,0.1)",
                transition: "transform 0.2s",
                "&:hover": { transform: "translateY(-5px)" },
              }}
            >
              <CardMedia
                component="img"
                height="180"
                image={
                  hotel.photos?.[0]?.url || "https://via.placeholder.com/300"
                }
                alt={hotel.name}
              />
              <CardContent>
                <Typography variant="subtitle1" fontWeight={600}>
                  {hotel.name}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {hotel.city} • ⭐ {hotel.rating}
                </Typography>
                <Typography variant="body2" color="primary" fontWeight={700}>
                  Giá từ {hotel.cheapestPrice} VND
                </Typography>
                <Button
                  size="small"
                  sx={{ mt: 1 }}
                  href={`/hotels/${hotel._id}`}
                  variant="outlined"
                >
                  Xem chi tiết
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
