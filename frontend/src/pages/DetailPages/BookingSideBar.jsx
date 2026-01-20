import {
  Paper,
  Typography,
  Stack,
  TextField,
  Button,
  Box,
  Divider,
} from "@mui/material";

export default function BookingSideBar({ hotel }) {
  return (
    <Paper
      sx={{
        p: 3,
        borderRadius: 3,
        boxShadow: 3,
      }}
    >
      {/* Price */}
      <Typography fontSize={22} fontWeight={700}>
        {hotel.cheapestPrice?.toLocaleString() || "—"} ₫
        <Typography
          component="span"
          fontSize={14}
          color="text.secondary"
        >
          {" "}
          / đêm
        </Typography>
      </Typography>

      <Divider sx={{ my: 2 }} />

      {/* Dates */}
      <Stack spacing={1.5}>
        <TextField
          label="Nhận phòng"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
        <TextField
          label="Trả phòng"
          type="date"
          InputLabelProps={{ shrink: true }}
          fullWidth
        />
      </Stack>

      <Divider sx={{ my: 2 }} />

      {/* CTA */}
      <Button
        fullWidth
        size="large"
        variant="contained"
        sx={{ py: 1.4 }}
      >
        Đặt phòng
      </Button>

      <Box mt={2}>
        <Typography
          fontSize={13}
          color="text.secondary"
          textAlign="center"
        >
          Bạn chưa bị trừ tiền
        </Typography>
      </Box>
    </Paper>
  );
}
