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
    const fetchRooms = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Gọi API getRoomsByHotel đã sửa ở Backend
        const res = await axios.get(`/rooms/hotel/${hotelId}`);
        
        console.log("Dữ liệu nhận được từ Backend:", res.data);

        // Đảm bảo lấy đúng mảng rooms từ response { hotel, rooms }
        const roomData = res.data.rooms || [];
        setRooms(roomData);
        setHotel(res.data.hotel);
        
      } catch (err) {
        console.error("Lỗi khi tải dữ liệu:", err);
        setError("Không thể tải danh sách phòng. Vui lòng thử lại sau.");
      } finally {
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchRooms();
    }
  }, [hotelId]);

  // 2. Logic lọc phòng (Đã sửa lỗi so sánh Case-sensitive và ép kiểu Số)
  const filteredRooms = useMemo(() => {
    if (!rooms.length) return [];

    return rooms.filter((room) => {
      // Ép kiểu về Number để tránh lỗi so sánh chuỗi/NaN
      const roomPrice = Number(room.price) || 0;
      const filterPrice = Number(filter?.price) || 10000000;
      const matchesPrice = roomPrice <= filterPrice;

      // So sánh loại phòng (Case-insensitive)
      const roomType = room.type?.toLowerCase();
      const filterType = filter?.type?.toLowerCase() || "all";
      const matchesType = filterType === "all" || roomType === filterType;

      // So sánh số lượng khách
      const roomMaxPeople = Number(room.maxPeople) || 0;
      const filterMaxPeople = Number(filter?.maxPeople) || 1;
      const matchesPeople = roomMaxPeople >= filterMaxPeople;

      // Lọc theo tiện nghi
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
      <Typography sx={{ mt: 2, color: 'text.secondary' }}>Đang tìm kiếm phòng tốt nhất cho bạn...</Typography>
    </Box>
  );

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8F9FA" }}>
      
      {/* SECTION 1: BREADCRUMBS */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #eee", py: 1.5 }}>
        <Container>
          <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: "0.85rem" }}>
            <Link component={RouterLink} to="/" color="inherit" underline="hover">Trang chủ</Link>
            <Link component={RouterLink} to="/hotels" color="inherit" underline="hover">Khách sạn</Link>
            <Typography color="text.primary" sx={{ fontWeight: 600 }}>
              {hotel?.name || "Khách sạn"}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* SECTION 2: HOTEL HEADER */}
      <Box sx={{ bgcolor: "#fff", pt: 4, pb: 4, mb: 4, boxShadow: "0 2px 10px rgba(0,0,0,0.03)" }}>
        <Container>
          <Grid container spacing={3} alignItems="center">
            <Grid item xs={12} md={8}>
              <Typography 
                variant="h3" 
                sx={{ 
                  fontFamily: "'Playfair Display', serif", 
                  fontWeight: 800, 
                  color: "#1A1A1A", 
                  mb: 1,
                  fontSize: { xs: '2rem', md: '3rem' }
                }}
              >
                {hotel?.name}
              </Typography>
              <Stack direction="row" spacing={1} alignItems="center">
                <LocationOnIcon sx={{ color: "primary.main", fontSize: "1.2rem" }} />
                <Typography variant="body1" color="text.secondary">
                  {hotel?.address || hotel?.city}
                </Typography>
              </Stack>
            </Grid>
            <Grid item xs={12} md={4} sx={{ textAlign: { md: "right" } }}>
              <Chip 
                icon={<VerifiedUserIcon />} 
                label="Thanh toán an toàn qua SePay" 
                color="success" 
                variant="outlined" 
                sx={{ fontWeight: 700, px: 1 }} 
              />
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* SECTION 3: MAIN CONTENT */}
      <Container sx={{ pb: 10 }}>
        {error ? (
          <Alert severity="error" sx={{ borderRadius: 2 }}>{error}</Alert>
        ) : (
          <Grid container spacing={4}>
            
            {/* CỘT TRÁI: BỘ LỌC */}
            <Grid item xs={12} lg={3.5}>
              <RoomFilter />
            </Grid>

            {/* CỘT PHẢI: DANH SÁCH PHÒNG */}
            <Grid item xs={12} lg={8.5}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" sx={{ fontWeight: 700 }}>
                  Phòng sẵn có ({filteredRooms.length})
                </Typography>
                
                {(filter.type !== "all" || filter.amenities.length > 0 || filter.price < 10000000) && (
                  <Typography 
                    variant="body2" 
                    color="primary" 
                    sx={{ cursor: 'pointer', fontWeight: 600, "&:hover": { textDecoration: 'underline' } }}
                    onClick={handleResetFilter}
                  >
                    Xóa tất cả bộ lọc
                  </Typography>
                )}
              </Stack>
              
              {filteredRooms.length > 0 ? (
                <RoomList 
                  rooms={filteredRooms} 
                  hotel={hotel} 
                />
              ) : (
                <Paper sx={{ p: 5, textAlign: 'center', borderRadius: 3 }}>
                  <Typography variant="h6" color="text.secondary" gutterBottom>
                    Không tìm thấy phòng phù hợp
                  </Typography>
                  <Typography variant="body2" color="text.disabled" mb={3}>
                    Bạn hãy thử thay đổi tiêu chí lọc hoặc ngày đặt phòng xem sao nhé!
                  </Typography>
                  <Button variant="outlined" onClick={handleResetFilter}>Xem lại tất cả phòng</Button>
                </Paper>
              )}
            </Grid>
          </Grid>
        )}
      </Container>
    </Box>
  );
}