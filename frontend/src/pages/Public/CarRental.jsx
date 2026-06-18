import React, { useState } from "react";
import {
  Box, Container, Typography, Button, Stack, Paper, Snackbar, Slide, 
  Grid, Rating, Stepper, Step, StepLabel, Link, Avatar, Chip, useTheme 
} from "@mui/material";

// Icons
import PhoneIcon from "@mui/icons-material/Phone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import DownloadIcon from "@mui/icons-material/Download";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";

function SlideUp(props) {
  return <Slide {...props} direction="up" />;
}

const reviews = [
  { name: "Anh Minh – Hà Nội", rating: 5, content: "Xe sạch, chạy êm và tài xế rất lịch sự.", avatar: "M" },
  { name: "Chị Lan – TP.HCM", rating: 4.5, content: "Xe điện không mùi, không ồn. Cực tiện lợi.", avatar: "L" },
  { name: "Hoàng – Gia đình", rating: 5, content: "VF 9 rất rộng rãi, đi gia đình cực kỳ thoải mái.", avatar: "H" },
];

const steps = [
  { label: "Tải ứng dụng", icon: <DownloadIcon /> },
  { label: "Đăng ký", icon: <AppRegistrationIcon /> },
  { label: "Đặt xe", icon: <ElectricCarIcon /> },
];

export default function XanhSMContact() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();
  const xanhSMColor = "#00b14f";

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, pb: 6 }}>
      {/* HERO SECTION */}
      <Box sx={{ position: "relative", height: { xs: 350, md: 450 }, width: "100%", backgroundImage: 'url("/xanhBanner.jpeg")', backgroundSize: "cover", backgroundPosition: "center", display: "flex", alignItems: "center", "&::before": { content: '""', position: "absolute", inset: 0, bgcolor: "rgba(0, 28, 28, 0.65)" } }}>
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container>
            <Grid item xs={12} md={8}>
              <Chip label="Đối tác di chuyển xanh" size="small" sx={{ bgcolor: xanhSMColor, color: "#fff", fontWeight: 600, mb: 1.5 }} />
              <Typography variant="h3" color="white" sx={{ mb: 1, fontSize: { xs: "2rem", md: "3rem" }, fontWeight: 800 }}>Hành trình Xanh <br /> khởi nguồn từ sự tĩnh lặng</Typography>
              <Button variant="contained" size="medium" onClick={() => setOpen(true)} startIcon={<PhoneIcon />} sx={{ bgcolor: xanhSMColor, mt: 2, borderRadius: "8px", fontWeight: 700 }}>Hotline 1900 2088</Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* CONTENT */}
      <Container maxWidth="lg" sx={{ mt: -6, position: "relative", zIndex: 2 }}>
        {/* Chọn xe */}
        <Paper elevation={0} sx={{ p: 3, borderRadius: 4, mb: 6, border: `1px solid ${theme.palette.divider}` }}>
          <Grid container spacing={2} justifyContent="center">
            {[{ src: "/vin-blue.png", name: "GreenCar" }, { src: "/vin-red.png", name: "Luxury (VF 8)" }, { src: "/vin-gray.png", name: "Luxury (VF 9)" }].map((car, i) => (
              <Grid item xs={6} sm={4} key={i} textAlign="center">
                <Box component="img" src={car.src} sx={{ width: "100%", maxWidth: 160, transition: "0.4s", "&:hover": { transform: "translateY(-6px)" } }} />
                <Typography variant="caption" fontWeight={700} display="block">{car.name}</Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Stack spacing={8}>
          {/* Hướng dẫn đặt xe */}
          <Paper 
  sx={{ 
    p: { xs: 3, md: 5 }, 
    borderRadius: 6, 
    border: `2px solid ${xanhSMColor}`, 
    boxShadow: `0 10px 30px ${xanhSMColor}22` 
  }}
>
  <Typography variant="h5" textAlign="center" mb={5} fontWeight={800} color={xanhSMColor}>
    Bắt đầu chuyến đi xanh
  </Typography>
  
  <Stepper alternativeLabel>
    {steps.map((step, i) => (
      <Step key={i}>
        <StepLabel icon={<Box sx={{ bgcolor: xanhSMColor, p: 1.2, borderRadius: "50%", color: "#fff" }}>{step.icon}</Box>}>
          <Typography variant="body2" mt={1}>{step.label}</Typography>
        </StepLabel>
      </Step>
    ))}
  </Stepper>

  {/* ĐÃ THÊM LẠI NÚT BẤM VÀO ĐÂY */}
  <Stack alignItems="center" mt={5}>
    <Button
      component={Link}
      href="https://play.google.com/store/apps/details?id=com.gsm.customer"
      target="_blank"
      variant="contained"
      size="medium"
      sx={{ 
        bgcolor: xanhSMColor,
        color: "#fff", 
        borderRadius: "100px",
        px: 5,
        py: 1.2,
        textTransform: "none",
        fontSize: "0.95rem",
        fontWeight: 700,
        boxShadow: `0 6px 16px ${xanhSMColor}55`,
        "&:hover": { bgcolor: "#008f3f", boxShadow: "0 8px 20px rgba(0,0,0,0.2)" }
      }}
    >
      Mở Google Play / App Store
    </Button>
  </Stack>
</Paper>

          {/* Đánh giá */}
          <Box>
            <Typography variant="h5" textAlign="center" mb={4} fontWeight={700}>Phản hồi khách hàng</Typography>
            <Grid container spacing={2}>
              {reviews.map((r, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Paper sx={{ p: 2.5, borderRadius: 3, border: `1px solid ${theme.palette.divider}`, "&:hover": { borderColor: xanhSMColor } }}>
                    <FormatQuoteIcon sx={{ color: xanhSMColor, fontSize: 24, opacity: 0.3 }} />
                    <Typography variant="body2" sx={{ fontStyle: "italic", my: 2, color: "#444" }}>“{r.content}”</Typography>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      <Avatar sx={{ width: 32, height: 32, bgcolor: xanhSMColor, fontSize: '0.8rem' }}>{r.avatar}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={700} fontSize="0.8rem">{r.name}</Typography>
                        <Rating value={r.rating} readOnly size="small" sx={{ fontSize: '0.75rem', color: xanhSMColor }} />
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Container>

      {/* SNACKBAR */}
      <Snackbar open={open} autoHideDuration={4000} onClose={() => setOpen(false)} TransitionComponent={SlideUp} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
        <Paper sx={{ px: 2.5, py: 1, display: "flex", alignItems: "center", gap: 1.5, borderRadius: "100px", border: `1px solid ${xanhSMColor}` }}>
          <NotificationsActiveIcon sx={{ color: xanhSMColor }} />
          <Typography variant="body2" fontWeight={700}>Tổng đài: 1900 2088</Typography>
        </Paper>
      </Snackbar>
    </Box>
  );
}