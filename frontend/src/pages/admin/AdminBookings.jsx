import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Stack, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Button, CircularProgress, Tooltip, Divider
} from "@mui/material";
// THÊM: markNoShow vào phần import
import { getAdminBookings, updateContactStatus, markBookingPaid, confirmRefunded, markNoShow, cancelBookingByAdmin } from "../../api/admin.api";
import AdminBookingLogsDialog from "./AdminBookingLogsDialog";
import { 
  CheckCircle, Cancel, Payment, 
  CurrencyExchange, PersonOff // THÊM: Icon khách bùng
} from "@mui/icons-material";

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
  if (hasPaidSomething) return { label: "ĐÃ ĐẶT CỌC", color: "primary" }; // Flow 30% cọc
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
    if (window.confirm("Xác nhận trạng thái THÀNH CÔNG cho đơn này?")) {
      await updateContactStatus(id, { contactStatus: "CLOSED", result: "CONFIRMED" });
      fetchBookings();
    }
  };

  const handleCancel = async (id) => {
  if (window.confirm("Xác nhận HỦY đơn này? Phòng sẽ được giải phóng ngay lập tức.")) {
    try {
      await cancelBookingByAdmin(id); // Gọi đúng hàm API admin
      
      alert("Đã hủy đơn thành công!");
      fetchBookings(); // Tải lại danh sách
    } catch (err) {
      console.error("Lỗi khi hủy đơn:", err);
      alert("Không thể hủy đơn: " + (err.response?.data?.message || "Lỗi server"));
    }
  }
};

  // THÊM: Hàm xử lý khách không đến
  const handleNoShow = async (id) => {
    if (window.confirm("Xác nhận khách KHÔNG ĐẾN? Phòng sẽ trống và tiền cọc KHÔNG được hoàn.")) {
      try {
        await markNoShow(id);
        fetchBookings();
      } catch (err) {
        alert("Lỗi: " + (err.response?.data?.message || "Không thể thực hiện"));
      }
    }
  };

  const handlePaid = async (id) => {
    if (window.confirm("Xác nhận đã thu đủ số tiền mặt còn lại?")) {
      try {
        await markBookingPaid(id); 
        fetchBookings();
      } catch (err) {
        alert("Lỗi thanh toán: " + (err.response?.data?.message || "Không thể cập nhật"));
      }
    }
  };

  const handleConfirmRefund = async (id) => {
    if (window.confirm("Xác nhận đã hoàn trả tiền qua NH?")) {
      try {
        await confirmRefunded(id);
        fetchBookings();
      } catch (err) {
        alert("Lỗi hoàn tiền: " + (err.response?.data?.message || "Thất bại"));
      }
    }
  };

  if (loading) return <Box py={10} textAlign="center"><CircularProgress sx={{ color: '#C2A56D' }} /></Box>;

  return (
    <>
      <Stack spacing={3} sx={{ p: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h5" fontWeight={800} color="#1C1B19">Quản trị Lưu trú</Typography>
          <Button variant="outlined" size="small" onClick={fetchBookings}>Làm mới</Button>
        </Box>

        <Paper sx={{ borderRadius: "16px", border: "1px solid #E5E2DC", overflow: "hidden", boxShadow: 'none' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#F9F8F6" }}>
                <TableCell sx={{ fontWeight: 700 }}>Khách hàng</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Lưu trú</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Tài chính (VNĐ)</TableCell>
                <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
                <TableCell align="right" sx={{ fontWeight: 700 }}>Thao tác</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.map((b) => {
                const total = b.totalPrice || 0;
                const paid = b.depositAmount || 0;
                
                // FIXED LOGIC: Chỉ ẩn nút khi Backend báo đã PAID
                const isPaidFull = b.paymentStatus === "PAID";
                const isCancelled = b.status === "cancelled";
                const isNoShow = b.status === "no_show";
                const isRefundPending = b.paymentStatus === "REFUND_PENDING";

                const bStatus = bookingColor(b.status);
                const pStatus = paymentStatusConfig(b.paymentStatus, isPaidFull, paid > 0 && !isPaidFull);

                return (
                  <TableRow key={b._id} sx={{ opacity: (isCancelled || isNoShow) ? 0.6 : 1 }}>
                   <TableCell>
  <Typography variant="body2" fontWeight={700}>
    {b.guest?.name || "N/A"}
  </Typography>
  <Stack spacing={0}>
    <Typography variant="caption" color="text.secondary" sx={{ display: 'block' }}>
      {b.guest?.phone}
    </Typography>

    <Typography variant="caption" color="text.disabled" sx={{ fontStyle: 'italic' }}>
      {b.guest?.email || b.user?.email || ""}
    </Typography>
  </Stack>
</TableCell>

                    <TableCell>
                      <Typography variant="body2" fontWeight={600}>
                        {new Date(b.checkIn).toLocaleDateString('vi-VN')} - {new Date(b.checkOut).toLocaleDateString('vi-VN')}
                      </Typography>
                      <Typography variant="caption" color="primary">{b.roomSnapshot?.name}</Typography>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={0.5} width={180}>
                        <Box display="flex" justifyContent="space-between">
                          <Typography variant="caption">Tổng tiền:</Typography>
                          <Typography variant="caption" fontWeight={700}>{total.toLocaleString()}</Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" color="primary.main">
                          <Typography variant="caption">Đã thu:</Typography>
                          <Typography variant="caption" fontWeight={700}>-{paid.toLocaleString()}</Typography>
                        </Box>
                        <Divider sx={{ my: 0.5 }} />
                        <Box display="flex" justifyContent="space-between" color={isPaidFull ? "success.main" : "error.main"}>
                          <Typography variant="caption" fontWeight={700}>{isPaidFull ? "Đã xong" : "Còn nợ:"}</Typography>
                          <Typography variant="body2" fontWeight={900}>
                            {isPaidFull ? "0 đ" : (total - paid).toLocaleString() + " đ"}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack spacing={1}>
                        <Chip size="small" label={bStatus.label} sx={{ bgcolor: bStatus.bg, color: bStatus.color, fontWeight: 800 }} />
                        <Chip size="small" label={pStatus.label} color={pStatus.color} sx={{ fontWeight: 800 }} />
                      </Stack>
                    </TableCell>

                    <TableCell align="right">
                      <Stack direction="row" spacing={1} justifyContent="flex-end">
                        
                        {isRefundPending && (
                          <Button size="small" variant="contained" color="error" startIcon={<CurrencyExchange />} onClick={() => handleConfirmRefund(b._id)}>
                            Hoàn cọc
                          </Button>
                        )}

                        {!isCancelled && !isNoShow && !isRefundPending && (
                          <>
                            {b.status !== "confirmed" && (
                              <Tooltip title="Xác nhận khách đến/Xong">
                                <Button size="small" variant="contained" color="success" onClick={() => handleConfirm(b._id)}>
                                  <CheckCircle fontSize="small" />
                                </Button>
                              </Tooltip>
                            )}
                            
                            {/* NÚT NO-SHOW MỚI */}
                            <Tooltip title="Khách bùng (No-show)">
                              <Button size="small" variant="outlined" color="warning" onClick={() => handleNoShow(b._id)}>
                                <PersonOff fontSize="small" />
                              </Button>
                            </Tooltip>

                            <Tooltip title="Hủy đơn">
                              <Button size="small" variant="outlined" color="error" onClick={() => handleCancel(b._id)}>
                                <Cancel fontSize="small" />
                              </Button>
                            </Tooltip>

                            {/* NÚT THU TIỀN: Luôn hiện nếu chưa PAID */}
                            {!isPaidFull && (
                              <Button
                              size="small"
                              variant="contained"
                              startIcon={<Payment />}
                              onClick={() => handlePaid(b._id)}
                              sx={{ 
                              bgcolor: "#2e7d32", // Màu xanh lá đậm (Success) thể hiện việc tiền đã vào túi
                              fontWeight: 700,
                              textTransform: "none", // Giữ nguyên chữ thường cho dễ đọc
                              borderRadius: "8px",
                              px: 2,
                              "&:hover": {
                              bgcolor: "#1b5e20", // Màu đậm hơn khi di chuột vào
                              boxShadow: "0 4px 12px rgba(0,0,0,0.15)"
                               }
                                }}
                                >
                               Xác nhận thu tiền mặt
                                </Button>
                            )}
                          </>
                        )}

                        <Button size="small" variant="text" onClick={() => { setSelectedBooking(b); setOpenLogs(true); }}>
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