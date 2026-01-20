import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  CircularProgress,
  Stack,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import { Visibility, VisibilityOff, Email, Lock } from "@mui/icons-material";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo || "/home";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
  e.preventDefault();
  setError("");
  setLoading(true);

  try {
    await login(form);
    navigate(redirectTo, { replace: true });
  } catch (err) {
    if (err.message === "EMAIL_NOT_VERIFIED") {
      setError("Vui lòng xác thực email trước khi đăng nhập");
    } else {
      setError("Email hoặc mật khẩu không đúng");
    }
  } finally {
    setLoading(false);
  }
};


  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        bgcolor: "background.default",
        p: 2,
      }}
    >
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          bgcolor: "background.paper",
          p: 4,
          borderRadius: 4,
          boxShadow: "0 18px 48px rgba(0,0,0,0.08)",
          maxWidth: 420,
          width: "100%",
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.8rem",
              fontWeight: 500,
              color: "text.primary",
              mb: 0.5,
            }}
          >
            Đăng nhập
          </Typography>
          <Typography fontSize={14.5} color="text.secondary">
            Truy cập tài khoản BookingHotel của bạn
          </Typography>
        </Box>

        {/* ERROR */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* FORM */}
        <Stack spacing={2.6}>
          <TextField
            label="Email"
            type="email"
            required
            fullWidth
            value={form.email}
            onChange={(e) =>
              setForm({ ...form, email: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Email sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />

          <TextField
            label="Mật khẩu"
            type={showPassword ? "text" : "password"}
            required
            fullWidth
            value={form.password}
            onChange={(e) =>
              setForm({ ...form, password: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Lock sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    size="small"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            sx={{
              py: 1.4,
              borderRadius: 999,
              fontWeight: 600,
              bgcolor: "primary.main",
              color: "#1C1C1C",
              "&:hover": {
                bgcolor: "#9A7B56",
              },
            }}
          >
            {loading ? (
              <CircularProgress size={22} color="inherit" />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </Stack>

        {/* FOOTER */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography fontSize={14} color="text.secondary">
            Chưa có tài khoản?{" "}
            <Link
              to="/register"
              style={{
                color: "#8B6F4E",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Đăng ký
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
