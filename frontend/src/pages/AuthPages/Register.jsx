import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  Box,
  Typography,
  TextField,
  Button,
  Stack,
  CircularProgress,
  InputAdornment,
  IconButton,
  Alert,
} from "@mui/material";
import {
  Visibility,
  VisibilityOff,
  Email,
  Lock,
  Person,
} from "@mui/icons-material";

export default function Register() {
  const { register } = useAuth();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await register(form);
      navigate("/check-email", { replace: true });
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Đăng ký thất bại. Vui lòng thử lại."
      );
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
              mb: 0.5,
            }}
          >
            Tạo tài khoản
          </Typography>
          <Typography fontSize={14.5} color="text.secondary">
            Tham gia BookingHotel và bắt đầu hành trình của bạn
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
            label="Tên người dùng"
            required
            fullWidth
            value={form.username}
            onChange={(e) =>
              setForm({ ...form, username: e.target.value })
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Person sx={{ color: "text.secondary" }} />
                </InputAdornment>
              ),
            }}
          />

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
                    size="small"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <VisibilityOff />
                    ) : (
                      <Visibility />
                    )}
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
              "Tạo tài khoản"
            )}
          </Button>
        </Stack>

        {/* FOOTER */}
        <Box sx={{ textAlign: "center", mt: 3 }}>
          <Typography fontSize={14} color="text.secondary">
            Đã có tài khoản?{" "}
            <Link
              to="/login"
              style={{
                color: "#8B6F4E",
                textDecoration: "none",
                fontWeight: 500,
              }}
            >
              Đăng nhập
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
}
