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
  HistoryEduOutlined, ErrorOutline, InfoOutlined,
  PaymentOutlined
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

const InfoRow = ({ icon: IconComponent, label, value, color = "#1C1B19" }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Avatar sx={{ bgcolor: '#F9F8F6', width: 42, height: 42, borderRadius: "12px", border: '1px solid rgba(194, 165, 109, 0.1)' }}>
      {IconComponent && <IconComponent sx={{ fontSize: 20, color: '#C2A56D' }} />}
    </Avatar>
    <Box>
      <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 600, textTransform: 'uppercase', letterSpacing: 0.5 }}>{label}</Typography>
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

  // Logic phân loại trạng thái để khớp với STATUS_CONFIG
  const getBookingStatus = (booking) => {
    if (booking.paymentStatus === 'REFUNDED') return 'refunded';
    if (booking.paymentStatus === 'REFUND_PENDING') return 'refund_pending';
    if (booking.status === 'cancelled') return 'cancelled';
    
    // Tách biệt dựa trên paymentStatus từ Backend
    if (booking.paymentStatus === 'PAID') return 'confirmed'; 
    if (booking.paymentStatus === 'DEPOSITED') return 'deposited'; 
    
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
        {/* HEADER */}
        <Stack direction="row" justifyContent="space-between" alignItems="flex-end" mb={6}>
          <Box>
            <Typography variant="h3" sx={{ color: "#1C1B19", fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>
              Kỳ nghỉ của tôi
            </Typography>
            <Typography variant="body2" sx={{ color: "#72716E", mt: 1 }}>Xem lại lịch trình và quản lý giao dịch</Typography>
          </Box>
          <Chip 
            label={`${bookings.length} Đơn đặt`} 
            sx={{ fontWeight: 700, bgcolor: "#1C1B19", color: "#C2A56D", borderRadius: "8px" }} 
          />
        </Stack>

        {/* TABS NAVIGATION */}
        <Paper elevation={0} sx={{ borderRadius: "16px", p: 0.5, bgcolor: "rgba(28, 27, 25, 0.04)", mb: 5 }}>
          <Tabs 
            value={tab} 
            onChange={(_, v) => setTab(v)} 
            variant="scrollable" 
            scrollButtons="auto" 
            sx={{ '& .MuiTabs-indicator': { display: 'none' } }}
          >
            {Object.keys(STATUS_CONFIG).map((key) => (
              <Tab 
                key={key} 
                label={STATUS_CONFIG[key].label} 
                value={key} 
                sx={{
                  borderRadius: "12px", minHeight: 44, fontWeight: 700, textTransform: "none", color: "#72716E", mx: 0.5,
                  '&.Mui-selected': { bgcolor: "white", color: "#C2A56D", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }
                }} 
              />
            ))}
          </Tabs>
        </Paper>

        {/* LISTING CARDS */}
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
                    <Button
                      variant="contained"
                      onClick={() => navigate(`/checkout/${booking.room?._id || booking.room}`, { state: booking })}
                      sx={{ position: 'absolute', right: 20, bottom: 20, bgcolor: '#C2A56D', color: '#fff', borderRadius: '8px', fontWeight: 700, px: 3, '&:hover': { bgcolor: '#A68D5B' } }}
                    >
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
      <Dialog 
        open={!!selectedBooking && !isRefundDialogOpen} 
        onClose={() => setSelectedBooking(null)} 
        fullWidth maxWidth="xs" 
        PaperProps={{ sx: { borderRadius: "28px" } }}
      >
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pt: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>Chi tiết kỳ nghỉ</Typography>
          <IconButton onClick={() => setSelectedBooking(null)}><Close /></IconButton>
        </DialogTitle>

        <DialogContent>
          {selectedBooking && (
            <Stack spacing={3} sx={{ mt: 1 }}>
              {/* Thông tin phòng */}
              <Box sx={{ p: 2.5, borderRadius: "20px", bgcolor: '#F9F8F6', border: '1px solid #EAE9E2' }}>
                <Typography variant="overline" sx={{ color: '#C2A56D', fontWeight: 900, mb: 1, display: 'block' }}>Mã đơn: #{selectedBooking._id?.slice(-6).toUpperCase()}</Typography>
                <Stack spacing={2}>
                  <InfoRow icon={HotelOutlined} label="Khách sạn" value={selectedBooking.hotel?.name || selectedBooking.roomSnapshot?.hotelName} />
                  <InfoRow icon={MeetingRoomOutlined} label="Hạng phòng" value={selectedBooking.room?.name || selectedBooking.roomSnapshot?.name} />
                  <InfoRow icon={CalendarMonthOutlined} label="Lịch trình" value={`${new Date(selectedBooking.checkIn).toLocaleDateString("vi-VN")} - ${new Date(selectedBooking.checkOut).toLocaleDateString("vi-VN")}`} />
                </Stack>
              </Box>

              {/* TÀI CHÍNH MINH BẠCH */}
              <Box sx={{ px: 1 }}>
                <Typography variant="subtitle2" sx={{ color: "#1C1B19", fontWeight: 800, mb: 2 }}>Thông tin thanh toán</Typography>
                <Stack spacing={2}>
                  <InfoRow 
                    icon={AccountBalanceWalletOutlined} 
                    label="Tổng tiền phòng" 
                    value={`${selectedBooking.totalPrice?.toLocaleString()} VND`} 
                  />
                  
                  <InfoRow 
                    icon={HistoryEduOutlined} 
                    label="Tiền đã trả" 
                    value={`${selectedBooking.depositAmount?.toLocaleString()} VND`}
                    color={getBookingStatus(selectedBooking) === 'confirmed' ? "#10b981" : "#0288d1"} 
                  />

                  {/* Hiển thị số tiền còn thiếu nếu mới đặt cọc */}
                  {selectedBooking.paymentStatus === 'DEPOSITED' && (
                    <Box sx={{ ml: 7, p: 2, bgcolor: 'rgba(2, 136, 209, 0.05)', borderRadius: '12px', border: '1px dashed #0288d1' }}>
                      <Typography variant="caption" sx={{ color: "#0288d1", fontWeight: 700, display: 'block' }}>
                        CÒN LẠI PHẢI TRẢ TẠI QUẦY:
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: 900, color: "#1C1B19" }}>
                        {(selectedBooking.totalPrice - selectedBooking.depositAmount).toLocaleString()} VND
                      </Typography>
                      <Stack direction="row" spacing={0.5} alignItems="center" mt={0.5}>
                        <InfoOutlined sx={{ fontSize: 14, color: '#0288d1' }} />
                        <Typography variant="caption" sx={{ color: "#72716E" }}>Thanh toán khi nhận phòng</Typography>
                      </Stack>
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Trạng thái đơn */}
              <Box sx={{ 
                p: 2, 
                borderRadius: "16px", 
                bgcolor: STATUS_CONFIG[getBookingStatus(selectedBooking)].bg, 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center' 
              }}>
                <Typography variant="body2" sx={{ fontWeight: 700 }}>Trạng thái:</Typography>
                <Typography sx={{ fontWeight: 800, color: STATUS_CONFIG[getBookingStatus(selectedBooking)].color }}>
                  {STATUS_CONFIG[getBookingStatus(selectedBooking)].label}
                </Typography>
              </Box>
            </Stack>
          )}
        </DialogContent>

        <DialogActions sx={{ p: 3, flexDirection: 'column', gap: 1 }}>
          <Button 
            fullWidth 
            variant="contained" 
            onClick={() => setSelectedBooking(null)} 
            sx={{ bgcolor: '#1C1B19', color: '#C2A56D', borderRadius: '12px', py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#333' } }}
          >
            Quay lại
          </Button>
          
          {selectedBooking && ['deposited', 'confirmed'].includes(getBookingStatus(selectedBooking)) && (
            <Button 
              fullWidth 
              color="error" 
              onClick={() => setIsRefundDialogOpen(true)}
              sx={{ fontWeight: 700, textTransform: 'none' }}
            >
              Yêu cầu hủy & hoàn tiền
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* DIALOG YÊU CẦU HOÀN TIỀN */}
      <Dialog 
        open={isRefundDialogOpen} 
        onClose={() => setIsRefundDialogOpen(false)} 
        fullWidth maxWidth="xs" 
        PaperProps={{ sx: { borderRadius: "28px" } }}
      >
        <DialogTitle sx={{ fontWeight: 800 }}>Thông tin hoàn tiền</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <Typography variant="body2" color="text.secondary">Vui lòng cung cấp STK để chúng tôi xử lý hoàn tiền cọc.</Typography>
            <TextField fullWidth label="Ngân hàng" variant="outlined" size="small" onChange={(e) => setRefundForm({...refundForm, bankName: e.target.value})} />
            <TextField fullWidth label="Số tài khoản" variant="outlined" size="small" onChange={(e) => setRefundForm({...refundForm, accountNumber: e.target.value})} />
            <TextField fullWidth label="Tên chủ tài khoản" placeholder="VIET HOA KHONG DAU" variant="outlined" size="small" onChange={(e) => setRefundForm({...refundForm, accountHolder: e.target.value})} />
            <TextField fullWidth label="Lý do hủy" multiline rows={2} variant="outlined" size="small" onChange={(e) => setRefundForm({...refundForm, reason: e.target.value})} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsRefundDialogOpen(false)} sx={{ color: '#72716E' }}>Hủy bỏ</Button>
          <Button 
            variant="contained" 
            color="error" 
            onClick={handleRefundRequest} 
            disabled={!refundForm.accountNumber || !refundForm.bankName}
            sx={{ borderRadius: '10px' }}
          >
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}