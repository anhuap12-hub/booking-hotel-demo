import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { 
  Container, Grid, Divider, Skeleton, Box, Fade 
} from "@mui/material";
import { getHotelById } from "../../api/hotel.api";

// Lazy components
const HotelGallery = lazy(() => import("../../components/Hotel/HotelGallery"));
const HotelHeaderSummary = lazy(() => import("../../components/Hotel/HotelHeaderSummary"));
const HotelDescription = lazy(() => import("../../components/Hotel/HotelDescription"));
const HotelAmenities = lazy(() => import("../../components/Hotel/HotelAmenities"));
const ReviewsSection = lazy(() => import("../../components/Hotel/ReviewsSection"));
const HotelMap = lazy(() => import("../../components/Hotel/HotelMap"));
const RightSideBar = lazy(() => import("../../components/Hotel/RightSideBar"));

const LoadingSkeleton = () => (
    <Box sx={{ mt: 2 }}>
      <Skeleton variant="rectangular" height={450} sx={{ borderRadius: "24px", mb: 4 }} />
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Skeleton variant="text" width="40%" height={40} />
          <Skeleton variant="text" width="80%" height={24} />
          <Skeleton variant="rectangular" height={200} sx={{ mt: 4, borderRadius: "16px" }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={400} sx={{ borderRadius: "24px" }} />
        </Grid>
      </Grid>
    </Box>
  );
export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    if (!id) return;
    const fetchHotel = async () => {
      try {
        const res = await getHotelById(id);
        setHotel(res.data?.data);
      } catch (err) {
        console.error("❌ Get hotel failed:", err);
      }
    };
    fetchHotel();
    // Scroll lên đầu trang khi vào chi tiết
    window.scrollTo(0, 0);
  }, [id]);

  // Component hiển thị khung xương khi đang tải
  

  return (
    <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh", pb: 10 }}>
      <Container maxWidth="lg" sx={{ pt: 4 }}>
        {!hotel ? (
          <LoadingSkeleton />
        ) : (
          <Fade in={true} timeout={1000}>
            <Box>
              {/* 1. Gallery Section - Chiếm trọn bề ngang giai đoạn đầu */}
              <Suspense fallback={<Skeleton variant="rectangular" height={450} sx={{ borderRadius: "24px" }} />}>
                <HotelGallery photos={hotel.photos || []} />
              </Suspense>

              {/* 2. Header Summary */}
              <Box sx={{ mt: 4, mb: 2 }}>
                <Suspense fallback={<Skeleton height={80} />}>
                  <HotelHeaderSummary hotel={hotel} />
                </Suspense>
              </Box>

              <Divider sx={{ my: 4, borderColor: "rgba(194, 165, 109, 0.15)" }} />

              {/* 3. Main Content Area */}
              <Grid container spacing={5}>
                {/* Left Side: Information */}
                <Grid item xs={12} md={8}>
                  <Stack spacing={5}>
                    <Suspense fallback={<Skeleton height={150} />}>
                      <HotelDescription hotel={hotel} />
                    </Suspense>

                    <Divider sx={{ borderColor: "rgba(194, 165, 109, 0.1)" }} />

                    <Suspense fallback={<Skeleton height={200} />}>
                      <HotelAmenities amenities={hotel.amenities || []} />
                    </Suspense>

                    <Divider sx={{ borderColor: "rgba(194, 165, 109, 0.1)" }} />

                    <Suspense fallback={<Skeleton height={300} />}>
                      <ReviewsSection
                        rating={hotel.rating}
                        reviews={hotel.reviews}
                      />
                    </Suspense>

                    <Divider sx={{ borderColor: "rgba(194, 165, 109, 0.1)" }} />

                    <Suspense fallback={<Skeleton variant="rectangular" height={400} sx={{ borderRadius: "24px" }} />}>
                      <HotelMap hotel={hotel} />
                    </Suspense>
                  </Stack>
                </Grid>

                {/* Right Side: Sticky Booking Bar */}
                <Grid item xs={12} md={4}>
                  <Box sx={{ position: "sticky", top: 100 }}>
                    <Suspense fallback={<Skeleton variant="rectangular" height={450} sx={{ borderRadius: "24px" }} />}>
                      <RightSideBar hotel={hotel} />
                    </Suspense>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}