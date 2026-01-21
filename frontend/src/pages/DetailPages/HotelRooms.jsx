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
  const { filter, setFilter } = useFilter(); // Lấy filter và hàm setFilter từ context
  
  const [rooms, setRooms] = useState([]);
  const [hotel, setHotel] = useState(null);
  const [loading, setLoading] = useState(true);

  // 1. Lấy dữ liệu từ API
  useEffect(() => {
    const fetchRooms = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/rooms/hotel/${hotelId}`);
        setRooms(res.data.rooms || []);
        setHotel(res.data.hotel);
      } catch (error) {
        console.error("Lỗi khi tải dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchRooms();
  }, [hotelId]);

  // 2. Logic lọc phòng đồng bộ với Schema Room
  const filteredRooms = useMemo(() => {
    return rooms.filter((room) => {
      // Lọc theo giá (tối đa)
      const matchesPrice = room.price <= filter.price;

      // Lọc theo loại phòng (Single, Double, Suite...)
      const matchesType = filter.type === "all" || room.type === filter.type;

      // Lọc theo số lượng khách (Số khách tối đa của phòng phải >= yêu cầu)
      const matchesPeople = room.maxPeople >= (filter.maxPeople || 1);

      // Lọc theo tiện nghi (Phòng phải chứa tất cả các tiện nghi đã chọn)
      const matchesAmenities = filter.amenities.every((a) =>
        room.amenities?.map(item => item.toLowerCase()).includes(a.toLowerCase())
      );

      return matchesPrice && matchesType && matchesPeople && matchesAmenities;
    });
  }, [rooms, filter]);

  // Hàm Reset bộ lọc
  const handleResetFilter = () => {
    setFilter({
      price: 10000000,
      type: "all",
      amenities: [],
      maxPeople: 1
    });
  };

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "#F8F9FA" }}>
      
      {/* SECTION 1: BREADCRUMBS */}
      <Box sx={{ bgcolor: "#fff", borderBottom: "1px solid #eee", py: 1.5 }}>
        <Container>
          <Breadcrumbs separator={<NavigateNextIcon sx={{ fontSize: 14 }} />} sx={{ fontSize: "0.85rem" }}>
            <Link component={RouterLink} to="/" color="inherit" underline="hover">Trang chủ</Link>
            <Link component={RouterLink} to="/hotels" color="inherit" underline="hover">Khách sạn</Link>
            <Typography color="text.primary" sx={{ fontWeight: 600 }}>
              {hotel?.name || "Đang tải..."}
            </Typography>
          </Breadcrumbs>
        </Container>
      </Box>

      {/* SECTION 2: HOTEL HEADER (Tên & Địa chỉ) */}
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
                  mb: 1 
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
        <Grid container spacing={4}>
          
          {/* CỘT TRÁI: BỘ LỌC (STAY STICKY) */}
          <Grid item xs={12} lg={3.5}>
            <RoomFilter />
          </Grid>

          {/* CỘT PHẢI: DANH SÁCH PHÒNG (Sử dụng RoomList) */}
          <Grid item xs={12} lg={8.5}>
            <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
              <Typography variant="h5" sx={{ fontWeight: 700 }}>
                Phòng sẵn có ({filteredRooms.length})
              </Typography>
              
              {/* Chỉ hiện nút xóa khi có thay đổi filter */}
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
            
            {loading ? (
              <Box sx={{ display: 'flex', justifyContent: 'center', py: 10 }}>
                <CircularProgress size={40} />
              </Box>
            ) : (
              <RoomList 
                rooms={filteredRooms} 
                hotel={hotel} 
              />
            )}
          </Grid>

        </Grid>
      </Container>
    </Box>
  );
}