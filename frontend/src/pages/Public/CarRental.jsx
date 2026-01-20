import React, { useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Stack,
  Paper,
  Snackbar,
  Slide,
  Grid,
  Rating,
  Stepper,
  Step,
  StepLabel,
  Link,
  Avatar,
  Chip,
  useTheme,
} from "@mui/material";

// Icons
import PhoneIcon from "@mui/icons-material/Phone";
import NotificationsActiveIcon from "@mui/icons-material/NotificationsActive";
import FormatQuoteIcon from "@mui/icons-material/FormatQuote";
import DownloadIcon from "@mui/icons-material/Download";
import AppRegistrationIcon from "@mui/icons-material/AppRegistration";
import ElectricCarIcon from "@mui/icons-material/ElectricCar";

// Để tránh lỗi Vite, chúng ta dùng Slide trực tiếp
function SlideUp(props) {
  return <Slide {...props} direction="up" />;
}

const reviews = [
  {
    name: "Anh Minh – Hà Nội",
    rating: 5,
    content: "Xe sạch, chạy êm và tài xế rất lịch sự. Trải nghiệm Xanh SM khiến mình yên tâm hơn hẳn.",
    avatar: "M",
  },
  {
    name: "Chị Lan – TP.HCM",
    rating: 4.5,
    content: "Xe điện không mùi, không ồn. Đặt xe nhanh qua ứng dụng, cực kỳ tiện lợi cho khách du lịch.",
    avatar: "L",
  },
  {
    name: "Hoàng – Gia đình",
    rating: 5,
    content: "VF 9 rất rộng rãi, đi gia đình cực kỳ thoải mái. Trải nghiệm dịch vụ cao cấp như xe riêng.",
    avatar: "H",
  },
];

const steps = [
  { label: "Tải ứng dụng Xanh SM", icon: <DownloadIcon /> },
  { label: "Đăng ký tài khoản", icon: <AppRegistrationIcon /> },
  { label: "Đặt xe & trải nghiệm", icon: <ElectricCarIcon /> },
];

