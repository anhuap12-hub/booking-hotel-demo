import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { 
  Box, 
  Container, 
  Typography, 
  Stack, 
  Grid, 
  CircularProgress, 
  Button, 
  Divider, 
  Breadcrumbs, 
  Link,
  Alert 
} from "@mui/material"; // Soát lỗi: Đã thêm Typography và các component thiếu vào đây
import { NavigateNext, LocationOn, Star, ArrowBack } from "@mui/icons-material";

import { getHotelDetail } from "../../api/hotel.api";
import RoomListSection from "../../components/Hotel/RoomListSection";
import HotelImages from "../../components/Hotel/HotelImages";
import WhyBook from "../../components/Home/WhyBook";

export default function HotelDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getHotelDetail(id);
        
        // Kiểm tra dữ liệu trả về để tránh lỗi 404 hoặc dữ liệu rỗng
        if (res.data?.data) {
          setHotel(res.data.data);
        } else {
          setError("Không tìm thấy thông tin khách sạn.");
        }
      } catch (err) {
        console.error("Fetch hotel detail error:", err);
        setError("Đã có lỗi xảy ra khi tải dữ liệu. Vui lòng thử lại.");
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchDetail();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) {
    return (
      <Stack alignItems="center" justifyContent="center" sx={{ minHeight: "60vh" }}>
        <CircularProgress sx={{ color: "#C2A56D" }} />
      </Stack>
    );
  }

  // Xử lý lỗi 404 hoặc lỗi API để không bị văng app
  if (error || !hotel) {
    return (
      <Container sx={{ py: 10 }}>
        <Alert severity="warning" action={
          <Button color="inherit" size="small" onClick={() => navigate("/hotels")}>
            Quay lại danh sách
          </Button>
        }>
          {error || "Khách sạn không tồn tại."}
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#FDFCFB", minHeight: "100vh" }}>
      <Container maxWidth="xl" sx={{ pt: 3, pb: 10 }}>
        
        {/* 1. Breadcrumbs */}
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="/" sx={{ fontSize: '0.9rem' }}>Trang chủ</Link>
          <Link underline="hover" color="inherit" href="/hotels" sx={{ fontSize: '0.9rem' }}>Khách sạn</Link>
          <Typography color="text.primary" sx={{ fontWeight: 700, fontSize: '0.9rem' }}>{hotel.name}</Typography>
        </Breadcrumbs>

        {/* 2. Header Summary */}
        <Box sx={{ mb: 4 }}>
          <Typography variant="h3" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 900, mb: 1.5 }}>
            {hotel.name}
          </Typography>
          <Stack direction="row" spacing={3} alignItems="center">
            <Stack direction="row" spacing={0.5} alignItems="center">
              <Star sx={{ color: "#C2A56D", fontSize: 20 }} />
              <Typography fontWeight={700}>{hotel.rating || 5.0}</Typography>
            </Stack>
            <Typography sx={{ display: 'flex', alignItems: 'center', color: "#72716E" }}>
              <LocationOn sx={{ fontSize: 18, mr: 0.5 }} /> {hotel.city}
            </Typography>
          </Stack>
        </Box>

        {/* 3. Gallery */}
        <Box sx={{ mb: 6 }}>
          <HotelImages photos={hotel.photos || []} />
        </Box>

        <Grid container spacing={6}>
          {/* Cột trái: Thông tin */}
          <Grid item xs={12} md={8}>
            <Box>
              <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, mb: 2 }}>
                Giới thiệu về Coffee Stay {hotel.name}
              </Typography>
              <Typography sx={{ color: "#4A4947", lineHeight: 1.8, whiteSpace: 'pre-line' }}>
                {hotel.desc}
              </Typography>

              <Divider sx={{ my: 6 }} />

              {/* Danh sách phòng */}
              <Box>
                <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, mb: 4 }}>
                  Các hạng phòng thượng lưu
                </Typography>
                <RoomListSection hotelId={id} rooms={hotel.rooms || []} />
              </Box>
            </Box>
          </Grid>

          {/* Cột phải: Thông tin thêm/Tiện ích */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: 'sticky', top: 100 }}>
              <Box sx={{ p: 4, bgcolor: "#1C1B19", color: "#fff", borderRadius: "24px" }}>
                <Typography variant="h6" sx={{ color: "#C2A56D", mb: 2, fontWeight: 800 }}>
                  Thông tin Coffee Stay
                </Typography>
                <Typography variant="body2" sx={{ mb: 3, opacity: 0.8 }}>
                  Nhận phòng sớm và trả phòng muộn tùy theo tình trạng phòng trống khi đặt trực tiếp tại hệ thống Coffee Stay.
                </Typography>
                <Button 
                  fullWidth 
                  variant="contained" 
                  sx={{ bgcolor: "#C2A56D", color: "#1C1B19", fontWeight: 800 }}
                  onClick={() => window.scrollTo({ top: 800, behavior: 'smooth' })}
                >
                  Chọn phòng ngay
                </Button>
              </Box>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ mt: 10 }}>
          <WhyBook />
        </Box>
      </Container>
    </Box>
  );
}