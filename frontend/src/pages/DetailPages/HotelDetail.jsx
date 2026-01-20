import { useEffect, useState, lazy, Suspense } from "react";
import { useParams } from "react-router-dom";
import { Container, Grid, Divider, Skeleton } from "@mui/material";
import { getHotelById } from "../../api/hotel.api";

const HotelGallery = lazy(() => import("../../components/Hotel/HotelGallery"));
const HotelHeaderSummary = lazy(() =>
  import("../../components/Hotel/HotelHeaderSummary")
);
const HotelDescription = lazy(() =>
 import("../../components/Hotel/HotelDescription")
);
const HotelAmenities = lazy(() =>
  import("../../components/Hotel/HotelAmenities")
);
const ReviewsSection = lazy(() =>
  import("../../components/Hotel/ReviewsSection")
);
const HotelMap = lazy(() =>
  import("../../components/Hotel/HotelMap")
);
const RightSideBar = lazy(() =>
  import("../../components/Hotel/RightSideBar")
);

export default function HotelDetail() {
  const { id } = useParams();
  const [hotel, setHotel] = useState(null);

  useEffect(() => {
    if (!id) return;

    const fetchHotel = async () => {
      try {
        const res = await getHotelById(id);

        // ✅ FIX GỐC Ở ĐÂY
        const hotelData = res.data?.data;

        console.log(" HOTEL RAW:", res.data);
        console.log(" HOTEL DATA:", hotelData);
        console.log(" HOTEL ID:", hotelData?._id);

        setHotel(hotelData);
      } catch (err) {
        console.error("❌ Get hotel failed:", err);
      }
    };

    fetchHotel();
  }, [id]);

  return (
    <Container maxWidth="lg" sx={{ mt: 2, mb: 6 }}>
      {!hotel ? (
        <>
          <Skeleton variant="rectangular" height={380} />
          <Skeleton height={36} sx={{ mt: 2 }} />
          <Skeleton height={24} width="60%" />
        </>
      ) : (
        <>
          <Suspense fallback={<Skeleton variant="rectangular" height={380} />}>
            <HotelGallery photos={hotel.photos || []} />
          </Suspense>

          <Suspense fallback={<Skeleton height={48} />}>
            <HotelHeaderSummary hotel={hotel} />
          </Suspense>

          <Divider sx={{ my: 4 }} />

          <Grid container spacing={4}>
            <Grid item xs={12} md={8}>
              <Suspense fallback={<Skeleton height={140} />}>
                <HotelDescription hotel={hotel} />
              </Suspense>

              <Divider sx={{ my: 4 }} />

              <Suspense fallback={<Skeleton height={160} />}>
                <HotelAmenities amenities={hotel.amenities || []} />
              </Suspense>

              <Divider sx={{ my: 4 }} />

              <Suspense fallback={<Skeleton height={120} />}>
                <ReviewsSection
                  rating={hotel.rating}
                  reviews={hotel.reviews}
                />
              </Suspense>

              <Divider sx={{ my: 4 }} />

              <Suspense fallback={<Skeleton height={320} />}>
                <HotelMap hotel={hotel} />
              </Suspense>
            </Grid>

            <Grid item xs={12} md={4}>
              <Suspense fallback={<Skeleton height={420} />}>
                <RightSideBar hotel={hotel} />
              </Suspense>
            </Grid>
          </Grid>
        </>
      )}
    </Container>
  );
}
