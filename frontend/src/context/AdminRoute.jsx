import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Box, CircularProgress } from "@mui/material";

const AdminRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Nếu không có user, đá về trang login
  if (!user) return <Navigate to="/login" replace />;

  // Kiểm tra role: thêm toLowerCase() và dấu "?" để tránh lỗi crash nếu user.role undefined
  if (user.role?.toLowerCase() !== "admin") {
    console.warn("Truy cập bị từ chối: Không phải Admin");
    return <Navigate to="/home" replace />;
  }

  return children;
};

export default AdminRoute;