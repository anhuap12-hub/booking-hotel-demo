import { useEffect, useState, useMemo } from "react";
import {
  Container, Typography, Box, CircularProgress, Stack, Chip,
  Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Paper, Divider, IconButton, Fade
} from "@mui/material";
import PersonIcon from "@mui/icons-material/Person";
import PhoneIcon from "@mui/icons-material/Phone";
import EventIcon from "@mui/icons-material/Event";
import HotelIcon from "@mui/icons-material/Hotel";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import CloseIcon from "@mui/icons-material/Close";
import ReceiptLongIcon from "@mui/icons-material/ReceiptLong";

import instance from "../../api/axios";
import Navbar from "../../components/Layout/Navbar";
import BookingCard from "../../components/Booking/BookingCard";
import { useNavigate } from "react-router-dom";

// Cấu hình tập trung cho các trạng thái
const STATUS_MAP = {
  all: { label: "Tất cả", color: "default" },
  pending: { label: "Chờ duyệt", color: "warning", themeColor: "#ed6c02" },
  confirmed: { label: "Thành công", color: "success", themeColor: "#2e7d32" },
  cancelled: { label: "Đã hủy", color: "error", themeColor: "#d32f2f" },
};

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const navigate = useNavigate();

  const [openDetail, setOpenDetail] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  // Khởi tạo dữ liệu
 useEffect(() => {
  let isMounted = true;
  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/bookings/my");
      
      if (isMounted) {
        // QUAN TRỌNG: Backend trả về { success: true, bookings: [] }
        // Nên phải lấy đúng res.data.bookings
        const data = res.data.bookings || res.data || []; 
        setBookings(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error("Fetch error:", err);
      if (isMounted) setBookings([]); // Tránh lỗi crash giao diện
    } finally {
      if (isMounted) setLoading(false);
    }
  };
  fetchBookings();
  return () => { isMounted = false; };
}, []);

