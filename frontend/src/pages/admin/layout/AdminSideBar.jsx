import {
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
  Divider,
} from "@mui/material";
import { Link, useLocation } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import HotelIcon from "@mui/icons-material/Hotel";
import AddBusinessIcon from "@mui/icons-material/AddBusiness";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import MapIcon from "@mui/icons-material/Map"; // Icon cho Room Map
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom"; // Icon cho Rooms

export default function AdminSideBar() {
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
    { text: "Room Map", path: "/admin/room-map", icon: <MapIcon /> }, // Thêm dòng này
    { text: "Hotels", path: "/admin/hotels", icon: <HotelIcon /> },
    { text: "Rooms", path: "/admin/rooms", icon: <MeetingRoomIcon /> },
    { text: "Add Hotel", path: "/admin/hotels/new", icon: <AddBusinessIcon /> },
    { text: "Bookings", path: "/admin/bookings", icon: <BookOnlineIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        width: 240,
        flexShrink: 0,
        "& .MuiDrawer-paper": {
          width: 240,
          bgcolor: "#111827",
          color: "white",
          boxSizing: "border-box",
        },
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="center"
        sx={{ py: 3, letterSpacing: 1 }}
      >
        HOTEL ADMIN
      </Typography>
      
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.1)" }} />

      <List sx={{ px: 1, mt: 1 }}>
        {menuItems.map((item) => {
          const isSelected = location.pathname === item.path;
          
          return (
            <ListItem key={item.text} disablePadding sx={{ mb: 0.5 }}>
              <ListItemButton
                component={Link}
                to={item.path}
                selected={isSelected}
                sx={{
                  borderRadius: 2,
                  "&.Mui-selected": {
                    bgcolor: "#2563eb",
                    color: "white",
                    "& .MuiSvgIcon-root": { color: "white" },
                    "&:hover": { bgcolor: "#1e40af" },
                  },
                  "& .MuiSvgIcon-root": { 
                    color: isSelected ? "white" : "#9ca3af",
                    fontSize: 22 
                  },
                  "&:hover": { bgcolor: "#374151" },
                }}
              >
                {item.icon}
                <ListItemText
                  primary={item.text}
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isSelected ? 600 : 400,
                  }}
                  sx={{ ml: 2 }}
                />
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}