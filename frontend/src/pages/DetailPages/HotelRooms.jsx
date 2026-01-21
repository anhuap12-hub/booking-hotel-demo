import {
  Box,
  Container,
  Typography,
  Stack,
  Grid,
  Breadcrumbs,
  Link,
  Chip,
  CircularProgress,
  Alert,
  Paper,
  Button, // Thêm Button bị thiếu
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

  // 1. Lấy dữ liệu từ API
  useEffect(() => {
    let isMounted = true; // Phòng tránh setState trên component đã unmount
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await axios.get(`/rooms/hotel/${hotelId}`);
        
        if (isMounted) {
          const roomData = res.data.rooms || [];
          setRooms(roomData);
          setHotel(res.data.hotel);
        }
      } catch (err) {
        if (isMounted) {
          console.error("Lỗi khi tải dữ liệu:", err);
          setError("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    if (hotelId) {
      fetchRooms();
    }
    return () => { isMounted = false; };
  }, [hotelId]);

  // 2. Logic lọc phòng
  const filteredRooms = useMemo(() => {
    if (!rooms.length) return [];

    return rooms.filter((room) => {
      const roomPrice = Number(room.price) || 0;
      const filterPrice = Number(filter?.price) || 10000000;
      const matchesPrice = roomPrice <= filterPrice;

      const roomType = room.type?.toLowerCase();
      const filterType = filter?.type?.toLowerCase() || "all";
      const matchesType = filterType === "all" || roomType === filterType;

      const roomMaxPeople = Number(room.maxPeople) || 0;
      const filterMaxPeople = Number(filter?.maxPeople) || 1;
      const matchesPeople = roomMaxPeople >= filterMaxPeople;

      const roomAmenities = room.amenities?.map(a => a.toLowerCase()) || [];
      const filterAmenities = filter?.amenities || [];
      const matchesAmenities = filterAmenities.every((a) =>
        roomAmenities.includes(a.toLowerCase())
      );

      return matchesPrice && matchesType && matchesPeople && matchesAmenities;
    });
  }, [rooms, filter]);

  const handleResetFilter = () => {
    setFilter({
      price: 10000000,
      type: "all",
      amenities: [],
      maxPeople: 1
    });
  };

  if (loading) return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', py: 20 }}>
      <CircularProgress size={50} thickness={4} />
      <Typography sx={{ mt: 2, color: 'text.secondary' }}>Đang tìm kiếm phòng...</Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8F9FA" }}>
      
      {/* SECTION 1: BREADCRUMBS */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #eee", py: 1.5 }}>
        <Container maxWidth="lg">
          <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: "0.85rem" }}>
            <Link component={RouterLink} to="/" color="inherit" underline="hover">Trang chủ</Link>
            <Link component={RouterLink} to="/hotels" color="inherit" underline="hover">Khách sạn</Link>
            <Typography color="text.primary" sx={{ fontWeight: 600 }}>
              {hotel?.name || "Chi tiết"}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* SECTION 2: HOTEL HEADER */}
      <Box sx={{ bgcolor: "#fff", pt: 4, pb: 4, mb: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <Container maxWidth="lg">
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontWeight: 800, 
                  color: "#1A1A1A", 
                  mb: 1,
                  fontSize: { xs: '1.8rem', md: '2.5rem' }
                }}
              >
                {hotel?.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon sx={{ color: "primary.main", fontSize: "1.2rem" }} />
                <Typography variant="body1" color="text.secondary">
                  {hotel?.address}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
              <Chip 
                icon={<VerifiedUserIcon />} 
                label="Thanh toán an toàn" 
                color="success" 
                variant="outlined" 
                sx={{ fontWeight: 700 }} 
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SECTION 3: MAIN CONTENT - Đây là nơi chia cột */}
      <Container maxWidth="lg" sx={{ pb: 10 }}>
        {error ? (
          <Alert severity="error">{error}</Alert>
        ) : (
          <Grid container spacing={4}>
            
            {/* CỘT TRÁI (Sticky Filter) */}
            <Grid item xs={12} md={4} lg={3.5}>
              <Box sx={{ position: { md: 'sticky' }, top: 20 }}>
                <RoomFilter />
              </Box>
            </Grid>

            {/* CỘT PHẢI (Room List) */}
            <Grid item xs={12} md={8} lg={8.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Phòng sẵn có ({filteredRooms.length})
                </Typography>
                
                {(filter.type !== "all" || filter.amenities.length > 0 || filter.price < 10000000) && (
                  <Button 
                    size="small"
                    onClick={handleResetFilter}
                    sx={{ fontWeight: 600 }}
                  >
                    Xóa tất cả bộ lọc
                  </Button>
                )}
              </Stack>
              
              {filteredRooms.length > 0 ? (
                <RoomList rooms={filteredRooms} hotel={hotel} />
              ) : (
                <Paper sx={{ p: 8, textAlign: 'center', borderRadius: 4, border: '2px dashed #eee' }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Không tìm thấy phòng phù hợp
                  </Typography>
                  <Typography variant="body2" color="text.disabled" mb={3}>
                    Vui lòng thay đổi bộ lọc hoặc chọn ngày khác.
                  </Typography>
                  <Button variant="contained" onClick={handleResetFilter}>
                    Reset bộ lọc
                  </Button>
                </Paper>
              )}
            </Grid>

          </Grid>
        )}
      </Container>
    </Box>
  );
}