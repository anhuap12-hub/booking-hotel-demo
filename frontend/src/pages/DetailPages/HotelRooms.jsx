import {
  Box,
  Container,
  Typography,
  Stack,
  Breadcrumbs,
  Link,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Button,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "../../api/axios";

// Components
import RoomList from "../../components/Room/RoomList";
import RoomFilter from "../../components/Room/RoomFilter";

// Context & Icons
import { useFilter } from "../../context/FilterContext";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";

export default function HotelRoom() {
  const { hotelId } = useParams();
  const { filter, setFilter } = useFilter();

  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/rooms/hotel/${hotelId}`);
        if (mounted) {
          setRooms(res.data.rooms || []);
          setHotel(res.data.hotel);
        }
      } catch (err) {
        if (mounted) setError("Không thể tải danh sách phòng",err);
      } finally {
        if (mounted) setLoading(false);
      }
    };
    if (hotelId) fetchRooms();
    return () => (mounted = false);
  }, [hotelId]);

  const filteredRooms = useMemo(() => {
  if (!rooms.length) return [];

  const maxPrice = Number.isFinite(Number(filter?.price))
    ? Number(filter.price)
    : 10000000;

  const type = filter?.type || "all";
  const maxPeople = Number(filter?.maxPeople) || 1;
  const amenities = filter?.amenities || [];

  return rooms.filter(room => {
    if (Number(room.price) > maxPrice) return false;

    if (
      type !== "all" &&
      room.type?.toLowerCase() !== type.toLowerCase()
    ) return false;

    if (Number(room.maxPeople) < maxPeople) return false;

    if (
      amenities.length &&
      !amenities.every(a =>
        room.amenities?.map(x => x.toLowerCase()).includes(a.toLowerCase())
      )
    ) return false;

    return true;
  });
}, [rooms, filter]);

  const resetFilter = () =>
    setFilter({
      price: 10000000,
      type: "all",
      amenities: [],
      maxPeople: 1,
    });

  if (loading)
    return (
      <Box py={20} textAlign="center">
        <CircularProgress />
        <Typography mt={2}>Đang tải phòng...</Typography>
      </Box>
    );

  return (
    <Box bgcolor="#F8F9FA" minHeight="100vh">
      {/* BREADCRUMB */}
      <Box bgcolor="#fff" borderBottom="1px solid #eee" py={1.5}>
        <Container maxWidth="lg">
          <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
            <Link component={RouterLink} to="/">Trang chủ</Link>
            <Link component={RouterLink} to="/hotels">Khách sạn</Link>
            <Typography fontWeight={600}>{hotel?.name}</Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* HEADER */}
      <Box bgcolor="#fff" py={4} mb={4}>
        <Container maxWidth="lg">
          <Stack
            direction={{ xs: "column", md: "row" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h4" fontWeight={800}>
                {hotel?.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon color="primary" fontSize="small" />
                <Typography color="text.secondary">
                  {hotel?.address}
                </Typography>
              </Stack>
            </Box>
            <Chip
              icon={<VerifiedUserIcon />}
              label="Thanh toán an toàn"
              color="success"
              variant="outlined"
            />
          </Stack>
        </Container>
      </Box>

      {/* MAIN LAYOUT */}
      <Container maxWidth="lg">
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Box display="flex" gap={4} alignItems="flex-start">
            {/* FILTER */}
            <Box
              width={320}
              flexShrink={0}
              sx={{ position: "sticky", top: 20 }}
            >
              <RoomFilter />
            </Box>

            {/* ROOM LIST */}
            <Box flex={1}>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mb={3}
              >
                <Typography variant="h5" fontWeight={700}>
                  Phòng sẵn có ({filteredRooms.length})
                </Typography>
                {(filter.type !== "all" ||
                  filter.amenities.length > 0 ||
                  filter.price < 10000000) && (
                  <Button size="small" onClick={resetFilter}>
                    Xóa tất cả bộ lọc
                  </Button>
                )}
              </Stack>

              {filteredRooms.length ? (
                <RoomList rooms={filteredRooms} hotel={hotel} />
              ) : (
                <Paper sx={{ p: 6, textAlign: "center" }}>
                  <Typography>Không có phòng phù hợp</Typography>
                  <Button sx={{ mt: 2 }} onClick={resetFilter} variant="contained">
                    Reset bộ lọc
                  </Button>
                </Paper>
              )}
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}
