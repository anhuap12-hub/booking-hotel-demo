import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Divider, Skeleton, Box, Alert } from "@mui/material";
import { getRoomDetail } from "../../api/room.api";

/* ===== LAZY COMPONENTS ===== */
const RoomGallery = lazy(() => import("../../components/Room/RoomGallery"));
const RoomHeaderSummary = lazy(() => import("../../components/Room/RoomHeaderSummary"));
const RoomDescription = lazy(() => import("../../components/Room/RoomDescription"));
const RoomAmenities = lazy(() => import("../../components/Room/RoomAmenities"));
const RoomBookingCard = lazy(() => import("../../components/Room/RoomBookingCard"));

export default function RoomDetail() {
  const { id } = useParams();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. QUẢN LÝ NGÀY ĐẶT PHÒNG
  const [selectedDates, setSelectedDates] = useState({
    checkIn: new Date().toISOString().split('T')[0], 
    checkOut: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split('T')[0], 
  });

  useEffect(() => {
    if (!id) return;
    const fetchRoom = async () => {
      try {
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
  }, [id]);

  // Hàm xử lý khi người dùng đổi ngày (Để giải quyết lỗi ESLint)
  const handleDateChange = (newDates) => {
    setSelectedDates(newDates);
  };

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {/* FIX: borderRadius phải nằm trong sx */}
        <Skeleton variant="rectangular" height={380} sx={{ borderRadius: 4 }} />
        <Skeleton height={48} sx={{ mt: 2 }} />
        <Skeleton height={24} width="60%" />
      </Container>
    );
  }

  if (!room) {
    return (
      <Container sx={{ py: 6 }}>
        <Alert severity="error">Không tìm thấy thông tin phòng</Alert>
      </Container>
    );
  }

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <Container maxWidth="lg" sx={{ pt: 3, pb: 8 }}>
        <Suspense fallback={<Skeleton variant="rectangular" height={380} sx={{ borderRadius: 4 }} />}>
          <RoomGallery photos={room.photos || []} />
        </Suspense>

        <Suspense fallback={<Skeleton height={64} />}>
          <RoomHeaderSummary room={room} />
        </Suspense>

        <Divider sx={{ my: 4 }} />

        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            <Suspense fallback={<Skeleton height={140} />}>
              <RoomDescription room={room} />
            </Suspense>
            <Divider sx={{ my: 4 }} />
            <Suspense fallback={<Skeleton height={160} />}>
              <RoomAmenities amenities={room.amenities || []} />
            </Suspense>
          </Grid>

          <Grid item xs={12} md={4}>
            <Suspense fallback={<Skeleton height={420} sx={{ borderRadius: 3 }} />}>
              <RoomBookingCard 
                room={room} 
                selectedDates={selectedDates} 
                // Truyền hàm này xuống để RoomBookingCard có thể cập nhật ngày nếu cần
                onDateChange={handleDateChange} 
              />
            </Suspense>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}