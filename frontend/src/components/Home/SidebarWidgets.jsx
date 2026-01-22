import { Stack, Paper, Typography, Button, Box, ButtonBase } from "@mui/material";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";
import LuggageIcon from "@mui/icons-material/Luggage";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

const MotionBox = motion(Box);
const MotionPaper = motion(Paper);

export default function SidebarWidgets({ randomQuote }) {
  const navigate = useNavigate();

  // Biến thể cho hiệu ứng xuất hiện từ bên phải
  const containerVariants = {
    hidden: { opacity: 0, x: 20 },
    visible: { 
      opacity: 1, 
      x: 0,
      transition: { staggerChildren: 0.2, duration: 0.6 }
    }
  };

  return (
    <MotionBox 
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      sx={{ position: { lg: "sticky" }, top: 100 }}
    >
      <Stack spacing={3}>
        {/* ================= QUOTE WIDGET ================= */}
        <MotionPaper
          whileHover={{ y: -5 }}
          sx={{ 
            p: 3, borderRadius: 5, 
            bgcolor: randomQuote.bg || "#fdfcf0", 
            border: `1px solid ${randomQuote.border || "#f1eed8"}`,
            position: "relative",
            overflow: "hidden"
          }}
        >
          <FormatQuoteIcon sx={{ position: "absolute", top: 10, right: 10, opacity: 0.1, fontSize: 40 }} />
          <Typography 
            fontWeight={800} 
            color="#1C1B19" 
            sx={{ fontFamily: "'Playfair Display', serif", fontSize: "1.1rem", lineHeight: 1.4 }}
            dangerouslySetInnerHTML={{ __html: randomQuote.title }} 
          />
          <Typography variant="body2" sx={{ mt: 1.5, mb: 2, color: "#5d5c56", fontStyle: "italic" }}>
            "{randomQuote.desc}"
          </Typography>
          <Typography variant="caption" sx={{ fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", color: "#8B6F4E" }}>
            — {randomQuote.author}
          </Typography>
        </MotionPaper>

        {/* ================= XANH SM WIDGET ================= */}
        <MotionPaper
          whileHover={{ scale: 1.02 }}
          sx={{ 
            p: 3, borderRadius: 5, 
            background: "linear-gradient(135deg, #00b14f 0%, #008f3f 100%)", 
            color: "#fff",
            boxShadow: "0 10px 20px rgba(0, 177, 79, 0.2)"
          }}
        >
          <Stack direction="row" alignItems="center" spacing={1.5} mb={2}>
            <Box sx={{ bgcolor: "rgba(255,255,255,0.2)", p: 1, borderRadius: 2, display: "flex" }}>
              <ElectricCarIcon />
            </Box>
            <Box>
              <Typography fontWeight={800} sx={{ lineHeight: 1 }}>Xanh SM</Typography>
              <Typography variant="caption" sx={{ opacity: 0.8 }}>Di chuyển xanh cùng VinFast</Typography>
            </Box>
          </Stack>
          <Button 
            fullWidth 
            variant="contained"
            sx={{ 
              bgcolor: "#fff", color: "#008f3f", fontWeight: 800, borderRadius: "12px",
              textTransform: "none",
              "&:hover": { bgcolor: "#f8f8f8", transform: "translateY(-2px)" },
              transition: "0.3s"
            }}
          >
            Đặt xe ngay
          </Button>
        </MotionPaper>

        {/* ================= MY BOOKINGS WIDGET ================= */}
        <MotionPaper
          whileHover={{ y: -5 }}
          sx={{ 
            p: 3, borderRadius: 5, 
            bgcolor: "#1C1B19", // Đồng bộ màu đen Ebony của brand
            color: "#fff",
            boxShadow: "0 15px 30px rgba(0,0,0,0.15)"
          }}
        >
          <Stack direction="row" spacing={1.5} alignItems="center" mb={2.5}>
            <LuggageIcon sx={{ color: "#C2A56D" }} />
            <Typography fontWeight={700} sx={{ letterSpacing: "0.05em" }}>HÀNH TRÌNH CỦA BẠN</Typography>
          </Stack>
          
          <ButtonBase 
            onClick={() => navigate("/my-bookings")}
            sx={{ 
              width: "100%", justifyContent: "space-between", 
              p: 2, borderRadius: "14px", border: "1px solid rgba(194, 165, 109, 0.3)",
              transition: "0.3s",
              "&:hover": { borderColor: "#C2A56D", bgcolor: "rgba(194, 165, 109, 0.05)" }
            }}
          >
            <Typography variant="body2" sx={{ fontWeight: 600, color: "#C2A56D" }}>Kiểm tra lịch trình</Typography>
            <ArrowForwardIcon sx={{ fontSize: 16, color: "#C2A56D" }} />
          </ButtonBase>
        </MotionPaper>
      </Stack>
    </MotionBox>
  );
}