import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar, { NAVBAR_HEIGHT } from "./Navbar";
import Footer from "../Common/Footer";
import AppBreadcrumbs from "../Navigation/AppBreadcrumbs";

export default function Layout() {
  const location = useLocation();
  const isHome = location.pathname === "/";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",

        // 🌥 trắng mây – dịu mắt
        bgcolor: "background.default",
      }}
    >
      <Navbar />

      {/* Spacer đẩy content xuống dưới Navbar */}
      <Box sx={{ height: `${NAVBAR_HEIGHT}px` }} />

      {/* Breadcrumb (không hiện ở Home) */}
      {!isHome && <AppBreadcrumbs />}

      {/* MAIN */}
      <Box component="main" sx={{ flex: 1, width: "100%" }}>
        {isHome ? (
          /* HOME: full width */
          <Outlet />
        ) : (
          /* OTHER PAGES: gọn gàng */
          <Box
            sx={{
              width: "100%",
              maxWidth: 1400,
              mx: "auto",
              px: { xs: 1.5, md: 2 },
              pb: 4,
            }}
          >
            <Outlet />
          </Box>
        )}
      </Box>

      <Footer />
    </Box>
  );
}
