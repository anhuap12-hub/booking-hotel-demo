import { useEffect, useState, useMemo } from "react";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Stack,
  Button,
  Container,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { LocationOn, Star } from "@mui/icons-material";

import HeroBanner from "../../components/Home/HeroBanner";
import FilterSidebar from "../../components/Common/FilterSidebar";
import WhyBook from "../../components/Home/WhyBook";
import { getAllHotels } from "../../api/hotel.api";
import { useSearch } from "../../context/SearchContext";
import { normalizeText } from "../../utils/normalizeText";

/* ================= QUOTES ================= */
const QUOTES = [
  {
    text: "“Du lịch không phải là điểm đến, mà là hành trình.”",
    author: "— Coffee Stay",
  },
  {
    text: "“Nghỉ ngơi đúng cách là đầu tư cho tương lai.”",
    author: "— Travel Notes",
  },
];

/* ================= HOTEL ROW ================= */
const HotelRow = ({ hotel }) => {
  const navigate = useNavigate();

  const price = useMemo(() => {
    if (!hotel.rooms?.length) return null;
    return hotel.rooms
      .map((r) => ({
        orig: r.price,
        curr: r.price * (1 - (r.discount || 0) / 100),
        disc: r.discount || 0,
      }))
      .sort((a, b) => a.curr - b.curr)[0];
  }, [hotel.rooms]);

  return (
    <Paper
      sx={{
        p: 3,
        mb: 3,
        borderRadius: 1,
        display: "flex",
        gap: 3,
        border: "1px solid #eee",
        flexDirection: { xs: "column", md: "row" },
        transition: "all .25s",
        "&:hover": {
          boxShadow: "0 15px 35px rgba(0,0,0,0.06)",
          transform: "translateY(-4px)",
        },
      }}
    >
      <Box
        sx={{
          width: { xs: "100%", md: 260 },
          height: 180,
          borderRadius: 1,
          overflow: "hidden",
        }}
      >
        <img
          src={hotel.photos?.[0]?.url || "https://via.placeholder.com/400x300"}
          alt={hotel.name}
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
      </Box>

      <Box flex={1} display="flex" flexDirection="column">
        <Typography fontWeight={800} variant="h6">
          {hotel.name}
        </Typography>

        <Stack direction="row" spacing={2} mt={0.5} mb={1}>
          <Stack direction="row" spacing={0.5} alignItems="center">
            <Star sx={{ fontSize: 16, color: "#ffb400" }} />
            <Typography fontWeight={700}>{hotel.rating}/10</Typography>
          </Stack>
          <Typography color="text.secondary">
            <LocationOn sx={{ fontSize: 16, verticalAlign: "middle" }} />{" "}
            {hotel.city}
          </Typography>
        </Stack>

        <Typography
  color="text.secondary"
  mb={2}
  sx={{
    display: "-webkit-box",
    WebkitLineClamp: 2,        // 👈 số dòng muốn hiển thị (2 hoặc 3)
    WebkitBoxOrient: "vertical",
    overflow: "hidden",
    textOverflow: "ellipsis",
    lineHeight: 1.5,
  }}
>
  {hotel.desc}
</Typography>

        <Box mt="auto" display="flex" justifyContent="space-between">
          <Box>
            {price?.disc > 0 && (
              <Typography
                variant="caption"
                sx={{ textDecoration: "line-through" }}
              >
                {price.orig.toLocaleString()}đ
              </Typography>
            )}
            <Typography fontWeight={800} variant="h6">
              {price?.curr.toLocaleString()}đ
              <small style={{ color: "#999", fontWeight: 400 }}>/đêm</small>
            </Typography>
          </Box>

          <Button
            variant="contained"
            onClick={() => navigate(`/hotels/${hotel._id}`)}
            sx={{ borderRadius: 2.5, fontWeight: 700 }}
          >
           Xem Thông Tin
          </Button>
        </Box>
      </Box>
    </Paper>
  );
};

/* ================= MAIN ================= */
export default function HotelList() {
  const { search } = useSearch(); // 👈 LẤY TỪ CONTEXT

  const [hotels, setHotels] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    minPrice: search.minPrice ?? 0,
    maxPrice: search.maxPrice ?? 2000000,
    city: search.city ?? "",
    types: search.types ?? [],
    rating: search.rating ?? null,
    amenities: search.amenities ?? [],
    onlyDiscount: false,
  });

  /* ================= FETCH ================= */
  useEffect(() => {
    setLoading(true);
    getAllHotels()
      .then((res) => setHotels(res.data?.data || []))
      .finally(() => setLoading(false));
  }, []);

  /* ================= FILTER LOGIC ================= */
