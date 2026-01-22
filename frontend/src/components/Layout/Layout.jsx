import { Outlet, useLocation } from "react-router-dom";
import { Box } from "@mui/material";
import Navbar, { NAVBAR_HEIGHT } from "./Navbar";
import Footer from "../Common/Footer";
import AppBreadcrumbs from "../Navigation/AppBreadcrumbs";

export default function Layout() {
  const location = useLocation();
  
  // Kiểm tra nếu là trang Landing (/) hoặc trang Home (/home)
  const isFullWidthPage = location.pathname === "/" || location.pathname === "/home";

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
        bgcolor: "background.default",
      }}
    >
      <Navbar />

      {/* Spacer: Lấp đầy khoảng trống dưới Navbar fixed */}
      {/* Nếu Banner của bạn màu tối, hãy đổi bgcolor ở đây thành #1C1B19 để liền mạch */}
      <Box sx={{ 
        height: `${NAVBAR_HEIGHT}px`, 
        bgcolor: isFullWidthPage ? "#1C1B19" : "transparent" 
      }} />

      {/* Breadcrumb: Chỉ hiện ở các trang con, không hiện ở Landing/Home */}
      {!isFullWidthPage && <AppBreadcrumbs />}

      {/* MAIN CONTENT AREA */}
      <Box component="main" sx={{ flex: 1, width: "100%" }}>
        {isFullWidthPage ? (
          /* TRANG TRÀN VIỀN: Không bị giới hạn bởi Container hay Padding */
          <Outlet />
        ) : (
          /* CÁC TRANG KHÁC: Có giới hạn chiều rộng để dễ đọc nội dung */
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