import { Box, Typography, Button, Paper, Avatar, Container } from "@mui/material";
import { Link } from "react-router-dom";
// Import Icons từ MUI
import MarkEmailReadOutlinedIcon from '@mui/icons-material/MarkEmailReadOutlined';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

export default function CheckEmail() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        // Nền màu kem nhạt sang trọng thay vì gradient lòe loẹt
        bgcolor: "#F9F8F6",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={0}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: "32px", // Bo góc cực lớn hiện đại
            textAlign: "center",
            bgcolor: "#FFF",
            border: "1px solid rgba(194, 165, 109, 0.2)", // Viền Gold siêu mảnh
            boxShadow: "0 20px 40px rgba(28,27,25,0.05)",
          }}
        >
          {/* Vùng Icon trung tâm */}
          <Avatar
            sx={{
              bgcolor: "rgba(194, 165, 109, 0.1)", // Gold nhạt
              color: "#C2A56D", // Gold thương hiệu
              width: 100,
              height: 100,
              margin: "0 auto 32px",
              border: "1px solid #EFE7DD",
            }}
          >
            <MarkEmailReadOutlinedIcon sx={{ fontSize: 45 }} />
          </Avatar>

          <Typography 
            variant="h4" 
            sx={{ 
              fontFamily: "'Playfair Display', serif", // Font tiêu đề sang trọng
              fontWeight: 800, 
              color: "#1C1B19", // Ebony
              mb: 2,
              letterSpacing: "-0.5px" 
            }}
          >
            Xác thực email
          </Typography>

          <Typography 
            variant="body1" 
            sx={{ 
              mb: 4, 
              lineHeight: 1.8, 
              fontSize: "1rem",
              color: "#72716E",
            }}
          >
            Cảm ơn bạn đã tin tưởng <strong style={{ color: "#1C1B19" }}>Coffee Stay</strong>. <br />
            Chúng tôi đã gửi một liên kết xác thực đến địa chỉ email của bạn. 
            Vui lòng kiểm tra hộp thư (và cả thư rác) để hoàn tất.
          </Typography>

          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2.5 }}>
            <Button
              component={Link}
              to="/login"
              variant="contained"
              startIcon={<ArrowBackIcon />}
              fullWidth
              sx={{ 
                borderRadius: "12px",
                py: 2,
                textTransform: "none",
                fontSize: "0.95rem",
                fontWeight: "700",
                bgcolor: "#1C1B19", // Nền đen Ebony
                color: "#C2A56D",   // Chữ vàng Gold
                "&:hover": {
                  bgcolor: "#333230",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Quay về đăng nhập
            </Button>

            <Typography variant="body2" sx={{ color: "#A8A7A1" }}>
              Bạn gặp sự cố?{" "}
              <Link 
                to="/contact" 
                style={{ 
                  color: "#C2A56D", 
                  textDecoration: "none", 
                  fontWeight: "700",
                  borderBottom: "1px solid #C2A56D"
                }}
              >
                Liên hệ hỗ trợ
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}