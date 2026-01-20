import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Stack,
  Divider,
  Button,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import KingBedIcon from "@mui/icons-material/KingBed";
import EventIcon from "@mui/icons-material/Event";
import CloseIcon from "@mui/icons-material/Close";
import InfoIcon from "@mui/icons-material/Info";

/**
 * BookingCard
 * - booking: object
 * - onCancel(booking)
 * - onView(booking)
 */
export default function BookingCard({ booking, onCancel, onView }) {
  // 🔒 SAFETY GUARD
  if (!booking || !booking.hotel) return null;

  const hotel = booking.hotel;
  const room = booking.room;

  // 🖼 IMAGE PRIORITY: room → hotel → pexels
  const image =
    room?.photos?.[0]?.url ||
    hotel?.photos?.[0]?.url ||
    "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg";

  // 🎨 STATUS MAP (LOWERCASE FROM BACKEND)
  const statusMap = {
    pending: { label: "Pending", color: "warning" },
    confirmed: { label: "Confirmed", color: "success" },
    cancelled: { label: "Cancelled", color: "error" },
  };

  const statusInfo = statusMap[booking.status] || {
    label: booking.status,
    color: "default",
  };

  return (
    <Card sx={{ mb: 3, borderRadius: 3 }} elevation={3}>
      <CardContent>
        <Stack direction={{ xs: "column", md: "row" }} spacing={2}>
          {/* IMAGE */}
          <Box
            sx={{
              width: 160,
              height: 120,
              borderRadius: 2,
              overflow: "hidden",
              flexShrink: 0,
              bgcolor: "#eee",
            }}
          >
            <img
              src={image}
              alt={hotel?.name}
              style={{ width: "100%", height: "100%", objectFit: "cover" }}
            />
          </Box>

          {/* INFO */}
          <Box flex={1}>
            <Stack spacing={1.2}>
              {/* HOTEL */}
              <Typography fontWeight={600} display="flex" alignItems="center">
                <HotelIcon fontSize="small" sx={{ mr: 1 }} />
                {hotel?.name || "Unknown hotel"}
              </Typography>

              {/* ROOM */}
              <Typography color="text.secondary" display="flex" alignItems="center">
                <KingBedIcon fontSize="small" sx={{ mr: 1 }} />
                {room?.name || "Unknown room"}
              </Typography>

              <Divider />

              {/* DATES */}
              <Stack direction="row" spacing={1} flexWrap="wrap">
                <Chip
                  size="small"
                  icon={<EventIcon />}
                  label={`Check-in: ${new Date(
                    booking.checkIn
                  ).toLocaleDateString("vi-VN")}`}
                />
                <Chip
                  size="small"
                  icon={<EventIcon />}
                  label={`Check-out: ${new Date(
                    booking.checkOut
                  ).toLocaleDateString("vi-VN")}`}
                />
                <Chip size="small" label={`${booking.nights || 1} đêm`} />
              </Stack>

              {/* PRICE + STATUS */}
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                mt={1}
              >
                <Typography fontWeight={700} color="primary">
                  Tổng tiền:{" "}
                  {(booking.totalPrice || 0).toLocaleString("vi-VN")} VND
                </Typography>

                <Chip
                  size="small"
                  label={statusInfo.label}
                  color={statusInfo.color}
                />
              </Stack>

              {/* ACTIONS */}
              <Stack direction="row" spacing={1} justifyContent="flex-end">
                <Button
                  size="small"
                  startIcon={<InfoIcon />}
                  onClick={() => onView?.(booking)}
                >
                  Chi tiết
                </Button>

                {booking.status !== "cancelled" && (
                  <Button
                    size="small"
                    color="error"
                    startIcon={<CloseIcon />}
                    onClick={() => onCancel?.(booking)}
                  >
                    Huỷ
                  </Button>
                )}
              </Stack>
            </Stack>
          </Box>
        </Stack>
      </CardContent>
    </Card>
  );
}
