import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { 
  Container, Grid, Divider, Skeleton, Box, Fade, Stack , Typography
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
    <Box sx={{ mt: 4 }}>
      {/* Gallery Skeleton */}
      <Skeleton variant="rectangular" height={500} sx={{ borderRadius: "32px", mb: 6 }} />
      <Grid container spacing={6}>
        <Grid item xs={12} md={8}>
          <Skeleton variant="text" width="60%" height={60} sx={{ mb: 2 }} />
          <Skeleton variant="text" width="30%" height={30} sx={{ mb: 4 }} />
          <Divider sx={{ mb: 4 }} />
          <Skeleton variant="rectangular" height={300} sx={{ borderRadius: "20px" }} />
        </Grid>
        <Grid item xs={12} md={4}>
          <Skeleton variant="rectangular" height={500} sx={{ borderRadius: "32px" }} />
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
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [id]);

  return (
    <Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", pb: 12 }}>
      {/* 1. Full-width Gallery bọc trong Container lớn hơn để ảnh trông cinematic */}
      <Container maxWidth="xl" sx={{ pt: 2 }}>
        {!hotel ? (
          <LoadingSkeleton />
        ) : (
          <Fade in={true} timeout={800}>
            <Box>
              <Suspense fallback={<Skeleton variant="rectangular" height={550} sx={{ borderRadius: "32px" }} />}>
                <HotelGallery photos={hotel.photos || []} />
              </Suspense>

              {/* 2. Nội dung chính - Thu hẹp về Container lg để dễ đọc */}
              <Container maxWidth="lg" sx={{ px: { xs: 2, md: 0 } }}>
                <Box sx={{ mt: 6 }}>
                  <Suspense fallback={<Skeleton height={100} />}>
                    <HotelHeaderSummary hotel={hotel} />
                  </Suspense>
                </Box>

                <Divider sx={{ my: 6, opacity: 0.6 }} />

                <Grid container spacing={8}>
                  {/* Left Side: Information */}
                  <Grid item xs={12} md={7.5}>
                    <Stack spacing={8}>
                      <Suspense fallback={<Skeleton height={200} />}>
                        <HotelDescription hotel={hotel} />
                      </Suspense>

                      <Suspense fallback={<Skeleton height={250} />}>
                        <HotelAmenities amenities={hotel.amenities || []} />
                      </Suspense>

                      <Divider />

                      <Suspense fallback={<Skeleton height={400} />}>
                        <ReviewsSection
                          rating={hotel.rating}
                          reviews={hotel.reviews}
                        />
                      </Suspense>

                      <Divider />

                      <Box>
                         <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 3 }}>
                            Vị trí điểm đến
                         </Typography>
                         <Suspense fallback={<Skeleton variant="rectangular" height={450} sx={{ borderRadius: "24px" }} />}>
                            <HotelMap hotel={hotel} />
                         </Suspense>
                      </Box>
                    </Stack>
                  </Grid>

                  {/* Right Side: Sticky Booking Card */}
                  <Grid item xs={12} md={4.5}>
                    <Box sx={{ position: "sticky", top: 120, mb: 4 }}>
                      <Suspense fallback={<Skeleton variant="rectangular" height={500} sx={{ borderRadius: "32px" }} />}>
                        {/* Lưu ý: Card này nên có Shadow đậm và Border mảnh mờ */}
                        <RightSideBar hotel={hotel} />
                      </Suspense>
                    </Box>
                  </Grid>
                </Grid>
              </Container>
            </Box>
          </Fade>
        )}
      </Container>
    </Box>
  );
}