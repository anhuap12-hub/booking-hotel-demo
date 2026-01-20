import {
  Stack,
  Typography,
  Paper,
  Box,
  Divider,
} from "@mui/material";
import AccessTimeIcon from "@mui/icons-material/AccessTime";

export default function ContactLogTimeline({ logs = [] }) {
  if (!logs.length)
    return (
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mt: 2 }}
      >
        No contact history yet.
      </Typography>
    );

  return (
    <Stack spacing={2} mt={2}>
      {logs.map((log, index) => (
        <Paper
          key={index}
          variant="outlined"
          sx={{ p: 2, borderRadius: 2 }}
        >
          <Stack spacing={1}>
            <Stack direction="row" spacing={1} alignItems="center">
              <AccessTimeIcon sx={{ fontSize: 16 }} />
              <Typography fontSize={13} color="text.secondary">
                {new Date(log.createdAt).toLocaleString()}
              </Typography>
            </Stack>

            <Typography fontWeight={600}>
              Result: {log.result || "—"}
            </Typography>

            {log.note && (
              <>
                <Divider />
                <Typography variant="body2">
                  {log.note}
                </Typography>
              </>
            )}
          </Stack>
        </Paper>
      ))}
    </Stack>
  );
}
