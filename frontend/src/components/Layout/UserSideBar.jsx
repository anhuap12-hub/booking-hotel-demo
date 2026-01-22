import React from 'react';
import { 
  List, 
  ListItem, 
  ListItemIcon, 
  ListItemText, 
  Box, 
  Typography,
  ListItemButton
} from '@mui/material';
import { 
  LocalHotel, 
  DirectionsCar, 
  Attractions, 
  LocalTaxi, 
  AdminPanelSettings, 
  BookOnline 
} from '@mui/icons-material';
import { Link, useLocation } from 'react-router-dom';

const Sidebar = () => {
  const { pathname } = useLocation();

  const navItems = [
    { to: '/', icon: <LocalHotel />, label: 'Lưu trú' },
    { to: '/car-rentals', icon: <DirectionsCar />, label: 'Thuê xe' },
    { to: '/attractions', icon: <Attractions />, label: 'Địa điểm' },
    { to: '/taxi', icon: <LocalTaxi />, label: 'Taxi sân bay' },
    { to: '/mybooking', icon: <BookOnline />, label: 'Đơn đặt của tôi' },
    { to: '/adminpanel', icon: <AdminPanelSettings />, label: 'Quản trị' },
  ];

  return (
    <Box sx={{ height: '100%', bgcolor: '#1C1B19', py: 3 }}>
      {/* Sidebar Header/Logo (Dành cho Mobile Drawer) */}
      <Box sx={{ px: 3, mb: 4 }}>
        <Typography
          sx={{
            fontFamily: "'Playfair Display', serif",
            fontSize: 20,
            fontWeight: 800,
            color: "#C2A56D",
            letterSpacing: 1
          }}
        >
          Coffee Stay
        </Typography>
      </Box>

      <List sx={{ px: 2 }}>
        {navItems.map((item) => {
          const isActive = pathname === item.to;
          
          return (
            <ListItem key={item.to} disablePadding sx={{ mb: 1 }}>
              <ListItemButton
                component={Link}
                to={item.to}
                sx={{
                  borderRadius: "12px",
                  py: 1.5,
                  bgcolor: isActive ? "rgba(194, 165, 109, 0.12)" : "transparent",
                  transition: "all 0.3s ease",
                  "&:hover": {
                    bgcolor: "rgba(255, 255, 255, 0.05)",
                    "& .MuiListItemIcon-root": { color: "#C2A56D" }
                  }
                }}
              >
                <ListItemIcon 
                  sx={{ 
                    minWidth: 40,
                    color: isActive ? "#C2A56D" : "rgba(241, 240, 238, 0.4)",
                    transition: "0.3s"
                  }}
                >
                  {React.cloneElement(item.icon, { fontSize: 'small' })}
                </ListItemIcon>
                
                <ListItemText 
                  primary={item.label} 
                  primaryTypographyProps={{
                    fontSize: 14,
                    fontWeight: isActive ? 700 : 500,
                    color: isActive ? "#F1F0EE" : "rgba(241, 240, 238, 0.6)",
                    letterSpacing: 0.3
                  }}
                />
                
                {isActive && (
                  <Box 
                    sx={{ 
                      width: 4, 
                      height: 20, 
                      bgcolor: "#C2A56D", 
                      borderRadius: 2,
                      ml: 1 
                    }} 
                  />
                )}
              </ListItemButton>
            </ListItem>
          );
        })}
      </List>
    </Box>
  );
};

export default Sidebar;