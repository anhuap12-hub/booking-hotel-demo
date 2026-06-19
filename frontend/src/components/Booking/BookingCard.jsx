import React, { useState } from "react";
import {
  Card, CardContent, Typography, Box, Chip, Stack, Button,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, CircularProgress, IconButton, Alert, Snackbar
} from "@mui/material";
import { 
  CalendarToday, Hotel, LocationOn, StarBorder, Close, CheckCircleOutline
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createReview } from "../../api/review.api";

const MotionCard = motion(Card);

export default function BookingCard({ booking, onView }) {
  const navigate = useNavigate();

  // --- Logic State Đánh giá ---
  const [openReview, setOpenReview] = useState(false);
  const [userStars, setUserStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [reviewSuccess, setReviewSuccess] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  if (!booking) return null;

  const { 
    _id: bookingId, status, paymentStatus, totalPrice, 
    depositAmount, expireAt, roomSnapshot, room, checkIn, checkOut, hotel 
  } = booking;
  
  const total = totalPrice || 0;
  const paid = depositAmount || 0;
  
  /* ================= LOGIC ================= */
  const isConfirmedOrCompleted = ['confirmed', 'completed'].includes(status);
  const isExpired = status === 'pending' && paymentStatus === 'UNPAID' && expireAt && new Date(expireAt) < new Date();
  const canReview = isConfirmedOrCompleted && (paymentStatus === 'PAID' || paymentStatus === 'DEPOSITED') && !booking.isReviewed;
  const canPay = paymentStatus === 'UNPAID' && !isExpired && status !== 'cancelled';

  const paymentLabel = paymentStatus === 'PAID' ? "Đã thanh toán" : "Đã thanh toán cọc";

  const getStatusStyle = (status) => {
    switch (status) {
      case 'cancelled': return { bg: "#FEE2E2", color: "#991B1B", border: "#FECACA", label: "Đã hủy" };
      case 'completed': return { bg: "#DCFCE7", color: "#166534", border: "#BBF7D0", label: "Hoàn tất" };
      case 'confirmed': return { bg: "#EFF6FF", color: "#1E40AF", border: "#BFDBFE", label: "Đã xác nhận" };
      case 'pending': return { bg: "#FEF3C7", color: "#92400E", border: "#FDE68A", label: "Chờ xử lý" };
      default: return { bg: "#F3F4F6", color: "#374151", border: "#E5E7EB", label: "Khác" };
    }
  };

  const statusInfo = getStatusStyle(status);

  // --- Handlers ---
  const handleOpenReview = (e) => { e.stopPropagation(); setOpenReview(true); };
  
  const handleCloseReview = () => {
    setOpenReview(false);
    setTimeout(() => { setComment(""); setUserStars(5); setReviewSuccess(false); }, 300);
  };

 const handleSubmitReview = async () => {
    if (!comment.trim()) return;
    
    // 1. Xác định chính xác ID khách sạn từ dữ liệu booking
    const targetHotelId = hotel?._id || hotel?.id || roomSnapshot?.hotelId || booking?.hotel;
    
    // 2. Debug kiểm tra dữ liệu trước khi gửi
    console.log("Payload gửi lên:", {
      hotelId: targetHotelId,
      bookingId,
      rating: userStars * 2,
      comment: comment.trim()
    });

    if (!targetHotelId) {
      setToast({ open: true, message: "Lỗi: Không tìm thấy ID khách sạn!", severity: "error" });
      return;
    }

    setSubmitting(true);
    try {
      await createReview({ 
        hotelId: targetHotelId, 
        bookingId, 
        rating: userStars * 2, 
        comment: comment.trim() 
      });
      
      setReviewSuccess(true);
      setTimeout(() => { 
        handleCloseReview(); 
        setToast({ open: true, message: "Đánh giá thành công!", severity: "success" });
        // Tùy chọn: Gọi lại API lấy danh sách booking để cập nhật trạng thái UI
        // window.location.reload(); 
      }, 2000);
    } catch (err) {
      console.error("Lỗi API chi tiết:", err.response?.data);
      setToast({ 
        open: true, 
        message: err.response?.data?.message || "Gửi đánh giá thất bại!", 
        severity: "error" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      <MotionCard 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ 
          mb: 2.5, borderRadius: "24px", border: '1.5px solid #E5E7EB', bgcolor: '#fff', 
          position: 'relative', overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.06)', 
          transition: 'all 0.3s ease', '&:hover': { boxShadow: '0 8px 30px rgba(0,0,0,0.12)' }
        }}
      >
        <CardContent sx={{ p: { xs: 2, sm: 3 } }}>
          <Stack direction={{ xs: "column", sm: "row" }} spacing={3}>
            <Box sx={{ width: { xs: "100%", sm: 280 }, height: { xs: 240, sm: 250 }, borderRadius: "20px", overflow: "hidden", flexShrink: 0 }}>
              <img src={hotel?.photos?.[0]?.url || roomSnapshot?.image || "https://via.placeholder.com/300"} alt="hotel" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
            </Box>

            <Box flex={1} display="flex" flexDirection="column" justifyContent="space-between">
              <Box>
                <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                  <Typography variant="h5" sx={{ fontWeight: 800, color: "#1C1B19", fontFamily: "'Inter', sans-serif" }}>{hotel?.name || "Khách sạn"}</Typography>
                  <Chip label={statusInfo.label} sx={{ bgcolor: statusInfo.bg, color: statusInfo.color, fontWeight: 800, borderRadius: "8px", fontSize: 11, border: `1px solid ${statusInfo.border}` }} />
                </Stack>
                <Typography variant="body2" sx={{ color: "#72716E", mb: 1.5, display: 'flex', alignItems: 'center', gap: 0.5 }}><LocationOn sx={{ fontSize: 16 }} /> {hotel?.address || "Địa chỉ chưa cập nhật"}</Typography>
                <Stack spacing={1} sx={{ mt: 1 }}>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', bgcolor: '#F9F8F6', px: 1.5, py: 0.7, borderRadius: "8px", alignSelf: 'flex-start' }}>
                    <CalendarToday sx={{ fontSize: 14, color: '#C2A56D', mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#1C1B19' }}>{new Date(checkIn).toLocaleDateString("vi-VN")} - {new Date(checkOut).toLocaleDateString("vi-VN")}</Typography>
                  </Box>
                  <Box sx={{ display: 'inline-flex', alignItems: 'center', px: 1.5 }}>
                    <Hotel sx={{ fontSize: 16, color: '#C2A56D', mr: 1 }} />
                    <Typography variant="body2" sx={{ fontWeight: 700, color: '#4A4946' }}>{room?.name || roomSnapshot?.name || "Hạng phòng tiêu chuẩn"}</Typography>
                  </Box>
                </Stack>
              </Box>

              <Stack direction="row" justifyContent="space-between" alignItems="center" mt={2} pt={2} borderTop="1px dashed #EAE9E2">
                <Box>
                  <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 700, display: 'block' }}>TỔNG THANH TOÁN</Typography>
                  <Typography sx={{ fontSize: "1.3rem", fontWeight: 900, color: "#1C1B19" }}>{total.toLocaleString("vi-VN")} <span style={{ fontSize: 12 }}>VND</span></Typography>
                  {paid > 0 && <Typography sx={{ color: "#166534", fontWeight: 700, fontSize: "0.95rem", mt: 0.2 }}>{paymentLabel}: {paid.toLocaleString("vi-VN")} VND</Typography>}
                </Box>
                <Stack direction="row" spacing={1}>
                  {canReview && <Button variant="contained" onClick={handleOpenReview} sx={{ bgcolor: "#C2A56D", borderRadius: "12px", textTransform: 'none', fontWeight: 700 }}>Đánh giá</Button>}
                  {canPay && <Button onClick={(e) => { e.stopPropagation(); navigate(`/checkout/${bookingId}`); }} variant="contained" sx={{ bgcolor: "#1C1B19", borderRadius: "12px", textTransform: 'none', fontWeight: 700 }}>Thanh toán</Button>}
                  <Button onClick={() => onView(booking)} variant="outlined" sx={{ borderColor: "#1C1B19", color: "#1C1B19", borderRadius: "12px", textTransform: 'none', fontWeight: 700 }}>Chi tiết</Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </MotionCard>

      {/* Dialog Đánh giá */}
      <Dialog open={openReview} onClose={handleCloseReview} fullWidth maxWidth="sm">
        <DialogTitle>Đánh giá kỳ nghỉ <IconButton sx={{ float: 'right' }} onClick={handleCloseReview}><Close /></IconButton></DialogTitle>
        <DialogContent dividers>
          {reviewSuccess ? (
            <Box textAlign="center" py={3}><CheckCircleOutline color="success" sx={{ fontSize: 60 }} /><Typography variant="h6">Cảm ơn bạn đã đánh giá!</Typography></Box>
          ) : (
            <Stack spacing={2}>
              <Rating value={userStars} onChange={(e, v) => setUserStars(v)} size="large" />
              <TextField fullWidth multiline rows={4} value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Chia sẻ trải nghiệm của bạn..." />
            </Stack>
          )}
        </DialogContent>
        {!reviewSuccess && (
          <DialogActions>
            <Button onClick={handleCloseReview}>Hủy</Button>
            <Button variant="contained" onClick={handleSubmitReview} disabled={submitting}>{submitting ? <CircularProgress size={24} /> : "Gửi đánh giá"}</Button>
          </DialogActions>
        )}
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity}>{toast.message}</Alert>
      </Snackbar>
    </>
  );
}