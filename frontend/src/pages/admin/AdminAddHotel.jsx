import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { uploadBatch } from "../../api/upload"; 
import imageCompression from 'browser-image-compression';
import { 
  TextField, Button, Typography, Stack, Box, 
  CircularProgress, Alert, Grid, MenuItem 
} from "@mui/material";

const AdminAddHotel = () => {
  const [form, setForm] = useState({
    name: "",
    city: "",
    address: "",
    desc: "",
    lat: "",
    lng: "",
    type: "hotel",
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
      let photosData = []; 

      // 1. Xử lý nén và Upload ảnh
      if (images.length > 0) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1280, useWebWorker: true };
        const compressedImages = await Promise.all(
          images.map(async (img) => {
            try {
              return await imageCompression(img, options);
            } catch  {
              return img;
            }
          })
        );

        const formData = new FormData();
        compressedImages.forEach((img) => {
          formData.append("photos", img); 
        });

        const uploadRes = await uploadBatch(formData);
        
        // Map đúng cấu trúc Object {url, public_id} của Schema
        photosData = uploadRes.data.data.map(item => ({
          url: item.url,
          public_id: item.public_id
        }));
      }

      // 2. Gom dữ liệu vào hotelPayload để khớp chính xác với Hotel Model
      const hotelPayload = {
        name: form.name,
        city: form.city,
        address: form.address,
        desc: form.desc,
        type: form.type,
        location: {
          lat: Number(form.lat) || 0,
          lng: Number(form.lng) || 0
        },
        photos: photosData,
        // Bổ sung các giá trị mặc định để tránh lỗi "required" từ Mongoose
        status: "active",
        amenities: [], 
        country: "Vietnam",
        rating: 0,
        reviews: 0,
        cheapestPrice: 0,
        checkInTime: "14:00",
        checkOutTime: "12:00"
      };

      // 3. Gọi API tạo Hotel
      const res = await axios.post("/admin/hotels", hotelPayload);

      if (res.data.success || res.status === 201 || res.status === 200) {
        alert("Tạo khách sạn thành công!");
        navigate("/admin/hotels");
      }

    } catch (err) {
      console.error("Lỗi khi Submit:", err);
      // Xử lý catch lỗi chi tiết để Admin biết sai ở đâu
      if (err.response) {
        // Lỗi trả về từ Backend (VD: thiếu trường, trùng tên...)
        setError(err.response.data.message || "Dữ liệu không hợp lệ. Vui lòng kiểm tra các trường bắt buộc.");
      } else if (err.request) {
        // Lỗi không gọi được đến Backend
        setError("Không thể kết nối đến máy chủ. Vui lòng kiểm tra lại kết nối mạng.");
      } else {
        setError("Lỗi hệ thống: " + err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 700, mx: "auto", mt: 6, p: 4, bgcolor: "#F5F3EF", borderRadius: 4, border: "1px solid #E0DAD3" }}>
      <Typography fontSize={24} fontWeight={700} mb={3} sx={{ color: "#3E2C1C", textAlign: 'center' }}>
        Thêm Khách Sạn Mới
      </Typography>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError("")}>
          {error}
        </Alert>
      )}

      <Stack spacing={3} component="form" onSubmit={handleSubmit}>
        <TextField label="Tên khách sạn" name="name" value={form.name} onChange={handleInputChange} required fullWidth />
        
        <Grid container spacing={2}>
          <Grid item xs={8}>
            <TextField label="Thành phố" name="city" value={form.city} onChange={handleInputChange} required fullWidth />
          </Grid>
          <Grid item xs={4}>
            <TextField select label="Loại hình" name="type" value={form.type} onChange={handleInputChange} fullWidth>
              <MenuItem value="hotel">Khách sạn</MenuItem>
              <MenuItem value="resort">Resort</MenuItem>
              <MenuItem value="apartment">Căn hộ</MenuItem>
              <MenuItem value="villa">Villa</MenuItem>
            </TextField>
          </Grid>
        </Grid>

        <TextField label="Địa chỉ chi tiết" name="address" value={form.address} onChange={handleInputChange} required fullWidth />

        <Grid container spacing={2}>
          <Grid item xs={6}>
            <TextField label="Vĩ độ (Lat)" name="lat" type="number" value={form.lat} onChange={handleInputChange} fullWidth placeholder="VD: 10.76" />
          </Grid>
          <Grid item xs={6}>
            <TextField label="Kinh độ (Lng)" name="lng" type="number" value={form.lng} onChange={handleInputChange} fullWidth placeholder="VD: 106.66" />
          </Grid>
        </Grid>

        <TextField label="Mô tả khách sạn" name="desc" value={form.desc} onChange={handleInputChange} required fullWidth multiline rows={4} />

        <Box sx={{ p: 3, border: "2px dashed #B8A99A", borderRadius: 2, textAlign: 'center', bgcolor: "#FFF" }}>
          <Button variant="outlined" component="label" sx={{ color: "#3E2C1C", borderColor: "#3E2C1C" }}>
            Chọn hình ảnh (Tối đa 10)
            <input type="file" hidden multiple onChange={handleFileChange} accept="image/*" />
          </Button>
          {images.length > 0 && (
            <Typography fontSize={13} mt={1} color="success.main" fontWeight={600}>
              Đã chọn {images.length} ảnh thành công
            </Typography>
          )}
        </Box>

        <Button 
          type="submit" 
          variant="contained" 
          disabled={loading} 
          sx={{ py: 1.5, bgcolor: "#3E2C1C", "&:hover": { bgcolor: "#2A1D12" }, fontWeight: 700 }}
        >
          {loading ? <CircularProgress size={24} color="inherit" /> : "XÁC NHẬN TẠO MỚI"}
        </Button>
      </Stack>
    </Box>
  );
};

export default AdminAddHotel;