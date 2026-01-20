import { Grid } from "@mui/material";
import { useState } from "react";
import RoomCard from "./RoomCard";
import BookingDialog from "../Booking/BookingDialog";

export default function RoomList({ rooms }) {
  const [open, setOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState(null);

  if (!rooms?.length) return null;

  return (
    <>
      <Grid container spacing={3}>
        {rooms.map((room) => (
          <Grid item xs={12} key={room._id}>
            <RoomCard
              room={room}
              onBook={(room) => {
                setSelectedRoom(room);
                setOpen(true);
              }}
            />
          </Grid>
        ))}
      </Grid>

      {selectedRoom && (
        <BookingDialog
          open={open}
          onClose={() => setOpen(false)}
          room={selectedRoom}
        />
      )}
    </>
  );
}
