import { useState, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

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

  const primaryBlue = "#0056b3";

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
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;

    setLoading(true);
    try {
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
      bgcolor: "#f0f4f8", p: 2,
    }}>
      <Fade in timeout={800}>
        <Paper component="form" onSubmit={handleSubmit} noValidate
          sx={{
            p: { xs: 4, md: 5 }, borderRadius: "32px", maxWidth: 440, width: "100%",
            border: "1px solid #e1e8ed",
            boxShadow: "0 10px 30px rgba(0,86,179,0.1)",
          }}
        >
          <Box sx={{ mb: 4, textAlign: "center" }}>
            <Typography sx={{ fontSize: "2rem", fontWeight: 800, color: primaryBlue, mb: 1 }}>
              Tạo tài khoản
            </Typography>
            <Typography variant="body2" color="#333">
              Gia nhập <strong style={{color: primaryBlue}}>Coffee Stay</strong> để nhận ưu đãi riêng
            </Typography>
          </Box>

          {serverError && <Alert severity="error" sx={{ mb: 3, borderRadius: "12px" }}>{serverError}</Alert>}

          <Stack spacing={2.5}>
            <TextField
              name="username" label="Họ và tên" fullWidth required
              value={form.username} onChange={handleChange}
              error={!!errors.username} helperText={errors.username}
              InputProps={{
                startAdornment: <InputAdornment position="start"><PersonOutlineOutlined sx={{ color: "#333" }} /></InputAdornment>,
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", "&.Mui-focused fieldset": { borderColor: primaryBlue } } }}
            />

            <TextField
              name="email" label="Địa chỉ Email" type="email" fullWidth required
              value={form.email} onChange={handleChange}
              error={!!errors.email} helperText={errors.email}
              InputProps={{
                startAdornment: <InputAdornment position="start"><EmailOutlined sx={{ color: "#333" }} /></InputAdornment>,
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", "&.Mui-focused fieldset": { borderColor: primaryBlue } } }}
            />

            <TextField
              name="password" label="Mật khẩu" fullWidth required
              type={showPassword ? "text" : "password"}
              value={form.password} onChange={handleChange}
              error={!!errors.password} helperText={errors.password}
              InputProps={{
                startAdornment: <InputAdornment position="start"><LockOutlined sx={{ color: "#333" }} /></InputAdornment>,
                endAdornment: (
                  <InputAdornment position="end">
                    <Button onClick={() => setShowPassword(!showPassword)} sx={{ minWidth: 40, color: "#333" }}>
                      {showPassword ? <VisibilityOffOutlined /> : <VisibilityOutlined />}
                    </Button>
                  </InputAdornment>
                ),
              }}
              sx={{ "& .MuiOutlinedInput-root": { borderRadius: "12px", "&.Mui-focused fieldset": { borderColor: primaryBlue } } }}
            />

            <Button type="submit" fullWidth disabled={loading} variant="contained"
              sx={{
                py: 1.8, borderRadius: "12px", fontWeight: 700, bgcolor: primaryBlue,
                "&:hover": { bgcolor: "#004494" }, textTransform: "none", fontSize: "1rem"
              }}
            >
              {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Tạo tài khoản"}
            </Button>
          </Stack>

          <Box sx={{ textAlign: "center", mt: 4 }}>
            <Typography variant="body2" color="#333">
              Đã là thành viên?{" "}
              <Link to="/login" style={{ color: primaryBlue, textDecoration: "none", fontWeight: 700 }}>
                Đăng nhập
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Fade>
    </Box>
  );
}