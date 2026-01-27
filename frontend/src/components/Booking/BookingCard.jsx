import React, { useState } from "react";
import {
  Card, CardContent, Typography, Box, Chip, Stack, Button, useTheme, useMediaQuery,
  Dialog, DialogTitle, DialogContent, DialogActions, TextField, Rating, CircularProgress,
  IconButton, Alert, Snackbar
} from "@mui/material";
import { 
  CalendarToday, Hotel, AccessTime, Close, StarBorder
} from "@mui/icons-material";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { createReview } from "../../api/review.api";

const MotionCard = motion(Card);

export default function BookingCard({ booking, onView }) {
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  /* ================= REVIEW STATE ================= */
  const [openReview, setOpenReview] = useState(false);
  const [userStars, setUserStars] = useState(5);
  const [comment, setComment] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  if (!booking) return null;

  const { 
    _id: bookingId,
    status, 
    paymentStatus, 
    totalPrice, 
    depositAmount, 
    expireAt, 
    roomSnapshot, 
    room,
    checkIn,
    checkOut,
    hotel 
  } = booking;
  
  const total = totalPrice || 0;
  const paid = depositAmount || 0;
  const isPaidFull = (paymentStatus === 'PAID' && paid >= total);
  const isOnlyDeposited = (paymentStatus === 'DEPOSITED') || (paymentStatus === 'PAID' && paid < total && paid > 0);
  const isExpired = status === 'pending' && paymentStatus === 'UNPAID' && expireAt && new Date(expireAt) < new Date();
  
  // Chỉ cho phép đánh giá khi trạng thái đơn hàng là completed
  const canReview = status === 'completed' || isPaidFull;

  /* ================= HANDLERS ================= */
  const handleOpenReview = (e) => {
    e.stopPropagation();
    setOpenReview(true);
  };

  const handleCloseReview = () => {
    setOpenReview(false);
    setComment("");
    setUserStars(5);
  };

  const handleSubmitReview = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      await createReview({
        hotelId: hotel?._id || roomSnapshot?.hotelId,
        bookingId: bookingId,
        rating: userStars * 2, // Đồng bộ thang điểm 10 với Backend
        comment
      });

      setToast({ open: true, message: "Cảm ơn bạn đã đánh giá!", severity: "success" });
      handleCloseReview();
    } catch (err) {
      setToast({ 
        open: true, 
        message: err.response?.data?.message || "Không thể gửi đánh giá!", 
        severity: "error" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  const payInfo = (() => {
    if (status === 'no_show') return { label: "Mất cọc (No-show)", color: "#991b1b", bgcolor: "rgba(153, 27, 27, 0.1)" };
    if (paymentStatus === 'REFUNDED') return { label: "Đã hoàn tiền", color: "#7b1fa2", bgcolor: "rgba(123, 31, 162, 0.1)" };
    if (paymentStatus === 'REFUND_PENDING') return { label: "Chờ hoàn tiền", color: "#f57c00", bgcolor: "rgba(245, 124, 0, 0.1)" };
    if (isPaidFull) return { label: "Đã trả đủ", color: "#10b981", bgcolor: "rgba(16, 185, 129, 0.1)" };
    if (isOnlyDeposited) return { label: "Đã cọc 30%", color: "#0288d1", bgcolor: "rgba(2, 136, 209, 0.1)" };
    return { label: "Chưa thanh toán", color: "#C2A56D", bgcolor: "rgba(194, 165, 109, 0.1)" };
  })();

  const tagInfo = (() => {
    if (status === 'cancelled') return { text: "Đã hủy", bg: "#ef4444" };
    // BỔ SUNG TRƯỜNG HỢP NO_SHOW (KHỚP VỚI DATABASE CỦA BẠN)
    if (status === 'no_show') return { text: "Khách không đến", bg: "#991b1b" }; 
    
    if (isExpired) return { text: "Hết hạn thanh toán", bg: "#6b7280" };
    if (status === 'completed') return { text: "Đã hoàn thành", bg: "#10b981" };
    if (isPaidFull) return { text: "Thành công", bg: "#1C1B19" };
    if (isOnlyDeposited) return { text: "Đã giữ chỗ", bg: "#0288d1" };
    return { text: "Chờ xử lý", bg: "#C2A56D" };
  })();

  return (
    <>
      <MotionCard 
        layout
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={{ y: -4 }}
        transition={{ duration: 0.3 }}
        sx={{ 
          mb: 3, borderRadius: "20px", border: '1px solid #EAE9E2',
          bgcolor: '#fff', position: 'relative', overflow: 'hidden',
          boxShadow: '0 4px 20px rgba(0,0,0,0.03)'
        }}
      >
        <CardContent sx={{ p: isMobile ? 2 : 3 }}>
          <Stack direction={isMobile ? "column" : "row"} spacing={isMobile ? 2 : 3}>
            
            {/* PHẦN ẢNH & TAG TRẠNG THÁI */}
            <Box sx={{ width: isMobile ? "100%" : 180, height: isMobile ? 180 : 160, borderRadius: "16px", overflow: "hidden", position: 'relative' }}>
              <img 
                src={roomSnapshot?.image || room?.photos?.[0]?.url || "https://via.placeholder.com/300"} 
                alt="room" 
                style={{ width: "100%", height: "100%", objectFit: "cover" }} 
              />
              <Box sx={{ position: 'absolute', top: 12, left: 12, bgcolor: tagInfo.bg, color: "#fff", px: 1.2, py: 0.4, borderRadius: "6px", fontSize: 10, fontWeight: 800, textTransform: 'uppercase' }}>
                {tagInfo.text}
              </Box>
            </Box>

            {/* PHẦN NỘI DUNG CHI TIẾT */}
            <Box flex={1}>
              <Stack direction="row" justifyContent="space-between" alignItems="flex-start" mb={1}>
                <Box>
                  <Typography sx={{ fontSize: isMobile ? "1.1rem" : "1.25rem", fontWeight: 800, color: "#1C1B19", fontFamily: "'Playfair Display', serif" }}>
                    {roomSnapshot?.hotelName || "Luxstay Hotel"}
                  </Typography>
                  <Typography variant="caption" sx={{ color: "#72716E", fontWeight: 600, display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <Hotel sx={{ fontSize: 14 }} />
                    {roomSnapshot?.name || "Premium Room"}
                  </Typography>
                </Box>
                <Chip label={payInfo.label} size="small" sx={{ bgcolor: payInfo.bgcolor, color: payInfo.color, fontWeight: 800, fontSize: 10 }} />
              </Stack>

              <Box sx={{ bgcolor: "#F9F8F6", p: 1.5, borderRadius: "12px", my: 1.5 }}>
                <Stack direction="row" spacing={2} alignItems="center">
                  <CalendarToday sx={{ fontSize: 14, color: '#C2A56D' }} />
                  <Typography sx={{ fontSize: 13, fontWeight: 700 }}>
                    {new Date(checkIn).toLocaleDateString("vi-VN")} — {new Date(checkOut).toLocaleDateString("vi-VN")}
                  </Typography>
                  {isExpired && (
                    <Stack direction="row" alignItems="center" spacing={0.5} sx={{ color: '#ef4444' }}>
                      <AccessTime sx={{ fontSize: 14 }} />
                      <Typography variant="caption" fontWeight={700}>Hết hạn</Typography>
                    </Stack>
                  )}
                </Stack>
              </Box>

              <Stack direction={isMobile ? "column" : "row"} justifyContent="space-between" alignItems="flex-end" spacing={2}>
                <Box>
                  <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 700, textTransform: "uppercase", fontSize: 10 }}>
                    {isOnlyDeposited ? "Tổng tiền (Đã thanh toán cọc)" : "Tổng giá trị đơn hàng"}
                  </Typography>
                  <Typography sx={{ fontSize: "1.45rem", fontWeight: 900, color: "#1C1B19", lineHeight: 1.2 }}>
                    {total.toLocaleString("vi-VN")} <span style={{ fontSize: 14 }}>VND</span>
                  </Typography>
                  
                  {isOnlyDeposited && (
                    <Box sx={{ mt: 0.5, p: 0.5, px: 1, bgcolor: 'rgba(2, 136, 209, 0.05)', borderRadius: '6px', display: 'inline-block' }}>
                      <Typography variant="caption" sx={{ color: "#0288d1", fontWeight: 700 }}>
                        Đã cọc: {paid.toLocaleString()} đ — Còn lại: {(total - paid).toLocaleString()} đ
                      </Typography>
                    </Box>
                  )}
                </Box>

                <Stack direction="row" spacing={1.5}>
                  {/* NÚT ĐÁNH GIÁ TÍCH HỢP */}
                  {canReview && (
                    <Button 
                      variant="contained"
                      onClick={handleOpenReview}
                      startIcon={<StarBorder />}
                      sx={{ 
                        bgcolor: "#C2A56D", color: "#fff", borderRadius: "10px", px: 2,
                        fontWeight: 700, textTransform: 'none', "&:hover": { bgcolor: "#A88B4F" }
                      }}
                    >
                      Để lại đánh giá
                    </Button>
                  )}

                  {paymentStatus === 'UNPAID' && !isExpired && status !== 'cancelled' && (
                    <Button 
                      variant="contained"
                      onClick={() => navigate(`/checkout/${room?._id || roomSnapshot?._id}`, { state: booking })}
                      sx={{ 
                        bgcolor: "#1C1B19", color: "#fff", borderRadius: "10px", px: 3,
                        fontWeight: 700, textTransform: 'none', "&:hover": { bgcolor: "#333" }
                      }}
                    >
                      Thanh toán
                    </Button>
                  )}
                  <Button 
                    variant="outlined"
                    onClick={() => onView(booking)}
                    sx={{ 
                      borderColor: "#1C1B19", color: "#1C1B19", borderRadius: "10px", px: 3,
                      fontWeight: 700, textTransform: 'none', "&:hover": { borderColor: "#333", bgcolor: 'transparent' }
                    }}
                  >
                    Xem chi tiết
                  </Button>
                </Stack>
              </Stack>
            </Box>
          </Stack>
        </CardContent>
      </MotionCard>

      {/* ================= REVIEW DIALOG ================= */}
      <Dialog 
        open={openReview} 
        onClose={handleCloseReview} 
        fullWidth 
        maxWidth="sm" 
        PaperProps={{ sx: { borderRadius: "20px", p: 1 } }}
      >
        <DialogTitle sx={{ fontWeight: 800, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontFamily: "'Playfair Display', serif" }}>
          Đánh giá kỳ nghỉ của bạn
          <IconButton onClick={handleCloseReview}><Close /></IconButton>
        </DialogTitle>
        <DialogContent dividers sx={{ borderBottom: 'none' }}>
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="body2" color="text.secondary" mb={1}>
              Bạn thấy trải nghiệm tại <b>{roomSnapshot?.hotelName}</b> thế nào?
            </Typography>
            <Rating 
              size="large"
              value={userStars}
              onChange={(e, v) => setUserStars(v)}
              sx={{ mb: 3, color: '#C2A56D' }}
            />
            <TextField
              fullWidth
              multiline
              rows={4}
              placeholder="Chia sẻ chi tiết về phòng ốc, dịch vụ và vị trí nhé..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ 
                bgcolor: "#F9F8F6",
                "& .MuiOutlinedInput-root": { borderRadius: "12px" }
              }}
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ p: 3, pt: 0 }}>
          <Button onClick={handleCloseReview} sx={{ color: "#72716E", fontWeight: 700, textTransform: 'none' }}>Hủy</Button>
          <Button 
            variant="contained" 
            disabled={!comment.trim() || submitting}
            onClick={handleSubmitReview}
            sx={{ 
              bgcolor: "#1C1B19", px: 4, borderRadius: "10px", fontWeight: 700, textTransform: 'none',
              "&:hover": { bgcolor: "#333" }
            }}
          >
            {submitting ? <CircularProgress size={24} color="inherit" /> : "Gửi đánh giá ngay"}
          </Button>
        </DialogActions>
      </Dialog>

      {/* THÔNG BÁO KẾT QUẢ */}
      <Snackbar open={toast.open} autoHideDuration={4000} onClose={() => setToast({ ...toast, open: false })}>
        <Alert severity={toast.severity} sx={{ borderRadius: '10px', fontWeight: 600 }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </>
  );
}