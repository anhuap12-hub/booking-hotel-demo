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
  Paper,
  Avatar,
  Stack,
  Chip,
  Container
} from "@mui/material";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import { getRecommendations } from "../../api/recommend.api.js";

export default function Recommendation() {
  const [hotels, setHotels] = useState([]);
  const [aiIntro, setAiIntro] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getRecommendations();
        setHotels(res.data.data || []);
        setAiIntro(res.data.intro || "");
      } catch (err) {
        const status = err.response?.status;
        if (status === 401) {
          setError("Vui lòng đăng nhập để nhận gợi ý cá nhân hóa.");
        } else if (status === 403) {
          setError("Tài khoản của bạn cần xác thực email để sử dụng tính năng này.");
        } else {
          setError("Hiện tại không thể tải gợi ý. Vui lòng thử lại sau.");
        }
        console.error("Lỗi fetch recommendation:", err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) return (
    <Box textAlign="center" py={10}><CircularProgress sx={{ color: "#C2A56D" }} /></Box>
  );

  if (error || hotels.length === 0) return null;

  return (
    <Container maxWidth="lg" sx={{ py: 8 }}>
      {/* KHỐI AI ADVISOR */}
      <Paper 
        elevation={0} 
        sx={{ 
          p: 4, mb: 6, 
          background: "linear-gradient(135deg, #1C1B19 0%, #2D2C2A 100%)",
          color: "#fff", borderRadius: 4, position: "relative",
          overflow: "hidden", border: "1px solid rgba(194, 165, 109, 0.3)"
        }}
      >
        <Box sx={{ position: "absolute", right: -20, bottom: -20, opacity: 0.1 }}>
          <SmartToyIcon sx={{ fontSize: 150, color: "#C2A56D" }} />
        </Box>

        <Stack direction={{ xs: "column", sm: "row" }} spacing={3} alignItems="center">
          <Avatar sx={{ bgcolor: "#C2A56D", width: 70, height: 70, boxShadow: "0 0 20px rgba(194, 165, 109, 0.5)" }}>
            <SmartToyIcon sx={{ fontSize: 40 }} />
          </Avatar>
          <Box>
            <Typography variant="h6" fontWeight={700} sx={{ color: "#C2A56D", mb: 1 }}>
              Coffee Stay AI Advisor
            </Typography>
            <Typography variant="body1" sx={{ fontStyle: "italic", lineHeight: 1.8, opacity: 0.9 }}>
              "{aiIntro || "Dựa trên sở thích của bạn, tôi đã chọn lọc những không gian tuyệt vời nhất."}"
            </Typography>
          </Box>
        </Stack>
      </Paper>

      <Typography variant="h4" fontWeight={800} mb={4} sx={{ color: "#1C1B19" }}>
        Đề xuất cho kỳ nghỉ của bạn
      </Typography>

      <Grid container spacing={4}>
        {hotels.map((hotel) => (
          <Grid item xs={12} sm={6} md={4} key={hotel._id}>
            <Card
              sx={{
                borderRadius: 4,
                boxShadow: "0 10px 40px rgba(0,0,0,0.06)",
                transition: "all 0.3s ease",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                "&:hover": { transform: "translateY(-10px)", boxShadow: "0 20px 50px rgba(0,0,0,0.12)" }
              }}
            >
              <Box sx={{ position: "relative", pt: "66.67%", overflow: "hidden" }}> 
                {/* Dùng tỉ lệ 3:2 (padding-top: 66.67%) để cố định khung ảnh */}
                <CardMedia
                  component="img"
                  image={hotel.photos?.[0]?.url || "https://via.placeholder.com/400x300"}
                  alt={hotel.name}
                  sx={{ 
                    position: "absolute", 
                    top: 0, left: 0, width: "100%", height: "100%",
                    objectFit: "cover" 
                  }}
                />
                <Chip 
                  icon={<StarIcon sx={{ fontSize: "14px !important", color: "#C2A56D !important" }} />}
                  label={hotel.rating || "5.0"}
                  sx={{ 
                    position: "absolute", top: 15, right: 15, 
                    bgcolor: "#fff", fontWeight: 700, color: "#1C1B19" 
                  }} 
                />
              </Box>

              <CardContent sx={{ flexGrow: 1, p: 3, display: 'flex', flexDirection: 'column' }}>
                <Stack direction="row" alignItems="center" spacing={0.5} mb={1}>
                  <LocationOnIcon sx={{ fontSize: 16, color: "#C2A56D" }} />
                  <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase' }}>
                    {hotel.city}
                  </Typography>
                </Stack>

                <Typography 
                  variant="h6" 
                  fontWeight={700} 
                  mb={2} 
                  sx={{ 
                    color: "#1C1B19",
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                    height: '3.2rem', // Cố định chiều cao 2 dòng chữ
                    lineHeight: '1.6rem'
                  }}
                >
                  {hotel.name}
                </Typography>

                <Box sx={{ mt: 'auto' }}> {/* Đẩy phần giá xuống dưới cùng */}
                  <Stack direction="row" justifyContent="space-between" alignItems="flex-end">
                    <Box>
                      <Typography variant="caption" color="text.secondary" display="block" sx={{ fontWeight: 600 }}>GIÁ TỪ</Typography>
                      <Typography variant="h6" fontWeight={800} color="#C2A56D">
                        {hotel.cheapestPrice?.toLocaleString()} <small style={{ fontSize: 12 }}>VND</small>
                      </Typography>
                    </Box>
                    <Button
                      variant="contained"
                      href={`/hotels/${hotel._id}`}
                      sx={{ 
                        bgcolor: "#1C1B19", borderRadius: "10px", 
                        px: 2, textTransform: "none", fontWeight: 600,
                        "&:hover": { bgcolor: "#C2A56D" } 
                      }}
                    >
                      Chi tiết
                    </Button>
                  </Stack>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}