import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Stack, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Button, CircularProgress, Tooltip, Divider
} from "@mui/material";
// Giả định bạn thêm API confirmRefunded vào admin.api
import { getAdminBookings, updateContactStatus, markBookingPaid, confirmRefunded } from "../../api/admin.api";
import AdminBookingLogsDialog from "./AdminBookingLogsDialog";
import { 
  AccessTime, CheckCircle, Cancel, Payment, 
  CurrencyExchange, InfoOutlined 
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

const paymentStatusConfig = (status) => {
  switch (status) {
    case "PAID": return { label: "ĐÃ THANH TOÁN", color: "success" };
    case "DEPOSITED": return { label: "ĐÃ CỌC 30%", color: "primary" };
    case "UNPAID": return { label: "CHƯA THANH TOÁN", color: "warning" };
    case "REFUND_PENDING": return { label: "CHỜ HOÀN TIỀN", color: "error" }; // MỚI
    case "REFUNDED": return { label: "ĐÃ HOÀN TIỀN", color: "secondary" };      // MỚI
    default: return { label: status, color: "default" };
  }
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
    await updateContactStatus(id, { contactStatus: "CLOSED", result: "CONFIRMED" });
    fetchBookings();
  };

  const handleCancel = async (id) => {
    if (window.confirm("Xác nhận HỦY đơn hàng này? Hệ thống sẽ giải phóng phòng.")) {
      await updateContactStatus(id, { contactStatus: "CLOSED", result: "CANCELLED" });
      fetchBookings();
    }
  };

  const handlePaid = async (id) => {
    if (window.confirm("Xác nhận đã thu TIỀN MẶT số tiền còn lại từ khách?")) {
      await markBookingPaid(id);
      fetchBookings();
    }
  };

  // MỚI: XỬ LÝ HOÀN TIỀN
  const handleConfirmRefund = async (id) => {
    if (window.confirm("Xác nhận BẠN ĐÃ CHUYỂN KHOẢN hoàn tiền cho khách? Trạng thái sẽ chuyển thành ĐÃ HOÀN TIỀN.")) {
      try {
        await confirmRefunded(id);
        fetchBookings();
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || "Không thể xác nhận hoàn tiền"));
      }
    }
  };

  if (loading) return <Box py={10} textAlign="center"><CircularProgress sx={{ color: '#C2A56D' }} /></Box>;

  return (
    <>
      <Stack spacing={3} sx={{ p: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={800} color="#1C1B19">Quản lý Đặt phòng & Thu ngân</Typography>
          <Button variant="outlined" size="small" onClick={fetchBookings}>Làm mới dữ liệu</Button>
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
                const bStatus = bookingColor(b.status);
                const pStatus = paymentStatusConfig(b.paymentStatus);
                const isCancelled = b.status === "cancelled";
                const isPaidFull = b.paymentStatus === "PAID";
                const isDeposited = b.paymentStatus === "DEPOSITED";
                const isRefundPending = b.paymentStatus === "REFUND_PENDING";

                return (
                  <TableRow 
                    key={b._id} 
                    sx={{ 
                      opacity: isCancelled ? 0.7 : 1,
                      bgcolor: isRefundPending ? "rgba(239, 68, 68, 0.02)" : "inherit",
                      "&:hover": { bgcolor: "#FDFDFD" }
                    }}
                  >
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>{b.guest?.name}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">{b.guest?.phone}</Typography>
                      <Chip label={`#${b._id.slice(-6).toUpperCase()}`} size="small" sx={{ fontSize: 10, height: 18, mt: 0.5 }} />
                    </TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {new Date(b.checkIn).toLocaleDateString('vi-VN')} → {new Date(b.checkOut).toLocaleDateString('vi-VN')}
                      </Typography>
                      <Typography variant="caption" color="primary">{b.roomSnapshot?.name || b.room?.name}</Typography>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5}>
                        <Box display="flex" justifyContent="space-between" width={160}>
                          <Typography variant="caption">Tổng cộng:</Typography>
                          <Typography variant="caption" fontWeight={700}>{b.totalPrice?.toLocaleString()} đ</Typography>
                        </Box>
                        
                        {/* HIỂN THỊ THÔNG TIN HOÀN TIỀN NẾU CÓ */}
                        {isRefundPending ? (
                          <Box width={180} sx={{ p: 1.5, bgcolor: '#FFF5F5', borderRadius: '8px', border: '1px solid #FEB2B2', mt: 1 }}>
    <Typography variant="caption" color="error" fontWeight={900} display="block">
      CẦN HOÀN: {b.refundInfo?.amount?.toLocaleString()} đ
    </Typography>
    <Typography variant="caption" sx={{ fontSize: 10, color: '#555', fontWeight: 600 }}>
      {b.refundInfo?.bankName} - {b.refundInfo?.accountNumber}
    </Typography>
    <Typography variant="caption" sx={{ fontSize: 10, color: '#555', display: 'block', fontStyle: 'italic' }}>
      Chủ: {b.refundInfo?.accountHolder}
    </Typography>
  </Box>
                        ) : (
                          <>
                            {isDeposited && (
                              <Box display="flex" justifyContent="space-between" width={160} color="primary.main">
                                <Typography variant="caption">Đã cọc:</Typography>
                                <Typography variant="caption" fontWeight={700}>-{b.depositAmount?.toLocaleString()} đ</Typography>
                              </Box>
                            )}
                            <Divider />
                            <Box display="flex" justifyContent="space-between" width={160} color={isPaidFull ? "success.main" : "error.main"}>
                              <Typography variant="caption" fontWeight={700}>{isPaidFull ? "Đã thu đủ:" : "Còn phải thu:"}</Typography>
                              <Typography variant="body2" fontWeight={900}>
                                {isPaidFull ? b.totalPrice?.toLocaleString() : b.remainingAmount?.toLocaleString()} đ
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
                        
                        {/* NÚT XÁC NHẬN HOÀN TIỀN (CHỈ HIỆN KHI ĐANG CHỜ HOÀN) */}
                        {isRefundPending && (
                          <Button
                            size="small"
                            variant="contained"
                            color="error"
                            startIcon={<CurrencyExchange />}
                            onClick={() => handleConfirmRefund(b._id)}
                            sx={{ fontWeight: 700 }}
                          >
                            Xác nhận đã hoàn tiền
                          </Button>
                        )}

                        {!isCancelled && !isPaidFull && !isRefundPending && (
                          <>
                            <Tooltip title="Xác nhận đơn hàng">
                              <Button size="small" variant="contained" color="success" sx={{ minWidth: 40 }} onClick={() => handleConfirm(b._id)}>
                                <CheckCircle fontSize="small" />
                              </Button>
                            </Tooltip>
                            <Tooltip title="Hủy đơn hàng">
                              <Button size="small" variant="outlined" color="error" sx={{ minWidth: 40 }} onClick={() => handleCancel(b._id)}>
                                <Cancel fontSize="small" />
                              </Button>
                            </Tooltip>
                          </>
                        )}

                        {isDeposited && !isPaidFull && !isCancelled && !isRefundPending && (
                          <Button
                            size="small"
                            variant="contained"
                            startIcon={<Payment />}
                            onClick={() => handlePaid(b._id)}
                            sx={{ bgcolor: "#FF9800", "&:hover": { bgcolor: "#F57C00" }, fontWeight: 700 }}
                          >
                            Thu tiền mặt
                          </Button>
                        )}

                        <Button 
                          size="small" 
                          variant="text" 
                          sx={{ color: '#72716E' }}
                          onClick={() => { setSelectedBooking(b); setOpenLogs(true); }}
                        >
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