export default function XanhSMContact() {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const xanhSMColor = "#00b14f"; // Màu xanh thương hiệu Xanh SM

  return (
    <Box sx={{ backgroundColor: theme.palette.background.default, pb: 10 }}>
      {/* ================= HERO SECTION ================= */}
      <Box
        sx={{
          position: "relative",
          height: { xs: 450, md: 550 },
          width: "100vw",
          left: "50%",
          right: "50%",
          ml: "-50vw",
          mr: "-50vw",
          backgroundImage: 'url("/xanhBanner.jpeg")',
          backgroundSize: "cover",
          backgroundPosition: "center",
          display: "flex",
          alignItems: "center",
          overflow: "hidden",
          "&::before": {
            content: '""',
            position: "absolute",
            inset: 0,
            bgcolor: "rgba(0, 28, 28, 0.55)", // Overlay trầm để nổi bật text
          },
        }}
      >
        <Container maxWidth="lg" sx={{ position: "relative", zIndex: 1 }}>
          <Grid container>
            <Grid item xs={12} md={8}>
              <Chip 
                label="Đối tác di chuyển xanh" 
                sx={{ 
                  bgcolor: xanhSMColor, 
                  color: "#fff", 
                  fontWeight: 700, 
                  mb: 3,
                  px: 1 
                }} 
              />
              <Typography 
                variant="h2" 
                color="white" 
                sx={{ 
                  mb: 2, 
                  fontSize: { xs: "2.8rem", md: "4rem" },
                  lineHeight: 1.2
                }}
              >
                Hành trình Xanh <br /> khởi nguồn từ sự tĩnh lặng
              </Typography>
              <Typography 
                variant="h6" 
                color="rgba(255,255,255,0.85)" 
                sx={{ 
                  mb: 5, 
                  fontWeight: 400, 
                  fontFamily: 'Inter',
                  maxWidth: "90%" 
                }}
              >
                Kết nối kỳ nghỉ tại Coffee Stay với dịch vụ taxi thuần điện đầu tiên tại Việt Nam. 
                Không mùi xăng, không tiếng ồn, chỉ có sự thư thái.
              </Typography>
              
              <Button
                variant="contained"
                size="large"
                onClick={() => setOpen(true)}
                startIcon={<PhoneIcon />}
                sx={{
                  bgcolor: xanhSMColor,
                  px: 5,
                  py: 1.8,
                  borderRadius: "12px",
                  fontSize: "1rem",
                  fontWeight: 700,
                  "&:hover": { bgcolor: "#008f3f" }
                }}
              >
                Hotline 1900 2088
              </Button>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* ================= CHỌN XE (CONTENT TRÀN LÊN HERO) ================= */}
      <Container maxWidth="lg" sx={{ mt: -8, position: "relative", zIndex: 2 }}>
        <Paper 
          elevation={0} 
          sx={{ 
            p: { xs: 3, md: 5 }, 
            borderRadius: 6, 
            border: `1px solid ${theme.palette.divider}`,
            mb: 10,
            backgroundColor: "#fff"
          }}
        >
          <Grid container spacing={4} justifyContent="center" alignItems="center">
            {[
              { src: "/vin-blue.png", name: "GreenCar (VF 5/VF e34)" },
              { src: "/vin-red.png", name: "Xanh SM Luxury (VF 8)" },
              { src: "/vin-gray.png", name: "Xanh SM Luxury (VF 9)" }
            ].map((car, i) => (
              <Grid item xs={12} sm={4} key={i} textAlign="center">
                <Box 
                  component="img" 
                  src={car.src} 
                  sx={{ 
                    width: "100%", 
                    maxWidth: 240, 
                    filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.12))",
                    transition: "transform 0.4s ease",
                    "&:hover": { transform: "translateY(-10px)" }
                  }} 
                />
                <Typography variant="body1" fontWeight={700} mt={2} color="primary.main">
                  {car.name}
                </Typography>
              </Grid>
            ))}
          </Grid>
        </Paper>

        <Stack spacing={12}>
          {/* GIÁ TRỊ CỐT LÕI */}
          <Box textAlign="center">
            <Typography variant="h3" sx={{ mb: 2 }}>Trải nghiệm khác biệt</Typography>
            <Typography variant="body1" color="text.secondary" sx={{ maxWidth: 700, mx: "auto", mb: 8 }}>
              Sự kết hợp giữa công nghệ tương lai và tâm hồn của những người yêu cà phê. 
              Mỗi hành trình là một sự khởi đầu mới.
            </Typography>
            
            <Grid container spacing={4}>
              {[
                { title: "Không mùi xăng xe", desc: "Hệ thống lọc không khí và động cơ điện giúp bạn không còn nỗi lo say xe." },
                { title: "Sự yên tĩnh tuyệt đối", desc: "Tận hưởng những bản nhạc nhẹ nhàng hoặc chợp mắt giữa hành trình." },
                { title: "Tài xế chuẩn 5 sao", desc: "Sự lịch thiệp và chu đáo là tiêu chuẩn bắt buộc tại Xanh SM." },
                { title: "Góp phần sống xanh", desc: "Cùng Coffee Stay và Xanh SM kiến tạo một tương lai bền vững." }
              ].map((item, i) => (
                <Grid item xs={12} sm={6} md={3} key={i}>
                  <Box sx={{ textAlign: "left", p: 2 }}>
                    <Typography variant="h6" sx={{ fontSize: "1.2rem", mb: 1.5, color: "text.primary" }}>
                      {item.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ lineHeight: 1.6 }}>
                      {item.desc}
                    </Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </Box>

          {/* HƯỚNG DẪN ĐẶT XE (Style Coffee Stay) */}
          <Box>
            <Paper 
              sx={{ 
                p: { xs: 4, md: 8 }, 
                borderRadius: 8, 
                bgcolor: "#3a342b", 
                color: "#fff",
                boxShadow: "0 20px 40px rgba(0,0,0,0.15)"
              }}
            >
              <Typography variant="h4" textAlign="center" color="#fff" mb={8}>
                Bắt đầu chuyến đi xanh
              </Typography>
              <Stepper 
                alternativeLabel 
                sx={{ 
                  "& .MuiStepLabel-label": { color: "rgba(255,255,255,0.6) !important" },
                  "& .MuiStepLabel-label.Mui-active": { color: "#fff !important", fontWeight: 700 },
                  "& .MuiStepConnector-line": { borderColor: "rgba(255,255,255,0.1)" }
                }}
              >
                {steps.map((step, i) => (
                  <Step key={i}>
                    <StepLabel 
                      icon={
                        <Box sx={{ 
                          bgcolor: xanhSMColor, 
                          p: 1.5, 
                          borderRadius: "50%", 
                          display: "flex", 
                          color: "#fff",
                          boxShadow: `0 0 15px ${xanhSMColor}66`
                        }}>
                          {step.icon}
                        </Box>
                      }
                    >
                      <Typography variant="body1" mt={1}>{step.label}</Typography>
                    </StepLabel>
                  </Step>
                ))}
              </Stepper>

              <Stack alignItems="center" mt={8}>
                <Button
                  component={Link}
                  href="https://play.google.com/store/apps/details?id=com.gsm.customer"
                  target="_blank"
                  variant="outlined"
                  sx={{ 
                    color: "#fff", 
                    borderColor: "rgba(255,255,255,0.2)", 
                    borderRadius: "100px",
                    px: 6,
                    py: 1.5,
                    textTransform: "none",
                    "&:hover": { borderColor: xanhSMColor, color: xanhSMColor, bgcolor: "rgba(0,177,79,0.05)" }
                  }}
                >
                  Mở Google Play / App Store
                </Button>
              </Stack>
            </Paper>
          </Box>

          {/* ĐÁNH GIÁ (REVIEWS) */}
          <Box>
            <Typography variant="h3" textAlign="center" mb={8}>Phản hồi từ khách hàng</Typography>
            <Grid container spacing={4}>
              {reviews.map((r, i) => (
                <Grid item xs={12} md={4} key={i}>
                  <Paper 
                    elevation={0}
                    sx={{ 
                      p: 4, 
                      height: "100%", 
                      borderRadius: 6,
                      border: `1px solid ${theme.palette.divider}`,
                      transition: "0.3s ease",
                      "&:hover": { transform: "translateY(-8px)", boxShadow: theme.shadows[3] }
                    }}
                  >
                    <FormatQuoteIcon sx={{ color: xanhSMColor, fontSize: 40, opacity: 0.2, mb: 1 }} />
                    <Typography variant="body1" sx={{ fontStyle: "italic", mb: 4, minHeight: 80 }}>
                      “{r.content}”
                    </Typography>
                    <Stack direction="row" spacing={2} alignItems="center">
                      <Avatar sx={{ bgcolor: theme.palette.primary.main, fontWeight: 700 }}>{r.avatar}</Avatar>
                      <Box>
                        <Typography variant="subtitle2" fontWeight={800}>{r.name}</Typography>
                        <Rating value={r.rating} precision={0.5} readOnly size="small" />
                      </Box>
                    </Stack>
                  </Paper>
                </Grid>
              ))}
            </Grid>
          </Box>
        </Stack>
      </Container>

      {/* SNACKBAR THÔNG BÁO */}
      <Snackbar
        open={open}
        autoHideDuration={4000}
        onClose={() => setOpen(false)}
        TransitionComponent={SlideUp}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Paper 
          sx={{ 
            px: 3, 
            py: 1.5, 
            display: "flex", 
            alignItems: "center", 
            gap: 2, 
            borderRadius: "100px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.15)",
            border: `1px solid ${xanhSMColor}`
          }}
        >
          <NotificationsActiveIcon sx={{ color: xanhSMColor }} />
          <Typography variant="body2" fontWeight={700}>
            Tổng đài toàn quốc: 1900 2088
          </Typography>
          <Button 
            size="small" 
            sx={{ color: xanhSMColor, minWidth: "auto", fontWeight: 800 }} 
            onClick={() => setOpen(false)}
          >
            ĐÃ HIỂU
          </Button>
        </Paper>
      </Snackbar>
    </Box>
  );
}