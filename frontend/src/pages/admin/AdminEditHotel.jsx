import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import {
  Stack,
  TextField,
  Typography,
  Button,
  Paper,
  IconButton,
  Box,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

const AdminEditHotel = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [desc, setDesc] = useState(""); // ✅ schema desc
  const [photos, setPhotos] = useState([]);
  const [existingPhotos, setExistingPhotos] = useState([]);

  useEffect(() => {
    const fetchHotel = async () => {
      const res = await axios.get(`/hotels/${id}`);
      const hotel = res.data.data;

      setName(hotel.name || "");
      setCity(hotel.city || "");
      setAddress(hotel.address || "");
      setDesc(hotel.desc || "");
      setExistingPhotos(hotel.photos || []);
    };

    fetchHotel();
  }, [id]);

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
          `/upload/hotels/${id}`,
          uploadForm,
          { headers: { "Content-Type": "multipart/form-data" } }
        );

        uploadedUrls = uploadRes.data.urls;
      }

      await axios.put(`/admin/hotels/${id}`, {
        name,
        city,
        address,
        desc, // ✅ đúng schema
        photos: [...existingPhotos, ...uploadedUrls],
      });

      navigate("/admin/hotels");
    } catch (err) {
      console.error(err.response?.data || err.message);
    }
  };

  return (
    <Paper
      elevation={0}
      sx={{
        maxWidth: 720,
        mx: "auto",
        p: 4,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack spacing={4}>
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Edit Hotel
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Update hotel information and images
          </Typography>
        </Box>

        <Divider />

        <Stack spacing={2}>
          <TextField
            label="Hotel Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            fullWidth
          />

          <TextField
            label="City"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            fullWidth
          />

          <TextField
            label="Address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            fullWidth
          />

          {/* ✅ DESC */}
          <TextField
            label="Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            fullWidth
            multiline
            minRows={4}
            placeholder="Mô tả khách sạn, tiện ích, vị trí..."
          />
        </Stack>

        {/* EXISTING PHOTOS */}
        <Box>
          <Typography variant="subtitle1" fontWeight={600} mb={1}>
            Existing Photos
          </Typography>

          <DragDropContext onDragEnd={(r) => handleDragEnd(r, "existing")}>
            <Droppable droppableId="existingPhotos" direction="horizontal">
              {(provided) => (
                <Stack
                  ref={provided.innerRef}
                  direction="row"
                  spacing={2}
                  flexWrap="wrap"
                  {...provided.droppableProps}
                >
                  {existingPhotos.map((photo, i) => (
                    <Draggable
                      key={i}
                      draggableId={`existing-${i}`}
                      index={i}
                    >
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
                              width: 110,
                              height: 80,
                              objectFit: "cover",
                              borderRadius: 2,
                              border: "1px solid",
                              borderColor: "divider",
                            }}
                          />

                          <IconButton
                            size="small"
                            onClick={() =>
                              handleDeletePhoto(i, "existing")
                            }
                            sx={{
                              position: "absolute",
                              top: 4,
                              right: 4,
                              bgcolor: "rgba(255,255,255,0.85)",
                            }}
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

        {/* NEW PHOTOS */}
        {photos.length > 0 && (
          <Box>
            <Typography variant="subtitle1" fontWeight={600} mb={1}>
              New Photos
            </Typography>

            <DragDropContext onDragEnd={(r) => handleDragEnd(r, "new")}>
              <Droppable droppableId="newPhotos" direction="horizontal">
                {(provided) => (
                  <Stack
                    ref={provided.innerRef}
                    direction="row"
                    spacing={2}
                    flexWrap="wrap"
                    {...provided.droppableProps}
                  >
                    {photos.map((file, i) => (
                      <Draggable key={i} draggableId={`new-${i}`} index={i}>
                        {(provided) => (
                          <Box
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                            {...provided.dragHandleProps}
                            sx={{ position: "relative" }}
                          >
                            <Box
                              component="img"
                              src={URL.createObjectURL(file)}
                              sx={{
                                width: 110,
                                height: 80,
                                objectFit: "cover",
                                borderRadius: 2,
                                border: "1px solid",
                                borderColor: "divider",
                              }}
                            />

                            <IconButton
                              size="small"
                              onClick={() => handleDeletePhoto(i, "new")}
                              sx={{
                                position: "absolute",
                                top: 4,
                                right: 4,
                                bgcolor: "rgba(255,255,255,0.85)",
                              }}
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
        )}

        <Stack direction="row" spacing={2}>
          <Button variant="outlined" component="label">
            Upload Photos
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>

          <Button variant="contained" onClick={handleSubmit}>
            Save Changes
          </Button>
        </Stack>
      </Stack>
    </Paper>
  );
};

export default AdminEditHotel;
