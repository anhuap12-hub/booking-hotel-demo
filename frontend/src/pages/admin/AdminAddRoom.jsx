import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createRoom } from "../../api/room.api";
import {
  TextField,
  Button,
  Select,
  MenuItem,
  Stack,
  InputLabel,
  FormControl,
  Box,
  Typography,
} from "@mui/material";

export default function AdminAddRoom() {
  const { hotelId } = useParams();
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    type: "single",
    price: "",
    maxPeople: 1,
    status: "Available",
  });

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    await createRoom(hotelId, {
      ...form,
      price: Number(form.price),
      maxPeople: Number(form.maxPeople),
    });
    navigate(`/admin/hotels/${hotelId}/rooms`);
  };

  return (
    <Box
      sx={{
        maxWidth: 440,
        mx: "auto",
        mt: 6,
        p: 4,
        bgcolor: "#F5F3EF",
        borderRadius: 2,
        border: "1px solid #E5E2DC",
      }}
    >
      <Typography
        fontSize={20}
        fontWeight={600}
        mb={3}
        sx={{ color: "#2B2B2B" }}
      >
        Add Room
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Room Name"
          name="name"
          value={form.name}
          onChange={handleChange}
          required
          fullWidth
          sx={{
            "& .MuiInputBase-root": { color: "#2B2B2B" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#CFC6BC",
            },
          }}
        />

        <FormControl fullWidth>
          <InputLabel sx={{ color: "#6B6B6B" }}>Type</InputLabel>
          <Select
            name="type"
            value={form.type}
            onChange={handleChange}
            sx={{
              color: "#2B2B2B",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#CFC6BC",
              },
            }}
          >
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="double">Double</MenuItem>
            <MenuItem value="suite">Suite</MenuItem>
          </Select>
        </FormControl>

        <TextField
          type="number"
          label="Price"
          name="price"
          value={form.price}
          onChange={handleChange}
          required
          fullWidth
          sx={{
            "& .MuiInputBase-root": { color: "#2B2B2B" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#CFC6BC",
            },
          }}
        />

        <TextField
          type="number"
          label="Max People"
          name="maxPeople"
          value={form.maxPeople}
          onChange={handleChange}
          required
          fullWidth
          sx={{
            "& .MuiInputBase-root": { color: "#2B2B2B" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#CFC6BC",
            },
          }}
        />

        <FormControl fullWidth>
          <InputLabel sx={{ color: "#6B6B6B" }}>Status</InputLabel>
          <Select
            name="status"
            value={form.status}
            onChange={handleChange}
            sx={{
              color: "#2B2B2B",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: "#CFC6BC",
              },
            }}
          >
            <MenuItem value="Available">Available</MenuItem>
            <MenuItem value="Booked">Booked</MenuItem>
          </Select>
        </FormControl>

        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            mt: 1,
            bgcolor: "#3E2C1C",
            color: "#fff",
            fontWeight: 600,
            textTransform: "none",
            "&:hover": {
              bgcolor: "#2F2116",
            },
          }}
        >
          Add Room
        </Button>
      </Stack>
    </Box>
  );
}
