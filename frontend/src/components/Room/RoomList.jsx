import { Grid, Typography, Box, Skeleton, Fade } from "@mui/material";
import { useState } from "react";
import RoomCard from "./RoomCard";
import BookingDialog from "../Booking/BookingDialog";
import SearchOffOutlinedIcon from '@mui/icons-material/SearchOffOutlined';

export default function RoomList({ rooms, hotel, loading }) {
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  /* ================= SKELETON LOADING ================= */
  if (loading) {
    return (
      <Grid container spacing={3}>
        {[1, 2, 3].map((i) => (
          <Grid item xs={12} key={i}>
            <Skeleton 
              variant="rounded" 
              height={260} 
              sx={{ 
                borderRadius: "20px", 
                bgcolor: "rgba(0,0,0,0.04)",
                transform: "scale(1, 0.98)" 
              }} 
            />
          </Grid>
        ))}
      </Grid>
    );
  }

  /* ================= EMPTY STATE ================= */
  if (!rooms?.length) {
    return (
      <Fade in={true} timeout={800}>
        <Box
          sx={{
            p: 10,
            textAlign: "center",
            border: "1px dashed #D6C9B8", // Viền màu be/vàng nhạt
            borderRadius: "24px",
            bgcolor: "#F9F8F6",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2
          }}
        >
          <SearchOffOutlinedIcon sx={{ fontSize: 60, color: "#C2A56D", mb: 1 }} />
          <Typography 
            variant="h6" 
            sx={{ fontFamily: "'Playfair Display', serif", fontWeight: 700, color: "#1C1B19" }}
          >
            Chưa tìm thấy phòng phù hợp
          </Typography>
          <Typography variant="body2" sx={{ color: "#72716E", maxWidth: "300px", lineHeight: 1.6 }}>
            Bạn hãy thử điều chỉnh lại bộ lọc hoặc chọn ngày nhận/trả phòng khác để tìm kiếm nhé.
          </Typography>
        </Box>
      </Fade>
    );
  }

  return (
    <>
      <Fade in={true} timeout={600}>
        <Grid container spacing={3}>
          {rooms.map((room) => (
            <Grid item xs={12} key={room._id}>
              <RoomCard
                room={room}
                onBook={(r) => {
                  // Giữ nguyên logic thêm thông tin hotel vào selectedRoom
                  setSelectedRoom({ ...r, hotel: hotel });
                  setOpen(true);
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Fade>

      {/* RENDER DIALOG */}
      {selectedRoom && (
        <BookingDialog
          open={open}
          onClose={() => {
            setOpen(false);
            // Delay dọn dẹp selectedRoom một chút để modal kịp đóng mượt mà
            setTimeout(() => setSelectedRoom(null), 300);
          }}
          room={selectedRoom}
        />
      )}
    </>
  );
}