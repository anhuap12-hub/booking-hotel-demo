import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Import trực tiếp từng component
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Button from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import Stack from "@mui/material/Stack";
import InputAdornment from "@mui/material/InputAdornment";
import Alert from "@mui/material/Alert";
import Paper from "@mui/material/Paper";

import { Visibility, VisibilityOff, EmailOutlined, LockOutlined } from "@mui/icons-material";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectTo = location.state?.redirectTo || "/hotels";

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
        bgcolor: "#F9F8F6",
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

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>
            {error}
          </Alert>
        )}

        <Stack spacing={2.5}>
          <TextField
            label="Địa chỉ Email"
            type="email"
            required
            fullWidth
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "12px",
                "&.Mui-focused fieldset": { borderColor: "#C2A56D" },
              },
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
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "#A8A7A1", fontSize: 20 }} />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  
                  <Button
                    onClick={() => setShowPassword(!showPassword)}
                    sx={{
                      minWidth: 40,
                      width: 40,
                      height: 40,
                      borderRadius: "50%",
                      color: "#72716E",
                      p: 0,
                      "&:hover": { bgcolor: "rgba(0,0,0,0.04)" }
                    }}
                  >
                    {showPassword ? <VisibilityOff sx={{ fontSize: 20 }} /> : <Visibility sx={{ fontSize: 20 }} />}
                  </Button>
                </InputAdornment>
              ),
            }}
          />
          <Button
            type="submit"
            fullWidth
            disabled={loading}
            variant="contained"
            sx={{
              py: 1.8,
              borderRadius: "12px",
              fontWeight: 700,
              bgcolor: "#1C1B19",
              color: "#C2A56D",
              textTransform: "none",
              "&:hover": { bgcolor: "#333230" },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#C2A56D" }} /> : "Đăng nhập"}
          </Button>
        </Stack>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography fontSize={14} color="#72716E">
            Chưa có tài khoản trải nghiệm?{" "}
            <Link to="/register" style={{ color: "#1C1B19", fontWeight: 700, textDecoration: "none" }}>
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}