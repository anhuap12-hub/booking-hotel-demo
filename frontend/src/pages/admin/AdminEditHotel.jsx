import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";

import {
  Stack, TextField, Typography, Button, Paper, Box, Divider, 
  MenuItem, Chip, Grid
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const AdminEditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

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
        console.error("Error fetching hotel:", err);
      }
    };
    fetchHotel();
  }, [id]);

  /* ================= HANDLERS ================= */

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

  const handleDragEnd = (result, type = "new") => {
    if (!result.destination) return;
    const items = type === "new" ? Array.from(photos) : Array.from(existingPhotos);
    const [moved] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, moved);
    type === "new" ? setPhotos(items) : setExistingPhotos(items);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      let uploadedUrls = [];
      if (photos.length > 0) {
        const uploadForm = new FormData();
        photos.forEach((file) => uploadForm.append("photos", file));
        const uploadRes = await axios.post(
          `/upload/hotels/${id}`,
          uploadForm,
          { headers: { "Content-Type": "multipart/form-data" } }
        );
        uploadedUrls = uploadRes.data.urls; 
      }

      const finalHotelData = {
        name,
        city,
        address,
        desc,
        type,
        status,
        location: {
          lat: Number(location.lat),
          lng: Number(location.lng)
        },
        amenities,
        photos: [...existingPhotos, ...uploadedUrls],
      };

      await axios.put(`/admin/hotels/${id}`, finalHotelData);
      navigate("/admin/hotels");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <Paper elevation={0} sx={{ maxWidth: 850, mx: "auto", p: 4, borderRadius: 3, border: "1px solid", borderColor: "divider" }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" fontWeight={700}>Chỉnh sửa Khách sạn</Typography>
          <Typography variant="body2" color="text.secondary">Cập nhật thông tin mô tả, vị trí và hình ảnh</Typography>
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

              <TextField 
                label="Mô tả" 
                value={desc} 
                onChange={(e) => setDesc(e.target.value)} 
                fullWidth multiline minRows={4} 
              />
            </Stack>
          </Grid>

          <Grid item xs={12} md={4}>
            <Stack spacing={3}>
              <TextField select fullWidth label="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value)}>
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Tạm ngưng</MenuItem>
              </TextField>

              <Box sx={{ p: 2, bgcolor: '#F9F8F6', borderRadius: 2 }}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mb: 1.5 }}>
                  <LocationOnIcon fontSize="small" color="primary"/> Tọa độ Bản đồ
                </Typography>
                <Stack spacing={1.5}>
                  <TextField label="Latitude" size="small" type="number" value={location.lat} onChange={(e) => setLocation({...location, lat: e.target.value})} fullWidth />
                  <TextField label="Longitude" size="small" type="number" value={location.lng} onChange={(e) => setLocation({...location, lng: e.target.value})} fullWidth />
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1.5}>Tiện ích (Amenities)</Typography>
          <TextField 
            fullWidth size="small"
            placeholder="Gõ tiện ích rồi ấn Enter"
            value={newAmenity}
            onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={handleAddAmenity}
            InputProps={{ startAdornment: <AddIcon sx={{ color: 'action.active', mr: 1, fontSize: 20 }} /> }}
          />
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mt: 2 }}>
            {amenities.map((item, idx) => (
              <Chip key={idx} label={item} onDelete={() => handleDeleteAmenity(item)} color="primary" variant="outlined" sx={{ borderRadius: '8px', fontWeight: 500 }} />
            ))}
          </Box>
        </Box>

        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1.5}>Hình ảnh hiện tại (Kéo thả để sắp xếp)</Typography>
          <DragDropContext onDragEnd={(r) => handleDragEnd(r, "existing")}>
            <Droppable droppableId="existingPhotos" direction="horizontal">
              {(provided) => (
                <Stack ref={provided.innerRef} direction="row" spacing={2} flexWrap="wrap" {...provided.droppableProps} sx={{ minHeight: 110, p: 2, border: '1px dashed', borderColor: 'divider', borderRadius: 2, bgcolor: '#fafafa' }}>
                  {existingPhotos.map((photo, i) => (
                    <Draggable key={`exist-${i}`} draggableId={`existing-${i}`} index={i}>
                      {(provided) => (
                        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ position: "relative" }}>
                          <Box component="img" src={photo.url || photo} sx={{ width: 120, height: 90, objectFit: "cover", borderRadius: 2, border: "1px solid #eee" }} />
                          <Button onClick={() => handleDeletePhoto(i, "existing")} sx={{ position: "absolute", top: -8, right: -8, minWidth: 24, width: 24, height: 24, borderRadius: "50%", bgcolor: "#ef4444", color: "white", p: 0, '&:hover': { bgcolor: '#dc2626' } }}>
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

        <Stack direction="row" spacing={2} justifyContent="space-between" alignItems="center">
          <Button variant="outlined" component="label" size="large" sx={{ textTransform: 'none', fontWeight: 700 }}>
            Tải ảnh mới lên
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>

          <Stack direction="row" spacing={2}>
            <Button onClick={() => navigate("/admin/hotels")} sx={{ color: 'text.secondary', fontWeight: 700 }}>Hủy</Button>
            <Button variant="contained" onClick={handleSubmit} size="large" sx={{ px: 4, bgcolor: '#1C1B19', color: '#C2A56D', textTransform: 'none', fontWeight: 700, '&:hover': { bgcolor: '#000' } }}>
              Lưu thay đổi
            </Button>
          </Stack>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AdminEditHotel;