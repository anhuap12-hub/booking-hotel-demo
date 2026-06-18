import {
  Container,
  Paper,
  Typography,
  Button,
  Box,
} from "@mui/material";
import LoginIcon from "@mui/icons-material/Login";

export default function ContactCTA() {
  return (
    <Container maxWidth="md" sx={{ mb: 8 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 3, md: 5 },
          borderRadius: 4,
          textAlign: "center",
          color: "#1a1a1a",
          // Màu xanh đậm hơn để bớt "mờ", thêm shadow để nổi khối
          background: "linear-gradient(135deg, #e6f0ff 0%, #dbe9ff 100%)",
          border: "1px solid #c2d6ff", 
          boxShadow: "0 4px 12px rgba(0, 53, 128, 0.08)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <Typography
          variant="h4"
          gutterBottom
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 700,
            fontSize: { xs: "1.75rem", md: "2.2rem" },
            position: "relative",
            zIndex: 1
          }}
        >
          Trải nghiệm ưu đãi{" "}
          <Box component="span" sx={{ color: "#003580" }}>
            Genius
          </Box>
        </Typography>

        <Typography
          sx={{
            mb: 3,
            maxWidth: 500,
            mx: "auto",
            color: "#4a4a4a",
            fontSize: { xs: "0.95rem", md: "1rem" },
            lineHeight: 1.5,
            position: "relative",
            zIndex: 1
          }}
        >
          Đăng nhập để mở khóa mức giá và các ưu đãi dành riêng cho kỳ nghỉ của bạn.
        </Typography>

        <Button
          variant="contained"
          size="medium"
          startIcon={<LoginIcon />}
          href="/login"
          sx={{
            px: 4,
            py: 1.2,
            fontSize: "0.95rem",
            fontWeight: 600,
            fontFamily: "'Inter', sans-serif",
            bgcolor: "#003580", 
            color: "#ffffff",
            borderRadius: 2,
            textTransform: "none",
            boxShadow: "0 2px 8px rgba(0, 53, 128, 0.25)", // Thêm shadow cho nút
            transition: "all 0.2s ease",
            "&:hover": {
              bgcolor: "#00224f",
              boxShadow: "0 4px 16px rgba(0, 53, 128, 0.3)",
            },
          }}
        >
          Đăng nhập ngay
        </Button>
      </Paper>
    </Container>
  );
}