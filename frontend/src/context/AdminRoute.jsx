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

  if (!user) return <Navigate to="/login" replace />;

  if (user.role !== "admin") return <Navigate to="/home" replace />;

  return children;
};

export default AdminRoute;
