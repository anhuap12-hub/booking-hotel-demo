import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { uploadBatch } from "../../api/upload"; // Import hàm upload mới
import imageCompression from 'browser-image-compression';
import {
  TextField, Button, Select, MenuItem, Stack, InputLabel,
  FormControl, Box, Typography, CircularProgress, Alert,
  Grid, Divider, Chip, Paper
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AdminAddRoom() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "single",
    price: "",
    maxPeople: 1,
    desc: "",
    status: "active",
  });
  
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [photos, setPhotos] = useState([]); 
  const [previews, setPreviews] = useState([]); 

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Dọn dẹp bộ nhớ ảnh preview
  useEffect(() => {
    return () => previews.forEach(url => {
        if(url.startsWith('blob:')) URL.revokeObjectURL(url);
    });
  }, [previews]);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleAddAmenity = (e) => {
    if (e.key === "Enter" && newAmenity.trim()) {
      e.preventDefault();
      if (!amenities.includes(newAmenity.trim())) {
        setAmenities([...amenities, newAmenity.trim()]);
      }
      setNewAmenity("");
    }
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files).filter(f => f.type.startsWith("image/"));
    if (photos.length + files.length > 5) {
        alert("Chỉ được phép upload tối đa 5 ảnh.");
        return;
    }
    setPhotos(prev => [...prev, ...files]);
    const urls = files.map(file => URL.createObjectURL(file));
    setPreviews(prev => [...prev, ...urls]);
    e.target.value = null;
  };

  const handleDeletePhoto = (index) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos(photos.filter((_, i) => i !== index));
    setPreviews(previews.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
try {
  let uploadedPhotos = [];

  if (photos.length > 0) {
 
    const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1280, useWebWorker: true };
    const compressedFiles = await Promise.all(
      photos.map(async (file) => {
        try {
          const compressedBlob = await imageCompression(file, options);
          return new File([compressedBlob], file.name, { type: file.type });
        } catch { return file; }
      })
    );

    const formData = new FormData();
    compressedFiles.forEach(file => formData.append("photos", file));

    const uploadRes = await uploadBatch(formData);
    
    uploadedPhotos = uploadRes.data.data.map(item => ({
      url: item.url,
      public_id: item.public_id
    })); 
  }

  await axios.post(`/rooms/by-hotel/${hotelId}`, {
    ...form,
    price: Number(form.price),
    maxPeople: Number(form.maxPeople),
    amenities,
    photos: uploadedPhotos, 
  });
      
      alert("Thêm phòng thành công!");
      navigate(`/admin/hotels/${hotelId}/rooms`);
    } catch (err) {
      console.error("Lỗi chi tiết:", err);
      const msg = err.response?.data?.message || "Không thể kết nối đến server.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box sx={{ maxWidth: 800, mx: "auto", mt: 4, mb: 4 }}>
      <Paper elevation={0} sx={{ p: 4, borderRadius: "16px", border: "1px solid #E5E2DC", bgcolor: "#FDFCFB" }}>
        <Typography variant="h5" fontWeight={700} mb={1} color="#3E2C1C">Thêm Phòng Mới</Typography>
        <Typography variant="body2" color="text.secondary" mb={4}>Điền thông tin chi tiết để tạo hạng phòng mới cho khách sạn.</Typography>
        
        {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}

        <Stack spacing={4} component="form" onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={7}>
              <Stack spacing={3}>
                <TextField label="Tên phòng / Số phòng" name="name" value={form.name} onChange={handleChange} required fullWidth placeholder="VD: Deluxe Ocean View" />
                <TextField label="Mô tả" name="desc" value={form.desc} onChange={handleChange} multiline rows={3} fullWidth />
                <Stack direction="row" spacing={2}>
                  <TextField type="number" label="Giá (VNĐ)" name="price" value={form.price} onChange={handleChange} required fullWidth />
                  <TextField type="number" label="Sức chứa (Người)" name="maxPeople" value={form.maxPeople} onChange={handleChange} required fullWidth />
                </Stack>
              </Stack>
            </Grid>
            <Grid item xs={12} md={5}>
              <Stack spacing={3}>
                <FormControl fullWidth>
                  <InputLabel>Loại phòng</InputLabel>
                  <Select name="type" value={form.type} label="Loại phòng" onChange={handleChange}>
                    <MenuItem value="single">Phòng đơn (Single)</MenuItem>
                    <MenuItem value="double">Phòng đôi (Double)</MenuItem>
                    <MenuItem value="suite">Cao cấp (Suite)</MenuItem>
                    <MenuItem value="family">Gia đình (Family)</MenuItem>
                  </Select>
                </FormControl>
                <FormControl fullWidth>
                  <InputLabel>Trạng thái</InputLabel>
                  <Select name="status" value={form.status} label="Trạng thái" onChange={handleChange}>
                    <MenuItem value="active">Sẵn sàng đón khách</MenuItem>
                    <MenuItem value="maintenance">Đang bảo trì</MenuItem>
                  </Select>
                </FormControl>
              </Stack>
            </Grid>
          </Grid>

          <Divider />

          <Box>
            <Typography variant="subtitle2" mb={1} fontWeight={600}>Tiện ích phòng</Typography>
            <TextField fullWidth size="small" value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)} onKeyDown={handleAddAmenity} placeholder="Nhập tiện ích rồi nhấn Enter" />
            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 1 }}>
              {amenities.map((item, idx) => (
                <Chip key={idx} label={item} onDelete={() => setAmenities(amenities.filter(a => a !== item))} color="primary" variant="outlined" />
              ))}
            </Box>
          </Box>

          <Box>
            <Typography variant="subtitle2" mb={1} fontWeight={600}>Hình ảnh (Tối đa 5 ảnh)</Typography>
            <Button variant="outlined" component="label" sx={{ mb: 2, textTransform: 'none' }} disabled={photos.length >= 5}>
              + Tải ảnh lên
              <input type="file" hidden multiple onChange={handleFileChange} accept="image/*" />
            </Button>
            <Stack direction="row" spacing={2} flexWrap="wrap">
              {previews.map((url, i) => (
                <Box key={i} sx={{ position: "relative", width: 100, height: 80 }}>
                  <Box component="img" src={url} sx={{ width: "100%", height: "100%", objectFit: "cover", borderRadius: 1, border: "1px solid #ddd" }} />
                  <Button onClick={() => handleDeletePhoto(i)} sx={{ position: "absolute", top: -8, right: -8, minWidth: 24, width: 24, height: 24, bgcolor: "#d32f2f", color: "white", borderRadius: "50%", p: 0, "&:hover": {bgcolor: "#b71c1c"} }}>
                    <CloseIcon sx={{ fontSize: 14 }} />
                  </Button>
                </Box>
              ))}
            </Stack>
          </Box>

          <Button type="submit" variant="contained" disabled={loading} sx={{ bgcolor: "#3E2C1C", color: "#C2A56D", py: 1.5, fontWeight: 700, "&:hover": { bgcolor: "#1a130d" } }}>
            {loading ? <CircularProgress size={24} sx={{ color: "#C2A56D" }} /> : "XÁC NHẬN THÊM PHÒNG"}
          </Button>
        </Stack>
      </Paper>
    </Box>
  );
}