import {
  Dialog,
  DialogContent,
  DialogActions,
  Typography,
  Button,
  Stack,
  Box,
} from "@mui/material";

export default function RequireLoginDialog({ open, onClose, onLogin }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      BackdropProps={{
        sx: {
          backdropFilter: "blur(4px)",
          backgroundColor: "rgba(28,28,28,0.45)",
        },
      }}
      PaperProps={{
        sx: {
          borderRadius: 4,
          px: 2.5,
          py: 3,
          boxShadow: "0 30px 60px rgba(0,0,0,0.25)",
        },
      }}
    >
      <DialogContent>
        <Stack spacing={2.5} alignItems="center" textAlign="center">
          {/* Icon */}
          <Box
            sx={{
              width: 68,
              height: 68,
              borderRadius: "50%",
              bgcolor: "#EFEAE3",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 30,
              boxShadow: "0 6px 18px rgba(0,0,0,0.12)",
            }}
          >
            ☕
          </Box>

          {/* Title */}
          <Typography
            sx={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.35rem",
              fontWeight: 500,
              color: "text.primary",
            }}
          >
            Cần đăng nhập để tiếp tục
          </Typography>

          {/* Quote box */}
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderRadius: 2,
              bgcolor: "#F5F3EF",
            }}
          >
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic", lineHeight: 1.6 }}
            >
              “Chỉ một bước nhỏ nữa thôi,<br />
              để căn phòng chờ đón bạn.”
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center", pb: 2.5, px: 2 }}>
        <Stack spacing={1.5} width="100%">
          <Button
            size="large"
            onClick={onLogin}
            sx={{
              borderRadius: 999,
              bgcolor: "primary.main",
              color: "#1C1C1C",
              fontWeight: 600,
              py: 1.1,
              "&:hover": {
                bgcolor: "#9A7B56",
              },
            }}
          >
            Đăng nhập
          </Button>

          <Button
            onClick={onClose}
            sx={{
              color: "text.secondary",
              textTransform: "none",
              "&:hover": {
                bgcolor: "rgba(0,0,0,0.04)",
              },
            }}
          >
            Để sau
          </Button>
        </Stack>
      </DialogActions>
    </Dialog>
  );
}
