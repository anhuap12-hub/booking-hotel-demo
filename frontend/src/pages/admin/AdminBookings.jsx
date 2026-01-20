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

/* ================= HELPERS ================= */

const bookingColor = (status) => {
  switch (status) {
    case "pending":
      return "warning";
    case "confirmed":
      return "success";
    case "cancelled":
      return "error";
    default:
      return "default";
  }
};

const paymentColor = (status) => {
  switch (status) {
    case "PAID":
      return "success";
    case "REFUNDED":
      return "info";
    default:
      return "default";
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

/* ================= COMPONENT ================= */

export default function AdminBookings() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [openLogs, setOpenLogs] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  /* ================= FETCH ================= */
  const fetchBookings = useCallback(async () => {
    try {
      const res = await getAdminBookings();
      setBookings(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error(err);
      setBookings([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchBookings();
  }, [fetchBookings]);

  /* ================= ACTIONS ================= */

  const handleConfirm = async (id) => {
    await updateContactStatus(id, {
      contactStatus: "CLOSED",
      result: "CONFIRMED",
    });
    fetchBookings();
  };

  const handleCancel = async (id) => {
    await updateContactStatus(id, {
      contactStatus: "CLOSED",
      result: "CANCELLED",
    });
    fetchBookings();
  };

  const handlePaid = async (id) => {
    await markBookingPaid(id);
    fetchBookings();
  };

  /* ================= LOADING ================= */

  if (loading) {
    return (
      <Box py={6} textAlign="center">
        <CircularProgress />
      </Box>
    );
  }

  if (!bookings.length) {
    return (
      <Box py={6} textAlign="center">
        <Typography color="text.secondary">
          Không có booking nào
        </Typography>
      </Box>
    );
  }

  /* ================= UI ================= */

  return (
    <>
      <Stack spacing={3}>
        <Typography fontSize={22} fontWeight={600}>
          Customer Care – Bookings
        </Typography>

        <Paper sx={{ borderRadius: 2, border: "1px solid #E5E2DC" }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: "#EFEAE3" }}>
                <TableCell>Khách</TableCell>
                <TableCell>Khách sạn</TableCell>
                <TableCell>Ngày ở</TableCell>
                <TableCell>Booking</TableCell>
                <TableCell>CSKH</TableCell>
                <TableCell>Hành động</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {bookings.map((b) => (
                <TableRow key={b._id}>
                  {/* KHÁCH */}
                  <TableCell>
                    <Typography fontWeight={600}>
                      {b.guest?.name}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {b.guest?.phone} • {b.guest?.email}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {b.guestsCount} khách
                    </Typography>
                  </TableCell>

                  {/* HOTEL */}
                  <TableCell>
                    <Typography fontSize={14}>
                      {b.hotel?.name}
                    </Typography>
                    <Typography fontSize={12} color="text.secondary">
                      {b.room?.name}
                    </Typography>
                  </TableCell>

                  {/* DATE */}
                  <TableCell>
                    {new Date(b.checkIn).toLocaleDateString()} →{" "}
                    {new Date(b.checkOut).toLocaleDateString()}
                    <Typography fontSize={12} color="text.secondary">
                      Đặt lúc:{" "}
                      {new Date(b.createdAt).toLocaleString()}
                    </Typography>
                  </TableCell>

                  {/* BOOKING */}
                  <TableCell sx={{ verticalAlign: "top" }}>
  <Stack spacing={0.5} alignItems="flex-start">
    {/* Booking status */}
    <Chip
      size="small"
      label={b.status}
      color={bookingColor(b.status)}
    />

    {/* Payment status */}
    <Chip
      size="small"
      label={b.paymentStatus || "UNPAID"}
      color={paymentColor(b.paymentStatus)}
    />

    {/* Price → CHIP TRUNG TÍNH */}
    <Chip
      size="small"
      variant="outlined"
      label={`${b.totalPrice?.toLocaleString()} đ`}
      sx={{
        fontWeight: 600,
      }}
    />
  </Stack>
</TableCell>
                  {/* CSKH */}
                  <TableCell sx={{ verticalAlign: "top" }}>
  <Stack spacing={0.5} alignItems="flex-start">
    {/* Result */}
    <Chip
      size="small"
      label={displayResult(b)}
      color={
        b.result === "CONFIRMED"
          ? "success"
          : b.result === "CANCELLED"
          ? "error"
          : "default"
      }
    />

    {/* contactStatus → CHIP NHẠT */}
    <Chip
      size="small"
      variant="outlined"
      label={b.contactStatus}
    />
  </Stack>
</TableCell>

                  {/* ACTION */}
                  <TableCell>
                    <Stack direction="row" spacing={1} flexWrap="wrap">
                      {b.contactStatus !== "CLOSED" && (
                        <>
                          <Button
                            size="small"
                            onClick={() => handleConfirm(b._id)}
                            sx={{
                              bgcolor: "#4F6F52",
                              color: "#fff",
                              "&:hover": {
                                bgcolor: "#3E5A42",
                              },
                            }}
                          >
                            Confirm
                          </Button>

                          <Button
                            size="small"
                            onClick={() => handleCancel(b._id)}
                            sx={{
                              bgcolor: "#8B3A3A",
                              color: "#fff",
                              "&:hover": {
                                bgcolor: "#6E2D2D",
                              },
                            }}
                          >
                            Cancel
                          </Button>
                        </>
                      )}

                      {b.paymentStatus !== "PAID" && (
                        <Button
                          size="small"
                          onClick={() => handlePaid(b._id)}
                          sx={{
                            bgcolor: "#9A6A3A",
                            color: "#fff",
                            "&:hover": {
                              bgcolor: "#7C5430",
                            },
                          }}
                        >
                          Xác nhận thanh toán
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
              ))}
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
