import { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Stack, Paper, Table, TableHead, TableRow, TableCell,
  TableBody, Chip, Button, CircularProgress, Tooltip
} from "@mui/material";
import { getAdminBookings, updateContactStatus, markBookingPaid } from "../../api/admin.api";
import AdminBookingLogsDialog from "./AdminBookingLogsDialog";

/* ================= HELPERS ================= */

const bookingColor = (status) => {
  switch (status) {
    case "pending": return "warning";
    case "confirmed": return "success";
    case "cancelled": return "error";
    default: return "default";
  }
};

const paymentColor = (status) => {
  switch (status) {
    case "PAID": return "success";
    case "DEPOSITED": return "primary"; // Màu xanh dương cho tiền cọc
    case "REFUNDED": return "info";
    default: return "default";
  }
};

const displayResult = (b) => {
  if (b.contactStatus === "CLOSED") {
    if (b.result === "CONFIRMED") return "Đã xác nhận";
    if (b.result === "CANCELLED") return "Đã huỷ";
    return "Đã xử lý";
  }
  return "Chưa xử lý";
};

/* ================= MAIN COMPONENT ================= */

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openLogs, setOpenLogs] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  const fetchBookings = useCallback(async () => {
    try {
      const res = await getAdminBookings();
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Fetch bookings error:", err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /* ================= ACTION HANDLERS ================= */

  const handleConfirm = async (id) => {
    await updateContactStatus(id, { contactStatus: "CLOSED", result: "CONFIRMED" });
    fetchBookings();
  };

  const handleCancel = async (id) => {
    if (window.confirm("Bạn có chắc chắn muốn hủy booking này?")) {
      await updateContactStatus(id, { contactStatus: "CLOSED", result: "CANCELLED" });
      fetchBookings();
    }
  };

  const handlePaid = async (id) => {
    if (window.confirm("Xác nhận khách đã thanh toán TOÀN BỘ số tiền còn lại?")) {
      await markBookingPaid(id);
      fetchBookings();
    }
  };

  if (loading) return <Box py={6} textAlign="center"><CircularProgress /></Box>;

  return (
    <>
      <Stack spacing={3}>
        <Typography fontSize={22} fontWeight={600}>Quản lý Đặt phòng & Thanh toán</Typography>

        <Paper sx={{ borderRadius: 2, border: "1px solid #E5E2DC", overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#EFEAE3" }}>
                <TableCell>Khách hàng</TableCell>
                <TableCell>Phòng / Khách sạn</TableCell>
                <TableCell>Chi tiết Tiền (VNĐ)</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>CSKH</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!bookings.length ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>Trống</TableCell></TableRow>
              ) : (
                bookings.map((b) => {
                  const isCancelled = b.status === "cancelled" || b.result === "CANCELLED";
                  const isPaidFull = b.paymentStatus === "PAID";
                  const isDeposited = b.paymentStatus === "DEPOSITED";

                  return (
                    <TableRow key={b._id} sx={{ opacity: isCancelled ? 0.7 : 1, bgcolor: isDeposited ? '#f0f7ff' : 'inherit' }}>
                      {/* KHÁCH HÀNG */}
                      <TableCell>
                        <Typography fontWeight={600}>{b.guest?.name}</Typography>
                        <Typography fontSize={12} color="text.secondary">{b.guest?.phone}</Typography>
                        <Typography fontSize={11} color="primary">ID: ...{b._id.slice(-6).toUpperCase()}</Typography>
                      </TableCell>

                      {/* PHÒNG */}
                      <TableCell>
                        <Typography fontSize={14} fontWeight={500}>{b.room?.name}</Typography>
                        <Typography fontSize={12} color="text.secondary">{b.hotel?.name}</Typography>
                        <Typography fontSize={11}>{b.guestsCount} khách | {new Date(b.checkIn).toLocaleDateString()} - {new Date(b.checkOut).toLocaleDateString()}</Typography>
                      </TableCell>

                      {/* CHI TIẾT TIỀN */}
                      <TableCell>
                        <Tooltip title="Tổng tiền đơn hàng">
                          <Typography fontSize={13} fontWeight={600}>{b.totalPrice?.toLocaleString()} đ</Typography>
                        </Tooltip>
                        {isDeposited && (
                          <Typography fontSize={11} color="primary.main">
                            Đã cọc: {b.depositAmount?.toLocaleString()} đ
                          </Typography>
                        )}
                        {(isDeposited || !isPaidFull) && (
                          <Typography fontSize={11} color="error.main" fontWeight={600}>
                            Còn lại: {b.remainingAmount?.toLocaleString()} đ
                          </Typography>
                        )}
                      </TableCell>

                      {/* TRẠNG THÁI */}
                      <TableCell>
                        <Stack spacing={0.5}>
                          <Chip size="small" label={b.status.toUpperCase()} color={bookingColor(b.status)} />
                          <Chip 
                            size="small" 
                            label={isDeposited ? "ĐÃ CỌC 30%" : b.paymentStatus || "CHƯA TRẢ"} 
                            color={paymentColor(b.paymentStatus)} 
                          />
                        </Stack>
                      </TableCell>

                      {/* CSKH */}
                      <TableCell>
                        <Chip 
                          size="small" 
                          variant="outlined"
                          label={displayResult(b)} 
                          color={b.result === "CONFIRMED" ? "success" : b.result === "CANCELLED" ? "error" : "default"} 
                        />
                      </TableCell>

                      {/* HÀNH ĐỘNG */}
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end">
                          {b.contactStatus !== "CLOSED" && (
                            <>
                              <Button size="small" variant="contained" color="success" onClick={() => handleConfirm(b._id)}>Duyệt</Button>
                              <Button size="small" variant="contained" color="error" onClick={() => handleCancel(b._id)}>Hủy</Button>
                            </>
                          )}

                          {/* Chỉ hiện nút Thanh Toán nếu chưa trả đủ 100% và đơn không bị hủy */}
                          {!isPaidFull && !isCancelled && (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handlePaid(b._id)}
                              sx={{ bgcolor: "#FF9800", "&:hover": { bgcolor: "#F57C00" } }}
                            >
                              Thu tiền mặt
                            </Button>
                          )}

                          <Button size="small" variant="outlined" onClick={() => { setSelectedBooking(b); setOpenLogs(true); }}>Logs</Button>
                        </Stack>
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Paper>
      </Stack>

      <AdminBookingLogsDialog open={openLogs} onClose={() => setOpenLogs(false)} booking={selectedBooking} />
    </>
  );
}