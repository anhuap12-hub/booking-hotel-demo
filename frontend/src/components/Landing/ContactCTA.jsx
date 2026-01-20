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
    <Container maxWidth="xl" sx={{ mb: 10 }}>
      <Paper
        elevation={0}
        sx={{
          p: { xs: 4, md: 6 },
          borderRadius: 5,
          textAlign: "center",
          color: "#f5f5f5",
          background:
            "linear-gradient(145deg, #2c2a28 0%, #1f1e1c 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle light */}
        <Box
          sx={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(circle at top, rgba(255,255,255,0.08), transparent 60%)",
          }}
        />

        <Typography
          variant="h3"
          gutterBottom
          sx={{
            fontFamily: "Playfair Display, serif",
            fontWeight: 600,
            letterSpacing: "-0.5px",
          }}
        >
          Trải nghiệm ưu đãi{" "}
          <Box component="span" sx={{ color: "#c7a76c" }}>
            Genius
          </Box>
        </Typography>

        <Typography
          sx={{
            mb: 4,
            maxWidth: 520,
            mx: "auto",
            color: "rgba(255,255,255,0.75)",
            fontSize: 15,
          }}
        >
          Đăng nhập để mở khóa mức giá tinh tuyển và đặc quyền dành riêng cho
          những kỳ nghỉ mang dấu ấn riêng.
        </Typography>

        <Button
          variant="contained"
          size="large"
          startIcon={<LoginIcon />}
          href="/login"
          sx={{
            px: 4.5,
            py: 1.5,
            fontWeight: 500,
            fontFamily: "Inter, sans-serif",
            bgcolor: "#c7a76c",
            color: "#1f1e1c",
            borderRadius: 999,
            textTransform: "none",
            boxShadow: "0 8px 30px rgba(0,0,0,0.35)",
            "&:hover": {
              bgcolor: "#d6b980",
              transform: "translateY(-2px)",
            },
          }}
        >
          Đăng nhập ngay
        </Button>
      </Paper>
    </Container>
  );
}
