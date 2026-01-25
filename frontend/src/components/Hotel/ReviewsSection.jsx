import { useEffect, useState } from "react";
import { 
  Box, Typography, Stack, Rating, TextField, Button, 
  Avatar, CircularProgress, Alert, Snackbar, Grid 
} from "@mui/material";
import { 
  BedOutlined, 
  CalendarMonthOutlined, 
  PeopleOutlined, 
  CheckCircle,
  ExpandMore
} from "@mui/icons-material";
import { motion, AnimatePresence } from "framer-motion";
import { format } from "date-fns";
import { vi } from "date-fns/locale";
import { getHotelReviews, createReview } from "../../api/review.api";

const MotionBox = motion(Box);

export default function ReviewsSection({ rating, reviews, hotelId, onReviewSuccess }) {
  const [comment, setComment] = useState("");
  const [userStars, setUserStars] = useState(5);
  const [listReviews, setListReviews] = useState([]);
  const [visibleCount, setVisibleCount] = useState(5);
  const [submitting, setSubmitting] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [toast, setToast] = useState({ open: false, message: "", severity: "success" });

  // 1. Lấy dữ liệu đánh giá
  useEffect(() => {
    if (!hotelId) return;
    const fetchReviews = async () => {
      setFetching(true);
      try {
        const res = await getHotelReviews(hotelId);
        setListReviews(res.data?.data || []);
      } catch (err) {
        console.error("❌ Lỗi fetch reviews:", err);
      } finally {
        setFetching(false);
      }
    };
    fetchReviews();
  }, [hotelId]);

  // 2. Xử lý gửi đánh giá
  const handleSubmitReview = async () => {
    if (!comment.trim()) return;
    setSubmitting(true);
    try {
      const res = await createReview({
        hotelId,
        rating: userStars * 2,
        comment,
      });

      setListReviews((prev) => [res.data.data, ...prev]);
      setComment("");
      setUserStars(5);
      setToast({ open: true, message: "Cảm ơn bạn đã đánh giá!", severity: "success" });
      if (onReviewSuccess) onReviewSuccess();
    } catch (err) {
      setToast({ 
        open: true, 
        message: err.response?.data?.message || "Lỗi khi gửi đánh giá!", 
        severity: "error" 
      });
    } finally {
      setSubmitting(false);
    }
  };

  // 3. Xử lý hiển thị thêm (Load More)
  const handleLoadMore = () => {
    setLoadingMore(true);
    // Giả lập độ trễ 500ms để tạo hiệu ứng mượt mà
    setTimeout(() => {
      setVisibleCount((prev) => prev + 5);
      setLoadingMore(false);
    }, 500);
  };

  const handleCloseToast = () => setToast({ ...toast, open: false });

  return (
    <Box sx={{ mt: 6 }}>
      {/* TỔNG QUAN ĐIỂM SỐ */}
      <Stack direction="row" spacing={2} alignItems="center" mb={5}>
        <Box sx={{ 
          bgcolor: "#003580", color: "#fff", px: 1.8, py: 1.2, 
          borderRadius: "8px 8px 8px 0", fontWeight: 800, fontSize: "1.4rem"
        }}>
          {rating ? Number(rating).toFixed(1) : "0.0"}
        </Box>
        <Box>
          <Typography variant="h6" fontWeight={800} sx={{ color: "#1a1a1a" }}>
            {rating >= 9 ? "Trên cả tuyệt vời" : rating >= 8 ? "Rất tốt" : "Hài lòng"}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Dựa trên {reviews || 0} bài đánh giá đã xác thực
          </Typography>
        </Box>
      </Stack>

      {/* FORM NHẬP BÌNH LUẬN */}
      <Box sx={{ bgcolor: "#f0f4fa", p: 3, borderRadius: "12px", mb: 8, border: "1px solid #e0e0e0" }}>
        <Typography variant="subtitle1" fontWeight={700} mb={2}>Để lại đánh giá của bạn</Typography>
        <Stack direction="row" spacing={2}>
          <Avatar sx={{ bgcolor: "#003580", width: 48, height: 48 }}>U</Avatar>
          <Box sx={{ flex: 1 }}>
            <Stack direction="row" alignItems="center" spacing={1} mb={2}>
              <Typography variant="body2" fontWeight={600}>Xếp hạng:</Typography>
              <Rating value={userStars} onChange={(e, v) => setUserStars(v)} />
            </Stack>
            <TextField
              fullWidth multiline rows={3}
              placeholder="Bạn cảm thấy thế nào về kỳ nghỉ này?"
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              sx={{ bgcolor: "#fff", borderRadius: "8px" }}
            />
            <Button 
              variant="contained" 
              disabled={!comment.trim() || submitting}
              onClick={handleSubmitReview}
              sx={{ mt: 2, bgcolor: "#006ce4", textTransform: 'none', px: 4, borderRadius: "4px" }}
            >
              {submitting ? <CircularProgress size={24} color="inherit" /> : "Gửi đánh giá"}
            </Button>
          </Box>
        </Stack>
      </Box>

      {/* DANH SÁCH ĐÁNH GIÁ */}
      <Stack spacing={0}>
        {fetching ? (
          <Box sx={{ textAlign: 'center', py: 8 }}><CircularProgress /></Box>
        ) : (
          <AnimatePresence>
            {listReviews.slice(0, visibleCount).map((rev) => (
              <MotionBox 
                key={rev._id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                sx={{ py: 5, borderTop: "1px solid #e7e7e7" }}
              >
                <Grid container spacing={4}>
                  {/* SIDEBAR: THÔNG TIN NGƯỜI DÙNG & PHÒNG */}
                  <Grid item xs={12} md={3.5}>
                    <Stack spacing={2.5}>
                      <Stack direction="row" spacing={2} alignItems="center">
                        <Avatar sx={{ bgcolor: "#f2f2f2", color: "#555", fontWeight: 700, border: "1px solid #ddd" }}>
                          {rev.userId?.name?.charAt(0).toUpperCase()}
                        </Avatar>
                        <Box>
                          <Typography variant="subtitle2" fontWeight={700}>{rev.userId?.name}</Typography>
                          <Typography variant="caption" color="text.secondary">🇻🇳 Việt Nam</Typography>
                        </Box>
                      </Stack>

                      <Stack spacing={1.5} sx={{ pl: 0.5 }}>
                        <Stack direction="row" spacing={1.5} alignItems="flex-start" sx={{ color: "#003580" }}>
                          <BedOutlined sx={{ fontSize: 18 }} />
                          <Typography variant="caption" fontWeight={700} sx={{ lineHeight: 1.4 }}>
                            {rev.roomName}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: "#444" }}>
                          <CalendarMonthOutlined sx={{ fontSize: 18 }} />
                          <Typography variant="caption">
                            {rev.stayDuration} đêm • {rev.stayMonth}
                          </Typography>
                        </Stack>
                        <Stack direction="row" spacing={1.5} alignItems="center" sx={{ color: "#444" }}>
                          <PeopleOutlined sx={{ fontSize: 18 }} />
                          <Typography variant="caption">
                            {rev.numberOfGuests} người lớn
                          </Typography>
                        </Stack>
                      </Stack>
                    </Stack>
                  </Grid>

                  {/* NỘI DUNG ĐÁNH GIÁ */}
                  <Grid item xs={12} md={8.5}>
                    <Stack spacing={2}>
                      <Stack direction="row" justifyContent="space-between" alignItems="center">
                        <Typography variant="caption" color="text.secondary">
                          Đã đánh giá: {rev.createdAt ? format(new Date(rev.createdAt), "d MMMM yyyy", { locale: vi }) : "N/A"}
                        </Typography>
                        <Box sx={{ bgcolor: "#003580", color: "#fff", px: 1.2, py: 0.6, borderRadius: "4px 4px 4px 0", fontWeight: 700 }}>
                          {Number(rev.rating).toFixed(1)}
                        </Box>
                      </Stack>

                      {rev.isVerified && (
                        <Stack direction="row" spacing={0.8} alignItems="center" sx={{ color: "#008009" }}>
                          <CheckCircle sx={{ fontSize: 16 }} />
                          <Typography variant="caption" fontWeight={700}>Đã xác nhận đặt phòng</Typography>
                        </Stack>
                      )}

                      <Typography variant="body1" sx={{ color: "#1a1a1a", lineHeight: 1.8, fontSize: "0.95rem" }}>
                        "{rev.comment}"
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>
              </MotionBox>
            ))}
          </AnimatePresence>
        )}
      </Stack>

      {/* NÚT TẢI THÊM (LOAD MORE) */}
      {!fetching && listReviews.length > visibleCount && (
        <Box sx={{ textAlign: 'center', mt: 4, pb: 4 }}>
          <Button 
            variant="outlined"
            onClick={handleLoadMore}
            disabled={loadingMore}
            endIcon={loadingMore ? <CircularProgress size={16} color="inherit" /> : <ExpandMore />}
            sx={{ 
              textTransform: 'none', fontWeight: 700, px: 5, py: 1,
              color: "#006ce4", borderColor: "#006ce4",
              "&:hover": { bgcolor: "rgba(0,108,228,0.05)", borderColor: "#006ce4" }
            }}
          >
            {loadingMore ? "Đang tải..." : "Hiển thị thêm kết quả"}
          </Button>
        </Box>
      )}

      <Snackbar open={toast.open} autoHideDuration={4000} onClose={handleCloseToast}>
        <Alert onClose={handleCloseToast} severity={toast.severity} variant="filled" sx={{ width: '100%' }}>
          {toast.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}