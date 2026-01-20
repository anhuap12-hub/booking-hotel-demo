// src/components/Layout/Sidebar.jsx
import React from 'react';
import { List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { LocalHotel, DirectionsCar, Attractions, LocalTaxi, AdminPanelSettings, BookOnline } from '@mui/icons-material';
import { Link } from 'react-router-dom';

const Sidebar = () => {
  const navItems = [
    { to: '/', icon: <LocalHotel />, label: 'Stays' },
    { to: '/car-rentals', icon: <DirectionsCar />, label: 'Car rentals' },
    { to: '/attractions', icon: <Attractions />, label: 'Attractions' },
    { to: '/taxi', icon: <LocalTaxi />, label: 'Airport taxi' },
    { to: '/adminpanel', icon: <AdminPanelSettings />, label: 'AdminPanel' },
    { to: '/mybooking', icon: <BookOnline />, label: 'MyBooking' },
  ];

  return (
    <List>
      {navItems.map((item) => (
        <ListItem button component={Link} to={item.to} key={item.to}>
          <ListItemIcon>{item.icon}</ListItemIcon>
          <ListItemText primary={item.label} />
        </ListItem>
      ))}
    </List>
  );
};

export default Sidebar;
