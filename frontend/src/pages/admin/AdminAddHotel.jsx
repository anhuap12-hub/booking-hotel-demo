import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { uploadBatch } from "../../api/upload.api"; 
import imageCompression from 'browser-image-compression';
import { 
  TextField, Button, Typography, Stack, Box, 
  CircularProgress, Alert, Grid, MenuItem, IconButton, Card
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

const AdminAddHotel = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [images, setImages] = useState([]);
  const [previews, setPreviews] = useState([]);
  
  const [form, setForm] = useState({
    name: "", city: "", address: "", desc: "", 
    lat: "", lng: "", type: "hotel"
  });

  // Tự động giải phóng bộ nhớ RAM cho các URL preview
  useEffect(() => {
    return () => previews.forEach(url => URL.revokeObjectURL(url));
  }, [previews]);

  const handleInputChange = (e) => {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleFileChange = useCallback((e) => {
    const files = Array.from(e.target.files);
    if (images.length + files.length > 10) {
      return alert("Hệ thống chỉ hỗ trợ tối đa 10 ảnh mỗi khách sạn.");
    }

    const newPreviews = files.map(file => URL.createObjectURL(file));
    setImages(prev => [...prev, ...files]);
    setPreviews(prev => [...prev, ...newPreviews]);
    e.target.value = null; 
  }, [images]);

  const removeImage = (index) => {
    URL.revokeObjectURL(previews[index]);
    setImages(prev => prev.filter((_, i) => i !== index));
    setPreviews(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;
    
    setLoading(true);
    setError("");

    try {
      let photosData = [];

      // 1. Nén ảnh chất lượng cao và Upload lên Cloudinary
      if (images.length > 0) {
        const options = { maxSizeMB: 0.9, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressed = await Promise.all(images.map(img => imageCompression(img, options)));

        const formData = new FormData();
        compressed.forEach(img => formData.append("photos", img));

        const uploadRes = await uploadBatch(formData);
        photosData = uploadRes.data.data.map(item => ({
          url: item.url,
          public_id: item.public_id
        }));
      }

      // 2. Gom Payload (Đường dẫn /hotels vì Backend app.use("/api/hotels", ...))
      const payload = {
        ...form,
        location: { 
          lat: Number(form.lat) || 0, 
          lng: Number(form.lng) || 0 
        },
        photos: photosData,
        status: "active",
        country: "Vietnam",
        amenities: [], // Có thể bổ sung thêm checkbox UI sau
        rating: 5,
        reviews: 0
      };

      await axios.post("/hotels", payload);
      alert("Khách sạn đã được đăng tải thành công!");
      navigate("/admin/hotels");

    } catch (err) {
      setError(err.response?.data?.message || "Lỗi hệ thống. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 850, mx: "auto", my: 5, px: 2 }}>
      <Card sx={{ p: 4, borderRadius: 4, boxShadow: "0 10px 40px rgba(0,0,0,0.1)" }}>
        <Typography variant="h5" fontWeight={800} mb={4} textAlign="center" color="primary.main">
          HỆ THỐNG QUẢN TRỊ - THÊM KHÁCH SẠN
        </Typography>

        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Stack spacing={3} component="form" onSubmit={handleSubmit}>
          <TextField label="Tên khách sạn" name="name" required fullWidth onChange={handleInputChange} />
          
          <Grid container spacing={2}>
            <Grid item xs={12} sm={8}>
              <TextField label="Thành phố" name="city" required fullWidth onChange={handleInputChange} />
            </Grid>
            <Grid item xs={12} sm={4}>
              <TextField select label="Loại hình" name="type" fullWidth value={form.type} onChange={handleInputChange}>
                <MenuItem value="hotel">Khách sạn</MenuItem>
                <MenuItem value="resort">Resort</MenuItem>
                <MenuItem value="villa">Villa</MenuItem>
                <MenuItem value="apartment">Căn hộ</MenuItem>
              </TextField>
            </Grid>
          </Grid>

          <TextField label="Địa chỉ chi tiết" name="address" required fullWidth onChange={handleInputChange} />
          
          <Grid container spacing={2}>
            <Grid item xs={6}><TextField label="Vĩ độ (Lat)" name="lat" type="number" fullWidth onChange={handleInputChange} /></Grid>
            <Grid item xs={6}><TextField label="Kinh độ (Lng)" name="lng" type="number" fullWidth onChange={handleInputChange} /></Grid>
          </Grid>

          <TextField label="Mô tả khách sạn" name="desc" multiline rows={4} fullWidth required onChange={handleInputChange} />

          {/* Image Preview Grid */}
          <Box sx={{ p: 3, border: "2px dashed #ccc", borderRadius: 3, bgcolor: "#fafafa" }}>
            <Box textAlign="center" mb={2}>
              <Button variant="contained" component="label" startIcon={<CloudUploadIcon />} color="secondary">
                Tải ảnh lên (Max 10)
                <input type="file" hidden multiple accept="image/*" onChange={handleFileChange} />
              </Button>
            </Box>
            
            <Grid container spacing={1}>
              {previews.map((url, index) => (
                <Grid item xs={4} sm={2.4} key={url} position="relative">
                  <Box sx={{ 
                    width: "100%", pt: "100%", borderRadius: 2, 
                    backgroundImage: `url(${url})`, backgroundSize: "cover", backgroundPosition: "center" 
                  }} />
                  <IconButton 
                    size="small" onClick={() => removeImage(index)}
                    sx={{ position: "absolute", top: 2, right: 2, bgcolor: "error.main", color: "white", "&:hover": { bgcolor: "error.dark" } }}
                  >
                    <DeleteIcon fontSize="inherit" />
                  </IconButton>
                </Grid>
              ))}
            </Grid>
          </Box>

          <Button 
            type="submit" variant="contained" size="large" disabled={loading}
            sx={{ py: 2, fontWeight: 700, borderRadius: 2 }}
          >
            {loading ? <CircularProgress size={24} color="inherit" /> : "XÁC NHẬN LƯU VÀO CƠ SỞ DỮ LIỆU"}
          </Button>
        </Stack>
      </Card>
    </Box>
  );
};

export default AdminAddHotel;