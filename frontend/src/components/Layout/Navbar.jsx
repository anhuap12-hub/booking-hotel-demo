import { Link, useLocation } from "react-router-dom";
import {
  Box,
  Button,
  Stack,
  Typography,
  IconButton,
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
} from "@mui/icons-material";
import { useAuth } from "../../context/AuthContext";

export const NAVBAR_HEIGHT = 96;

export default function Navbar() {
  const { pathname } = useLocation();
  const { user, logout, loading } = useAuth();

  if (loading) return null;

  const navItems = [
    // ✅ TRANG CHỦ (ICON)
    { label: "Trang chủ", icon: HomeIcon, path: "/", isHome: true },

    // ✅ LƯU TRÚ → HOME
    { label: "Lưu trú", icon: LocalHotel, path: "/home", isHome: false },

    { label: "Ưu đãi", icon: LocalOffer, path: "/deals" },
    { label: "Thuê xe", icon: DirectionsCar, path: "/car-rentals" },

    ...(user
      ? [{ label: "MyBooking", icon: BookOnline, path: "/my-bookings" }]
      : []),

    ...(user?.role === "admin"
      ? [{ label: "Admin", icon: AdminPanelSettings, path: "/admin" }]
      : []),
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
        bgcolor: "#1f1f1f",
        color: "#f5f4f2",
        borderBottom: "1px solid rgba(255,255,255,0.08)",
      }}
    >
      {/* ================= TOP ================= */}
      <Stack
        direction="row"
        alignItems="center"
        justifyContent="space-between"
        sx={{ px: 4, height: "50%" }}
      >
        <Typography
          sx={{
            fontFamily: "Playfair Display, serif",
            fontSize: 20,
            letterSpacing: 1,
          }}
        >
          Coffee Stay
        </Typography>

        {/* AUTH */}
        {!user ? (
          <Stack direction="row" spacing={1.5}>
            <Button
              component={Link}
              to="/login"
              startIcon={<Login />}
              size="small"
              sx={{
                color: "#f5f4f2",
                textTransform: "none",
                fontSize: 13,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.12)",
                },
              }}
            >
              Đăng nhập
            </Button>

            <Button
              component={Link}
              to="/register"
              startIcon={<PersonAdd />}
              size="small"
              sx={{
                bgcolor: "#f5f4f2",
                color: "#1f1f1f",
                textTransform: "none",
                fontSize: 13,
                borderRadius: 2,
                "&:hover": {
                  bgcolor: "#e6e4df",
                },
              }}
            >
              Đăng ký
            </Button>
          </Stack>
        ) : (
          <Stack direction="row" spacing={2} alignItems="center">
            <Typography sx={{ fontSize: 13, opacity: 0.85 }}>
              {user.username}
            </Typography>
            <Button
              onClick={logout}
              size="small"
              sx={{
                bgcolor: "#f5f4f2",
                color: "#1f1f1f",
                textTransform: "none",
                borderRadius: 2,
                fontSize: 12,
                "&:hover": { bgcolor: "#e6e4df" },
              }}
            >
              Đăng xuất
            </Button>
          </Stack>
        )}
      </Stack>

      {/* ================= NAV ================= */}
      <Stack direction="row" spacing={1.5} sx={{ px: 4, height: "50%" }}>
        {navItems.map((item) => {
          const Icon = item.icon;

          // ✅ FIX ACTIVE LOGIC
          const active = item.isHome
            ? pathname === "/"
            : pathname.startsWith(item.path) && item.path !== "/";

          return (
            <Link
              key={item.label}
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                  py: 0.8,
                  borderRadius: 2,
                  fontSize: 13,
                  color: active ? "#fff" : "rgba(255,255,255,0.6)",
                  bgcolor: active
                    ? "rgba(255,255,255,0.12)"
                    : "transparent",
                  transition: "all .25s ease",
                  "&:hover": {
                    color: "#fff",
                    bgcolor: "rgba(255,255,255,0.18)",
                  },
                }}
              >
                <Icon sx={{ fontSize: 18 }} />
                <Typography sx={{ fontSize: 13 }}>
                  {item.label}
                </Typography>
              </Box>
            </Link>
          );
        })}
      </Stack>
    </Box>
  );
}
