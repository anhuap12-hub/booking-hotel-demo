import {
  Dialog,
  DialogTitle,
  DialogContent,
  Stack,
  Typography,
  Divider,
  Chip,
  Box,
} from "@mui/material";

export default function AdminBookingLogsDialog({
  open,
  onClose,
  booking,
}) {
  if (!booking) return null;

  const logs = [...(booking.contactLogs || [])].reverse();

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
     <DialogTitle onClick={onClose} sx={{ cursor: "pointer" }}>
  Contact Timeline
</DialogTitle>

      <DialogContent>
        {logs.length === 0 ? (
          <Typography color="text.secondary">
            No contact history yet
          </Typography>
        ) : (
          <Stack spacing={2}>
            {logs.map((log, idx) => (
              <Box key={idx}>
                <Stack direction="row" spacing={1} alignItems="center">
                  <Chip
                    size="small"
                    label={log.result}
                    color={
                      log.result === "CONFIRMED"
                        ? "success"
                        : log.result === "CANCELLED"
                        ? "error"
                        : "default"
                    }
                  />
                  <Typography fontSize={12} color="text.secondary">
                    {new Date(log.at).toLocaleString()}
                  </Typography>
                </Stack>

                {log.note && (
                  <Typography mt={0.5}>
                    {log.note}
                  </Typography>
                )}

                <Divider sx={{ mt: 2 }} />
              </Box>
            ))}
          </Stack>
        )}
      </DialogContent>
    </Dialog>
  );
}
