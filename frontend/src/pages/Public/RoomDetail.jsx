import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { 
  Container, Grid, Skeleton, Box, Alert, Fade, Breadcrumbs, Link, Typography 
} from "@mui/material";
import { NavigateNext } from "@mui/icons-material";
import { getRoomDetail } from "../../api/room.api";

// IMPORT ĐÚNG CÁC FILES BẠN ĐANG CÓ
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
    const fetchRoom = async () => {
      try {
        setLoading(true);
        const res = await getRoomDetail(id);
        setRoom(res.data?.data || res.data);
      } catch (err) {
        console.error("Lỗi:", err);
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchRoom();
    window.scrollTo(0, 0);
  }, [id]);

  if (loading) return <Container sx={{ py: 6 }}><Skeleton variant="rectangular" height={450} sx={{ borderRadius: 8 }} /></Container>;
  if (!room) return <Container sx={{ py: 10 }}><Alert severity="error">Không tìm thấy thông tin phòng.</Alert></Container>;

  return (
    <Box sx={{ bgcolor: "#FDFCFB", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ pt: 4, pb: 10 }}>
        {/* Breadcrumbs */}
        <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ mb: 3 }}>
          <Link underline="hover" color="inherit" href="/">Trang chủ</Link>
          <Typography color="primary" sx={{ fontWeight: 700 }}>Chi tiết phòng</Typography>
        </Breadcrumbs>

        {/* Gallery */}
        <Box sx={{ mb: 4 }}>
          <Suspense fallback={<Skeleton variant="rectangular" height={450} />}>
            <RoomGallery photos={room.photos || []} />
          </Suspense>
        </Box>

        <Grid container spacing={5}>
          <Grid item xs={12} md={8}>
            <Suspense fallback={<Skeleton height={100} />}><RoomHeaderSummary room={room} /></Suspense>
            <Box sx={{ my: 4, height: '1px', bgcolor: 'rgba(0,0,0,0.1)' }} />
            <Suspense fallback={<Skeleton height={150} />}><RoomDescription room={room} /></Suspense>
            <Box sx={{ my: 4, height: '1px', bgcolor: 'rgba(0,0,0,0.1)' }} />
            <Suspense fallback={<Skeleton height={150} />}><RoomAmenities amenities={room.amenities || []} /></Suspense>
          </Grid>

          <Grid item xs={12} md={4}>
            <Box sx={{ position: "sticky", top: 100 }}>
              <Suspense fallback={<Skeleton height={400} />}>
                <RoomBookingCard room={room} selectedDates={selectedDates} onDateChange={setSelectedDates} />
              </Suspense>
            </Box>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}