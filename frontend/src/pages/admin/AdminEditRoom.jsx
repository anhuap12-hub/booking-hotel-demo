import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById, updateRoom } from "../../api/room.api";
import { uploadBatch } from "../../api/upload.api"; 
import imageCompression from 'browser-image-compression';

import {
  Stack, TextField, Button, MenuItem, Typography, Box, Paper, Divider, 
  Chip, Grid, InputAdornment, CircularProgress, Snackbar, Alert, IconButton
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import AddIcon from "@mui/icons-material/Add";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function AdminEditRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  // --- Form States ---
  const [name, setName] = useState("");
  const [type, setType] = useState("single");
  const [price, setPrice] = useState(""); // Lưu dạng số để dễ nhập liệu
  const [maxPeople, setMaxPeople] = useState(1);
  const [discount, setDiscount] = useState(0);
  const [status, setStatus] = useState("active");
  const [desc, setDesc] = useState("");
  const [hotelId, setHotelId] = useState("");
  const [freeCancel, setFreeCancel] = useState(24);
  const [refund, setRefund] = useState(100);

  // --- Photo & Amenities States ---
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [existingPhotos, setExistingPhotos] = useState([]); 
  const [newPhotos, setNewPhotos] = useState([]); // File gốc để upload
  const [newPhotosPreview, setNewPhotosPreview] = useState([]); // URL để preview

  // --- UI States ---
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [snackbar, setSnackbar] = useState({ open: false, message: "", severity: "success" });

  useEffect(() => {
    const fetchRoom = async () => {
      try {
        const res = await getRoomById(roomId);
        const room = res.data.data; 
        
        if (!room) throw new Error("Không có dữ liệu phòng");
        setName(room.name || "");
        setType(room.type || "single");
        setPrice(room.price || "");
        setMaxPeople(room.maxPeople || 1);
        setDiscount(room.discount || 0);
        setStatus(room.status || "active");
        setDesc(room.desc || "");
        setAmenities(room.amenities || []);
        setExistingPhotos(room.photos || []);
        setFreeCancel(room.cancellationPolicy?.freeCancelBeforeHours ?? 24);
        setRefund(room.cancellationPolicy?.refundPercent ?? 100);

        const id = room.hotel?._id || room.hotel; 
        if (id) {
          setHotelId(id.toString());
        } else {
          console.warn("Cảnh báo: Phòng này không có Hotel ID gắn kèm!");
        }

      } catch (err) {
        console.error(err);
        triggerToast("Không thể tải thông tin phòng", "error");
      } finally {
        setLoading(false);
      }
    };
    fetchRoom();
  }, [roomId]);

  const triggerToast = (msg, type = "success") => setSnackbar({ open: true, message: msg, severity: type });

  // Xử lý ảnh giống EditHotel
  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    const imageFiles = selectedFiles.filter(file => file.type.startsWith("image/"));
    
    setNewPhotos(prev => [...prev, ...imageFiles]);
    const newPreviews = imageFiles.map(file => ({ url: URL.createObjectURL(file), name: file.name }));
    setNewPhotosPreview(prev => [...prev, ...newPreviews]);
    e.target.value = null;
  };

  const handleDeletePhoto = (index, isExisting) => {
    if (!window.confirm("Bỏ ảnh này?")) return;
    if (isExisting) {
      setExistingPhotos(prev => prev.filter((_, i) => i !== index));
    } else {
      URL.revokeObjectURL(newPhotosPreview[index].url);
      setNewPhotos(prev => prev.filter((_, i) => i !== index));
      setNewPhotosPreview(prev => prev.filter((_, i) => i !== index));
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
    setIsSubmitting(true);

    try {
      let newlyUploadedPhotos = [];
      
      // 1. Upload ảnh mới nếu có (Giống Hotel)
      if (newPhotos.length > 0) {
        const options = { maxSizeMB: 0.8, maxWidthOrHeight: 1280, useWebWorker: true };
        const compressedFiles = await Promise.all(
          newPhotos.map(async (file) => {
            try { return await imageCompression(file, options); } catch { return file; }
          })
        );

        const uploadForm = new FormData();
        compressedFiles.forEach(file => uploadForm.append("photos", file));
        const uploadRes = await uploadBatch(uploadForm);
        newlyUploadedPhotos = uploadRes.data.data; 
      }

      // 2. Build Payload
      const payload = {
        name, type, maxPeople, status, desc, amenities,
        price: Number(price),
        discount: Number(discount),
        hotel: hotelId,
        photos: [...existingPhotos, ...newlyUploadedPhotos],
        cancellationPolicy: {
          freeCancelBeforeHours: Number(freeCancel),
          refundPercent: Number(refund)
        }
      };

      await updateRoom(roomId, payload);
      triggerToast("Cập nhật phòng thành công!");
      setTimeout(() => navigate(`/admin/hotels/${hotelId}/rooms`), 1000);
    } catch (err) {
      triggerToast(err.response?.data?.message || "Cập nhật thất bại", "error");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return <Box display="flex" justifyContent="center" mt={10}><CircularProgress color="#1C1B19" /></Box>;

  return (
    <Paper elevation={0} sx={{ maxWidth: 900, mx: "auto", p: 4, borderRadius: 3, border: "1px solid #E5E2DC" }}>
      <Stack spacing={4}>
        <Typography variant="h5" fontWeight={700}>Chỉnh sửa Phòng</Typography>
        
        <Grid container spacing={3}>
          <Grid item xs={12} md={7}>
            <Stack spacing={2.5}>
              <TextField label="Tên phòng" value={name} onChange={(e) => setName(e.target.value)} fullWidth />
              <Stack direction="row" spacing={2}>
                <TextField 
                  label="Giá (VNĐ)" type="number" value={price} 
                  onChange={(e) => setPrice(e.target.value)} fullWidth 
                />
                <TextField 
                  label="Giảm giá (%)" type="number" value={discount} 
                  onChange={(e) => setDiscount(e.target.value)} fullWidth 
                />
              </Stack>
              <Stack direction="row" spacing={2}>
                <TextField select label="Loại phòng" value={type} onChange={(e) => setType(e.target.value)} fullWidth>
                  <MenuItem value="single">Single</MenuItem>
                  <MenuItem value="double">Double</MenuItem>
                  <MenuItem value="suite">Suite</MenuItem>
                  <MenuItem value="family">Family</MenuItem>
                </TextField>
                <TextField label="Sức chứa" type="number" value={maxPeople} onChange={(e) => setMaxPeople(e.target.value)} fullWidth />
              </Stack>
              <TextField label="Mô tả" multiline rows={3} value={desc} onChange={(e) => setDesc(e.target.value)} fullWidth />
            </Stack>
          </Grid>

          <Grid item xs={12} md={5}>
            <Stack spacing={3}>
              <TextField select label="Trạng thái" value={status} onChange={(e) => setStatus(e.target.value)} fullWidth>
                <MenuItem value="active">Hoạt động</MenuItem>
                <MenuItem value="inactive">Tạm ngưng</MenuItem>
                <MenuItem value="maintenance">Bảo trì</MenuItem>
              </TextField>
              
              <Box sx={{ p: 2, bgcolor: "#F9F8F6", borderRadius: 2, border: "1px solid #eee" }}>
                <Typography variant="caption" fontWeight={700} display="block" mb={1}>CHÍNH SÁCH HỦY</Typography>
                <Stack spacing={2}>
                  <TextField label="Hủy miễn phí trước (giờ)" type="number" size="small" value={freeCancel} onChange={(e) => setFreeCancel(e.target.value)} />
                  <TextField label="Hoàn tiền (%)" type="number" size="small" value={refund} onChange={(e) => setRefund(e.target.value)} />
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Box>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>Tiện ích</Typography>
          <TextField 
            fullWidth size="small" placeholder="Thêm tiện ích (Enter)" 
            value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)}
            onKeyDown={(e) => {
                if(e.key === 'Enter') {
                    e.preventDefault();
                    if(newAmenity.trim() && !amenities.includes(newAmenity.trim())) {
                        setAmenities([...amenities, newAmenity.trim()]);
                        setNewAmenity("");
                    }
                }
            }}
          />
          <Stack direction="row" flexWrap="wrap" gap={1} mt={1}>
            {amenities.map(am => <Chip key={am} label={am} onDelete={() => setAmenities(amenities.filter(a => a !== am))} />)}
          </Stack>
        </Box>

        <Box>
          <Typography variant="subtitle2" fontWeight={700} mb={1}>Hình ảnh ({existingPhotos.length + newPhotosPreview.length})</Typography>
          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="room-photos" direction="horizontal">
              {(provided) => (
                <Box 
                    ref={provided.innerRef} {...provided.droppableProps}
                    sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, p: 2, border: '1px dashed #C2A56D', borderRadius: 2, bgcolor: '#FFFBF5', minHeight: 120 }}
                >
                  {existingPhotos.map((photo, i) => (
                    <Draggable key={photo.public_id} draggableId={photo.public_id} index={i}>
                      {(provided) => (
                        <Box ref={provided.innerRef} {...provided.draggableProps} {...provided.dragHandleProps} sx={{ position: "relative" }}>
                          <Box component="img" src={photo.url} sx={{ width: 100, height: 80, objectFit: "cover", borderRadius: 1.5, border: "2px solid #C2A56D" }} />
                          <IconButton onClick={() => handleDeletePhoto(i, true)} sx={{ position: "absolute", top: -8, right: -8, bgcolor: "error.main", color: "white", p: 0.2, "&:hover": {bgcolor: "error.dark"} }} size="small">
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {newPhotosPreview.map((photo, i) => (
                    <Box key={i} sx={{ position: "relative" }}>
                      <Box component="img" src={photo.url} sx={{ width: 100, height: 80, objectFit: "cover", borderRadius: 1.5, border: "2px dashed #4caf50" }} />
                      <IconButton onClick={() => handleDeletePhoto(i, false)} sx={{ position: "absolute", top: -8, right: -8, bgcolor: "error.main", color: "white", p: 0.2 }} size="small">
                        <CloseIcon sx={{ fontSize: 14 }} />
                      </IconButton>
                    </Box>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
          <Button variant="outlined" component="label" sx={{ mt: 2, textTransform: "none" }}>
            + Chọn thêm ảnh
            <input hidden multiple type="file" accept="image/*" onChange={handleFileChange} />
          </Button>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button onClick={() => navigate(-1)}>Hủy</Button>
          <Button 
            variant="contained" disabled={isSubmitting} onClick={handleSubmit}
            sx={{ bgcolor: "#1C1B19", color: "#C2A56D", px: 4, fontWeight: 700 }}
          >
            {isSubmitting ? <CircularProgress size={24} /> : "Lưu thay đổi"}
          </Button>
        </Stack>
      </Stack>

      <Snackbar open={snackbar.open} autoHideDuration={3000} onClose={() => setSnackbar({...snackbar, open: false})}>
        <Alert severity={snackbar.severity} variant="filled">{snackbar.message}</Alert>
      </Snackbar>
    </Paper>
  );
}