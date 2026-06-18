import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Stack, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Button, CircularProgress, TableContainer
} from "@mui/material";
import { Refresh } from "@mui/icons-material";
import { getAdminBookings, updateContactStatus, markBookingPaid, confirmRefunded, markNoShow, cancelBookingByAdmin } from "../../api/admin.api";
import AdminBookingLogsDialog from "./AdminBookingLogsDialog";

/* ================= HELPERS ================= */

const bookingColor = (status) => {
  switch (status) {
    case "pending": return { color: "#C2A56D", bg: "rgba(194, 165, 109, 0.1)", label: "Chờ cọc" };
    case "confirmed": return { color: "#10b981", bg: "rgba(16, 185, 129, 0.1)", label: "Thành công" };
    case "cancelled": return { color: "#EF4444", bg: "rgba(239, 68, 68, 0.1)", label: "Đã hủy" };
    case "no_show": return { color: "#F59E0B", bg: "rgba(245, 158, 11, 0.1)", label: "Bùng phòng" };
    default: return { color: "#72716E", bg: "#F5F5F5", label: status };
  }
};

const paymentStatusConfig = (status, isPaidFull, hasPaidSomething) => {
  if (status === "REFUND_PENDING") return { label: "CHỜ HOÀN TIỀN", color: "error" };
  if (status === "REFUNDED") return { label: "ĐÃ HOÀN TIỀN", color: "secondary" };
  if (isPaidFull) return { label: "ĐÃ THANH TOÁN", color: "success" };
  if (hasPaidSomething) return { label: "ĐÃ ĐẶT CỌC", color: "primary" };
  return { label: "CHƯA THANH TOÁN", color: "warning" };
};

/* ================= COMPONENT ================= */

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
    } catch (err) { console.error(err); } 
    finally { setLoading(false); }
  }, []);

  useEffect(() => { fetchBookings(); }, [fetchBookings]);

  const handleConfirm = async (id) => { if(window.confirm("Xác nhận thành công?")) { await updateContactStatus(id, { contactStatus: "CLOSED", result: "CONFIRMED" }); fetchBookings(); }};
  const handleCancel = async (id) => { if(window.confirm("Hủy đơn này?")) { await cancelBookingByAdmin(id); fetchBookings(); }};
  const handleNoShow = async (id) => { if(window.confirm("Xác nhận khách bùng?")) { await markNoShow(id); fetchBookings(); }};
  const handlePaid = async (id) => { if(window.confirm("Xác nhận đã thu tiền?")) { await markBookingPaid(id); fetchBookings(); }};
  const handleConfirmRefund = async (id) => { if(window.confirm("Xác nhận hoàn cọc?")) { await confirmRefunded(id); fetchBookings(); }};

  if (loading) return <Box py={10} textAlign="center"><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 3 }}>
      <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
        <Typography variant="h5" fontWeight={800}>Quản trị Lưu trú</Typography>
        <Button variant="outlined" startIcon={<Refresh />} onClick={fetchBookings}>Làm mới</Button>
      </Stack>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: "1px solid #E5E2DC" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F9F8F6" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem' }}>Khách hàng</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem' }}>Lưu trú</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem' }}>Thời gian</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem' }}>Tài chính</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem', width: '160px' }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 800, fontSize: '0.95rem' }} align="right">Thao tác</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {bookings.map((b) => {
              const total = b.totalPrice || 0;
              const paid = b.depositAmount || 0;
              const isPaidFull = b.paymentStatus === "PAID";
              const isCancelled = b.status === "cancelled";
              const isNoShow = b.status === "no_show";
              
              const bStatus = bookingColor(b.status);
              const pStatus = paymentStatusConfig(b.paymentStatus, isPaidFull, paid > 0 && !isPaidFull);

              return (
                <TableRow key={b._id} hover>
                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body1" fontWeight={700}>{b.guest?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{b.guest?.phone}</Typography>
                  </TableCell>
                  
                  <TableCell sx={{ whiteSpace: 'nowrap', py: 2 }}>
                    <Typography variant="body2" fontWeight={700} color="primary" display="block">
                      {b.hotel?.name || b.hotelSnapshot?.name || "Chưa xác định"}
                    </Typography>
                    <Typography variant="body2" display="block">Phòng: {b.roomSnapshot?.name}</Typography>
                    <Typography variant="body2" color="text.secondary">{b.guests || 1} khách</Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Typography variant="body2">
                      {new Date(b.checkIn).toLocaleDateString('vi-VN')} - {new Date(b.checkOut).toLocaleDateString('vi-VN')}
                    </Typography>
                  </TableCell>

                  <TableCell sx={{ whiteSpace: 'nowrap', py: 2 }}>
                    <Typography variant="body2" display="block">Tổng: {total.toLocaleString()}đ</Typography>
                    <Typography variant="body2" display="block" color="primary" fontWeight={600}>Đã thu: {paid.toLocaleString()}đ</Typography>
                  </TableCell>

                  <TableCell sx={{ py: 2 }}>
                    <Stack spacing={0.8}>
                      <Box sx={{ px: 1.5, py: 0.8, borderRadius: "6px", bgcolor: bStatus.bg, color: bStatus.color, fontSize: '0.85rem', fontWeight: 700, textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {bStatus.label}
                      </Box>
                      <Box sx={{ px: 1.5, py: 0.8, borderRadius: "6px", bgcolor: "#F5F5F5", color: "text.secondary", fontSize: '0.85rem', textAlign: 'center', whiteSpace: 'nowrap' }}>
                        {pStatus.label}
                      </Box>
                    </Stack>
                  </TableCell>

                  <TableCell align="right" sx={{ py: 2 }}>
                    <Stack direction="row" spacing={0.5} justifyContent="flex-end">
                      {!isPaidFull && !isCancelled && !isNoShow && (
                        <>
                          {b.status !== "confirmed" && (
                            <Button size="small" variant="outlined" color="success" onClick={() => handleConfirm(b._id)}>Xác nhận</Button>
                          )}
                          <Button size="small" variant="outlined" color="warning" onClick={() => handleNoShow(b._id)}>Bùng</Button>
                          <Button size="small" variant="outlined" color="error" onClick={() => handleCancel(b._id)}>Hủy</Button>
                          <Button size="small" variant="contained" sx={{ bgcolor: "#2e7d32" }} onClick={() => handlePaid(b._id)}>Thu tiền</Button>
                        </>
                      )}
                      {b.paymentStatus === "REFUND_PENDING" && (
                        <Button size="small" variant="contained" color="error" onClick={() => handleConfirmRefund(b._id)}>Hoàn cọc</Button>
                      )}
                      <Button size="small" onClick={() => { setSelectedBooking(b); setOpenLogs(true); }}>Logs</Button>
                    </Stack>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>

      <AdminBookingLogsDialog open={openLogs} onClose={() => setOpenLogs(false)} booking={selectedBooking} />
    </Box>
  );
}