import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Stack,
  Typography,
  Avatar,
  Tooltip,
  Container,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import {
  LocalHotel,
  DirectionsCar,
  AdminPanelSettings,
  BookOnline,
  Login,
  PersonAdd,
  LocalOffer,
  Logout,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

export const NAVBAR_HEIGHT = 110; // Tăng một chút để tạo độ thoáng

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  const navItems = [
    { label: "Trang chủ", icon: HomeIcon, path: "/", isHome: true },
    { label: "Lưu trú", icon: LocalHotel, path: "/hotels", isHome: false },
    { label: "Ưu đãi", icon: LocalOffer, path: "/deals" },
    { label: "Thuê xe", icon: DirectionsCar, path: "/car-rentals" },
    ...(user ? [{ label: "Chỗ nghỉ của tôi", icon: BookOnline, path: "/my-bookings" }] : []),
    ...(user?.role === "admin" ? [{ label: "Quản trị", icon: AdminPanelSettings, path: "/admin" }] : []),
  ];

  return (
    <Box
      component="header"
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        right: 0,
        height: NAVBAR_HEIGHT,
        zIndex: 1200,
        bgcolor: "#1C1B19", // Màu Ebony sâu hơn
        color: "#F1F0EE",
        borderBottom: "1px solid rgba(194,165,109,0.15)", // Border màu Gold nhẹ
        boxShadow: "0 4px 20px rgba(0,0,0,0.4)",
      }}
    >
      <Container maxWidth="xl" sx={{ height: "100%" }}>
        {/* ================= TOP: BRAND & ACCOUNT ================= */}
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
          sx={{ height: "55%", borderBottom: "1px solid rgba(255,255,255,0.05)" }}
        >
          <Typography
            component={Link}
            to="/"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: 24,
              fontWeight: 800,
              letterSpacing: -0.5,
              color: "#C2A56D", // Màu thương hiệu Gold
              textDecoration: "none",
            }}
          >
            Coffee Stay
          </Typography>

          {!user ? (
            <Stack direction="row" spacing={1}>
              <Button
                component={Link}
                to="/login"
                startIcon={<Login sx={{ fontSize: 18 }} />}
                sx={{
                  color: "#F1F0EE",
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 500,
                  "&:hover": { color: "#C2A56D" },
                }}
              >
                Đăng nhập
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="contained"
                sx={{
                  bgcolor: "#C2A56D",
                  color: "#1C1B19",
                  textTransform: "none",
                  fontSize: 14,
                  fontWeight: 700,
                  borderRadius: "8px",
                  px: 3,
                  "&:hover": { bgcolor: "#D4BC8E" },
                }}
              >
                Đăng ký
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={3} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar 
                  sx={{ width: 32, height: 32, bgcolor: "#C2A56D", fontSize: 14, fontWeight: 700, color: "#1C1B19" }}
                >
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#F1F0EE" }}>
                  {user.username}
                </Typography>
              </Stack>
              <Tooltip title="Đăng xuất">
                <IconButton onClick={logout} size="small" sx={{ color: "rgba(255,255,255,0.5)", "&:hover": { color: "#ff4d4f" } }}>
                  <Logout fontSize="small" />
                </IconButton>
              </Tooltip>
            </Stack>
          )}
        </Stack>

        {/* ================= BOTTOM: NAVIGATION ================= */}
        <Stack direction="row" spacing={1} sx={{ height: "45%", alignItems: "center" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isHome
              ? pathname === "/"
              : pathname.startsWith(item.path);

            return (
              <Box
                key={item.label}
                component={Link}
                to={item.path}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  height: "100%",
                  color: active ? "#C2A56D" : "rgba(241, 240, 238, 0.6)",
                  textDecoration: "none",
                  position: "relative",
                  transition: "0.3s",
                  "&:hover": { color: "#C2A56D" },
                  // Thanh underline khi active
                  "&::after": active ? {
                    content: '""',
                    position: "absolute",
                    bottom: 0,
                    left: "15%",
                    right: "15%",
                    height: "3px",
                    bgcolor: "#C2A56D",
                    borderRadius: "4px 4px 0 0",
                  } : {},
                }}
              >
                <Icon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, fontWeight: active ? 700 : 500, letterSpacing: 0.5 }}>
                  {item.label}
                </Typography>
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}