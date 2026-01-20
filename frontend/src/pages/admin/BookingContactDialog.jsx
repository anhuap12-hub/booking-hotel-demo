import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Stack,
  TextField,
  MenuItem,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import { updateContactStatus } from "../../api/admin.api";
import ContactLogTimeline from "./ContactLogTimeline";

const RESULT_OPTIONS = [
  "SUCCESS",
  "NO_RESPONSE",
  "FAILED",
];

export default function BookingContactDialog({
  open,
  onClose,
  booking,
  onUpdated,
}) {
  const [contactStatus, setContactStatus] = useState("CONTACTED");
  const [note, setNote] = useState("");
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);

  const isClosed = booking?.contactStatus === "CLOSED";

  useEffect(() => {
    if (!open || !booking) return;

    setContactStatus(booking.contactStatus || "CONTACTED");
    setNote("");
    setResult("");
  }, [open, booking]);

  const handleSubmit = async () => {
    if (!result) return;

    try {
      setLoading(true);

      await updateContactStatus(booking._id, {
        contactStatus: result === "SUCCESS" ? "CLOSED" : "CONTACTED",
        note,
        result,
      });

      onUpdated?.();
      onClose();
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Contact Booking</DialogTitle>

      <DialogContent>
        {isClosed && (
          <Typography color="error" mb={2}>
            This booking has been closed and cannot be updated.
          </Typography>
        )}

        <Stack spacing={2} mt={1}>
          <TextField
            label="Contact Status"
            value={contactStatus}
            disabled
            fullWidth
          />

          <TextField
            select
            label="Result"
            value={result}
            onChange={(e) => setResult(e.target.value)}
            fullWidth
            disabled={isClosed}
            required
          >
            {RESULT_OPTIONS.map((r) => (
              <MenuItem key={r} value={r}>
                {r}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Note"
            multiline
            rows={3}
            value={note}
            onChange={(e) => setNote(e.target.value)}
            fullWidth
            disabled={isClosed}
          />

          {booking?.contactLogs?.length > 0 && (
            <>
              <Typography fontWeight={600} mt={2}>
                Contact History
              </Typography>
              <ContactLogTimeline logs={booking.contactLogs} />
            </>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={loading || isClosed || !result}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}
