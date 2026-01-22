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
  Paper,
} from "@mui/material";
import { Visibility, VisibilityOff, EmailOutlined, LockOutlined } from "@mui/icons-material";

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
        setError("Email hoặc mật khẩu không chính xác");
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
        bgcolor: "#F9F8F6", // Nền kem nhạt đồng bộ
        backgroundImage: "radial-gradient(circle at 2px 2px, rgba(194, 165, 109, 0.05) 1px, transparent 0)",
        backgroundSize: "40px 40px",
        p: 2,
      }}
    >
      <Paper
        component="form"
        onSubmit={handleSubmit}
        elevation={0}
        sx={{
          p: { xs: 4, md: 5 },
          borderRadius: "32px",
          border: "1px solid rgba(194, 165, 109, 0.2)",
          boxShadow: "0 20px 60px rgba(28,27,25,0.06)",
          maxWidth: 420,
          width: "100%",
          bgcolor: "#FFF",
        }}
      >
        {/* HEADER */}
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontSize: "2.2rem",
              fontWeight: 800,
              color: "#1C1B19",
              mb: 1,
            }}
          >
            Chào mừng
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#72716E", letterSpacing: 0.5 }}>
            Truy cập tài khoản <strong style={{color: "#C2A56D"}}>Coffee Stay</strong> của bạn
          </Typography>
        </Box>

        {/* ERROR MESSAGE */}
        {error && (
          <Alert 
            severity="error" 
            sx={{ 
              mb: 3, 
              borderRadius: "12px",
              "& .MuiAlert-message": { fontWeight: 500 }
            }}
          >
            {error}
          </Alert>
        )}

        {/* FORM FIELDS */}
        <Stack spacing={2.5}>
          <TextField
            label="Địa chỉ Email"
            type="email"
            required
            fullWidth
            variant="outlined"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "&.Mui-focused fieldset": { borderColor: "#C2A56D" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#C2A56D" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: "#A8A7A1", fontSize: 20 }} />
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
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "&.Mui-focused fieldset": { borderColor: "#C2A56D" },
              },
              "& .MuiInputLabel-root.Mui-focused": { color: "#C2A56D" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "#A8A7A1", fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton
                    onClick={() => setShowPassword(!showPassword)}
                    edge="end"
                    size="small"
                  >
                    {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ textAlign: "right" }}>
            <Typography
              component={Link}
              to="/forgot-password"
              sx={{
                fontSize: 13,
                color: "#C2A56D",
                textDecoration: "none",
                fontWeight: 600,
                "&:hover": { textDecoration: "underline" },
              }}
            >
              Quên mật khẩu?
            </Typography>
          </Box>

          <Button
            type="submit"
            fullWidth
            disabled={loading}
            variant="contained"
            sx={{
              py: 1.8,
              borderRadius: "12px",
              fontWeight: 700,
              fontSize: "1rem",
              textTransform: "none",
              bgcolor: "#1C1B19", // Ebony
              color: "#C2A56D",   // Gold
              boxShadow: "0 10px 20px rgba(28,27,25,0.15)",
              "&:hover": {
                bgcolor: "#333230",
                transform: "translateY(-1px)",
                boxShadow: "0 12px 25px rgba(28,27,25,0.2)",
              },
              transition: "all 0.3s ease",
            }}
          >
            {loading ? (
              <CircularProgress size={24} sx={{ color: "#C2A56D" }} />
            ) : (
              "Đăng nhập"
            )}
          </Button>
        </Stack>

        {/* FOOTER */}
        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography fontSize={14} color="#72716E">
            Chưa có tài khoản trải nghiệm?{" "}
            <Link
              to="/register"
              style={{
                color: "#1C1B19",
                textDecoration: "none",
                fontWeight: 700,
                borderBottom: "1px solid #C2A56D"
              }}
            >
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}