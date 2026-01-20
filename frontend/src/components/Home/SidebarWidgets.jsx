import { Stack, Paper, Typography, Button, Box } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import LuggageIcon from "@mui/icons-material/Luggage";
import { useNavigate } from "react-router-dom";

export default function SidebarWidgets({ randomQuote }) {
  const navigate = useNavigate();
  return (
    <Stack spacing={3} sx={{ position: { lg: "sticky" }, top: 100 }}>
      {/* Quote Widget */}
      <Paper sx={{ p: 3, borderRadius: 4, bgcolor: randomQuote.bg, border: `1px solid ${randomQuote.border}` }}>
        <Typography fontWeight={800} color={randomQuote.color} dangerouslySetInnerHTML={{ __html: randomQuote.title }} />
        <Typography variant="body2" sx={{ mt: 1, mb: 2, opacity: 0.8 }}>{randomQuote.desc}</Typography>
        <Typography variant="caption" fontWeight={700}>{randomQuote.author}</Typography>
      </Paper>

      {/* Xanh SM Widget */}
      <Paper sx={{ p: 3, borderRadius: 4, background: "linear-gradient(135deg, #00b14f 0%, #008f3f 100%)", color: "#fff" }}>
        <Stack direction="row" spacing={1} mb={1}><ElectricCarIcon /><Typography fontWeight={800}>Xanh SM</Typography></Stack>
        <Button fullWidth sx={{ bgcolor: "#fff", color: "#008f3f", fontWeight: 800 }}>Đặt ngay</Button>
      </Paper>

      {/* My Bookings Widget */}
      <Paper sx={{ p: 3, borderRadius: 4, bgcolor: "#3a342b", color: "#fff" }}>
        <Stack direction="row" spacing={1} mb={1}><LuggageIcon sx={{ color: "#d4a373" }} /><Typography fontWeight={700}>Chuyến đi</Typography></Stack>
        <Button fullWidth variant="contained" sx={{ bgcolor: "#d4a373", mt: 1 }} onClick={() => navigate("/my-bookings")}>Kiểm tra</Button>
      </Paper>
    </Stack>
  );
}