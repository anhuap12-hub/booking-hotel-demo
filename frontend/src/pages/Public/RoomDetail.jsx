import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { 
  Container, 
  Grid, 
  Divider, 
  Skeleton, 
  Box, 
  Alert, 
  Fade, 
  Typography, 
  Breadcrumbs, 
  Link 
} from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { getRoomDetail } from "../../api/room.api";

/* ===== LAZY COMPONENTS (GIỮ NGUYÊN) ===== */
const RoomGallery = lazy(() => import("../../components/Room/RoomGallery"));
const RoomHeaderSummary = lazy(() => import("../../components/Room/RoomHeaderSummary"));
const RoomDescription = lazy(() => import("../../components/Room/RoomDescription"));
const RoomAmenities = lazy(() => import("../../components/Room/RoomAmenities"));
const RoomBookingCard = lazy(() => import("../../components/Room/RoomBookingCard"));

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  const [selectedDates, setSelectedDates] = useState({
    checkIn: new Date().toISOString().split('T')[0], 
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], 
  });

  useEffect(() => {
    if (!id) return;
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await getRoomDetail(id);
        const roomData = res.data?.data || res.data;
        setRoom(roomData);
      } catch (err) {
        console.error("❌ Get room failed:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
    window.scrollTo(0, 0); // Đảm bảo cuộn lên đầu trang khi vào chi tiết
  }, [id]);

  const handleDateChange = (newDates) => {
    setSelectedDates(newDates);
  };

  /* ================= LOADING STATE ================= */
  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        <Skeleton variant="text" width="40%" height={30} sx={{ mb: 2 }} />
        <Skeleton variant="rectangular" height={450} sx={{ borderRadius: "24px", mb: 4 }} />
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Skeleton height={60} width="80%" />
            <Skeleton height={200} sx={{ mt: 2 }} />
          </Grid>
          <Grid item xs={12} md={4}>
            <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "24px" }} />
          </Grid>
        </Grid>
      </Container>
    );
  }

  /* ================= ERROR STATE ================= */
  if (!room) {
    return (
      <Container sx={{ py: 10 }}>
        <Alert severity="error" sx={{ borderRadius: "12px", fontFamily: "inherit" }}>
          Rất tiếc, Ebony & Gold không tìm thấy thông tin phòng này.
        </Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#FDFDFD", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 10 }}>
        
        {/* 1. BREADCRUMBS - Dẫn hướng tinh tế */}
        <Breadcrumbs 
          separator={<NavigateNext fontSize="small" />} 
          sx={{ mb: 3, "& .MuiTypography-root": { fontSize: "0.85rem", fontWeight: 500 } }}
        >
          <Link underline="hover" color="inherit" href="/" sx={{ color: "#72716E" }}>Trang chủ</Link>
          <Link underline="hover" color="inherit" href="/hotels" sx={{ color: "#72716E" }}>Khách sạn</Link>
          <Typography color="primary.main" sx={{ fontWeight: 700 }}>Chi tiết phòng</Typography>
        </Breadcrumbs>

        {/* 2. GALLERY SECTION - Trình diễn hình ảnh */}
        <Box sx={{ mb: 4 }}>
          <Suspense fallback={<Skeleton variant="rectangular" height={450} sx={{ borderRadius: "24px" }} />}>
            <RoomGallery photos={room.photos || []} />
          </Suspense>
        </Box>

        <Grid container spacing={5}>
          {/* 3. LEFT CONTENT: THÔNG TIN CHI TIẾT */}
          <Grid item xs={12} md={8}>
            <Fade in timeout={800}>
              <Box>
                <Suspense fallback={<Skeleton height={100} />}>
                  <RoomHeaderSummary room={room} />
                </Suspense>

                <Divider sx={{ my: 4, borderColor: "rgba(194, 165, 109, 0.2)" }} />

                {/* Mô tả phòng */}
                <Box sx={{ mb: 5 }}>
                  <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, mb: 2, color: "#1C1B19" }}>
                    Về không gian này
                  </Typography>
                  <Suspense fallback={<Skeleton height={140} />}>
                    <RoomDescription room={room} />
                  </Suspense>
                </Box>

                <Divider sx={{ my: 4, borderColor: "rgba(194, 165, 109, 0.1)" }} />

                {/* Tiện nghi */}
                <Box>
                  <Typography variant="h6" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 800, mb: 3, color: "#1C1B19" }}>
                    Tiện ích thượng lưu
                  </Typography>
                  <Suspense fallback={<Skeleton height={160} />}>
                    <RoomAmenities amenities={room.amenities || []} />
                  </Suspense>
                </Box>
              </Box>
            </Fade>
          </Grid>

          {/* 4. RIGHT CONTENT: CARD ĐẶT PHÒNG (STICKY) */}
          <Grid item xs={12} md={4}>
            <Box sx={{ position: "sticky", top: 100 }}>
              <Suspense fallback={<Skeleton height={450} sx={{ borderRadius: "24px" }} />}>
                <Box sx={{ 
                  boxShadow: "0 20px 50px rgba(28, 27, 25, 0.08)", 
                  borderRadius: "24px",
                  border: "1px solid rgba(194, 165, 109, 0.15)",
                  overflow: "hidden"
                }}>
                  <RoomBookingCard 
                    room={room} 
                    selectedDates={selectedDates} 
                    onDateChange={handleDateChange} 
                  />
                </Box>
              </Suspense>

              {/* Thông tin hỗ trợ nhanh */}
              <Box sx={{ mt: 3, p: 2, textAlign: "center", bgcolor: "rgba(194, 165, 109, 0.05)", borderRadius: "16px" }}>
                <Typography variant="caption" sx={{ color: "#72716E", fontWeight: 500 }}>
                  Đảm bảo giá tốt nhất khi đặt trực tiếp tại Ebony & Gold.
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>

      </Container>
    </Box>
  );
}