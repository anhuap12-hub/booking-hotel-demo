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

export default function AdminSideBar() {
  const location = useLocation();

  const menuItems = [
    { text: "Dashboard", path: "/admin", icon: <DashboardIcon /> },
    { text: "Hotels", path: "/admin/hotels", icon: <HotelIcon /> },
    { text: "Add Hotel", path: "/admin/hotels/new", icon: <AddBusinessIcon /> },
    { text: "Bookings", path: "/admin/bookings", icon: <BookOnlineIcon /> },
  ];

  return (
    <Drawer
      variant="permanent"
      anchor="left"
      sx={{
        "& .MuiDrawer-paper": {
          width: 240,
          bgcolor: "#111827",
          color: "white",
        },
      }}
    >
      <Typography
        variant="h6"
        fontWeight="bold"
        textAlign="center"
        sx={{ py: 2 }}
      >
        Admin Panel
      </Typography>
      <Divider sx={{ bgcolor: "rgba(255,255,255,0.2)" }} />

      <List>
        {menuItems.map((item) => (
          <ListItem key={item.text} disablePadding>
            <ListItemButton
              component={Link}
              to={item.path}
              selected={location.pathname === item.path}
              sx={{
                "&.Mui-selected": {
                  bgcolor: "#2563eb",
                  "&:hover": { bgcolor: "#1e40af" },
                },
                "&:hover": { bgcolor: "#374151" },
              }}
            >
              {item.icon}
              <ListItemText
                primary={item.text}
                sx={{ ml: 2 }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
