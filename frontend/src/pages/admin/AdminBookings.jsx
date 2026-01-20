import { useEffect, useState, useCallback } from "react";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Table,
  TableHead,
  TableRow,
  TableCell,
  TableBody,
  Chip,
  Button,
  CircularProgress,
} from "@mui/material";

import {
  getAdminBookings,
  updateContactStatus,
  markBookingPaid,
} from "../../api/admin.api";

import AdminBookingLogsDialog from "./AdminBookingLogsDialog";

/* ================= HELPERS (Giữ logic hiển thị tách biệt) ================= */

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

  /* ================= FETCH DATA ================= */
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
    await markBookingPaid(id);
    fetchBookings();
  };

  /* ================= RENDER LOGIC ================= */

  if (loading) {
    return (
      <Box py={6} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Stack spacing={3}>
        <Typography fontSize={22} fontWeight={600}>
          Customer Care – Bookings
        </Typography>

        <Paper sx={{ borderRadius: 2, border: "1px solid #E5E2DC", overflow: "hidden" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#EFEAE3" }}>
                <TableCell>Khách</TableCell>
                <TableCell>Khách sạn</TableCell>
                <TableCell>Ngày ở</TableCell>
                <TableCell>Trạng thái</TableCell>
                <TableCell>CSKH</TableCell>
                <TableCell align="right">Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {!bookings.length ? (
                <TableRow>
                  <TableCell colSpan={6} align="center" sx={{ py: 3 }}>
                    <Typography color="text.secondary">Không có booking nào</Typography>
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((b) => {
                  const isCancelled = b.status === "cancelled" || b.result === "CANCELLED";
                  const isPaid = b.paymentStatus === "PAID";

                  return (
                    <TableRow key={b._id} sx={{ opacity: isCancelled ? 0.7 : 1 }}>
                      {/* THÔNG TIN KHÁCH */}
                      <TableCell>
                        <Typography fontWeight={600}>{b.guest?.name}</Typography>
                        <Typography fontSize={12} color="text.secondary">
                          {b.guest?.phone} • {b.guest?.email}
                        </Typography>
                        <Typography fontSize={12} color="text.secondary">
                          {b.guestsCount} khách
                        </Typography>
                      </TableCell>

                      {/* KHÁCH SẠN */}
                      <TableCell>
                        <Typography fontSize={14}>{b.hotel?.name}</Typography>
                        <Typography fontSize={12} color="text.secondary">{b.room?.name}</Typography>
                      </TableCell>

                      {/* NGÀY THÁNG */}
                      <TableCell>
                        <Typography fontSize={13}>
                          {new Date(b.checkIn).toLocaleDateString()} → {new Date(b.checkOut).toLocaleDateString()}
                        </Typography>
                        <Typography fontSize={11} color="text.secondary">
                          Đặt lúc: {new Date(b.createdAt).toLocaleString()}
                        </Typography>
                      </TableCell>

                      {/* TRẠNG THÁI BOOKING */}
                      <TableCell>
                        <Stack spacing={0.5} alignItems="flex-start">
                          <Chip size="small" label={b.status} color={bookingColor(b.status)} />
                          <Chip size="small" label={b.paymentStatus || "UNPAID"} color={paymentColor(b.paymentStatus)} />
                          <Typography fontWeight={700} fontSize={13} sx={{ mt: 0.5 }}>
                            {b.totalPrice?.toLocaleString()} đ
                          </Typography>
                        </Stack>
                      </TableCell>

                      {/* TRẠNG THÁI CSKH */}
                      <TableCell>
                        <Stack spacing={0.5} alignItems="flex-start">
                          <Chip 
                            size="small" 
                            label={displayResult(b)} 
                            color={b.result === "CONFIRMED" ? "success" : b.result === "CANCELLED" ? "error" : "default"} 
                          />
                          <Typography fontSize={11} color="text.secondary">{b.contactStatus}</Typography>
                        </Stack>
                      </TableCell>

                      {/* CÁC NÚT THAO TÁC */}
                      <TableCell align="right">
                        <Stack direction="row" spacing={1} justifyContent="flex-end" flexWrap="wrap">
                          {b.contactStatus !== "CLOSED" && (
                            <>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleConfirm(b._id)}
                                sx={{ bgcolor: "#4F6F52", "&:hover": { bgcolor: "#3E5A42" } }}
                              >
                                Confirm
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleCancel(b._id)}
                                sx={{ bgcolor: "#8B3A3A", "&:hover": { bgcolor: "#6E2D2D" } }}
                              >
                                Cancel
                              </Button>
                            </>
                          )}

                          {/* FIX: Chỉ hiện nút Thanh toán nếu chưa trả tiền VÀ chưa bị hủy */}
                          {!isPaid && !isCancelled && (
                            <Button
                              size="small"
                              variant="contained"
                              onClick={() => handlePaid(b._id)}
                              sx={{ bgcolor: "#9A6A3A", "&:hover": { bgcolor: "#7C5430" } }}
                            >
                              Thanh toán
                            </Button>
                          )}

                          <Button
                            size="small"
                            variant="outlined"
                            onClick={() => {
                              setSelectedBooking(b);
                              setOpenLogs(true);
                            }}
                          >
                            Logs
                          </Button>
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

      <AdminBookingLogsDialog
        open={openLogs}
        onClose={() => setOpenLogs(false)}
        booking={selectedBooking}
      />
    </>
  );
}