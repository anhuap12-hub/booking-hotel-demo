import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Stack,
  InputLabel,
  FormControl,
  Box,
  Typography,
  CircularProgress,
  Alert
} from "@mui/material";

export default function AdminAddRoom() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "single",
    price: "",
    maxPeople: 1,
    status: "active",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.name || !form.price) {
      setError("Vui lòng điền tên phòng và giá.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(`/rooms/by-hotel/${hotelId}`, {
        ...form,
        price: Number(form.price),
        maxPeople: Number(form.maxPeople),
      });
      
      navigate(`/admin/hotels/${hotelId}/rooms`);
    } catch (err) {
      setError(err.response?.data?.message || "Không thể thêm phòng.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 440, mx: "auto", mt: 6, p: 4,
        bgcolor: "#F5F3EF", borderRadius: "16px",
        border: "1px solid #E5E2DC",
        boxShadow: "0 4px 20px rgba(0,0,0,0.05)"
      }}
    >
      <Typography
        fontSize={22} fontWeight={700} mb={3}
        sx={{ color: "#3E2C1C", textAlign: "center" }}
      >
        Thêm Phòng Mới
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: "8px" }}>{error}</Alert>}

      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <TextField
          label="Tên phòng (Số phòng)"
          name="name"
          value={form.name}
          onChange={handleChange}
          required fullWidth
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
        />

        <FormControl fullWidth>
          <InputLabel>Loại phòng</InputLabel>
          <Select
            name="type"
            label="Loại phòng"
            value={form.type}
            onChange={handleChange}
            sx={{ borderRadius: "10px" }}
          >
            <MenuItem value="single">Single (Phòng đơn)</MenuItem>
            <MenuItem value="double">Double (Phòng đôi)</MenuItem>
            <MenuItem value="suite">Suite (Cao cấp)</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="number"
          label="Giá phòng / đêm"
          name="price"
          value={form.price}
          onChange={handleChange}
          required fullWidth
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
        />

        <TextField
          type="number"
          label="Số người tối đa"
          name="maxPeople"
          value={form.maxPeople}
          onChange={handleChange}
          required fullWidth
          sx={{ "& .MuiOutlinedInput-root": { borderRadius: "10px" } }}
        />

        <FormControl fullWidth>
          <InputLabel>Trạng thái ban đầu</InputLabel>
          <Select
            name="status"
            label="Trạng thái ban đầu"
            value={form.status}
            onChange={handleChange}
            sx={{ borderRadius: "10px" }}
          >
            <MenuItem value="active">Sẵn sàng đón khách</MenuItem>
            <MenuItem value="maintenance">Đang bảo trì / Sửa chữa</MenuItem>
            <MenuItem value="inactive">Tạm ngưng sử dụng</MenuItem>
          </Select>
        </FormControl>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5, bgcolor: "#3E2C1C", color: "#fff", fontWeight: 700,
            textTransform: "none", borderRadius: "10px", fontSize: "1rem",
            "&:hover": { bgcolor: "#2F2116" },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Tạo phòng và Cập nhật giá"}
        </Button>
      </Stack>
    </Box>
  );
}