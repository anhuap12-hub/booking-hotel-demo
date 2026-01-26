import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

// Import MUI (Sử dụng Destructuring để code gọn hơn)
import {
  Box, Typography, TextField, Button, Stack, 
  CircularProgress, InputAdornment, Alert, Paper, Fade
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

  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");
  const [errors, setErrors] = useState({});

  // Logic validate giữ nguyên nhưng bọc trong useCallback để tối ưu
  const validate = useCallback(() => {
    let temp = {};
    const gmailRegex = /^[a-zA-Z0-9._%+-]+@gmail\.com$/;

    if (!form.username.trim()) temp.username = "Họ và tên không được để trống";
    
    if (!form.email) {
      temp.email = "Vui lòng nhập email";
    } else if (!gmailRegex.test(form.email)) {
      temp.email = "Chỉ chấp nhận định dạng @gmail.com";
    }

    if (!form.password) {
      temp.password = "Vui lòng nhập mật khẩu";
    } else if (form.password.length < 6) {
      temp.password = "Mật khẩu phải có tối thiểu 6 ký tự";
    }

    setErrors(temp);
    return Object.keys(temp).length === 0;
  }, [form]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
    // Xóa lỗi của trường đang gõ
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
      // Trim dữ liệu trước khi gửi đi để tránh lỗi khoảng trắng
      const submitData = {
        ...form,
        username: form.username.trim(),
        email: form.email.trim().toLowerCase()
      };
      await register(submitData);
      navigate("/check-email", { replace: true });
    } catch (err) {
      setServerError(err.response?.data?.message || "Đăng ký thất bại. Thử lại sau!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{
      minHeight: "100vh", display: "flex", justifyContent: "center", alignItems: "center",
      bgcolor: "#F9F8F6", p: 2,
      backgroundImage: "radial-gradient(circle at 2px 2px, rgba(194, 165, 109, 0.05) 1px, transparent 0)",
      backgroundSize: "40px 40px",
    }}>
      <Fade in timeout={800}>
        <Paper component="form" onSubmit={handleSubmit} noValidate
          sx={{
            p: { xs: 4, md: 5 }, borderRadius: "32px", maxWidth: 440, width: "100%",
            border: "1px solid rgba(194, 165, 109, 0.2)",
            boxShadow: "0 20px 60px rgba(28,27,25,0.06)",
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography sx={{ fontFamily: "'Playfair Display', serif", fontSize: "2.2rem", fontWeight: 800, color: "#1C1B19", mb: 1 }}>
              Gia nhập
            </Typography>
            <Typography variant="body2" color="#72716E">
              Tạo tài khoản <strong style={{color: "#C2A56D"}}>Coffee Stay</strong> để nhận ưu đãi riêng
            </Typography>
          </Box>

          {serverError && <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>{serverError}</Alert>}

          <Stack spacing={2.5}>
            <TextField
              name="username" label="Họ và tên" fullWidth required
              value={form.username} onChange={handleChange}
              error={!!errors.username} helperText={errors.username}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonOutlineOutlined sx={{ color: "#A8A7A1" }} /></InputAdornment>,
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              name="email" label="Địa chỉ Email" type="email" fullWidth required
              value={form.email} onChange={handleChange}
              error={!!errors.email} helperText={errors.email}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ color: "#A8A7A1" }} /></InputAdornment>,
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <TextField
              name="password" label="Mật khẩu" fullWidth required
              type={showPassword ? "text" : "password"}
              value={form.password} onChange={handleChange}
              error={!!errors.password} helperText={errors.password}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: "#A8A7A1" }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => setShowPassword(!showPassword)} sx={{ minWidth: 40, color: "#72716E" }}>
                      {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px" } }}
            />

            <Button type="submit" fullWidth disabled={loading} variant="contained"
              sx={{
                py: 1.8, borderRadius: "12px", fontWeight: 700, bgcolor: "#1C1B19", color: "#C2A56D",
                "&:hover": { bgcolor: "#333230" }, textTransform: "none", fontSize: "1rem"
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#C2A56D" }} /> : "Tạo tài khoản"}
            </Button>
          </Stack>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2" color="#72716E">
              Đã là thành viên?{" "}
              <Link to="/login" style={{ color: "#1C1B19", textDecoration: "none", fontWeight: 700, borderBottom: "1px solid #C2A56D" }}>
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}