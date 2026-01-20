import {
  Box,
  Typography,
  Stack,
  Link,
  Container,
  Divider,
  Grid,
  IconButton,
} from "@mui/material";
import {
  Facebook,
  Twitter,
  Instagram,
  HelpOutline,
  ContactSupport,
  Security,
  Info,
  Work,
  Article,
  Gavel,
  PrivacyTip,
  Cookie,
} from "@mui/icons-material";

const sections = [
  {
    title: "Hỗ trợ",
    links: [
      { label: "Trung tâm trợ giúp", href: "/help", icon: HelpOutline },
      { label: "Liên hệ", href: "/contact", icon: ContactSupport },
      { label: "An toàn & bảo mật", href: "/safety", icon: Security },
    ],
  },
  {
    title: "Về chúng tôi",
    links: [
      { label: "Câu chuyện thương hiệu", href: "/about", icon: Info },
      { label: "Tuyển dụng", href: "/careers", icon: Work },
      { label: "Báo chí", href: "/press", icon: Article },
    ],
  },
  {
    title: "Pháp lý",
    links: [
      { label: "Điều khoản sử dụng", href: "/terms", icon: Gavel },
      { label: "Chính sách bảo mật", href: "/privacy", icon: PrivacyTip },
      { label: "Chính sách cookie", href: "/cookies", icon: Cookie },
    ],
  },
  {
    title: "Mạng xã hội",
    links: [
      { label: "Facebook", href: "https://facebook.com", icon: Facebook },
      { label: "Twitter", href: "https://twitter.com", icon: Twitter },
      { label: "Instagram", href: "https://instagram.com", icon: Instagram },
    ],
  },
];

export default function Footer() {
  return (
    <Box
      component="footer"
      sx={{
        bgcolor: "#1c1b19",
        color: "#e6e3dc",
        mt: "auto",
      }}
    >
      <Container maxWidth="xl" sx={{ py: 5 }}>
        {/* TOP */}
        <Grid container spacing={4}>
          {/* LOGO + DESCRIPTION */}
          <Grid item xs={12} md={3}>
            <Stack spacing={1.5}>
              <Typography
                sx={{
                  fontFamily: "Playfair Display, serif",
                  fontSize: 26,
                  fontWeight: 600,
                  color: "#f5f4f2",
                }}
              >
                Coffee Stay
              </Typography>

              <Typography
                sx={{
                  fontSize: 13,
                  lineHeight: 1.7,
                  color: "#cfcac2",
                }}
              >
                Nền tảng đặt phòng khách sạn boutique, tập trung vào trải nghiệm
                lưu trú tinh tế, chậm rãi và giàu cảm xúc.
              </Typography>

              <Typography
                sx={{
                  fontSize: 12,
                  color: "#9f9a90",
                }}
              >
                Chúng tôi không chỉ bán phòng — chúng tôi giúp bạn tìm thấy
                không gian để nghỉ ngơi đúng nghĩa.
              </Typography>
            </Stack>
          </Grid>

          {/* LINK SECTIONS */}
          {sections.map((section, idx) => (
            <Grid item xs={12} sm={6} md={3} key={idx}>
              <Typography
                sx={{
                  fontSize: 13,
                  fontWeight: 600,
                  letterSpacing: 0.5,
                  mb: 1.5,
                  color: "#f5f4f2",
                }}
              >
                {section.title}
              </Typography>

              <Stack spacing={1}>
                {section.links.map((link, i) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={i}
                      href={link.href}
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        fontSize: 13,
                        color: "#cfcac2",
                        textDecoration: "none",
                        "&:hover": {
                          color: "#ffffff",
                        },
                      }}
                    >
                      <Icon sx={{ fontSize: 16, opacity: 0.8 }} />
                      {link.label}
                    </Link>
                  );
                })}
              </Stack>
            </Grid>
          ))}
        </Grid>

        <Divider sx={{ my: 4, borderColor: "rgba(255,255,255,0.08)" }} />

        {/* POLICY TEXT */}
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography
              sx={{
                fontSize: 12,
                lineHeight: 1.7,
                color: "#9f9a90",
              }}
            >
              Coffee Stay cam kết bảo vệ quyền riêng tư và dữ liệu cá nhân của
              người dùng theo các tiêu chuẩn bảo mật cao nhất. Mọi thông tin
              được thu thập chỉ nhằm mục đích cải thiện trải nghiệm đặt phòng
              và sẽ không được chia sẻ cho bên thứ ba khi chưa có sự cho phép.
              <br />
              Việc sử dụng nền tảng đồng nghĩa với việc bạn đồng ý với các điều
              khoản sử dụng, chính sách bảo mật và chính sách cookie của chúng
              tôi.
            </Typography>
          </Grid>

          {/* SOCIAL */}
          <Grid item xs={12} md={4}>
            <Stack spacing={1.5} alignItems={{ xs: "flex-start", md: "flex-end" }}>
              <Stack direction="row" spacing={1}>
                {[Facebook, Twitter, Instagram].map((Icon, i) => (
                  <IconButton
                    key={i}
                    size="small"
                    sx={{
                      color: "#cfcac2",
                      "&:hover": { color: "#ffffff" },
                    }}
                  >
                    <Icon fontSize="small" />
                  </IconButton>
                ))}
              </Stack>

              <Typography sx={{ fontSize: 12, color: "#9f9a90" }}>
                © {new Date().getFullYear()} Coffee Stay
              </Typography>
            </Stack>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
}
