import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Stack, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Button, CircularProgress, Tooltip, Divider
} from "@mui/material";
import { getAdminBookings, updateContactStatus, markBookingPaid } from "../../api/admin.api";
import AdminBookingLogsDialog from "./AdminBookingLogsDialog";
import { AccessTime, CheckCircle, Cancel, Payment } from "@mui/icons-material";

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
                <TableCell sx={{ fontWeight: 700 }}>Ngày đặt / Lưu trú</TableCell>
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

                return (
                  <TableRow 
                    key={b._id} 
                    sx={{ 
                      opacity: isCancelled ? 0.6 : 1,
                      bgcolor: isDeposited && !isPaidFull ? "rgba(2, 136, 209, 0.02)" : "inherit",
                      "&:hover": { bgcolor: "#FDFDFD" }
                    }}
                  >
                    {/* KHÁCH HÀNG */}
                    <TableCell>
                      <Typography variant="body2" fontWeight={700}>{b.guest?.name}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">{b.guest?.phone}</Typography>
                      <Chip label={`#${b._id.slice(-6).toUpperCase()}`} size="small" sx={{ fontSize: 10, height: 18, mt: 0.5 }} />
                    </TableCell>

                    {/* NGÀY THÁNG */}
                    <TableCell>
                      <Typography variant="caption" color="text.secondary" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        <AccessTime sx={{ fontSize: 12 }} /> Đặt lúc: {new Date(b.createdAt).toLocaleString('vi-VN')}
                      </Typography>
                      <Typography variant="body2" fontWeight={600} sx={{ mt: 1 }}>
                        {new Date(b.checkIn).toLocaleDateString('vi-VN')} → {new Date(b.checkOut).toLocaleDateString('vi-VN')}
                      </Typography>
                      <Typography variant="caption" color="primary">{b.room?.name} | {b.guestsCount} khách</Typography>
                    </TableCell>

                    {/* TÀI CHÍNH */}
                    <TableCell>
                      <Stack spacing={0.5}>
                        <Box display="flex" justifyContent="space-between" width={160}>
                          <Typography variant="caption">Tổng cộng:</Typography>
                          <Typography variant="caption" fontWeight={700}>{b.totalPrice?.toLocaleString()} đ</Typography>
                        </Box>
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
                      </Stack>
                    </TableCell>

                    {/* TRẠNG THÁI */}
                    <TableCell>
                      <Stack spacing={1}>
                        <Chip 
                          size="small" 
                          label={bStatus.label} 
                          sx={{ bgcolor: bStatus.bg, color: bStatus.color, fontWeight: 800, fontSize: 11 }} 
                        />
                        <Chip 
                          size="small" 
                          label={pStatus.label} 
                          color={pStatus.color}
                          variant={isPaidFull ? "contained" : "outlined"}
                          sx={{ fontWeight: 800, fontSize: 10 }}
                        />
                      </Stack>
                    </TableCell>

                    {/* HÀNH ĐỘNG */}
                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        {/* Nhóm nút Duyệt/Hủy cho CSKH */}
                        {!isCancelled && !isPaidFull && (
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

                        {/* NÚT THU TIỀN MẶT - CHỈ HIỆN KHI ĐÃ CỌC & CHƯA TRẢ ĐỦ & KHÔNG HỦY */}
                        {isDeposited && !isPaidFull && !isCancelled && (
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