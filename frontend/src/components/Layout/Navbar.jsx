import { Link, useLocation } from "react-router-dom";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import Container from "@mui/material/Container";

import HomeIcon from "@mui/icons-material/Home";
import {
  LocalHotel,
  DirectionsCar,
  AdminPanelSettings,
  BookOnline,
  Login,
  LocalOffer,
  Logout,
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

export const NAVBAR_HEIGHT = 110;

// Bảng màu Booking Style
const COLORS = {
  primary: "#003580", // Xanh đậm Booking
  secondary: "#FFFFFF", // Trắng
  accent: "#FFB700",   // Vàng nhấn (nút đăng ký)
  text: "#FFFFFF",     // Chữ trắng trên nền xanh
  hover: "rgba(255, 255, 255, 0.15)"
};

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
        bgcolor: COLORS.primary, // Nền xanh Booking
        color: COLORS.text,
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
      }}
    >
      <Container maxWidth="xl" sx={{ height: "100%" }}>
        {/* TOP: BRAND & ACCOUNT */}
        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ height: "55%" }}>
          <Typography
            component={Link}
            to="/"
            sx={{
              fontSize: 24,
              fontWeight: 800,
              color: COLORS.secondary,
              textDecoration: "none",
            }}
          >
            Coffee Stay
          </Typography>

          {!user ? (
            <Stack direction="row" spacing={1}>
              <Button component={Link} to="/login" sx={{ color: COLORS.secondary, textTransform: "none", "&:hover": { bgcolor: COLORS.hover } }}>
                Đăng nhập
              </Button>
              <Button component={Link} to="/register" variant="contained"
                sx={{ bgcolor: COLORS.secondary, color: COLORS.primary, textTransform: "none", fontWeight: 700, borderRadius: "2px", "&:hover": { bgcolor: "#f0f0f0" } }}
              >
                Đăng ký
              </Button>
            </Stack>
          ) : (
            <Stack direction="row" spacing={3} alignItems="center">
              <Stack direction="row" spacing={1} alignItems="center">
                <Avatar sx={{ width: 32, height: 32, bgcolor: COLORS.secondary, color: COLORS.primary, fontSize: 14, fontWeight: 700 }}>
                  {user.username.charAt(0).toUpperCase()}
                </Avatar>
                <Typography sx={{ fontSize: 14, fontWeight: 600 }}>{user.username}</Typography>
              </Stack>
              <Tooltip title="Đăng xuất">
                <Button onClick={logout} sx={{ color: COLORS.secondary, minWidth: 32, "&:hover": { bgcolor: COLORS.hover } }}>
                  <Logout />
                </Button>
              </Tooltip>
            </Stack>
          )}
        </Stack>

        {/* BOTTOM: NAVIGATION */}
        <Stack direction="row" spacing={1} sx={{ height: "45%", alignItems: "center" }}>
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = item.isHome ? pathname === "/" : pathname.startsWith(item.path);

            return (
              <Box key={item.label} component={Link} to={item.path}
                sx={{
                  display: "flex", alignItems: "center", gap: 1, px: 2, height: "100%",
                  color: active ? COLORS.secondary : "rgba(255,255,255,0.7)",
                  textDecoration: "none",
                  bgcolor: active ? "rgba(255,255,255,0.15)" : "transparent",
                  borderRadius: "10px",
                  transition: "0.3s",
                  "&:hover": { bgcolor: "rgba(255,255,255,0.1)" },
                }}
              >
                <Icon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13, fontWeight: active ? 700 : 500 }}>{item.label}</Typography>
              </Box>
            );
          })}
        </Stack>
      </Container>
    </Box>
  );
}