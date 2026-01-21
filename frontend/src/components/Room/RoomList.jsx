import { Grid, Typography, Box, Skeleton } from "@mui/material";
import { useState } from "react";
import RoomCard from "./RoomCard";
import BookingDialog from "../Booking/BookingDialog";

export default function RoomList({ rooms, hotel, loading }) {
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Hiển thị Skeleton khi đang tải (Trông chuyên nghiệp hơn là text "Đang tải")
  if (loading) {
    return (
      <Grid container spacing={2.5}>
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} key={i}>
            <Skeleton variant="rounded" height={220} sx={{ borderRadius: 4 }} />
          </Grid>
        ))}
      </Grid>
    );
  }

  // Trường hợp không có dữ liệu
  if (!rooms?.length) {
    return (
      <Box
        sx={{
          p: 8,
          textAlign: "center",
          border: "2px dashed #e0e0e0",
          borderRadius: 4,
          bgcolor: "#fafafa",
        }}
      >
        <Typography variant="h6" color="text.secondary" gutterBottom>
          Không tìm thấy phòng phù hợp
        </Typography>
        <Typography variant="body2" color="text.disabled">
          Vui lòng thay đổi bộ lọc hoặc chọn ngày khác.
        </Typography>
      </Box>
    );
  }

  return (
    <>
      <Grid container spacing={2.5}>
        {rooms.map((room) => (
          <Grid item xs={12} key={room._id}>
            <RoomCard
              room={room}
              onBook={(r) => {
                // Đảm bảo thông tin hotel luôn đi kèm với room
                setSelectedRoom({ ...r, hotel: hotel });
                setOpen(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

      {/* Render Dialog - Sử dụng kỹ thuật conditional rendering để tránh lỗi undefined */}
      {selectedRoom && (
        <BookingDialog
          open={open}
          onClose={() => {
            setOpen(false);
            // Optional: setSelectedRoom(null) sau khi modal đóng hẳn để clear bộ nhớ
          }}
          room={selectedRoom}
        />
      )}
    </>
  );
}