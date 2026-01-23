import React, { useEffect, useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import instance from "../../api/axios";
import Navbar from "../../components/Layout/Navbar";
import BookingCard from "../../components/Booking/BookingCard";

import {
  Container, Typography, Box, CircularProgress, Stack, Chip,
  Tabs, Tab, Dialog, DialogTitle, DialogContent, DialogActions,
  Button, Paper, Avatar, Fade, TextField
} from "@mui/material";

import { 
  HotelOutlined, PersonOutlined, PhoneOutlined, Close, 
  MeetingRoomOutlined, CalendarMonthOutlined, AccountBalanceWalletOutlined,
  HistoryEduOutlined
} from "@mui/icons-material";

// ĐỒNG BỘ: Cập nhật thêm các trạng thái hoàn tiền
const STATUS_CONFIG = {
  all: { label: "Tất cả", color: "#1C1B19", bg: "#F9F8F6" },
  pending: { label: "Chờ đặt cọc", color: "#C2A56D", bg: "rgba(194, 165, 109, 0.1)" },
  deposited: { label: "Đã đặt cọc", color: "#0288d1", bg: "rgba(2, 136, 209, 0.1)" },
  confirmed: { label: "Đã thanh toán", color: "#10b981", bg: "rgba(16, 185, 129, 0.1)" },
  refund_pending: { label: "Chờ hoàn tiền", color: "#f57c00", bg: "rgba(245, 124, 0, 0.1)" }, // Mới
  refunded: { label: "Đã hoàn trả", color: "#7b1fa2", bg: "rgba(123, 31, 162, 0.1)" },      // Mới
  cancelled: { label: "Đã hủy", color: "#A8A7A1", bg: "#F1F1F1" },
};

const InfoRow = ({ icon: IconComponent, label, value }) => (
  <Stack direction="row" spacing={2} alignItems="center">
    <Avatar sx={{ bgcolor: '#F9F8F6', width: 42, height: 42, borderRadius: "12px", border: '1px solid rgba(194, 165, 109, 0.2)' }}>
      {IconComponent && <IconComponent sx={{ fontSize: 20, color: '#C2A56D' }} />}
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
  
  // NEW STATES FOR REFUND
  const [isRefundDialogOpen, setIsRefundDialogOpen] = useState(false);
  const [refundForm, setRefundForm] = useState({
    bankName: "",
    accountNumber: "",
    accountHolder: "",
    reason: ""
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
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getBookingStatus = (booking) => {
    if (booking.paymentStatus === 'REFUNDED') return 'refunded';
    if (booking.paymentStatus === 'REFUND_PENDING') return 'refund_pending';
    if (booking.status === 'cancelled') return 'cancelled';
    if (booking.paymentStatus === 'PAID') return 'confirmed';
    if (booking.paymentStatus === 'DEPOSITED') return 'deposited';
    return 'pending';
  };

  const filteredBookings = useMemo(() => {
    if (tab === "all") return bookings;
    return bookings.filter(b => getBookingStatus(b) === tab);
  }, [bookings, tab]);

  // HANDLE REFUND SUBMIT
  const handleRefundRequest = async () => {
    try {
      await instance.post(`/bookings/${selectedBooking._id}/refund`, refundForm);
      setIsRefundDialogOpen(false);
      setSelectedBooking(null);
      fetchBookings(); // Reload data
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi gửi yêu cầu hoàn tiền");
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
            <Typography variant="body2" sx={{ color: "#72716E", mt: 1 }}>Quản lý các đặc quyền lưu trú và lịch trình đặt phòng</Typography>
          </Box>
          <Chip label={`${bookings.length} Đơn đặt`} sx={{ fontWeight: 700, bgcolor: "#1C1B19", color: "#C2A56D", borderRadius: "8px" }} />
        </Stack>

        {/* TABS */}
        <Paper elevation={0} sx={{ borderRadius: "16px", p: 0.5, bgcolor: "rgba(28, 27, 25, 0.04)", mb: 5 }}>
          <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="scrollable" scrollButtons="auto" sx={{ '& .MuiTabs-indicator': { display: 'none' } }}>
            {Object.keys(STATUS_CONFIG).map((key) => (
              <Tab key={key} label={STATUS_CONFIG[key].label} value={key} sx={{
                borderRadius: "12px", minHeight: 44, fontWeight: 700, textTransform: "none", color: "#72716E", mx: 0.5,
                '&.Mui-selected': { bgcolor: "white", color: "#C2A56D", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }
              }} />
            ))}
          </Tabs>
        </Paper>

        {/* LISTING */}
        {loading ? (
          <Box sx={{ textAlign: 'center', py: 10 }}><CircularProgress sx={{ color: '#C2A56D' }} /></Box>
        ) : filteredBookings.length === 0 ? (
          <Paper sx={{ textAlign: "center", py: 12, borderRadius: "24px", border: "2px dashed rgba(194, 165, 109, 0.3)", bgcolor: "transparent" }}>
            <HotelOutlined sx={{ fontSize: 60, color: "rgba(194, 165, 109, 0.4)", mb: 2 }} />
            <Typography variant="h6" sx={{ fontWeight: 700 }}>Bạn chưa có chuyến đi nào ở mục này</Typography>
            <Button onClick={() => navigate("/")} sx={{ mt: 3, color: '#C2A56D' }}>Khám phá khách sạn</Button>
          </Paper>
        ) : (
          <Stack spacing={4}>
            {filteredBookings.map((booking) => {
              const currentStatus = getBookingStatus(booking);
              const isExpired = booking.status === 'pending' && booking.paymentStatus === 'UNPAID' && new Date(booking.expireAt) < new Date();
              
              return (
                <Fade in key={booking._id}>
                  <Box sx={{ position: 'relative' }}>
                    <BookingCard 
                      booking={{ ...booking, displayStatus: currentStatus }} 
                      onView={(b) => setSelectedBooking(b)} 
                    />
                    {currentStatus === 'pending' && !isExpired && (
                      <Button
                        variant="contained"
                        onClick={() => navigate(`/checkout/${booking.room?._id || booking.room}`, { state: booking })}
                        sx={{ position: 'absolute', right: 20, bottom: 20, bgcolor: '#C2A56D', color: '#fff', borderRadius: '8px', fontWeight: 700 }}
                      >
                        Thanh toán cọc
                      </Button>
                    )}
                  </Box>
                </Fade>
              );
            })}
          </Stack>
        )}
      </Container>

      {/* DETAIL DIALOG */}
      <Dialog open={!!selectedBooking && !isRefundDialogOpen} onClose={() => setSelectedBooking(null)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "28px" } }}>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="h6" sx={{ fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>Chi tiết đặt phòng</Typography>
          <Button onClick={() => setSelectedBooking(null)} sx={{ minWidth: 40, borderRadius: "50%", color: '#A8A7A1' }}><Close /></Button>
        </DialogTitle>
        <DialogContent>
          {selectedBooking && (
            <Stack spacing={3}>
              <Box sx={{ p: 3, borderRadius: "20px", bgcolor: '#1C1B19', color: '#FFF' }}>
                <Typography variant="overline" sx={{ color: '#C2A56D', fontWeight: 800 }}>Mã đơn: #{selectedBooking._id?.slice(-6).toUpperCase()}</Typography>
                <Stack spacing={2} mt={2}>
                  <InfoRow icon={HotelOutlined} label="Khách sạn" value={selectedBooking.hotel?.name || selectedBooking.roomSnapshot?.hotelName} />
                  <InfoRow icon={MeetingRoomOutlined} label="Phòng" value={selectedBooking.room?.name || selectedBooking.roomSnapshot?.name} />
                  <InfoRow icon={CalendarMonthOutlined} label="Lịch trình" value={`${new Date(selectedBooking.checkIn).toLocaleDateString("vi-VN")} - ${new Date(selectedBooking.checkOut).toLocaleDateString("vi-VN")}`} />
                </Stack>
              </Box>

              <Box sx={{ px: 1 }}>
                <Typography variant="overline" sx={{ color: "#A8A7A1", fontWeight: 800, display: 'block', mb: 1 }}>THÔNG TIN GIAO DỊCH</Typography>
                <Stack spacing={2}>
                  <InfoRow icon={AccountBalanceWalletOutlined} label="Tổng tiền" value={`${selectedBooking.totalPrice?.toLocaleString()} VND`} />
                  <InfoRow icon={HistoryEduOutlined} label="Đã đóng" value={`${(selectedBooking.paymentStatus === 'PAID' ? selectedBooking.totalPrice : selectedBooking.depositAmount)?.toLocaleString()} VND`} />
                </Stack>
              </Box>

              {(() => {
                const s = getBookingStatus(selectedBooking);
                const expired = s === 'pending' && new Date(selectedBooking.expireAt) < new Date();
                const config = STATUS_CONFIG[s];
                
                return (
                  <Box sx={{ p: 2, borderRadius: "16px", bgcolor: expired ? "#FDEDED" : config.bg, border: `1px solid ${expired ? '#d32f2f20' : config.color + '20'}`, display: 'flex', justifyContent: 'space-between' }}>
                    <Typography variant="body2" sx={{ fontWeight: 700 }}>Tình trạng:</Typography>
                    <Typography sx={{ fontWeight: 800, color: expired ? '#d32f2f' : config.color, fontSize: '0.85rem' }}>
                      {expired ? "ĐÃ HẾT HẠN (30P)" : config.label.toUpperCase()}
                    </Typography>
                  </Box>
                );
              })()}
            </Stack>
          )}
        </DialogContent>
        <DialogActions sx={{ p: 3, flexDirection: 'column', gap: 1 }}>
          <Button fullWidth variant="contained" onClick={() => setSelectedBooking(null)} sx={{ bgcolor: '#1C1B19', color: '#C2A56D', borderRadius: '12px', py: 1.5, fontWeight: 700 }}>Đóng</Button>
          
          {/* NÚT YÊU CẦU HOÀN TIỀN: Chỉ hiện khi đã cọc hoặc đã trả đủ */}
          {selectedBooking && ['deposited', 'confirmed'].includes(getBookingStatus(selectedBooking)) && (
            <Button 
              fullWidth 
              color="error" 
              onClick={() => setIsRefundDialogOpen(true)}
              sx={{ fontWeight: 700, textTransform: 'none' }}
            >
              Yêu cầu hủy phòng & hoàn tiền
            </Button>
          )}
        </DialogActions>
      </Dialog>

      {/* REFUND DIALOG (FORM NHẬP NGÂN HÀNG) */}
      <Dialog open={isRefundDialogOpen} onClose={() => setIsRefundDialogOpen(false)} fullWidth maxWidth="xs" PaperProps={{ sx: { borderRadius: "28px" } }}>
        <DialogTitle sx={{ fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>Thông tin hoàn tiền</DialogTitle>
        <DialogContent>
          <Stack spacing={2.5} sx={{ mt: 1 }}>
            <Box sx={{ p: 2, bgcolor: '#FFF9F0', borderRadius: '12px', border: '1px solid #FFE0B2' }}>
              <Typography variant="body2" sx={{ color: '#E65100', fontWeight: 700 }}>
                Tiền hoàn dự kiến: {selectedBooking?.potentialRefundAmount?.toLocaleString()} VND
              </Typography>
              <Typography variant="caption" sx={{ color: '#72716E' }}>* Áp dụng chính sách hủy tại thời điểm hiện tại.</Typography>
            </Box>

            <TextField fullWidth label="Tên ngân hàng" variant="outlined" size="small" 
              onChange={(e) => setRefundForm({...refundForm, bankName: e.target.value})} />
            <TextField fullWidth label="Số tài khoản" variant="outlined" size="small"
              onChange={(e) => setRefundForm({...refundForm, accountNumber: e.target.value})} />
            <TextField fullWidth label="Chủ tài khoản (Không dấu)" variant="outlined" size="small"
              onChange={(e) => setRefundForm({...refundForm, accountHolder: e.target.value})} />
            <TextField fullWidth label="Lý do hủy" variant="outlined" size="small" multiline rows={2}
              onChange={(e) => setRefundForm({...refundForm, reason: e.target.value})} />
          </Stack>
        </DialogContent>
        <DialogActions sx={{ p: 3 }}>
          <Button onClick={() => setIsRefundDialogOpen(false)} sx={{ color: '#72716E', fontWeight: 700 }}>Hủy bỏ</Button>
          <Button 
            variant="contained" 
            disabled={!refundForm.bankName || !refundForm.accountNumber}
            onClick={handleRefundRequest}
            sx={{ bgcolor: '#d32f2f', color: '#fff', borderRadius: '10px', fontWeight: 700 }}
          >
            Gửi yêu cầu
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}