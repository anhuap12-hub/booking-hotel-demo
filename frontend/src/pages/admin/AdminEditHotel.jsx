import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { uploadBatch } from "../../api/upload.api"; 
import imageCompression from 'browser-image-compression';
import {
  Stack, TextField, Typography, Button, Paper, Box, Divider, 
  MenuItem, Chip, Grid, CircularProgress, Snackbar, Alert
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const AdminEditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // --- Form States ---
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("hotel");
  const [status, setStatus] = useState("active");
  const [location, setLocation] = useState({ lat: "", lng: "" });
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");

  // --- Photo States ---
  const [photos, setPhotos] = useState([]); 
  const [newPhotosPreview, setNewPhotosPreview] = useState([]); 
  const [existingPhotos, setExistingPhotos] = useState([]); 
  
  // --- Status States ---
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  // Fetch dữ liệu ban đầu
  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const res = await axios.get(`/hotels/${id}`);
        const hotel = res.data.data;
        setName(hotel.name || "");
        setCity(hotel.city || "");
        setAddress(hotel.address || "");
        setDesc(hotel.desc || "");
        setType(hotel.type || "hotel");
        setStatus(hotel.status || "active");
        setLocation(hotel.location || { lat: 0, lng: 0 });
        setAmenities(hotel.amenities || []);
        setExistingPhotos(hotel.photos || []); 
      } catch{
        triggerToast("Không thể tải thông tin khách sạn!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // Dọn dẹp bộ nhớ preview ảnh
  useEffect(() => {
    return () => newPhotosPreview.forEach(photo => URL.revokeObjectURL(photo.url));
  }, [newPhotosPreview]);

  const triggerToast = (msg, type = "success") => setSnackbar({ open: true, message: msg, severity: type });
  const handleCloseSnackbar = () => setSnackbar(prev => ({ ...prev, open: false }));

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
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith("image/"));
    
    setPhotos(prev => [...prev, ...imageFiles]);
    const newPreviews = imageFiles.map(file => ({ url: URL.createObjectURL(file), name: file.name }));
    setNewPhotosPreview(prev => [...prev, ...newPreviews]);
    e.target.value = null;
  };

  const handleDeletePhoto = (index, type = "new") => {
    if (!window.confirm("Bạn có chắc chắn muốn bỏ ảnh này không?")) return;
    if (type === "new") {
      URL.revokeObjectURL(newPhotosPreview[index].url);
      setPhotos(prev => prev.filter((_, i) => i !== index));
      setNewPhotosPreview(prev => prev.filter((_, i) => i !== index));
    } else {
      setExistingPhotos(prev => prev.filter((_, i) => i !== index));
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(existingPhotos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setExistingPhotos(items);
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    if (isSubmitting) return;
    setIsSubmitting(true);
    
    try {
      let newlyUploadedPhotos = [];
      
      // 1. Nén và Upload ảnh mới (nếu có)
      if (photos.length > 0) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
        const compressedFiles = await Promise.all(
          photos.map(async (file) => {
            try {
              const compressedBlob = await imageCompression(file, options);
              return new File([compressedBlob], file.name, { type: file.type });
            } catch { return file; }
          })
        );

        const uploadForm = new FormData();
        compressedFiles.forEach(file => uploadForm.append("photos", file));

        const uploadRes = await uploadBatch(uploadForm);
        newlyUploadedPhotos = uploadRes.data.data.map(item => ({
          url: item.url,
          public_id: item.public_id
        }));
      }

      // 2. Chuẩn bị Payload gửi lên Server
      const finalHotelData = {
        name, city, address, desc, type, status,
        location: {
          lat: Number(location.lat) || 0,
          lng: Number(location.lng) || 0
        },
        amenities,
        photos: [...existingPhotos, ...newlyUploadedPhotos],
      };

      // 3. Gọi API cập nhật
      await axios.put(`/hotels/${id}`, finalHotelData); 
      triggerToast("Cập nhật thành công!", "success");
      setTimeout(() => navigate("/admin/hotels"), 1000);

    } catch (err) {
      const msg = err.response?.data?.message || "Lỗi khi lưu dữ liệu";
      triggerToast(`Thất bại: ${msg}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress color="#1C1B19" /></Box>;

  return (
    <Paper elevation={0} sx={{ maxWidth: 850, mx: "auto", p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" fontWeight={700} color="#1C1B19">Chỉnh sửa Khách sạn</Typography>
          <Typography variant="body2" color="text.secondary">Cập nhật thông tin chi tiết và thư viện ảnh</Typography>
        </Box>

        <Divider />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Stack spacing={2.5}>
              <TextField label="Tên khách sạn" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <TextField label="Địa chỉ" value={address} onChange={(e) => setAddress(e.target.value)} fullWidth />
              <Stack direction="row" spacing={2}>
                <TextField label="Thành phố" value={city} onChange={(e) => setCity(e.target.value)} fullWidth />
                <TextField select label="Loại" value={type} onChange={(e) => setType(e.target.value)} sx={{ width: 180 }}>
                  <MenuItem value="hotel">Khách sạn</MenuItem>
                  <MenuItem value="resort">Resort</MenuItem>
                  <MenuItem value="villa">Villa</MenuItem>
                  <MenuItem value="apartment">Căn hộ</MenuItem>
                </TextField>
              </Stack>
              <TextField label="Mô tả" value={desc} onChange={(e) => setDesc(e.target.value)} fullWidth multiline minRows={4} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <TextField select fullWidth label="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="active">Đang hoạt động</MenuItem>
                <MenuItem value="inactive">Tạm ngưng</MenuItem>
              </TextField>

              <Box sx={{ p: 2, bgcolor: '#F9F9F9', borderRadius: 2, border: '1px solid #eee' }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5, color: '#C2A56D' }}>
                  <LocationOnIcon fontSize="small"/> Tọa độ GPS
                </Typography>
                <Stack spacing={1.5}>
                  <TextField label="Vĩ độ (Lat)" size="small" type="number" value={location.lat} onChange={(e) => setLocation({...location, lat: e.target.value})} fullWidth />
                  <TextField label="Kinh độ (Lng)" size="small" type="number" value={location.lng} onChange={(e) => setLocation({...location, lng: e.target.value})} fullWidth />
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1.5}>Tiện ích</Typography>
          <TextField 
            fullWidth size="small" placeholder="Ví dụ: WiFi, Hồ bơi... (Nhấn Enter)"
            value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={handleAddAmenity}
            InputProps={{ startAdornment: <AddIcon sx={{ color: 'action.active', mr: 1, fontSize: 20 }} /> }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {amenities.map((item, idx) => (
              <Chip key={idx} label={item} onDelete={() => setAmenities(amenities.filter(a => a !== item))} color="primary" variant="outlined" sx={{ borderRadius: '6px' }} />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={0.5}>Thư viện ảnh ({existingPhotos.length + newPhotosPreview.length})</Typography>
          <Typography variant="caption" color="text.secondary" display="block" mb={2}>Kéo thả ảnh cũ để thay đổi thứ tự ưu tiên</Typography>
          
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="photos-grid" direction="horizontal">
              {(provided) => (
                <Box 
                  ref={provided.innerRef} {...provided.droppableProps}
                  sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2, border: '1px dashed #C2A56D', borderRadius: 2, bgcolor: '#FFFBF5', minHeight: 130 }}
                >
                  {existingPhotos.map((photo, i) => (
                    <Draggable key={photo.public_id || `exist-${i}`} draggableId={photo.public_id || `exist-${i}`} index={i}>
                      {(provided) => (
                        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ position: "relative" }}>
                          <Box component="img" src={photo.url} sx={{ width: 120, height: 90, objectFit: "cover", borderRadius: 2, border: "2px solid #C2A56D" }} />
                          <Button onClick={() => handleDeletePhoto(i, "existing")} sx={{ position: "absolute", top: -8, right: -8, minWidth: 24, width: 24, height: 24, borderRadius: "50%", bgcolor: "#ef4444", color: "white", p: 0 }}>
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </Button>
                        </Box>
                      )}
                    </Draggable>
                  ))}

                  {newPhotosPreview.map((photo, i) => (
                    <Box key={`new-${i}`} sx={{ position: "relative" }}>
                      <Box component="img" src={photo.url} sx={{ width: 120, height: 90, objectFit: "cover", borderRadius: 2, border: "2px dashed #2e7d32", opacity: 0.8 }} />
                      <Chip label="Mới" size="small" color="success" sx={{ position: 'absolute', bottom: 5, left: 5, height: 16, fontSize: 10 }} />
                      <Button onClick={() => handleDeletePhoto(i, "new")} sx={{ position: "absolute", top: -8, right: -8, minWidth: 24, width: 24, height: 24, borderRadius: "50%", bgcolor: "#ef4444", color: "white", p: 0 }}>
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </Button>
                    </Box>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Button variant="outlined" component="label" color="inherit" sx={{ textTransform: 'none' }}>
            + Chọn thêm ảnh mới
            <input type="file" hidden multiple onChange={handleFileChange} accept="image/*" />
          </Button>

          <Stack direction="row" spacing={2}>
            <Button onClick={() => navigate("/admin/hotels")} sx={{ textTransform: 'none' }}>Hủy bỏ</Button>
            <Button 
              variant="contained" onClick={handleSubmit} disabled={isSubmitting} 
              sx={{ px: 4, bgcolor: '#1C1B19', color: '#C2A56D', fontWeight: 700, textTransform: 'none', '&:hover': { bgcolor: '#000' } }}
            >
              {isSubmitting ? <CircularProgress size={24} color="inherit" /> : "Lưu thay đổi"}
            </Button>
          </Stack>
        </Stack>
      </Stack>

      <Snackbar open={snackbar.open} autoHideDuration={4000} onClose={handleCloseSnackbar} anchorOrigin={{ vertical: "top", horizontal: "right" }}>
        <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} variant="filled">
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AdminEditHotel;