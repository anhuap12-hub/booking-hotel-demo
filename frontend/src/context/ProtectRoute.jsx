import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./AuthContext";
import { Box, CircularProgress } from "@mui/material";

const ProtectRoute = ({ role }) => {
  const { user, loading } = useAuth();

  // ⏳ Waiting auth check
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "60vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // 🔒 Not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // 🛑 Role check (admin, etc.)
  if (role && user.role !== role) {
    return <Navigate to="/home" replace />;
  }

  return <Outlet />;
};

export default ProtectRoute;
