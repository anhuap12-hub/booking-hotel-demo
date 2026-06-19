import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import Navbar from "../../components/Layout/Navbar";
import BookingCard from "../../components/Booking/BookingCard";

import {
  Container, Typography, Box, CircularProgress, Stack, Chip,
  Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Paper, Avatar, Fade, TextField, Divider
} from "@mui/material";

import { 
  HotelOutlined, Close, MeetingRoomOutlined, 
  CalendarMonthOutlined, AccountBalanceWalletOutlined,
  HistoryEduOutlined, InfoOutlined, StarBorderOutlined
} from "@mui/icons-material";

/* ================= HELPERS - CONFIGURATION ================= */

const STATUS_CONFIG = {
  all: { label: "Tất cả", color: "#1C1B19", bg: "#F9F8F6" },
  pending: { label: "Chờ đặt cọc", color: "#C2A56D", bg: "rgba(194, 165, 109, 0.1)" },
  deposited: { label: "Đã đặt cọc", color: "#0288d1", bg: "rgba(2, 136, 209, 0.1)" }, 
  confirmed: { label: "Đã thanh toán đủ", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  refund_pending: { label: "Chờ hoàn tiền", color: "#f57c00", bg: "rgba(245, 124, 0, 0.1)" },
  refunded: { label: "Đã hoàn trả", color: "#7b1fa2", bg: "rgba(123, 31, 162, 0.1)" },
  cancelled: { label: "Đã hủy", color: "#A8A7A1", bg: "#F1F1F1" },
};

const InfoRow = ({ icon: IconComponent, label, value, color = "#1C1B19", iconColor = "#0056b3" }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Avatar sx={{ bgcolor: '#F9F8F6', width: 42, height: 42, borderRadius: "12px", border: '1px solid rgba(0, 86, 179, 0.1)' }}>
      {IconComponent && <IconComponent sx={{ fontSize: 20, color: iconColor }} />}
    </Avatar>
    <Box>
      <Typography variant="caption" sx={{ color: "#1C1B19", fontWeight: 700, textTransform: 'uppercase', letterSpacing: 0.5 }}>
        {label}
      </Typography>
      <Typography variant="body2" sx={{ fontWeight: 700, color: color }}>{value || "—"}</Typography>
    </Box>
  </Stack>
);

/* ================= MAIN COMPONENT ================= */

export default function MyBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState("all");
  const [selectedBooking, setSelectedBooking] = useState(null);
  
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundForm, setRefundForm] = useState({
    bankName: "", accountNumber: "", accountHolder: "", reason: ""
  });

  const navigate = useNavigate();

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const res = await instance.get("/bookings/my");
      const data = res.data.bookings || res.data || [];
      setBookings(Array.isArray(data) ? data : []);
    } catch (err) {
      setBookings([]);
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchBookings(); }, []);

  const getBookingStatus = (booking) => {
    const { paymentStatus, status, totalPrice, depositAmount } = booking;
    if (paymentStatus === 'REFUNDED') return 'refunded';
    if (paymentStatus === 'REFUND_PENDING') return 'refund_pending';
    if (status === 'cancelled') return 'cancelled';
    const isPaidFull = paymentStatus === 'PAID' && depositAmount >= totalPrice;
    const hasDeposited = depositAmount > 0 && depositAmount < totalPrice;
    if (isPaidFull) return 'confirmed'; 
    if (hasDeposited || paymentStatus === 'DEPOSITED') return 'deposited'; 
    return 'pending';
  };

  const filteredBookings = useMemo(() => {
    if (tab === "all") return bookings;
    return bookings.filter(b => getBookingStatus(b) === tab);
  }, [bookings, tab]);

  const handleRefundRequest = async () => {
    try {
      await instance.put(`/bookings/${selectedBooking._id}/request-refund`, refundForm);
      setIsRefundDialogOpen(false);
      setSelectedBooking(null);
      alert("Yêu cầu hoàn tiền đã gửi thành công!");
      fetchBookings();
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi gửi yêu cầu");
    }
  };

  return (
    <Box sx={{ bgcolor: "#F9F8F6", minHeight: "100vh" }}>
      <Navbar />

      <Container maxWidth="md" sx={{ mt: { xs: 12, md: 15 }, pb: 10 }}>
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={6}>
          <Box>
            <Typography variant="h3" sx={{ fontSize: "2rem", color: "#1C1B19", fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>
              Kỳ nghỉ của tôi
            </Typography>
            <Typography variant="body2" sx={{ color: "#72716E", mt: 1 }}>Xem lại lịch trình và quản lý giao dịch</Typography>
          </Box>
          <Chip label={`${bookings.length} Đơn đặt`} sx={{ fontWeight: 700, bgcolor: "#1C1B19", color: "#C2A56D", borderRadius: "8px" }} />
        </Stack>

        <Paper elevation={0} sx={{ borderRadius: "16px", p: 0.5, bgcolor: "rgba(28, 27, 25, 0.04)", mb: 5 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ '& .MuiTabs-indicator': { display: 'none' } }}>
            {Object.keys(STATUS_CONFIG).map((key) => (
              <Tab key={key} label={STATUS_CONFIG[key].label} value={key} sx={{ borderRadius: "12px", minHeight: 44, fontWeight: 700, textTransform: "none", color: "#72716E", mx: 0.5, '&.Mui-selected': { bgcolor: "white", color: "#C2A56D", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" } }} />
            ))}
          </Tabs>
        </Paper>

        {loading ? (
          <Box sx={{ textAlign: 'center', py: 10 }}><CircularProgress sx={{ color: '#C2A56D' }} /></Box>
        ) : filteredBookings.length === 0 ? (
          <Paper sx={{ textAlign: "center", py: 12, borderRadius: "24px", border: "2px dashed rgba(194, 165, 109, 0.3)", bgcolor: "transparent" }}>
            <HotelOutlined sx={{ fontSize: 60, color: "rgba(194, 165, 109, 0.4)", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Không tìm thấy đơn đặt phòng nào</Typography>
            <Button onClick={() => navigate("/")} sx={{ mt: 2, color: '#C2A56D', fontWeight: 700 }}>Khám phá ngay</Button>
          </Paper>
        ) : (
          <Stack spacing={4}>
            {filteredBookings.map((booking) => (
              <Fade in key={booking._id}>
                <Box sx={{ position: 'relative' }}>
                  <BookingCard 
                    booking={{ ...booking, displayStatus: getBookingStatus(booking) }} 
                    onView={(b) => setSelectedBooking(b)} 
                  />
                  {getBookingStatus(booking) === 'pending' && (
                    <Button variant="contained" onClick={() => navigate(`/checkout/${booking.room?._id || booking.room}`, { state: booking })} sx={{ position: 'absolute', right: 20, bottom: 20, bgcolor: '#C2A56D', color: '#fff', borderRadius: '8px', fontWeight: 700, px: 3, '&:hover': { bgcolor: '#A68D5B' } }}>
                      Thanh toán cọc ngay
                    </Button>
                  )}
                </Box>
              </Fade>
            ))}
          </Stack>
        )}
      </Container>

      {/* DETAIL DIALOG */}
      <Dialog open={!!selectedBooking && !isRefundDialogOpen} onClose={() => setSelectedBooking(null)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "28px" } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Inter', sans-serif" }}>Chi tiết kỳ nghỉ</Typography>
          <Button onClick={() => setSelectedBooking(null)} sx={{ minWidth: 40, color: 'text.secondary' }}><Close /></Button>
        </DialogTitle>
<DialogContent>
  {selectedBooking && (
    <Stack spacing={3} sx={{ mt: 1 }}>
      {/* Box Mã đơn */}
      <Box sx={{ px: 1 }}>
        <Typography variant="overline" sx={{ color: '#1C1B19', fontWeight: 900, mb: 1, display: 'block', fontSize: 16 }}>
          Mã đơn: #{selectedBooking._id?.slice(-6).toUpperCase()}
        </Typography>
        <Stack spacing={2}>
          <InfoRow icon={HotelOutlined} label="Khách sạn" value={selectedBooking.hotel?.name || selectedBooking.roomSnapshot?.hotelName} />
          <InfoRow icon={MeetingRoomOutlined} label="Hạng phòng" value={selectedBooking.room?.name || selectedBooking.roomSnapshot?.name} />
          <InfoRow icon={CalendarMonthOutlined} label="Lịch trình" value={`${new Date(selectedBooking.checkIn).toLocaleDateString("vi-VN")} - ${new Date(selectedBooking.checkOut).toLocaleDateString("vi-VN")}`} />
        </Stack>
      </Box>

      {/* Thông tin khách hàng */}
      <Box sx={{ px: 1 }}>
        <Typography variant="subtitle2" sx={{ color: "#1C1B19", fontWeight: 800, mb: 2, fontSize: 16 }}>Thông tin khách hàng</Typography>
        <Stack spacing={2}>
          <InfoRow icon={AccountBalanceWalletOutlined} label="Người đặt" value={selectedBooking.guest?.name || "Chưa cập nhật"} />
          <InfoRow icon={InfoOutlined} label="Số điện thoại" value={selectedBooking.guest?.phone || "Chưa cập nhật"} />
        </Stack>
      </Box>

      {/* Thông tin thanh toán */}
      <Box sx={{ px: 1 }}>
        <Typography variant="subtitle2" sx={{ color: "#1C1B19", fontWeight: 800, mb: 2, fontSize: 16 }}>Thông tin thanh toán</Typography>
        <Stack spacing={2}>
          <InfoRow icon={HistoryEduOutlined} label="Tổng tiền phòng" value={`${selectedBooking.totalPrice?.toLocaleString()} VND`} />
          <InfoRow icon={HistoryEduOutlined} label="Tiền đã trả" value={`${selectedBooking.depositAmount?.toLocaleString()} VND`} color="#1C1B19" />
          
          {/* Logic Box Thanh toán */}
          {['cancelled', 'refunded', 'refund_pending'].includes(getBookingStatus(selectedBooking)) ? (
            <Box sx={{ p: 2, bgcolor: 'rgba(239, 68, 68, 0.05)', borderRadius: '12px', border: '1px dashed #ef4444' }}>
              <Typography variant="body2" sx={{ color: "#b91c1c", fontWeight: 700, textAlign: 'center' }}>
                Bạn đã hủy lịch đặt phòng này.
              </Typography>
            </Box>
          ) : (
            (selectedBooking.totalPrice - selectedBooking.depositAmount > 0) && (
              <Box sx={{ p: 2, bgcolor: 'rgba(0, 86, 179, 0.05)', borderRadius: '12px', border: '1px dashed #0056b3' }}>
                <Typography variant="caption" sx={{ color: "#0056b3", fontWeight: 700, display: 'block' }}>CÒN LẠI PHẢI TRẢ TẠI QUẦY:</Typography>
                <Typography variant="h6" sx={{ fontWeight: 900, color: "#1C1B19" }}>
                  {(selectedBooking.totalPrice - selectedBooking.depositAmount).toLocaleString()} VND
                </Typography>
              </Box>
            )
          )}
        </Stack>
      </Box>
    </Stack>
  )}
</DialogContent>

       <DialogActions sx={{ p: 3, flexDirection: 'column', gap: 1 }}>
  <Button fullWidth variant="contained" onClick={() => setSelectedBooking(null)} sx={{ bgcolor: '#0056b3', color: '#FFFFFF', borderRadius: '12px', py: 1.5, fontWeight: 700 }}>Quay lại</Button>
  
  {selectedBooking && ['deposited', 'confirmed'].includes(getBookingStatus(selectedBooking)) && (
    <Button fullWidth color="error" onClick={() => setIsRefundDialogOpen(true)} sx={{ fontWeight: 700, textTransform: 'none' }}>Yêu cầu hủy & hoàn tiền</Button>
  )}
</DialogActions>
      </Dialog>
    </Box>
  );
}