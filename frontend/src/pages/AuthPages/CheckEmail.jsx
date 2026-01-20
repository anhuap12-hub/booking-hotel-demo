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
        // Nền gradient tinh tế tạo cảm giác chuyên nghiệp
        background: "linear-gradient(135deg, #fdfcfb 0%, #e2d1c3 100%)",
        p: 2,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={10}
          sx={{
            p: { xs: 4, md: 6 },
            borderRadius: 8,
            textAlign: "center",
            bgcolor: "rgba(255, 255, 255, 0.9)",
            backdropFilter: "blur(10px)", // Hiệu ứng kính mờ
            boxShadow: "0 20px 50px rgba(0,0,0,0.1)",
          }}
        >
          {/* Vùng Icon trung tâm */}
          <Avatar
            sx={{
              bgcolor: "rgba(212, 163, 115, 0.15)", 
              color: "#d4a373",
              width: 100,
              height: 100,
              margin: "0 auto 32px",
              border: "2px dashed #d4a373",
            }}
          >
            <MarkEmailReadOutlinedIcon sx={{ fontSize: 50 }} />
          </Avatar>

          <Typography 
            variant="h4" 
            fontWeight="800" 
            gutterBottom 
            sx={{ color: "#44403c", letterSpacing: "-0.5px" }}
          >
            Xác thực email
          </Typography>

          <Typography 
            variant="body1" 
            color="text.secondary" 
            sx={{ mb: 4, lineHeight: 1.7, fontSize: "1.1rem" }}
          >
            Cảm ơn bạn đã tin tưởng <strong>Coffee Stay</strong>. <br />
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
                borderRadius: 4,
                py: 1.8,
                textTransform: "none",
                fontSize: "1.05rem",
                fontWeight: "700",
                bgcolor: "#d4a373", // Màu vàng đồng thương hiệu
                boxShadow: "0 8px 20px rgba(212, 163, 115, 0.3)",
                "&:hover": {
                  bgcolor: "#b38a5f",
                  boxShadow: "0 10px 25px rgba(212, 163, 115, 0.4)",
                  transform: "translateY(-2px)",
                },
                transition: "all 0.3s ease",
              }}
            >
              Quay về đăng nhập
            </Button>

            <Typography variant="body2" color="text.disabled">
              Bạn gặp sự cố? <Link to="/contact" style={{ color: "#d4a373", textDecoration: "none", fontWeight: "600" }}>Liên hệ hỗ trợ</Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
}