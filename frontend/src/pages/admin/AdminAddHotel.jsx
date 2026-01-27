import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { 
  TextField, Button, Typography, Stack, Box, 
  CircularProgress, Alert, Grid 
} from "@mui/material";

const AdminAddHotel = () => {
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    desc: "",
    lat: "",
    lng: "",
  });
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  
  const navigate = useNavigate();

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const formData = new FormData();
    formData.append("name", form.name);
    formData.append("city", form.city);
    formData.append("address", form.address);
    formData.append("desc", form.desc);
    
    if (form.lat && form.lng) {
      formData.append("location[lat]", form.lat);
      formData.append("location[lng]", form.lng);
    }

    images.forEach((img) => {
      formData.append("images", img);
    });

    try {
      await axios.post("/hotels", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      navigate("/admin/hotels");
    } catch (err) {
      setError(err.response?.data?.message || "Lỗi khi tạo khách sạn.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
        maxWidth: 600, mx: "auto", mt: 6, p: 4,
        bgcolor: "#F5F3EF", borderRadius: 4,
        border: "1px solid #E0DAD3",
        boxShadow: "0 10px 30px rgba(0,0,0,0.05)"
      }}
    >
      <Typography fontSize={24} fontWeight={700} mb={3} sx={{ color: "#3E2C1C", textAlign: 'center' }}>
        Thêm Khách Sạn Mới
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }}>{error}</Alert>}

      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <TextField
          label="Tên khách sạn"
          name="name"
          value={form.name}
          onChange={handleInputChange}
          required fullWidth
        />

        <TextField
          label="Thành phố"
          name="city"
          value={form.city}
          onChange={handleInputChange}
          required fullWidth
        />

        <TextField
          label="Địa chỉ chi tiết"
          name="address"
          value={form.address}
          onChange={handleInputChange}
          required fullWidth
        />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField
              label="Vĩ độ (Latitude)"
              name="lat"
              type="number"
              value={form.lat}
              onChange={handleInputChange}
              fullWidth
              helperText="VD: 21.0285"
            />
          </Grid>
          <Grid item xs={6}>
            <TextField
              label="Kinh độ (Longitude)"
              name="lng"
              type="number"
              value={form.lng}
              onChange={handleInputChange}
              fullWidth
              helperText="VD: 105.8542"
            />
          </Grid>
        </Grid>

        <TextField
          label="Mô tả khách sạn"
          name="desc"
          value={form.desc}
          onChange={handleInputChange}
          required fullWidth multiline rows={4}
        />

        <Box sx={{ p: 2, border: "1px dashed #B8A99A", borderRadius: 2, textAlign: 'center' }}>
          <Button
            variant="outlined"
            component="label"
            sx={{
              textTransform: "none", color: "#6F4E37", borderColor: "#B8A99A",
              "&:hover": { borderColor: "#3E2C1C", bgcolor: "rgba(111,78,55,0.05)" },
            }}
          >
            Chọn hình ảnh (Max 10)
            <input type="file" hidden multiple onChange={handleFileChange} accept="image/*" />
          </Button>

          {images.length > 0 && (
            <Typography fontSize={13} mt={1} sx={{ color: "#2E7D32", fontWeight: 500 }}>
               đã chọn {images.length} ảnh
            </Typography>
          )}
        </Box>

        <Button
          type="submit"
          variant="contained"
          disabled={loading}
          sx={{
            py: 1.5, bgcolor: "#3E2C1C", color: "#fff", fontWeight: 700,
            fontSize: "1rem", textTransform: "none", borderRadius: 2,
            "&:hover": { bgcolor: "#2F2116" },
          }}
        >
          {loading ? <CircularProgress size={24} sx={{ color: "#fff" }} /> : "Tạo khách sạn"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AdminAddHotel;