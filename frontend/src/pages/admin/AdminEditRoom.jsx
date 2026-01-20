import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getRoomById, updateRoom } from "../../api/room.api";
import {
  Stack,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Typography,
  Box,
  IconButton,
  Paper,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

export default function AdminEditRoom() {
  const { roomId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "single",
    price: "",
    maxPeople: 1,
    status: "Available",
    hotel: "",
  });

  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  useEffect(() => {
    getRoomById(roomId).then((res) => {
      const room = res.data;
      setForm({
        name: room.name || "",
        type: room.type || "single",
        price: room.price ? room.price.toLocaleString("vi-VN") : "",
        maxPeople: room.maxPeople || 1,
        status: room.status || "Available",
        hotel:
          typeof room.hotel === "string"
            ? room.hotel
            : room.hotel?._id || "",
      });
      setExistingPhotos(room.photos || []);
    });
  }, [roomId]);

  const handleChange = (e) => {
    let { name, value } = e.target;
    if (name === "price") {
      value = value.replace(/\D/g, "");
      value = value ? Number(value).toLocaleString("vi-VN") : "";
    }
    setForm({ ...form, [name]: value });
  };

  const handleFileChange = (e) => {
    setPhotos(Array.from(e.target.files));
  };

  const handleDeletePhoto = (index, type = "new") => {
    type === "new"
      ? setPhotos((p) => p.filter((_, i) => i !== index))
      : setExistingPhotos((p) => p.filter((_, i) => i !== index));
  };

  const handleDragEnd = (result, type = "new") => {
    if (!result.destination) return;
    const items =
      type === "new" ? Array.from(photos) : Array.from(existingPhotos);
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
        `/upload/rooms/${roomId}`,
        uploadForm,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      uploadedUrls = uploadRes.data.urls;
    }

    await updateRoom(roomId, {
      ...form,
      price: Number(form.price.replace(/\./g, "")),
      maxPeople: Number(form.maxPeople),
      photos: [...existingPhotos, ...uploadedUrls],
    });

    // ✅ QUAY VỀ TRANG ROOM CỦA HOTEL
    navigate(`/admin/hotels/${form.hotel}/rooms`);

  } catch (err) {
    console.error(err.response?.data || err.message);
    alert("Lưu thay đổi thất bại");
  }
};


  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 760,
        mx: "auto",
        p: { xs: 3, md: 4 },
        borderRadius: 3,
        bgcolor: "#f5f3ef",
        border: "1px solid #d6d3cf",
      }}
    >
      <Stack spacing={4}>
        {/* Header */}
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Edit Room
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update room details & images
          </Typography>
        </Box>

        <Divider />

        {/* Form */}
        <Stack spacing={2}>
          <TextField
            label="Room Name"
            name="name"
            value={form.name}
            onChange={handleChange}
            fullWidth
          />
          <TextField
            label="Price (VND)"
            name="price"
            value={form.price}
            onChange={handleChange}
          />
          <TextField
            label="Max People"
            type="number"
            name="maxPeople"
            value={form.maxPeople}
            onChange={handleChange}
          />

          <FormControl>
            <InputLabel>Type</InputLabel>
            <Select name="type" value={form.type} onChange={handleChange}>
              <MenuItem value="single">Single</MenuItem>
              <MenuItem value="double">Double</MenuItem>
              <MenuItem value="suite">Suite</MenuItem>
            </Select>
          </FormControl>
        </Stack>

        {/* Existing Photos */}
        <Box>
          <Typography fontWeight={600} mb={1}>
            Existing Photos
          </Typography>

          <DragDropContext onDragEnd={(r) => handleDragEnd(r, "existing")}>
            <Droppable droppableId="existingPhotos" direction="horizontal">
              {(provided) => (
                <Stack
                  ref={provided.innerRef}
                  direction="row"
                  spacing={2}
                  {...provided.droppableProps}
                >
                  {existingPhotos.map((photo, i) => (
                    <Draggable key={i} draggableId={`ex-${i}`} index={i}>
                      {(provided) => (
                        <Box
                          ref={provided.innerRef}
                          {...provided.draggableProps}
                          {...provided.dragHandleProps}
                          sx={{ position: "relative" }}
                        >
                          <Box
                            component="img"
                            src={photo.url || photo}
                            sx={{
                              width: 120,
                              height: 90,
                              objectFit: "cover",
                              borderRadius: 2,
                            }}
                          />
                          <IconButton
                            size="small"
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "white",
                            }}
                            onClick={() =>
                              handleDeletePhoto(i, "existing")
                            }
                          >
                            <CloseIcon fontSize="small" />
                          </IconButton>
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

        {/* Actions */}
        <Stack direction="row" spacing={2} justifyContent="flex-end">
          <Button variant="outlined" component="label">
            Upload Photos
            <input hidden multiple type="file" onChange={handleFileChange} />
          </Button>

          <Button variant="contained" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
}