// 2. Sửa lại Logic lọc để không phân biệt hoa thường (Case-insensitive)
const filteredBookings = useMemo(() => {
  if (!Array.isArray(bookings)) return [];
  if (tab === "all") return bookings;
  // So sánh chữ thường để tránh lệch pha dữ liệu
  return bookings.filter((b) => b.status?.toLowerCase() === tab.toLowerCase());
}, [bookings, tab]);
  const handleView = (booking) => {
    setSelectedBooking(booking);
    setOpenDetail(true);
  };

  const handleCancel = async (booking) => {
    if (!window.confirm("Bạn chắc chắn muốn huỷ đặt phòng này?")) return;
    try {
      await instance.put(`/bookings/${booking._id}/cancel`);
      // Cập nhật state tại chỗ để UI phản ứng ngay lập tức
      setBookings((prev) =>
        prev.map((b) => (b._id === booking._id ? { ...b, status: "Cancelled" } : b))
      );
    } catch (err) {
      console.error("Cancel error:", err);
      alert("Huỷ đặt phòng thất bại. Vui lòng thử lại sau.");
    }
  };

  return (
    <Box sx={{ bgcolor: "#F8F9FA", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: { xs: 12, md: 15 }, pb: 10 }}>
        {/* HEADER */}
        <Stack direction={{ xs: "column", sm: "row" }} justifyContent="space-between" alignItems={{ sm: "flex-end" }} mb={5} spacing={2}>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: "#1A1A1A", mb: 1 }}>Kỳ nghỉ của tôi</Typography>
            <Typography variant="body1" color="text.secondary">
              Quản lý các yêu cầu đặt phòng tại Coffee Stay
            </Typography>
          </Box>
          <Chip 
            icon={<ReceiptLongIcon style={{ fontSize: 18 }} />} 
            label={`${bookings.length} đơn đặt`} 
            sx={{ fontWeight: 700, px: 1, bgcolor: "white", border: "1px solid #E0E0E0" }} 
          />
        </Stack>

        {/* TAB NAVIGATION */}
        <Paper sx={{ borderRadius: 3, mb: 4, p: 0.5, bgcolor: "#E5E2DC" }} elevation={0}>
          <Tabs 
            value={tab} 
            onChange={(_, v) => setTab(v)}
            variant="fullWidth"
            sx={{
              '& .MuiTabs-indicator': { display: 'none' },
              '& .MuiTab-root': {
                borderRadius: 2.5,
                minHeight: 44,
                fontWeight: 700,
                fontSize: "0.85rem",
                textTransform: "none",
                color: "#666",
                transition: "0.3s",
                '&.Mui-selected': {
                  bgcolor: "white",
                  color: "#0071c2",
                  boxShadow: "0 4px 10px rgba(0,0,0,0.08)"
                }
              }
            }}
          >
            {Object.keys(STATUS_MAP).map((key) => (
              <Tab key={key} label={STATUS_MAP[key].label} value={key} />
            ))}
          </Tabs>
        </Paper>

        {/* CONTENT AREA */}
        {loading ? (
          <Box display="flex" flexDirection="column" alignItems="center" py={10}>
            <CircularProgress size={40} thickness={4} sx={{ color: "#0071c2" }} />
          </Box>
        ) : filteredBookings.length === 0 ? (
          <Fade in={true}>
            <Paper sx={{ textAlign: "center", py: 10, borderRadius: 6, bgcolor: "transparent", border: "2px dashed #D1D1D1" }}>
              <HotelIcon sx={{ fontSize: 60, color: "#D1D1D1", mb: 2 }} />
              <Typography variant="h6" color="text.secondary">Không tìm thấy yêu cầu đặt phòng nào</Typography>
              <Button 
                variant="contained" 
                onClick={() => navigate("/home")}
                sx={{ mt: 3, borderRadius: 2, px: 4, bgcolor: "#0071c2", textTransform: "none" }}
              >
                Khám phá khách sạn ngay
              </Button>
            </Paper>
          </Fade>
        ) : (
          <Stack spacing={2.5}>
            {filteredBookings.map((booking) => (
              <Fade in={true} key={booking._id}>
                <Box>
                  <BookingCard
                    booking={booking}
                    onView={handleView}
                    onCancel={handleCancel}
                  />
                </Box>
              </Fade>
            ))}
          </Stack>
        )}
      </Container>

      {/* DETAIL DIALOG */}
      <Dialog
        open={openDetail}
        onClose={() => setOpenDetail(false)}
        fullWidth
        maxWidth="sm"
        PaperProps={{ sx: { borderRadius: 4, p: 1 } }}
      >
        <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", pb: 1 }}>
          <Typography variant="h6" fontWeight={800}>Chi tiết đặt phòng</Typography>
          <IconButton onClick={() => setOpenDetail(false)} size="small"><CloseIcon /></IconButton>
        </DialogTitle>

        <DialogContent sx={{ pb: 3 }}>
          {selectedBooking && (
            <Stack spacing={3} mt={1}>
              <Box>
                <Typography variant="caption" color="primary" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Thông tin khách sạn</Typography>
                <Stack spacing={2} mt={1.5}>
                  <Info icon={<HotelIcon sx={{ fontSize: 20 }} color="action" />} label="Tên khách sạn" value={selectedBooking.hotel?.name} />
                  <Info icon={<MeetingRoomIcon sx={{ fontSize: 20 }} color="action" />} label="Loại phòng" value={selectedBooking.room?.name} />
                  <Info icon={<EventIcon sx={{ fontSize: 20 }} color="action" />} label="Thời gian lưu trú" 
                    value={`${new Date(selectedBooking.checkIn).toLocaleDateString("vi-VN")} - ${new Date(selectedBooking.checkOut).toLocaleDateString("vi-VN")}`} 
                  />
                </Stack>
              </Box>

              <Divider sx={{ borderStyle: "dashed" }} />

              <Box>
                <Typography variant="caption" color="primary" fontWeight={800} sx={{ textTransform: "uppercase", letterSpacing: 1 }}>Thông tin khách hàng</Typography>
                <Stack spacing={2} mt={1.5}>
                  <Info icon={<PersonIcon sx={{ fontSize: 20 }} color="action" />} label="Người nhận phòng" value={selectedBooking.guest?.name || "Chưa cập nhật"} />
                  <Info icon={<PhoneIcon sx={{ fontSize: 20 }} color="action" />} label="Số điện thoại" value={selectedBooking.guest?.phone || "Chưa cập nhật"} />
                </Stack>
              </Box>

              <Box sx={{ 
                p: 2, borderRadius: 3, 
                bgcolor: `${STATUS_MAP[selectedBooking.status]?.themeColor}08`,
                border: `1px solid ${STATUS_MAP[selectedBooking.status]?.themeColor}30`,
                display: "flex", justifyContent: "space-between", alignItems: "center"
              }}>
                <Typography fontWeight={700} variant="body2">Trạng thái hiện tại:</Typography>
                <Chip
                  label={STATUS_MAP[selectedBooking.status]?.label || selectedBooking.status}
                  color={STATUS_MAP[selectedBooking.status]?.color}
                  size="small"
                  sx={{ fontWeight: 800, borderRadius: "6px" }}
                />
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 2, bgcolor: "#F8F9FA", borderRadius: "0 0 16px 16px" }}>
          <Stack direction="row" spacing={1} alignItems="center" sx={{ flexGrow: 1, pl: 1 }}>
            <SupportAgentIcon sx={{ color: "text.secondary", fontSize: 20 }} />
            <Typography variant="caption" color="text.secondary">Hotline hỗ trợ: 1900 1234</Typography>
          </Stack>
          <Button variant="outlined" onClick={() => setOpenDetail(false)} sx={{ borderRadius: 2, textTransform: "none", fontWeight: 700 }}>Đóng</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

// Component phụ hiển thị thông tin dòng
function Info({ icon, label, value }) {
  return (
    <Stack direction="row" spacing={2} alignItems="center">
      <Box sx={{ bgcolor: "#F0F2F5", p: 1, borderRadius: 1.5, display: "flex" }}>{icon}</Box>
      <Box>
        <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500 }}>{label}</Typography>
        <Typography variant="body2" sx={{ fontWeight: 700, color: "#333" }}>{value || "—"}</Typography>
      </Box>
    </Stack>
  );
}