import { Snackbar, Alert, Box } from "@mui/material";

export default function Notification({
  open,
  onClose,
  message,
  severity = "info",
}) {
  return (
    <Snackbar
      open={open}
      autoHideDuration={2800}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        icon={false}
        sx={{
          bgcolor: "#1f1f1f",
          color: "#f5f4f2",
          borderRadius: 2,
          fontSize: 13,
          px: 2,
          py: 1,
          boxShadow: "0 12px 30px rgba(0,0,0,0.35)",
          "& .MuiAlert-action": { color: "#f5f4f2" },
        }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}
