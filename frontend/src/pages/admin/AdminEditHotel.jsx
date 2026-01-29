import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
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

  // --- States ---
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [desc, setDesc] = useState("");
  const [type, setType] = useState("hotel");
  const [status, setStatus] = useState("active");
  const [location, setLocation] = useState({ lat: 0, lng: 0 });
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");

  const [photos, setPhotos] = useState([]); // File thực tế để upload
  const [newPhotosPreview, setNewPhotosPreview] = useState([]); // URL hiển thị preview
  const [existingPhotos, setExistingPhotos] = useState([]); // Ảnh từ database
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho Snackbar (Toast)
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "success",
  });

  // --- Fetch Data ---
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
      } catch (err) {
        console.error("Lỗi lấy dữ liệu khách sạn:", err);
        triggerToast("Không thể tải thông tin khách sạn!", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // --- Handlers ---
  const handleCloseSnackbar = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbar((prev) => ({ ...prev, open: false }));
  };

  const triggerToast = (msg, type = "success") => {
    setSnackbar({ open: true, message: msg, severity: type });
  };

  const handleAddAmenity = (e) => {
    if (e.key === "Enter" && newAmenity.trim()) {
      e.preventDefault();
      if (!amenities.includes(newAmenity.trim())) {
        setAmenities([...amenities, newAmenity.trim()]);
      }
      setNewAmenity("");
    }
  };

  const handleDeleteAmenity = (item) => {
    setAmenities(amenities.filter((a) => a !== item));
  };

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith("image/"));

    if (imageFiles.length === 0) {
      triggerToast("Vui lòng chỉ chọn các tệp tin hình ảnh!", "warning");
      return;
    }

    setPhotos((prev) => [...prev, ...imageFiles]);

    const newPreviews = imageFiles.map((file) => ({
      url: URL.createObjectURL(file), 
      name: file.name
    }));
    setNewPhotosPreview((prev) => [...prev, ...newPreviews]);
    e.target.value = null;
  };

  useEffect(() => {
    return () => {
      newPhotosPreview.forEach((photo) => {
        if (photo.url.startsWith("blob:")) {
          URL.revokeObjectURL(photo.url);
        }
      });
    };
  }, [newPhotosPreview]);

  const handleDeletePhoto = (index, type = "new") => {
    const confirmDelete = window.confirm("Bạn có chắc chắn muốn bỏ ảnh này không?");
    if (!confirmDelete) return;

    if (type === "new") {
      URL.revokeObjectURL(newPhotosPreview[index].url);
      setPhotos((prev) => prev.filter((_, i) => i !== index));
      setNewPhotosPreview((prev) => prev.filter((_, i) => i !== index));
    } else {
      setExistingPhotos((prev) => prev.filter((_, i) => i !== index));
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination) return;
    const items = Array.from(existingPhotos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    setExistingPhotos(items);
  };

  // --- Submit ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      let uploadedUrls = [];
      if (photos.length > 0) {
        const options = { maxSizeMB: 1, maxWidthOrHeight: 1920, useWebWorker: true };
       const compressedFiles = await Promise.all(
       photos.map(async (file) => {
    try {
      // Thêm await và bọc try-catch cho từng file
      return await imageCompression(file, options);
    } catch (e) {
      console.warn(`Không thể nén ${file.name}, giữ nguyên bản gốc:`, e);
      return file; // Nén lỗi thì dùng file gốc, không để crash cả hàm Submit
    }
  })
);

        const uploadForm = new FormData();
        compressedFiles.forEach((file) => uploadForm.append("photos", file));

        const uploadRes = await axios.post(`/upload/hotels/${id}`, uploadForm);
        uploadedUrls = uploadRes.data.data || [];
      }

      const finalHotelData = {
        name,
        city,
        address,
        desc,
        type,
        status,
        location: {
          lat: Number(location.lat) || 0,
          lng: Number(location.lng) || 0
        },
        amenities,
        photos: [...existingPhotos, ...uploadedUrls],
      };

      await axios.put(`/hotels/${id}`, finalHotelData);
      
      triggerToast("Cập nhật khách sạn thành công!", "success");
      
      // Chuyển hướng sau khi hiện thông báo thành công một lát
      setTimeout(() => {
        navigate("/admin/hotels");
      }, 1500);

    } catch (err) {
      const msg = err.response?.data?.message || "Có lỗi xảy ra khi lưu";
      console.error("Submit Error:", msg);
      triggerToast(`Thất bại: ${msg}`, "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" mt={10}><CircularProgress color="inherit" /></Box>
  );

  return (
    <Paper elevation={0} sx={{ maxWidth: 850, mx: "auto", p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Chỉnh sửa Khách sạn</Typography>
          <Typography variant="body2" color="text.secondary">Cập nhật thông tin chi tiết và quản lý hình ảnh</Typography>
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
                  <MenuItem value="hotel">Hotel</MenuItem>
                  <MenuItem value="resort">Resort</MenuItem>
                  <MenuItem value="villa">Villa</MenuItem>
                </TextField>
              </Stack>
              <TextField label="Mô tả" value={desc} onChange={(e) => setDesc(e.target.value)} fullWidth multiline minRows={4} />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <TextField select fullWidth label="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Tạm ngưng</MenuItem>
              </TextField>

              <Box sx={{ p: 2, bgcolor: '#f5f5f5', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                  <LocationOnIcon fontSize="small" color="primary"/> Tọa độ GPS
                </Typography>
                <Stack spacing={1.5}>
                  <TextField label="Lat" size="small" type="number" value={location.lat} onChange={(e) => setLocation({...location, lat: e.target.value})} fullWidth />
                  <TextField label="Lng" size="small" type="number" value={location.lng} onChange={(e) => setLocation({...location, lng: e.target.value})} fullWidth />
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1.5}>Tiện ích</Typography>
          <TextField 
            fullWidth size="small" placeholder="Nhấn Enter để thêm tiện ích"
            value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={handleAddAmenity}
            InputProps={{ startAdornment: <AddIcon sx={{ color: 'action.active', mr: 1, fontSize: 20 }} /> }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {amenities.map((item, idx) => (
              <Chip key={idx} label={item} onDelete={() => handleDeleteAmenity(item)} color="primary" variant="outlined" />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1.5}>Thư viện ảnh ({existingPhotos.length + newPhotosPreview.length})</Typography>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="existingPhotos" direction="horizontal">
              {(provided) => (
                <Stack 
                  ref={provided.innerRef} 
                  direction="row" 
                  spacing={2} 
                  flexWrap="wrap" 
                  {...provided.droppableProps} 
                  sx={{ minHeight: 120, p: 2, border: '1px dashed #ccc', borderRadius: 2, bgcolor: '#fafafa', gap: 2 }}
                >
                  {existingPhotos.map((photo, i) => (
                    <Draggable key={photo.public_id || `exist-${i}`} draggableId={photo.public_id || `exist-${i}`} index={i}>
                      {(provided) => (
                        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ position: "relative" }}>
                          <Box component="img" src={photo.url || photo} sx={{ width: 120, height: 90, objectFit: "cover", borderRadius: 2, border: "2px solid #C2A56D" }} />
                          <Button 
                            onClick={() => handleDeletePhoto(i, "existing")}
                            sx={{ position: "absolute", top: -8, right: -8, minWidth: 24, width: 24, height: 24, borderRadius: "50%", bgcolor: "#ef4444", color: "white", p: 0, '&:hover': { bgcolor: '#b91c1c' } }}
                          >
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
                      <Button 
                        onClick={() => handleDeletePhoto(i, "new")}
                        sx={{ position: "absolute", top: -8, right: -8, minWidth: 24, width: 24, height: 24, borderRadius: "50%", bgcolor: "#ef4444", color: "white", p: 0 }}
                      >
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </Button>
                    </Box>
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Button variant="outlined" component="label" size="large" sx={{ textTransform: 'none' }}>
            + Chọn thêm ảnh mới
            <input type="file" hidden multiple onChange={handleFileChange} accept="image/*" />
          </Button>

          <Stack direction="row" spacing={2}>
            <Button onClick={() => navigate("/admin/hotels")} color="inherit">Hủy</Button>
            <Button 
              variant="contained" 
              onClick={handleSubmit} 
              disabled={isSubmitting}
              size="large" 
              sx={{ px: 4, bgcolor: '#1C1B19', color: '#C2A56D', fontWeight: 700, '&:hover': { bgcolor: '#000' } }}
            >
              {isSubmitting ? (
                <Stack direction="row" spacing={1} alignItems="center">
                  <CircularProgress size={20} sx={{ color: '#C2A56D' }} />
                  <Typography variant="caption">Đang xử lý & Upload...</Typography>
                </Stack>
              ) : "Lưu thay đổi"}
            </Button>
          </Stack>
        </Stack>
      </Stack>

      {/* Snackbar để hiển thị thông báo */}
      <Snackbar 
        open={snackbar.open} 
        autoHideDuration={4000} 
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert 
          onClose={handleCloseSnackbar} 
          severity={snackbar.severity} 
          variant="filled" 
          sx={{ width: '100%', boxShadow: 3 }}
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Paper>
  );
};

export default AdminEditHotel;