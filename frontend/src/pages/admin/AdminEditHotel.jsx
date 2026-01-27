import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

import {
  Stack, TextField, Typography, Button, Paper, Box, Divider, 
  MenuItem, Chip, Grid, CircularProgress
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

  const [photos, setPhotos] = useState([]); 
  const [existingPhotos, setExistingPhotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };
    fetchHotel();
  }, [id]);

  // --- Handlers ---
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
    setPhotos(Array.from(e.target.files));
  };

  const handleDeletePhoto = (index, type = "new") => {
    if (type === "new") {
      setPhotos((prev) => prev.filter((_, i) => i !== index));
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
      
      // 1. Upload ảnh mới (Đồng bộ URL: /upload/hotels/ID)
      if (photos.length > 0) {
        const uploadForm = new FormData();
        photos.forEach((file) => uploadForm.append("photos", file));
        
        const uploadRes = await axios.post(
          `/upload/hotels/${id}`, 
          uploadForm,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        // Lấy mảng object {url, public_id} từ data trả về
        uploadedUrls = uploadRes.data.data || []; 
      }

      // 2. Gom dữ liệu cuối cùng
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
        // Gộp ảnh cũ đã sắp xếp + ảnh mới upload
        photos: [...existingPhotos, ...uploadedUrls],
      };

      // 3. Cập nhật qua API PUT
      await axios.put(`/hotels/${id}`, finalHotelData);
      
      alert("Cập nhật khách sạn thành công!");
      navigate("/admin/hotels");
    } catch (err) {
      const msg = err.response?.data?.message || "Có lỗi xảy ra khi lưu";
      console.error("Submit Error:", msg);
      alert(`Thất bại: ${msg}`);
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
          {/* Cột Trái: Thông tin chính */}
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

          {/* Cột Phải: Trạng thái & Tọa độ */}
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

        {/* Tiện ích */}
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

        {/* Quản lý ảnh */}
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1.5}>Thư viện ảnh (Kéo thả để sắp xếp)</Typography>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="existingPhotos" direction="horizontal">
              {(provided) => (
                <Stack 
                  ref={provided.innerRef} 
                  direction="row" 
                  spacing={2} 
                  flexWrap="wrap" 
                  {...provided.droppableProps} 
                  sx={{ minHeight: 120, p: 2, border: '1px dashed #ccc', borderRadius: 2, bgcolor: '#fafafa' }}
                >
                  {existingPhotos.map((photo, i) => (
                    <Draggable key={photo.public_id || `exist-${i}`} draggableId={photo.public_id || `exist-${i}`} index={i}>
                      {(provided) => (
                        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ position: "relative" }}>
                          <Box component="img" src={photo.url || photo} sx={{ width: 120, height: 90, objectFit: "cover", borderRadius: 2, border: "1px solid #ddd" }} />
                          <Button 
                            onClick={() => handleDeletePhoto(i, "existing")}
                            sx={{ position: "absolute", top: -8, right: -8, minWidth: 24, width: 24, height: 24, borderRadius: "50%", bgcolor: "#ef4444", color: "white", p: 0 }}
                          >
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </Button>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Stack>
              )}
            </Droppable>
          </DragDropContext>
        </Box>

        {/* Buttons */}
        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Button variant="outlined" component="label" size="large">
            Chọn thêm ảnh mới
            <input type="file" hidden multiple onChange={handleFileChange} />
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
              {isSubmitting ? "Đang xử lý..." : "Lưu thay đổi"}
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AdminEditHotel;