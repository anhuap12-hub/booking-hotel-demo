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
  Paper,
  Fade
} from "@mui/material";
import {
  VisibilityOutlined,
  VisibilityOffOutlined,
  EmailOutlined,
  LockOutlined,
  PersonOutlineOutlined,
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
          "Đăng ký thất bại. Vui lòng thử lại sau."
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
        bgcolor: "#F9F8F6", // Nền kem đồng bộ với Login
        backgroundImage: "radial-gradient(circle at 2px 2px, rgba(194, 165, 109, 0.05) 1px, transparent 0)",
        backgroundSize: "40px 40px",
        p: 2,
      }}
    >
      <Fade in={true} timeout={800}>
        <Paper
          component="form"
          onSubmit={handleSubmit}
          elevation={0}
          sx={{
            p: { xs: 4, md: 5 },
            borderRadius: "32px",
            border: "1px solid rgba(194, 165, 109, 0.2)",
            boxShadow: "0 20px 60px rgba(28,27,25,0.06)",
            maxWidth: 440,
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
              Gia nhập
            </Typography>
            <Typography sx={{ fontSize: 14, color: "#72716E", letterSpacing: 0.5 }}>
              Tạo tài khoản <strong style={{color: "#C2A56D"}}>Coffee Stay</strong> để nhận ưu đãi riêng
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
              label="Họ và tên"
              required
              fullWidth
              variant="outlined"
              value={form.username}
              onChange={(e) => setForm({ ...form, username: e.target.value })}
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
                    <PersonOutlineOutlined sx={{ color: "#A8A7A1", fontSize: 20 }} />
                  </InputAdornment>
                ),
              }}
            />

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
                      {showPassword ? <VisibilityOffOutlined sx={{ fontSize: 20 }} /> : <VisibilityOutlined sx={{ fontSize: 20 }} />}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />

            <Box sx={{ py: 1 }}>
               <Typography variant="caption" color="#A8A7A1" align="center" display="block">
                Bằng cách đăng ký, bạn đồng ý với Điều khoản & Chính sách của chúng tôi.
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
                "Tạo tài khoản"
              )}
            </Button>
          </Stack>

          {/* FOOTER */}
          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography fontSize={14} color="#72716E">
              Đã là thành viên?{" "}
              <Link
                to="/login"
                style={{
                  color: "#1C1B19",
                  textDecoration: "none",
                  fontWeight: 700,
                  borderBottom: "1px solid #C2A56D"
                }}
              >
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}