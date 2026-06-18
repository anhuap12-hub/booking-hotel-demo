import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

  const redirectTo = location.state?.redirectTo || "/";

  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const primaryBlue = "#0056b3"; // Màu xanh chính

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
        bgcolor: "#f0f4f8",
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
          border: "1px solid #e1e8ed",
          boxShadow: "0 10px 30px rgba(0,86,179,0.1)",
          maxWidth: 420,
          width: "100%",
          bgcolor: "#FFF",
        }}
      >
        <Box sx={{ mb: 4, textAlign: "center" }}>
          <Typography
            sx={{
              fontSize: "2rem",
              fontWeight: 800,
              color: primaryBlue,
              mb: 1,
            }}
          >
            Đăng nhập
          </Typography>
          <Typography sx={{ fontSize: 14, color: "#666" }}>
            Chào mừng trở lại với <strong style={{color: primaryBlue}}>Coffee Stay</strong>
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
                "&.Mui-focused fieldset": { borderColor: primaryBlue },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <EmailOutlined sx={{ color: "#999", fontSize: 20 }} />
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
                "&.Mui-focused fieldset": { borderColor: primaryBlue },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <LockOutlined sx={{ color: "#999", fontSize: 20 }} />
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
                      color: "#666",
                      "&:hover": { bgcolor: "#f0f4f8" }
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
              bgcolor: primaryBlue,
              textTransform: "none",
              fontSize: "1rem",
              "&:hover": { bgcolor: "#004494" },
            }}
          >
            {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Đăng nhập"}
          </Button>
        </Stack>

        <Box sx={{ textAlign: "center", mt: 4 }}>
          <Typography fontSize={14} color="#666">
            Chưa có tài khoản?{" "}
            <Link to="/register" style={{ color: primaryBlue, fontWeight: 700, textDecoration: "none" }}>
              Đăng ký ngay
            </Link>
          </Typography>
        </Box>
      </Paper>
    </Box>
  );
}