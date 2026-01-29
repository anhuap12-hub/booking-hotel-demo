import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import imageCompression from 'browser-image-compression'; // Thêm nén ảnh
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
    const files = Array.from(e.target.files);
    if (files.length > 10) {
      alert("Tối đa chỉ được chọn 10 ảnh");
      return;
    }
    setImages(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const formData = new FormData();
      
      // 1. Nén ảnh trước khi append vào FormData
      const options = { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true };
      const compressedImages = await Promise.all(
        images.map(async (img) => {
          try {
            return await imageCompression(img, options);
          } catch (err) {
            return img;
          }
        })
      );

      // 2. Append dữ liệu
      formData.append("name", form.name);
      formData.append("city", form.city);
      formData.append("address", form.address);
      formData.append("desc", form.desc);
      
      if (form.lat && form.lng) {
        // Gửi dạng string đơn giản nếu backend dùng req.body.lat
        formData.append("lat", form.lat);
        formData.append("lng", form.lng);
      }

      compressedImages.forEach((img) => {
        formData.append("images", img); // Đảm bảo key này khớp với upload.array("images") ở Backend
      });

      // 3. Gọi API (Sửa /hotels thành /admin/hotels cho khớp file API của bạn)
      await axios.post("/admin/hotels", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      alert("Tạo khách sạn thành công!");
      navigate("/admin/hotels");
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Lỗi khi tạo khách sạn. Kiểm tra lại Endpoint.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: "auto", mt: 6, p: 4, bgcolor: "#F5F3EF", borderRadius: 4, border: "1px solid #E0DAD3" }}>
      <Typography fontSize={24} fontWeight={700} mb={3} sx={{ color: "#3E2C1C", textAlign: 'center' }}>
        Thêm Khách Sạn Mới
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <TextField label="Tên khách sạn" name="name" value={form.name} onChange={handleInputChange} required fullWidth />
        <TextField label="Thành phố" name="city" value={form.city} onChange={handleInputChange} required fullWidth />
        <TextField label="Địa chỉ chi tiết" name="address" value={form.address} onChange={handleInputChange} required fullWidth />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Vĩ độ" name="lat" type="number" value={form.lat} onChange={handleInputChange} fullWidth />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Kinh độ" name="lng" type="number" value={form.lng} onChange={handleInputChange} fullWidth />
          </Grid>
        </Grid>

        <TextField label="Mô tả" name="desc" value={form.desc} onChange={handleInputChange} required fullWidth multiline rows={4} />

        <Box sx={{ p: 2, border: "1px dashed #B8A99A", borderRadius: 2, textAlign: 'center' }}>
          <Button variant="outlined" component="label">
            Chọn hình ảnh (Tối đa 5)
            <input type="file" hidden multiple onChange={handleFileChange} accept="image/*" />
          </Button>
          {images.length > 0 && (
            <Typography fontSize={13} mt={1} color="success.main">Đã chọn {images.length} ảnh</Typography>
          )}
        </Box>

        <Button type="submit" variant="contained" disabled={loading} sx={{ py: 1.5, bgcolor: "#3E2C1C" }}>
          {loading ? <CircularProgress size={24} /> : "Tạo khách sạn"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AdminAddHotel;