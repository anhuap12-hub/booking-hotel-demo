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
  Fade,
} from "@mui/material";
import { useEffect, useState, useMemo } from "react";
import { useParams, Link as RouterLink } from "react-router-dom";
import axios from "../../api/axios";

// Components & Context
import RoomList from "../../components/Room/RoomList";
import RoomFilter from "../../components/Room/RoomFilter";
import { useFilter } from "../../context/FilterContext";

// Icons
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";
import VerifiedUserOutlinedIcon from "@mui/icons-material/VerifiedUserOutlined";
import FilterListIcon from '@mui/icons-material/FilterList';

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
        console.log("Đang gọi API rooms cho ID:", hotelId);
        const res = await axios.get(`/rooms/hotel/${hotelId}`);
        
        if (mounted) {
          const roomsData = res.data.data || []; 
          console.log("Dữ liệu Rooms nhận được:", roomsData);
          setRooms(roomsData);

          if (roomsData.length > 0 && typeof roomsData[0].hotel === 'object' && roomsData[0].hotel !== null) {
            setHotel(roomsData[0].hotel);
          } else {
            // Gọi API lấy hotel riêng nếu phòng không chứa dữ liệu hotel
            const hotelRes = await axios.get(`/hotels/${hotelId}`); 
            console.log("Toàn bộ cấu trúc response từ API /hotels/:id :", hotelRes.data);
            
            if (hotelRes.data && hotelRes.data.data) {
                setHotel(hotelRes.data.data);
            } else if (hotelRes.data && hotelRes.data.name) {
                setHotel(hotelRes.data);
            }
          }
        }
      } catch (err) {
        console.error("Lỗi khi fetch dữ liệu:", err);
        if (mounted) setError("Không thể tải thông tin khách sạn");
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    if (hotelId) fetchRooms();
    return () => (mounted = false);
  }, [hotelId]);
  // Logic lọc giữ nguyên như bạn đã viết
  const filteredRooms = useMemo(() => {
    if (!rooms.length) return [];
    const maxPrice = Number.isFinite(Number(filter?.price)) ? Number(filter.price) : 10000000;
    const type = filter?.type || "all";
    const maxPeople = Number(filter?.maxPeople) || 1;
    const amenities = filter?.amenities || [];

    return rooms.filter(room => {
      if (Number(room.price) > maxPrice) return false;
      if (type !== "all" && room.type?.toLowerCase() !== type.toLowerCase()) return false;
      if (Number(room.maxPeople) < maxPeople) return false;
      if (amenities.length && !amenities.every(a => 
          room.amenities?.map(x => x.toLowerCase()).includes(a.toLowerCase()))) return false;
      return true;
    });
  }, [rooms, filter]);

  const resetFilter = () => setFilter({ price: 10000000, type: "all", amenities: [], maxPeople: 1 });

  if (loading) return (
    <Box py={20} textAlign="center" bgcolor="#F9F8F6" minHeight="100vh">
      <CircularProgress sx={{ color: '#C2A56D' }} />
      <Typography mt={2} color="#72716E" fontWeight={500}>Đang chuẩn bị không gian cho bạn...</Typography>
    </Box>
  );

  return (
    <Box bgcolor="#F9F8F6" minHeight="100vh">
     
      {/* HEADER SECTION - Elegant Typography */}
      <Box bgcolor="#FFFFFF" py={6} borderBottom="1px solid #E0E7ED">
      <Container maxWidth="lg">
        <Stack direction={{ xs: "column", md: "row" }} justifyContent="space-between" alignItems={{ md: "center" }} spacing={3}>
          <Box>
            <Typography variant="h3" sx={{ 
              color: "#000000", // Xanh đậm chủ đạo
              fontWeight: 800, 
              fontFamily: "'Playfair Display', serif",
              mb: 1,
              fontSize: { xs: "1.8rem", md: "2rem" },
            }}>
              {hotel?.name || "Đang tải thông tin..."}
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <LocationOnOutlinedIcon sx={{ color: "#0056b3", fontSize: 20 }} />
              <Typography sx={{ color: "#667085", fontWeight: 500 }}>
                {hotel?.address || "Địa chỉ chưa cập nhật"}
              </Typography>
            </Stack>
          </Box>
          <Chip
            icon={<VerifiedUserOutlinedIcon style={{ color: '#0056b3' }} />}
            label="Booking Tối Ưu & Bảo Mật"
            sx={{ 
              borderRadius: '8px', 
              bgcolor: '#eef6ff', 
              color: '#0056b3',
              fontWeight: 700,
              border: '1px solid #cce0ff',
              py: 2.5, px: 1
            }}
          />
        </Stack>
      </Container>
    </Box>

      {/* MAIN CONTENT */}
      <Container maxWidth="lg" sx={{ py: 6 }}>
        {error ? (
          <Alert severity="error" sx={{ borderRadius: '12px' }}>{error}</Alert>
        ) : (
          <Box display="flex" gap={{ md: 6 }} flexDirection={{ xs: 'column', md: 'row' }} alignItems="flex-start">
            
            {/* SIDEBAR FILTER - Sticky & Styled */}
            <Box width={{ xs: '100%', md: 320 }}>
          <Paper elevation={0} sx={{ border: '1px solid #E0E7ED', borderRadius: '16px', overflow: 'hidden' }}>
            <Box sx={{ p: 2.5, bgcolor: '#0056b3', color: '#FFFFFF', display: 'flex', alignItems: 'center', gap: 1.5 }}>
              <FilterListIcon fontSize="small" />
              <Typography fontWeight={700}>Bộ lọc tìm kiếm</Typography>
            </Box>
            <Box sx={{ p: 1, bgcolor: '#FFFFFF' }}>
              <RoomFilter />
            </Box>
          </Paper>
        </Box>

            {/* LIST AREA */}
            <Box flex={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h5" sx={{ fontWeight: 800, color: "#003580", fontFamily: "'Playfair Display', serif" }}>
              Phòng sẵn có 
              <span style={{ color: '#0056b3', fontSize: '1.2rem', marginLeft: '8px' }}>
                ({filteredRooms.length})
              </span>
            </Typography>
            
            {(filter.type !== "all" || filter.amenities.length > 0 || filter.price < 10000000) && (
              <Button 
                onClick={resetFilter}
                sx={{ color: '#0056b3', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#eef6ff' } }}
              >
                Xóa tất cả bộ lọc
              </Button>
            )}
          </Stack>

              <Fade in={true} timeout={1000}>
                <Box>
                  {filteredRooms.length ? (
                    <RoomList rooms={filteredRooms} hotel={hotel} />
                  ) : (
                    <Paper sx={{ 
                      p: 8, 
                      textAlign: "center", 
                      borderRadius: '24px', 
                      border: '1px dashed rgba(194, 165, 109, 0.4)',
                      bgcolor: 'transparent'
                    }}>
                      <Typography variant="h6" color="#1C1B19" fontWeight={700} gutterBottom>
                        Không tìm thấy phòng phù hợp
                      </Typography>
                      <Typography color="#A8A7A1" mb={3}>
                        Hãy thử thay đổi bộ lọc để tìm kiếm các lựa chọn khác.
                      </Typography>
                      <Button 
                        onClick={resetFilter} 
                        variant="contained"
                        sx={{ bgcolor: '#1C1B19', color: '#C2A56D', fontWeight: 700, borderRadius: '12px', px: 4, py: 1.5 }}
                      >
                        Reset bộ lọc
                      </Button>
                    </Paper>
                  )}
                </Box>
              </Fade>
            </Box>

          </Box>
        )}
      </Container>
    </Box>
  );
}