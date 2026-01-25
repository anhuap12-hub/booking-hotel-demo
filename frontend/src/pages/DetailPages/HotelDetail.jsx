import { useEffect, useState, lazy, Suspense, useCallback, useRef } from "react";
import { useParams } from "react-router-dom";
import { 
  Container, Grid, Divider, Skeleton, Box, Fade, Stack, Typography
} from "@mui/material";
import { getHotelById } from "../../api/hotel.api";

// Lazy components giữ nguyên...
const HotelGallery = lazy(() => import("../../components/Hotel/HotelGallery"));
const HotelHeaderSummary = lazy(() => import("../../components/Hotel/HotelHeaderSummary"));
const HotelDescription = lazy(() => import("../../components/Hotel/HotelDescription"));
const HotelAmenities = lazy(() => import("../../components/Hotel/HotelAmenities"));
const ReviewsSection = lazy(() => import("../../components/Hotel/ReviewsSection"));
const HotelMap = lazy(() => import("../../components/Hotel/HotelMap"));
const RightSideBar = lazy(() => import("../../components/Hotel/RightSideBar"));

const LoadingSkeleton = () => (
    <Box sx={{ mt: 4 }}>
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
  const isInitialMount = useRef(true); // Dùng ref để kiểm soát lần mount đầu tiên

  // 1. Dùng useCallback để bọc hàm fetch, giúp truyền xuống ReviewsSection ổn định
  const fetchHotelData = useCallback(async () => {
    if (!id) return;
    try {
      const res = await getHotelById(id);
      if (res.data?.data) {
        setHotel(res.data.data);
      }
    } catch (err) {
      console.error("❌ Get hotel failed:", err);
    }
  }, [id]);

  // 2. useEffect để thực thi fetching và scrolling
  useEffect(() => {
    // Tách việc gọi hàm vào một scope async để tránh lỗi "synchronous setState"
    const initData = async () => {
      await fetchHotelData();
      
      // Chỉ scroll smooth ở lần load đầu tiên của ID này
      if (isInitialMount.current) {
        window.scrollTo({ top: 0, behavior: "smooth" });
        isInitialMount.current = false;
      }
    };

    initData();

    // Cleanup khi ID thay đổi (reset ref)
    return () => {
      isInitialMount.current = true;
    };
  }, [id, fetchHotelData]); // Dependency rõ ràng

  return (
    <Box sx={{ bgcolor: "#FFFFFF", minHeight: "100vh", pb: 12 }}>
      <Container maxWidth="xl" sx={{ pt: 2 }}>
        {!hotel ? (
          <LoadingSkeleton />
        ) : (
          <Fade in={true} timeout={800}>
            <Box>
              <Suspense fallback={<Skeleton variant="rectangular" height={550} sx={{ borderRadius: "32px" }} />}>
                <HotelGallery photos={hotel.photos || []} />
              </Suspense>

              <Container maxWidth="lg" sx={{ px: { xs: 2, md: 0 } }}>
                <Box sx={{ mt: 6 }}>
                  <Suspense fallback={<Skeleton height={100} />}>
                    <HotelHeaderSummary hotel={hotel} />
                  </Suspense>
                </Box>

                <Divider sx={{ my: 6, opacity: 0.6 }} />

                <Grid container spacing={8}>
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
                          hotelId={hotel._id}
                          onReviewSuccess={fetchHotelData} 
                        />
                      </Suspense>

                      <Divider />

                      <Box>
                         <Typography variant="h5" sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, mb: 1 }}>
                            Vị trí điểm đến
                         </Typography>
                         <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                            {hotel.address}
                         </Typography>
                         <Suspense fallback={<Skeleton variant="rectangular" height={450} sx={{ borderRadius: "24px" }} />}>
                            <HotelMap 
                              location={hotel.location} 
                              address={hotel.address} 
                              hotelName={hotel.name}
                            />
                         </Suspense>
                      </Box>
                    </Stack>
                  </Grid>

                  <Grid item xs={12} md={4.5}>
                    <Box sx={{ position: "sticky", top: 100 }}>
                      <Suspense fallback={<Skeleton variant="rectangular" height={500} sx={{ borderRadius: "32px" }} />}>
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