import { Button } from "@mui/material";

export default function BookingButton({
  children,
  size = "large",
  fullWidth = true,
  disabled = false,
  ...props
}) {
  return (
    <Button
      variant="contained"
      size={size}
      fullWidth={fullWidth}
      disabled={disabled}
      sx={{
        py: 1.4,
        borderRadius: 3,
        fontWeight: 700,
        textTransform: "none",
      }}
      {...props}
    >
      {children}
    </Button>
  );
}
