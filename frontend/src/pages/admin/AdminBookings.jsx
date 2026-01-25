import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Stack, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Button, CircularProgress, Tooltip, Divider
} from "@mui/material";
import { getAdminBookings, updateContactStatus, markBookingPaid, confirmRefunded } from "../../api/admin.api";
import AdminBookingLogsDialog from "./AdminBookingLogsDialog";
import { 
  CheckCircle, Cancel, Payment, 
  CurrencyExchange 
} from "@mui/icons-material";

/* ================= HELPERS ================= */

const bookingColor = (status) => {
  switch (status) {
    case "pending": return { color: "#C2A56D", bg: "rgba(194, 165, 109, 0.1)", label: "Chờ cọc" };
    case "confirmed": return { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", label: "Thành công" };
    case "cancelled": return { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", label: "Đã hủy" };
    default: return { color: "#72716E", bg: "#F5F5F5", label: status };
  }
};

const paymentStatusConfig = (status, isPaidFull, hasPaidSomething) => {
  if (status === "REFUND_PENDING") return { label: "CHỜ HOÀN TIỀN", color: "error" };
  if (status === "REFUNDED") return { label: "ĐÃ HOÀN TIỀN", color: "secondary" };
  if (isPaidFull) return { label: "ĐÃ THANH TOÁN", color: "success" };
  if (hasPaidSomething) return { label: "THANH TOÁN MỘT PHẦN", color: "primary" };
  return { label: "CHƯA THANH TOÁN", color: "warning" };
};

/* ================= MAIN COMPONENT ================= */

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openLogs, setOpenLogs] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      setLoading(true);
      const res = await getAdminBookings();
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch error:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleConfirm = async (id) => {
    if (window.confirm("Xác nhận chuyển trạng thái đơn hàng sang THÀNH CÔNG?")) {
      await updateContactStatus(id, { contactStatus: "CLOSED", result: "CONFIRMED" });
      fetchBookings();
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm("Xác nhận HỦY đơn hàng? Phòng sẽ được giải phóng ngay lập tức.")) {
      await updateContactStatus(id, { contactStatus: "CLOSED", result: "CANCELLED" });
      fetchBookings();
    }
  };

  const handlePaid = async (id) => {
    if (window.confirm("Xác nhận khách đã thanh toán đủ số tiền còn lại bằng TIỀN MẶT?")) {
      await markBookingPaid(id);
      fetchBookings();
    }
  };

  const handleConfirmRefund = async (id) => {
    if (window.confirm("Bạn xác nhận đã hoàn trả tiền cọc cho khách qua ngân hàng?")) {
      try {
        await confirmRefunded(id);
        fetchBookings();
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || "Không thể hoàn tiền"));
      }
    }
  };

  if (loading) return <Box py={10} textAlign="center"><CircularProgress sx={{ color: '#C2A56D' }} /></Box>;

  return (
    <>
      <Stack spacing={3} sx={{ p: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={800} color="#1C1B19">Quản lý Đặt phòng & Thu ngân</Typography>
          <Button variant="outlined" size="small" onClick={fetchBookings} sx={{ borderRadius: '8px' }}>Làm mới dữ liệu</Button>
        </Box>

        <Paper sx={{ borderRadius: "16px", border: "1px solid #E5E2DC", overflow: "hidden", boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F9F8F6" }}>
                <TableCell sx={{ fontWeight: 700 }}>Thông tin khách</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Ngày lưu trú</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Chi tiết tài chính</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Thực thi</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.map((b) => {
                const total = b.totalPrice || 0;
                const paid = b.depositAmount || 0;
                
                const isPaidFull = b.paymentStatus === "PAID" && paid >= total;
                const hasPaidSomething = (paid > 0 && paid < total);
                const isCancelled = b.status === "cancelled";
                const isConfirmed = b.status === "confirmed";
                const isRefundPending = b.paymentStatus === "REFUND_PENDING";

                const bStatus = bookingColor(b.status);
                const pStatus = paymentStatusConfig(b.paymentStatus, isPaidFull, hasPaidSomething);

                return (
                  <TableRow key={b._id} sx={{ opacity: isCancelled ? 0.6 : 1, "&:hover": { bgcolor: "#FDFDFD" } }}>
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>{b.guest?.name || "N/A"}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">{b.guest?.phone}</Typography>
                      <Chip label={`#${b._id.slice(-6).toUpperCase()}`} size="small" sx={{ fontSize: 10, height: 18, mt: 0.5, fontWeight: 700 }} />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {new Date(b.checkIn).toLocaleDateString('vi-VN')} → {new Date(b.checkOut).toLocaleDateString('vi-VN')}
                      </Typography>
                      <Typography variant="caption" color="primary" sx={{ fontWeight: 600 }}>{b.roomSnapshot?.name || b.room?.name}</Typography>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Box display="flex" justifyContent="space-between" width={190}>
                          <Typography variant="caption">Tổng cộng:</Typography>
                          <Typography variant="caption" fontWeight={700}>{total.toLocaleString()} đ</Typography>
                        </Box>
                        
                        {isRefundPending ? (
                          <Box width={190} sx={{ p: 1, bgcolor: '#FFF5F5', borderRadius: '8px', border: '1px solid #FEB2B2', mt: 0.5 }}>
                            <Typography variant="caption" color="error" fontWeight={900}>CẦN HOÀN: {paid.toLocaleString()} đ</Typography>
                          </Box>
                        ) : (
                          <>
                            <Box display="flex" justifyContent="space-between" width={190} color="primary.main">
                              <Typography variant="caption">Đã thu:</Typography>
                              <Typography variant="caption" fontWeight={700}>-{paid.toLocaleString()} đ</Typography>
                            </Box>
                            <Divider sx={{ my: 0.5 }} />
                            <Box display="flex" justifyContent="space-between" width={190} color={isPaidFull ? "success.main" : "error.main"}>
                              <Typography variant="caption" fontWeight={700}>{isPaidFull ? "Đã tất toán:" : "Còn phải thu:"}</Typography>
                              <Typography variant="body2" fontWeight={900}>
                                {isPaidFull ? total.toLocaleString() : (total - paid).toLocaleString()} đ
                              </Typography>
                            </Box>
                          </>
                        )}
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={1}>
                        <Chip size="small" label={bStatus.label} sx={{ bgcolor: bStatus.bg, color: bStatus.color, fontWeight: 800, fontSize: 11 }} />
                        <Chip size="small" label={pStatus.label} color={pStatus.color} variant={isPaidFull ? "contained" : "outlined"} sx={{ fontWeight: 800, fontSize: 10 }} />
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        
                        {isRefundPending && (
                          <Button size="small" variant="contained" color="error" startIcon={<CurrencyExchange />} onClick={() => handleConfirmRefund(b._id)} sx={{ fontWeight: 700 }}>
                            Hoàn tiền
                          </Button>
                        )}

                        {!isCancelled && !isRefundPending && (
                          <>
                            {!isConfirmed && (
                              <Tooltip title="Xác nhận thành công">
                                <Button size="small" variant="contained" color="success" sx={{ minWidth: 40 }} onClick={() => handleConfirm(b._id)}>
                                  <CheckCircle fontSize="small" />
                                </Button>
                              </Tooltip>
                            )}
                            <Tooltip title="Hủy đơn">
                              <Button size="small" variant="outlined" color="error" sx={{ minWidth: 40 }} onClick={() => handleCancel(b._id)}>
                                <Cancel fontSize="small" />
                              </Button>
                            </Tooltip>
                          </>
                        )}

                        {!isPaidFull && !isCancelled && !isRefundPending && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Payment />}
                            onClick={() => handlePaid(b._id)}
                            sx={{ bgcolor: "#FF9800", "&:hover": { bgcolor: "#F57C00" }, fontWeight: 700, textTransform: 'none' }}
                          >
                            Thu tiền mặt
                          </Button>
                        )}

                        <Button size="small" variant="text" sx={{ color: '#72716E', fontWeight: 600 }} onClick={() => { setSelectedBooking(b); setOpenLogs(true); }}>
                          Logs
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </Paper>
      </Stack>

      <AdminBookingLogsDialog open={openLogs} onClose={() => setOpenLogs(false)} booking={selectedBooking} />
    </>
  );
}