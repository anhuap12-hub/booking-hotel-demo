import React, { useState } from "react";
import {
  Card, CardContent, Typography, Box, Chip, Stack, Button, useTheme, useMediaQuery,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, CircularProgress,
  IconButton, Alert, Snackbar
} from "@mui/material";
import { 
  CalendarToday, Hotel, Close, StarBorder, CheckCircleOutline, Payment, LocationOn
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createReview } from "../../api/review.api";

const MotionCard = motion(Card);

export default function BookingCard({ booking, onView }) {
  const navigate = useNavigate();
  const theme = useTheme();
  
  // sm (600px) là điểm ngắt lý tưởng để chuyển từ hàng ngang sang hàng dọc cho Card
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  /* ================= STATE ================= */
  const [openReview, setOpenReview] = useState(false);
  const [userStars, setUserStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [isReviewedLocally, setIsReviewedLocally] = useState(false); 
  const [reviewSuccess, setReviewSuccess] = useState(false); 
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  if (!booking) return null;

  const { 
    _id: bookingId, status, paymentStatus, totalPrice, 
    depositAmount, expireAt, roomSnapshot, room, checkIn, checkOut, hotel 
  } = booking;
  
  const total = totalPrice || 0;
  const paid = depositAmount || 0;
  
  /* ================= LOGIC CHECK ================= */
  const isPaidOrDeposited = ['PAID', 'DEPOSITED'].includes(paymentStatus);
  const isConfirmedOrCompleted = ['confirmed', 'completed'].includes(status);
  const isPaidFull = (paymentStatus === 'PAID' && paid >= total);
  const isOnlyDeposited = (paymentStatus === 'DEPOSITED') || (paymentStatus === 'PAID' && paid < total && paid > 0);
  const isExpired = status === 'pending' && paymentStatus === 'UNPAID' && expireAt && new Date(expireAt) < new Date();
  
  const hasBeenReviewed = booking.isReviewed || isReviewedLocally;
  const canReview = isConfirmedOrCompleted && isPaidOrDeposited && !hasBeenReviewed;
  const canPay = paymentStatus === 'UNPAID' && !isExpired && status !== 'cancelled';

  /* ================= HANDLERS ================= */
  const handleOpenReview = (e) => {
    e.stopPropagation();
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    if (submitting) return; 
    setOpenReview(false);
    setTimeout(() => {
      setComment("");
      setUserStars(5);
      setReviewSuccess(false);
    }, 300);
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const targetHotelId = 
        (typeof hotel === 'string' ? hotel : hotel?._id || hotel?.id) || 
        (typeof hotel?.hotel === 'object' ? hotel.hotel._id : null) ||
        roomSnapshot?.hotelId;

      if (!targetHotelId) throw new Error("Không xác định được ID khách sạn");

      await createReview({
        hotelId: targetHotelId,
        bookingId: bookingId,
        rating: userStars * 2, 
        comment: comment.trim()
      });

      setReviewSuccess(true); 
      setIsReviewedLocally(true); 

      setTimeout(() => {
        handleCloseReview();
        setToast({ open: true, message: "Cảm ơn bạn đã để lại đánh giá!", severity: "success" });
      }, 2200);

    } catch (err) {
      setToast({ 
        open: true, 
        message: err.response?.data?.message || err.message || "Gửi đánh giá thất bại!", 
        severity: "error" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const payInfo = (() => {
    if (status === 'no_show') return { label: "Mất cọc", color: "#991b1b", bgcolor: "rgba(153, 27, 27, 0.1)" };
    if (paymentStatus === 'REFUNDED') return { label: "Đã hoàn tiền", color: "#7b1fa2", bgcolor: "rgba(123, 31, 162, 0.1)" };
    if (isPaidFull) return { label: "Đã trả đủ", color: "#10b981", bgcolor: "rgba(16, 185, 129, 0.1)" };
    if (isOnlyDeposited) return { label: "Đã cọc", color: "#0288d1", bgcolor: "rgba(2, 136, 209, 0.1)" };
    return { label: "Chưa thanh toán", color: "#C2A56D", bgcolor: "rgba(194, 165, 109, 0.1)" };
  })();

  const tagInfo = (() => {
    if (status === 'cancelled') return { text: "Đã hủy", bg: "#ef4444" };
    if (status === 'completed') return { text: "Hoàn tất", bg: "#10b981" };
    if (status === 'confirmed') return { text: "Đã xác nhận", bg: "#1C1B19" };
    if (isExpired) return { text: "Hết hạn", bg: "#6b7280" };
    return { text: "Chờ xử lý", bg: "#C2A56D" };
  })();

  return (
    <>
      <MotionCard 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        sx={{ 
          mb: 3, borderRadius: "20px", border: '1px solid #EAE9E2',
          bgcolor: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)',
          transition: 'transform 0.2s',
          '&:hover': { transform: isMobile ? 'none' : 'translateY(-4px)' }
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 2 : 3}>
            
            {/* 1. KHỐI ẢNH: Tối ưu kích thước cố định */}
            <Box sx={{ 
              width: isMobile ? "100%" : 180, 
              height: isMobile ? 180 : 160, 
              borderRadius: "16px", 
              overflow: "hidden", 
              position: 'relative',
              flexShrink: 0 // Không cho phép Desktop bóp méo ảnh
            }}>
              <img 
                src={hotel?.photos?.[0]?.url || roomSnapshot?.image || "https://via.placeholder.com/300"} 
                alt="room" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
              <Box sx={{ 
                position: 'absolute', top: 12, left: 12, 
                bgcolor: tagInfo.bg, color: "#fff", 
                px: 1.2, py: 0.4, borderRadius: "6px", 
                fontSize: 10, fontWeight: 800, textTransform: 'uppercase'
              }}>
                {tagInfo.text}
              </Box>
            </Box>

            {/* 2. KHỐI NỘI DUNG: Tự động dãn theo khoảng trống */}
            <Box flex={1} sx={{ minWidth: 0 }}> {/* minWidth: 0 quan trọng để Text noWrap hoạt động */}
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={0.5}>
                <Box sx={{ minWidth: 0 }}>
                  <Typography 
                    noWrap 
                    sx={{ 
                      fontSize: isMobile ? "1.1rem" : "1.25rem", 
                      fontWeight: 800, color: "#1C1B19", 
                      fontFamily: "'Playfair Display', serif" 
                    }}
                  >
                    {hotel?.name || "Luxstay Hotel"}
                  </Typography>
                  
                  {hotel?.address && (
                    <Typography 
                      variant="caption" 
                      sx={{ 
                        color: "#72716E", display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.2, 
                        fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap'
                      }}
                    >
                      <LocationOn sx={{ fontSize: 14, color: "#C2A56D" }} /> {hotel.address}
                    </Typography>
                  )}
                  <Typography variant="caption" sx={{ color: "#72716E", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                    <Hotel sx={{ fontSize: 14 }} /> {room?.name || roomSnapshot?.name}
                  </Typography>
                </Box>
                <Chip label={payInfo.label} size="small" sx={{ bgcolor: payInfo.bgcolor, color: payInfo.color, fontWeight: 800, fontSize: 10, flexShrink: 0, ml: 1 }} />
              </Stack>

              <Box sx={{ bgcolor: "#F9F8F6", p: 1.5, borderRadius: "12px", my: 1.5 }}>
                <Typography sx={{ fontSize: 13, fontWeight: 700, display: 'flex', alignItems: 'center' }}>
                  <CalendarToday sx={{ fontSize: 14, color: '#C2A56D', mr: 1 }} />
                  {new Date(checkIn).toLocaleDateString("vi-VN")} — {new Date(checkOut).toLocaleDateString("vi-VN")}
                </Typography>
              </Box>

              {/* 3. KHỐI FOOTER: Responsive Giá & Nút */}
              <Stack 
                direction={isMobile ? "column" : "row"} 
                justifyContent="space-between" 
                alignItems={isMobile ? "stretch" : "center"} 
                spacing={2}
              >
                <Box>
                  <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 700, fontSize: 10 }}>GIÁ TRỊ</Typography>
                  <Typography sx={{ fontSize: "1.45rem", fontWeight: 900, color: "#1C1B19", lineHeight: 1 }}>
                    {total.toLocaleString("vi-VN")} <span style={{ fontSize: 14 }}>VND</span>
                  </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                  {canReview && (
                    <Button 
                      variant="contained" 
                      fullWidth={isMobile}
                      onClick={handleOpenReview}
                      startIcon={<StarBorder />}
                      sx={{ bgcolor: "#C2A56D", color: "#fff", borderRadius: "10px", fontWeight: 700, textTransform: 'none', px: 3, "&:hover": { bgcolor: "#A88B4F" } }}
                    >
                      Đánh giá
                    </Button>
                  )}
                  {canPay && (
                    <Button 
                      variant="contained"
                      fullWidth={isMobile}
                      onClick={() => navigate(`/checkout/${bookingId}`)}
                      startIcon={<Payment />}
                      sx={{ bgcolor: "#1C1B19", color: "#fff", borderRadius: "10px", fontWeight: 700, textTransform: 'none', px: 3, "&:hover": { bgcolor: "#333" } }}
                    >
                      Thanh toán
                    </Button>
                  )}
                  <Button 
                    variant="outlined" 
                    fullWidth={isMobile}
                    onClick={() => onView(booking)}
                    sx={{ borderColor: "#1C1B19", color: "#1C1B19", borderRadius: "10px", fontWeight: 700, textTransform: 'none', px: 3 }}
                  >
                    Chi tiết
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </MotionCard>

      {/* Dialog Review: Responsive cho màn hình nhỏ */}
      <Dialog 
        open={openReview} 
        onClose={handleCloseReview} 
        fullWidth 
        maxWidth="sm" 
        fullScreen={isMobile} // Toàn màn hình trên mobile để dễ nhập liệu
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : "20px" } }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {reviewSuccess ? "Hoàn tất" : "Đánh giá kỳ nghỉ"}
          {!reviewSuccess && <IconButton onClick={handleCloseReview} disabled={submitting}><Close /></IconButton>}
        </DialogTitle>
        
        <DialogContent dividers sx={{ minHeight: 220, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <AnimatePresence mode="wait">
            {reviewSuccess ? (
              <Box component={motion.div} key="success" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} sx={{ textAlign: 'center' }}>
                <CheckCircleOutline sx={{ fontSize: 60, color: '#10b981', mb: 1 }} />
                <Typography variant="h6" sx={{ fontWeight: 800 }}>Cảm ơn bạn đã đánh giá!</Typography>
                <Typography variant="body2" color="text.secondary">Ý kiến của bạn giúp chúng tôi cải thiện dịch vụ.</Typography>
              </Box>
            ) : (
              <Box component={motion.div} key="form" exit={{ opacity: 0, scale: 0.9 }} sx={{ width: '100%', textAlign: 'center' }}>
                <Rating size="large" value={userStars} onChange={(e, v) => setUserStars(v)} sx={{ mb: 2, color: '#C2A56D' }} disabled={submitting} />
                <TextField 
                  fullWidth multiline rows={isMobile ? 8 : 4} 
                  placeholder="Chia sẻ trải nghiệm của bạn..." 
                  value={comment} 
                  onChange={(e) => setComment(e.target.value)} 
                  disabled={submitting}
                  sx={{ bgcolor: "#F9F8F6", "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
                />
              </Box>
            )}
          </AnimatePresence>
        </DialogContent>

        {!reviewSuccess && (
          <DialogActions sx={{ p: 3 }}>
            <Button onClick={handleCloseReview} disabled={submitting} sx={{ fontWeight: 700, color: "#72716E" }}>Hủy</Button>
            <Button 
              variant="contained" 
              disabled={!comment.trim() || submitting} 
              onClick={handleSubmitReview}
              sx={{ bgcolor: "#1C1B19", px: 4, borderRadius: "10px", fontWeight: 700 }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : "Gửi ngay"}
            </Button>
          </DialogActions>
        )}
      </Dialog>

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} sx={{ borderRadius: '10px', fontWeight: 600 }}>{toast.message}</Alert>
      </Snackbar>
    </>
  );
}