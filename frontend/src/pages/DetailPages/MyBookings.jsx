import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import Navbar from "../../components/Layout/Navbar";
import BookingCard from "../../components/Booking/BookingCard";

// Import trực tiếp từng component để tối ưu
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import Chip from "@mui/material/Chip";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import Button from "@mui/material/Button";
import Paper from "@mui/material/Paper";
import Avatar from "@mui/material/Avatar";
import Fade from "@mui/material/Fade";

import { 
  HotelOutlined, PersonOutlined, PhoneOutlined, Close, 
  MeetingRoomOutlined, CalendarMonthOutlined, ConfirmationNumberOutlined
} from "@mui/icons-material";

// ĐỒNG BỘ: Schema màu Ebony & Gold cho trạng thái
const STATUS_CONFIG = {
  all: { label: "Tất cả", color: "#1C1B19", bg: "#F9F8F6" },
  pending: { label: "Chờ thanh toán", color: "#C2A56D", bg: "rgba(194, 165, 109, 0.1)" },
  confirmed: { label: "Thành công", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  cancelled: { label: "Đã hủy", color: "#A8A7A1", bg: "#F1F1F1" },
};

// Sửa lỗi: Truyền Icon trực tiếp vào component
const InfoRow = ({ label, value }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Avatar sx={{ bgcolor: '#F9F8F6', width: 42, height: 42, borderRadius: "12px", border: '1px solid rgba(194, 165, 109, 0.2)' }}>
      <IconComponent sx={{ fontSize: 20, color: '#C2A56D' }} />
    </Avatar>
    <Box>
      <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color: "#1C1B19" }}>{value || "—"}</Typography>
    </Box>
  </Stack>
);

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        setLoading(true);
        const res = await instance.get("/bookings/my");
        const data = res.data.bookings || res.data || [];
        setBookings(Array.isArray(data) ? data : []);
      } catch (err) {
        setBookings([]), err;
      } finally {
        setLoading(false);
      }
    };
    fetchBookings();
  }, []);

  const filteredBookings = useMemo(() => {
    if (tab === "all") return bookings;
    return bookings.filter(b => b.status?.toLowerCase() === tab.toLowerCase());
  }, [bookings, tab]);

  return (
    <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: { xs: 12, md: 15 }, pb: 10 }}>
        {/* HEADER */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={6}>
          <Box>
            <Typography variant="h3" sx={{ 
              color: "#1C1B19", 
              fontWeight: 800, 
              fontFamily: "'Playfair Display', serif",
              letterSpacing: "-0.5px" 
            }}>
              Kỳ nghỉ của tôi
            </Typography>
            <Typography variant="body2" sx={{ color: "#72716E", mt: 1 }}>Quản lý các đặc quyền lưu trú và lịch trình đặt phòng</Typography>
          </Box>
          <Chip 
            label={`${bookings.length} Booking`} 
            sx={{ 
              fontWeight: 700, 
              bgcolor: "#1C1B19", 
              color: "#C2A56D",
              borderRadius: "8px",
              px: 1
            }} 
          />
        </Stack>

        {/* CUSTOM TABS */}
        <Paper elevation={0} sx={{ borderRadius: "16px", p: 0.5, bgcolor: "rgba(28, 27, 25, 0.04)", mb: 5 }}>
          <Tabs 
            value={tab} 
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                borderRadius: "12px", minHeight: 44, fontWeight: 700, textTransform: "none",
                color: "#72716E", transition: "0.3s",
                '&.Mui-selected': { 
                    bgcolor: "white", 
                    color: "#C2A56D", 
                    boxShadow: "0 4px 20px rgba(0,0,0,0.08)" 
                }
              }
            }}
          >
            {Object.keys(STATUS_CONFIG).map((key) => (
              <Tab key={key} label={STATUS_CONFIG[key].label} value={key} />
            ))}
          </Tabs>
        </Paper>

        {/* LISTING AREA */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 10 }}>
            <CircularProgress sx={{ color: '#C2A56D' }} thickness={4} size={40} />
          </Box>
        ) : filteredBookings.length === 0 ? (
          <Paper sx={{ 
            textAlign: "center", py: 12, borderRadius: "24px", 
            bgcolor: "transparent", border: "2px dashed rgba(194, 165, 109, 0.3)" 
          }}>
            <HotelOutlined sx={{ fontSize: 60, color: "rgba(194, 165, 109, 0.4)", mb: 2 }} />
            <Typography variant="h6" sx={{ color: "#1C1B19", fontWeight: 700 }}>Bạn chưa có chuyến đi nào</Typography>
            <Typography variant="body2" sx={{ color: "#A8A7A1", mb: 3 }}>Bắt đầu khám phá những không gian nghỉ dưỡng thượng lưu ngay hôm nay.</Typography>
            <Button 
                variant="contained"
                onClick={() => navigate("/")} 
                sx={{ 
                    bgcolor: '#1C1B19', color: '#C2A56D', px: 4, py: 1.5,
                    borderRadius: "12px", textTransform: 'none', fontWeight: 700,
                    '&:hover': { bgcolor: '#333230' }
                }}
            >
                Khám phá khách sạn
            </Button>
          </Paper>
        ) : (
          <Stack spacing={4}>
            {filteredBookings.map((booking) => (
              <Fade in key={booking._id}>
                <Box>
                  <BookingCard 
                    booking={booking} 
                    onView={(b) => { setSelectedBooking(b); }}
                    onCancel={() => {}} 
                  />
                </Box>
              </Fade>
            ))}
          </Stack>
        )}
      </Container>

      {/* DETAIL DIALOG */}
      <Dialog 
        open={!!selectedBooking} 
        onClose={() => setSelectedBooking(null)} 
        fullWidth maxWidth="xs"
        PaperProps={{ sx: { borderRadius: "28px", p: 1, boxShadow: '0 25px 50px rgba(0,0,0,0.15)' } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>Chi tiết đặt phòng</Typography>
          
          <Button 
            onClick={() => setSelectedBooking(null)} 
            sx={{ 
                minWidth: 40, width: 40, height: 40, borderRadius: "50%", 
                color: '#A8A7A1', p: 0 
            }}
          >
            <Close />
          </Button>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Stack spacing={3.5} sx={{ mt: 1 }}>
              <Box sx={{ p: 3, borderRadius: "20px", bgcolor: '#1C1B19', color: '#FFF', position: 'relative', overflow: 'hidden' }}>
                <Typography variant="overline" sx={{ color: '#C2A56D', fontWeight: 800, letterSpacing: 1 }}>Mã đơn hàng: #{selectedBooking._id?.slice(-6).toUpperCase()}</Typography>
                <Stack spacing={2.5} mt={2}>
                  <InfoRow icon={HotelOutlined} label="Điểm đến" value={selectedBooking.hotel?.name} />
                  <InfoRow icon={MeetingRoomOutlined} label="Loại phòng" value={selectedBooking.room?.name} />
                  <InfoRow icon={CalendarMonthOutlined} label="Lịch trình" value={`${new Date(selectedBooking.checkIn).toLocaleDateString("vi-VN")} - ${new Date(selectedBooking.checkOut).toLocaleDateString("vi-VN")}`} />
                </Stack>
                <ConfirmationNumberOutlined sx={{ position: 'absolute', right: -15, bottom: -15, fontSize: 100, opacity: 0.05, transform: 'rotate(-15deg)', color: '#C2A56D' }} />
              </Box>

              <Box sx={{ px: 1 }}>
                <Typography variant="overline" sx={{ color: "#A8A7A1", fontWeight: 800, display: 'block', mb: 2 }}>THÔNG TIN ĐĂNG KÝ</Typography>
                <Stack spacing={2.5}>
                  <InfoRow icon={PersonOutlined} label="Chủ phòng" value={selectedBooking.guest?.name} />
                  <InfoRow icon={PhoneOutlined} label="Liên hệ" value={selectedBooking.guest?.phone} />
                </Stack>
              </Box>

              <Box sx={{ 
                p: 2.5, borderRadius: "16px", 
                bgcolor: STATUS_CONFIG[selectedBooking.status?.toLowerCase()]?.bg || "#F9F8F6",
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                border: `1px solid ${STATUS_CONFIG[selectedBooking.status?.toLowerCase()]?.color}20`
              }}>
                <Typography variant="body2" sx={{ fontWeight: 700, color: '#1C1B19' }}>Trạng thái:</Typography>
                <Typography sx={{ 
                    fontWeight: 800, 
                    color: STATUS_CONFIG[selectedBooking.status?.toLowerCase()]?.color,
                    fontSize: '0.85rem',
                    textTransform: 'uppercase'
                  }}>
                    {selectedBooking.status}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => setSelectedBooking(null)} 
            sx={{ 
                borderRadius: "12px", 
                bgcolor: '#1C1B19', 
                color: '#C2A56D',
                py: 1.8, 
                textTransform: 'none', 
                fontWeight: 700,
                fontSize: '1rem',
                '&:hover': { bgcolor: '#333230' }
            }}
          >
            Đóng
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}