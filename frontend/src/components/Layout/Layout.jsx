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
        // Chuyển sang màu nền trung tính hơn hoặc để các Section tự quyết định màu
        bgcolor: isHome ? "#fff" : "background.default", 
      }}
    >
      <Navbar />

      {/* CHỈNH SỬA: Spacer 
         Ở trang Home, nếu bạn muốn Hero Image nằm dưới Navbar (Transparent), 
         hãy bỏ Spacer này hoặc set nó về 0.
      */}
      {!isHome && <Box sx={{ height: `${NAVBAR_HEIGHT}px` }} />}

      {/* Breadcrumb (không hiện ở Home) */}
      {!isHome && <AppBreadcrumbs />}

      {/* MAIN CONTENT */}
      <Box 
        component="main" 
        sx={{ 
          flex: 1, 
          width: "100%",
          // Loại bỏ mọi padding mặc định có thể gây ra dải trắng quanh thanh Search
          p: 0, 
        }}
      >
        {isHome ? (
          /* HOME: Không bọc trong Container nào cả 
             Các Section (Deals, Trending, Search) sẽ tự quản lý Container của riêng chúng
          */
          <Box sx={{ width: "100%" }}>
            <Outlet />
          </Box>
        ) : (
          /* OTHER PAGES: Giữ nguyên bố cục trang trọng */
          <Box
            sx={{
              width: "100%",
              maxWidth: 1400,
              mx: "auto",
              px: { xs: 2, md: 4 },
              py: 4,
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