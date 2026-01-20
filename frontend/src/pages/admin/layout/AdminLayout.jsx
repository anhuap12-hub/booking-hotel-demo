import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Paper,
  Typography,
  Stack,
  Button,
  Divider,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HotelIcon from "@mui/icons-material/Hotel";
import MapIcon from "@mui/icons-material/Map";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const menuItems = [
  { label: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
  { label: "Hotels", path: "/admin/hotels", icon: <HotelIcon /> },
  { label: "Room Map", path: "/admin/room-map", icon: <MapIcon /> },
  { label: "Bookings", path: "/admin/bookings", icon: <BookOnlineIcon /> },
];

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  const isDashboard = location.pathname === "/admin";

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", bgcolor: "#f5f6fa" }}>
      {/* SIDEBAR */}
      <Box sx={{ width: 260, bgcolor: "#111827", p: 3 }}>
        <Typography color="white" fontWeight={700} textAlign="center" mb={2}>
          Admin Panel
        </Typography>

        <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)", mb: 3 }} />

        <Stack spacing={2}>
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              style={{ textDecoration: "none" }}
            >
              {({ isActive }) => (
                <Paper
                  sx={{
                    p: 2,
                    display: "flex",
                    gap: 1,
                    bgcolor: isActive ? "#2563eb" : "#1f2937",
                    color: "white",
                  }}
                >
                  {item.icon}
                  {item.label}
                </Paper>
              )}
            </NavLink>
          ))}
        </Stack>

        <Button
          fullWidth
          sx={{ mt: 3, bgcolor: "#374151", color: "white" }}
          onClick={() => navigate("/home")}
        >
          Back Home
        </Button>
      </Box>

      {/* CONTENT */}
      <Box sx={{ flex: 1, p: 4 }}>
        {/* 🔙 BACK BUTTON – TỰ ĐỘNG CHO MỌI TRANG CON */}
        {!isDashboard && (
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={() => navigate(-1)}
            sx={{
              mb: 2,
              textTransform: "none",
              borderRadius: 2,
              bgcolor: "#F5F3F0",
              color: "#1f1f1f",

            }}
          >
            <Typography        
             sx={{ color: "#2B2B2B" }}
      >
        Back
      </Typography>
          </Button>
        )}

        <Outlet />
      </Box>
    </Box>
  );
}
