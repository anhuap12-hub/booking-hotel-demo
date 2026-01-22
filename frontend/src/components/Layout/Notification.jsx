import { Snackbar, Alert, Box, Slide } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';
import InfoOutlinedIcon from '@mui/icons-material/InfoOutlined';

function TransitionLeft(props) {
  return <Slide {...props} direction="left" />;
}

export default function Notification({
  open,
  onClose,
  message,
  severity = "success", // success, error, info, warning
}) {
  // Cấu hình màu sắc theo phong cách Luxury Dark
  const severityConfig = {
    success: { color: "#C2A56D", icon: <CheckCircleOutlineIcon fontSize="small" /> },
    error: { color: "#E57373", icon: <ErrorOutlineIcon fontSize="small" /> },
    info: { color: "#81B1D3", icon: <InfoOutlinedIcon fontSize="small" /> },
    warning: { color: "#FFB74D", icon: <InfoOutlinedIcon fontSize="small" /> },
  };

  const currentConfig = severityConfig[severity] || severityConfig.info;

  return (
    <Snackbar
      open={open}
      autoHideDuration={4000}
      onClose={onClose}
      anchorOrigin={{ vertical: "top", horizontal: "right" }}
      TransitionComponent={TransitionLeft}
      sx={{ mt: 10 }} // Đẩy xuống một chút để không đè lên Navbar
    >
      <Alert
        onClose={onClose}
        severity={severity}
        variant="filled"
        icon={currentConfig.icon}
        sx={{
          bgcolor: "#1C1B19", // Màu Ebony nền của thương hiệu
          color: "#F1F0EE",
          borderRadius: "12px",
          fontSize: "0.85rem",
          fontWeight: 500,
          letterSpacing: "0.02em",
          px: 3,
          py: 1,
          border: `1px solid rgba(194,165,109,0.2)`, // Viền Gold cực mảnh
          boxShadow: "0 20px 40px rgba(0,0,0,0.4)",
          "& .MuiAlert-icon": {
            color: currentConfig.color, // Icon mang màu của severity nhưng nhẹ nhàng
          },
          "& .MuiAlert-action": { 
            color: "rgba(241, 240, 238, 0.5)",
            paddingTop: 0.5
          },
        }}
      >
        <Box sx={{ ml: 0.5 }}>{message}</Box>
      </Alert>
    </Snackbar>
  );
}