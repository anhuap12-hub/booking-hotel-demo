import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../../api/axios";
import { TextField, Button, Typography, Stack, Box } from "@mui/material";

const AdminAddHotel = () => {
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [address, setAddress] = useState("");
  const [cheapestPrice, setCheapestPrice] = useState("");
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  const handleFileChange = (e) => setImages(Array.from(e.target.files));

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append("name", name);
    formData.append("city", city);
    formData.append("address", address);
    formData.append("cheapestPrice", cheapestPrice);
    images.forEach((img) => formData.append("images", img));

    await axios.post("/hotels/create", formData);
    navigate("/admin/hotels");
  };

  return (
    <Box
      sx={{
        maxWidth: 520,
        mx: "auto",
        mt: 6,
        p: 4,
        bgcolor: "#F5F3EF",
        borderRadius: 2,
        border: "1px solid #E0DAD3",
      }}
    >
      <Typography
        fontSize={20}
        fontWeight={600}
        mb={3}
        sx={{ color: "#2B2B2B" }}
      >
        Add Hotel
      </Typography>

      <Stack spacing={3}>
        <TextField
          label="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
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
          label="City"
          value={city}
          onChange={(e) => setCity(e.target.value)}
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
          label="Address"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
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
          label="Cheapest Price"
          value={cheapestPrice}
          onChange={(e) => setCheapestPrice(e.target.value)}
          required
          fullWidth
          sx={{
            "& .MuiInputBase-root": { color: "#2B2B2B" },
            "& .MuiOutlinedInput-notchedOutline": {
              borderColor: "#CFC6BC",
            },
          }}
        />

        <Box>
          <Button
            variant="outlined"
            component="label"
            sx={{
              textTransform: "none",
              color: "#4B3621",
              borderColor: "#B8A99A",
              "&:hover": {
                borderColor: "#6F4E37",
                bgcolor: "rgba(111,78,55,0.05)",
              },
            }}
          >
            Upload Images
            <input type="file" hidden multiple onChange={handleFileChange} />
          </Button>

          {images.length > 0 && (
            <Typography fontSize={13} mt={1} sx={{ color: "#6B6B6B" }}>
              {images.length} file(s) selected
            </Typography>
          )}
        </Box>

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
          Create
        </Button>
      </Stack>
    </Box>
  );
};

export default AdminAddHotel;