const filteredHotels = useMemo(() => {
  const keyword = normalizeText(search.keyword || "");
  const citySearch = normalizeText(filters.city || "");

  return hotels.filter((h) => {
    const hotelName = normalizeText(h.name);
    const hotelCity = normalizeText(h.city);
    const hotelDesc = normalizeText(h.desc || "");

    const prices =
      h.rooms?.map(
        (r) => r.price * (1 - (r.discount || 0) / 100)
      ) || [];
    const minRoomPrice = prices.length ? Math.min(...prices) : 0;

    const matchKeyword =
      !keyword ||
      hotelName.includes(keyword) ||
      hotelCity.includes(keyword) ||
      hotelDesc.includes(keyword);

    const matchCity =
      !citySearch || hotelCity.includes(citySearch);

    const matchPrice =
      minRoomPrice >= filters.minPrice &&
      minRoomPrice <= filters.maxPrice;

    const matchType =
      !filters.types.length || filters.types.includes(h.type);

    const matchRating =
      !filters.rating || h.rating >= filters.rating;

    const matchAmenities =
      !filters.amenities.length ||
      filters.amenities.every((a) => h.amenities?.includes(a));

    const matchDiscount = filters.onlyDiscount
      ? h.rooms?.some((r) => r.discount > 0)
      : true;

    return (
      matchKeyword &&
      matchCity &&
      matchPrice &&
      matchType &&
      matchRating &&
      matchAmenities &&
      matchDiscount
    );
  });
}, [hotels, filters, search.keyword]);
  const cities = useMemo(
    () => [...new Set(hotels.map((h) => h.city).filter(Boolean))],
    [hotels]
  );

  const amenities = useMemo(
    () => [...new Set(hotels.flatMap((h) => h.amenities || []))],
    [hotels]
  );

  return (
    <Box bgcolor="#faf9f8">
      <HeroBanner />

      <Container maxWidth="xl" sx={{ mt: 6 }}>
        <Typography variant="h4" fontWeight={800} mb={4}>
          Tìm thấy {filteredHotels.length} khách sạn
          {search.keyword && (
            <>
              {" "}
              theo{" "}
              <span style={{ color: "#d4a373" }}>
                “{search.keyword}”
              </span>
            </>
          )}
        </Typography>

        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", lg: "280px 1fr 300px" },
            gap: 4,
          }}
        >
          {/* LEFT FILTER */}
          <Paper sx={{ p: 3, borderRadius: 4 }}>
            <FilterSidebar
              filters={filters}
              setFilters={setFilters}
              cities={cities}
              amenities={amenities}
              showPrice={true}
            />
          </Paper>

          {/* HOTEL LIST */}
          <Box>
            {loading ? (
              <Stack alignItems="center" py={10}>
                <CircularProgress />
              </Stack>
            ) : filteredHotels.length ? (
              filteredHotels.map((h) => (
                <HotelRow key={h._id} hotel={h} />
              ))
            ) : (
              <Paper sx={{ p: 6, textAlign: "center" }}>
                <Typography color="text.secondary">
                  Không tìm thấy khách sạn phù hợp.
                </Typography>
                <Button
                  sx={{ mt: 2 }}
                  onClick={() =>
                    setFilters({
                      minPrice: 0,
                      maxPrice: 2000000,
                      city: "",
                      types: [],
                      rating: null,
                      amenities: [],
                      onlyDiscount: false,
                    })
                  }
                >
                  Xóa bộ lọc
                </Button>
              </Paper>
            )}
          </Box>
          {/* RIGHT QUOTES */}
<Stack spacing={4}>
  {QUOTES.map((q, i) => (
    <Paper
      key={i}
      sx={{
        p: 3.5,
        borderRadius: 2,
        position: "relative",
        background:
          "linear-gradient(135deg, #ffffff 0%, #f7f3ee 100%)",
        border: "1px solid rgba(139,111,78,0.25)",
        boxShadow: "0 18px 40px rgba(0,0,0,0.08)",
        transition: "all .25s ease",
        "&:hover": {
          transform: "translateY(-6px)",
          boxShadow: "0 28px 60px rgba(0,0,0,0.12)",
        },
      }}
    >
      {/* Quote mark */}
      <Typography
        sx={{
          position: "absolute",
          top: -18,
          left: 20,
          fontSize: 60,
          fontFamily: "Playfair Display, serif",
          color: "rgba(139,111,78,0.25)",
          lineHeight: 1,
          pointerEvents: "none",
        }}
      >
        “
      </Typography>

      <Typography
        sx={{
          fontFamily: "Playfair Display, serif",
          fontSize: 16,
          fontWeight: 500,
          lineHeight: 1.6,
          color: "text.primary",
          mb: 2,
        }}
      >
        {q.text}
      </Typography>

      <Typography
        sx={{
          fontSize: 13,
          fontWeight: 600,
          color: "primary.main",
        }}
      >
        {q.author}
      </Typography>
    </Paper>
  ))}
</Stack>

        </Box>

        <Box mt={10}>
          <WhyBook />
        </Box>
      </Container>
    </Box>
  );
}
