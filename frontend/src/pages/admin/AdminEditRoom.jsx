import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById, updateRoom } from "../../api/room.api";
import axios from "../../api/axios";

import {
  Stack, TextField, Button, Select, MenuItem, InputLabel, FormControl,
  Typography, Box, Paper, Divider, Chip, Grid, InputAdornment, IconButton,
  Dialog, DialogTitle, DialogContent, DialogActions, CircularProgress
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function AdminEditRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "single",
    price: "",
    maxPeople: 1,
    discount: "",
    status: "active",
    desc: "",
    hotel: "",
    freeCancelBeforeHours: 24,
    refundPercent: 100
  });

  // Khởi tạo là mảng rỗng để tránh lỗi "n is not iterable"
  const [amenities, setAmenities] = useState([]);
  const [newAmenity, setNewAmenity] = useState("");
  const [existingPhotos, setExistingPhotos] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // State cho Confirm Dialog
  const [openConfirm, setOpenConfirm] = useState(false);
  const [deleteTarget, setDeleteTarget] = useState({ type: "", index: null, value: "" });

  useEffect(() => {
    getRoomById(roomId)
      .then((res) => {
        const room = res.data;
        setForm({
          name: room.name || "",
          type: room.type || "single",
          price: room.price ? room.price.toLocaleString("vi-VN") : "",
          maxPeople: room.maxPeople || 1,
          discount: room.discount !== null ? room.discount : "",
          status: room.status || "active",
          desc: room.desc || "",
          hotel: typeof room.hotel === "string" ? room.hotel : room.hotel?._id || "",
          freeCancelBeforeHours: room.cancellationPolicy?.freeCancelBeforeHours || 24,
          refundPercent: room.cancellationPolicy?.refundPercent || 100,
        });
        setAmenities(room.amenities || []);
        setExistingPhotos(room.photos || []);
      })
      .catch(err => console.error("Fetch room error:", err))
      .finally(() => setLoading(false));
  }, [roomId]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "price") {
      value = value.replace(/\D/g, "");
      value = value ? Number(value).toLocaleString("vi-VN") : "";
    }
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // --- Xử lý Ảnh ---
  const handleFileChange = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    const uploadForm = new FormData();
    files.forEach((file) => uploadForm.append("photos", file));

    try {
      const res = await axios.post(`/upload/rooms/${roomId}`, uploadForm, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      // Đảm bảo lấy đúng key 'data' từ Backend (Object {url, public_id})
      const newUploadedPhotos = res.data.data || res.data.urls;
      setExistingPhotos(prev => [...newUploadedPhotos, ...prev]);
    } catch (err) {
      console.error(err);
      alert("Upload ảnh thất bại");
    }
  };

  const handleDragEnd = (result) => {
    if (!result.destination || !Array.isArray(existingPhotos)) return;
    const items = Array.from(existingPhotos);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setExistingPhotos(items);
  };

  // --- Xử lý Amenities ---
  const handleAddAmenity = () => {
    const val = newAmenity.trim();
    if (val && !amenities.includes(val)) {
      setAmenities([...amenities, val]);
      setNewAmenity("");
    }
  };

  // --- Logic Xác nhận Xóa ---
  const requestDelete = (type, index = null, value = "") => {
    setDeleteTarget({ type, index, value });
    setOpenConfirm(true);
  };

  const handleConfirmDelete = () => {
    if (deleteTarget.type === "photo") {
      setExistingPhotos(prev => prev.filter((_, i) => i !== deleteTarget.index));
    } else if (deleteTarget.type === "amenity") {
      setAmenities(prev => prev.filter((am) => am !== deleteTarget.value));
    }
    setOpenConfirm(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const payload = {
        name: form.name,
        type: form.type,
        price: Number(form.price.toString().replace(/\./g, "")),
        maxPeople: Number(form.maxPeople),
        discount: form.discount === "" ? null : Number(form.discount),
        status: form.status,
        desc: form.desc,
        amenities: amenities,
        photos: existingPhotos, // Gửi mảng Object [{url, public_id}]
        cancellationPolicy: {
          freeCancelBeforeHours: Number(form.freeCancelBeforeHours),
          refundPercent: Number(form.refundPercent)
        },
        hotel: form.hotel
      };

      await updateRoom(roomId, payload);
      navigate(`/admin/hotels/${form.hotel}/rooms`);
    } catch (err) {
      console.error(err);
      alert("Cập nhật thất bại");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) return (
    <Box display="flex" justifyContent="center" py={10}><CircularProgress color="inherit" /></Box>
  );

  return (
    <Paper elevation={0} sx={{ maxWidth: 1000, mx: "auto", p: 4, borderRadius: 4, border: "1px solid #E5E2DC" }}>
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" fontWeight={800}>Chỉnh sửa chi tiết phòng</Typography>
          <Typography variant="body2" color="text.secondary">Mã phòng: {roomId}</Typography>
        </Box>

        <Divider />

        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Typography variant="subtitle2" fontWeight={700} color="primary">THÔNG TIN CƠ BẢN</Typography>
              <TextField label="Tên phòng" name="name" value={form.name} onChange={handleChange} fullWidth required />
              
              <Stack direction="row" spacing={2}>
                <TextField 
                  label="Giá (VNĐ)" name="price" value={form.price} onChange={handleChange} fullWidth
                  InputProps={{ endAdornment: <InputAdornment position="end">/đêm</InputAdornment> }}
                />
                <TextField 
                  label="Giảm giá (%)" name="discount" type="number" value={form.discount} onChange={handleChange} fullWidth 
                />
              </Stack>

              <Stack direction="row" spacing={2}>
                <FormControl fullWidth>
                  <InputLabel>Loại</InputLabel>
                  <Select name="type" value={form.type} label="Loại" onChange={handleChange}>
                    <MenuItem value="single">Single</MenuItem>
                    <MenuItem value="double">Double</MenuItem>
                    <MenuItem value="suite">Suite</MenuItem>
                  </Select>
                </FormControl>
                <TextField label="Sức chứa" name="maxPeople" type="number" value={form.maxPeople} onChange={handleChange} fullWidth />
              </Stack>

              <FormControl fullWidth>
                <InputLabel>Trạng thái</InputLabel>
                <Select name="status" value={form.status} label="Trạng thái" onChange={handleChange}>
                  <MenuItem value="active">Active (Sẵn sàng)</MenuItem>
                  <MenuItem value="inactive">Inactive (Ngừng bán)</MenuItem>
                  <MenuItem value="maintenance">Maintenance (Bảo trì)</MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>

          <Grid item xs={12} md={6}>
            <Stack spacing={3}>
              <Typography variant="subtitle2" fontWeight={700} color="primary">TIỆN NGHI & CHÍNH SÁCH</Typography>
              <TextField label="Mô tả" name="desc" multiline rows={3} value={form.desc} onChange={handleChange} fullWidth />
              
              <Box>
                <Typography variant="caption" fontWeight={700} gutterBottom display="block">TIỆN ÍCH (AMENITIES)</Typography>
                <Stack direction="row" spacing={1} mb={1}>
                  <TextField 
                    size="small" fullWidth placeholder="Nhấn Enter để thêm nhanh" 
                    value={newAmenity} onChange={(e) => setNewAmenity(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), handleAddAmenity())}
                  />
                  <Button variant="contained" onClick={handleAddAmenity} sx={{ bgcolor: "#333" }}>Add</Button>
                </Stack>
                <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                  {amenities.map((am) => (
                    <Chip key={am} label={am} size="small" onDelete={() => requestDelete("amenity", null, am)} />
                  ))}
                </Box>
              </Box>

              <Box sx={{ p: 2, bgcolor: "#F9F8F6", borderRadius: 2 }}>
                <Typography variant="caption" fontWeight={700} display="block" mb={1}>CANCELLATION POLICY</Typography>
                <Stack direction="row" spacing={2}>
                  <TextField 
                    label="Free cancel (hours)" type="number" size="small"
                    name="freeCancelBeforeHours" value={form.freeCancelBeforeHours} onChange={handleChange}
                  />
                  <TextField 
                    label="Refund (%)" type="number" size="small"
                    name="refundPercent" value={form.refundPercent} onChange={handleChange}
                  />
                </Stack>
              </Box>
            </Stack>
          </Grid>
        </Grid>

        <Divider />

        <Box>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography fontWeight={700}>Hình ảnh phòng ({existingPhotos.length})</Typography>
            <Button variant="outlined" component="label" startIcon={<CloudUploadIcon />}>
              Tải ảnh lên
              <input hidden multiple type="file" accept="image/*" onChange={handleFileChange} />
            </Button>
          </Stack>

          <DragDropContext onDragEnd={handleDragEnd}>
            <Droppable droppableId="room-photos" direction="horizontal">
              {(provided) => (
                <Box
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', minHeight: 100, p: 1, bgcolor: '#fbfbfb', borderRadius: 2 }}
                >
                  {existingPhotos && existingPhotos.map((photo, index) => (
                    <Draggable key={photo.public_id || `img-${index}`} draggableId={photo.public_id || `img-${index}`} index={index}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ position: 'relative', width: 150, height: 110 }}
                        >
                          <Box
                            component="img"
                            src={photo.url}
                            sx={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 2, border: '2px solid #eee' }}
                          />
                          <IconButton
                            size="small"
                            onClick={() => requestDelete("photo", index)}
                            sx={{ position: 'absolute', top: -10, right: -10, bgcolor: 'error.main', color: 'white', '&:hover': { bgcolor: 'error.dark' } }}
                          >
                            <CloseIcon sx={{ fontSize: 14 }} />
                          </IconButton>
                        </Box>
                      )}
                    </Draggable>
                  ))}
                  {provided.placeholder}
                </Box>
              )}
            </Droppable>
          </DragDropContext>
        </Box>

        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="text" color="inherit" onClick={() => navigate(-1)}>Hủy</Button>
          <Button 
            variant="contained" 
            disabled={isSubmitting} 
            onClick={handleSubmit}
            sx={{ px: 4, bgcolor: "#1C1B19", color: "#C2A56D", fontWeight: 700, "&:hover": { bgcolor: "#000" } }}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu thay đổi"}
          </Button>
        </Stack>
      </Stack>

      <Dialog open={openConfirm} onClose={() => setOpenConfirm(false)}>
        <DialogTitle sx={{ fontWeight: 700 }}>Xác nhận xóa?</DialogTitle>
        <DialogContent>
          <Typography variant="body2">
            Bạn có chắc chắn muốn xóa {deleteTarget.type === "photo" ? "hình ảnh này" : `tiện ích "${deleteTarget.value}"`} không? 
            Hành động này sẽ xóa khỏi danh sách hiện tại nhưng chỉ được áp dụng vĩnh viễn sau khi bạn nhấn "Lưu thay đổi".
          </Typography>
        </DialogContent>
        <DialogActions sx={{ p: 2 }}>
          <Button onClick={() => setOpenConfirm(false)} color="inherit">Hủy</Button>
          <Button onClick={handleConfirmDelete} variant="contained" color="error">Xóa ngay</Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
}