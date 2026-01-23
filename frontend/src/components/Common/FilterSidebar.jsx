import {
  Box,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
  Divider,
  Stack
} from "@mui/material";

export default function FilterSidebar({
  filters = {}, // Mặc định là object rỗng để tránh lỗi undefined
  setFilters,
  cities = [],
  amenities = [],
}) {
  // Trích xuất an toàn các giá trị từ filters
  const price = filters?.priceRange || [0, 2000000];
  const types = filters?.types || [];
  const selectedAmenities = filters?.amenities || [];
  const currentCity = filters?.city || "";

  return (
    <Box width="100%" sx={{ p: 0.5 }}>
      <Typography fontSize={16} fontWeight={800} mb={2} color="primary.main">
        Bộ lọc tìm kiếm
      </Typography>

      <Divider sx={{ mb: 2 }} />

      {/* PRICE RANGE */}
      <Box mb={3}>
        <Typography fontSize={13} fontWeight={700} gutterBottom>
          Khoảng giá / đêm
        </Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            size="small"
            value={price}
            min={0}
            max={5000000} // Tăng max lên cho thực tế hơn
            step={100000}
            onChange={(_, v) =>
              setFilters((f) => ({ ...f, priceRange: v }))
            }
            valueLabelDisplay="auto"
          />
        </Box>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize={11} color="text.secondary">
            {price[0].toLocaleString()}đ
          </Typography>
          <Typography fontSize={11} color="text.secondary">
            {price[1].toLocaleString()}đ
          </Typography>
        </Stack>
      </Box>

      {/* CITY SELECTION */}
      <Box mb={3}>
        <Typography fontSize={13} fontWeight={700} gutterBottom>
          Thành phố
        </Typography>
        <Select
          fullWidth
          size="small"
          value={currentCity}
          displayEmpty
          onChange={(e) =>
            setFilters((f) => ({ ...f, city: e.target.value }))
          }
          sx={{ fontSize: 13 }}
        >
          <MenuItem value="" sx={{ fontSize: 13 }}>Tất cả thành phố</MenuItem>
          {cities.map((c) => (
            <MenuItem key={c} value={c} sx={{ fontSize: 13 }}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* ACCOMMODATION TYPE */}
      <Box mb={3}>
        <Typography fontSize={13} fontWeight={700} gutterBottom>
          Loại chỗ ở
        </Typography>
        <FormGroup>
          {["hotel", "apartment", "resort", "villa"].map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  size="small"
                  checked={types.includes(type)}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      types: e.target.checked
                        ? [...types, type]
                        : types.filter((t) => t !== type),
                    }))
                  }
                />
              }
              label={
                <Typography fontSize={13} sx={{ textTransform: 'capitalize' }}>
                  {type}
                </Typography>
              }
            />
          ))}
        </FormGroup>
      </Box>

      {/* AMENITIES */}
      <Box>
        <Typography fontSize={13} fontWeight={700} gutterBottom>
          Tiện nghi phổ biến
        </Typography>
        <FormGroup>
          {amenities.slice(0, 10).map((a) => ( // Giới hạn hiển thị 10 cái cho gọn
            <FormControlLabel
              key={a}
              control={
                <Checkbox
                  size="small"
                  checked={selectedAmenities.includes(a)}
                  onChange={(e) =>
                    setFilters((f) => ({
                      ...f,
                      amenities: e.target.checked
                        ? [...selectedAmenities, a]
                        : selectedAmenities.filter((x) => x !== a),
                    }))
                  }
                />
              }
              label={<Typography fontSize={13}>{a}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
}