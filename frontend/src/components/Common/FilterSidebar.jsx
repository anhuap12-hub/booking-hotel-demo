import { Box, Typography, Slider, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, Divider, Paper } from "@mui/material";

export default function FilterSidebar({ filters = {}, setFilters, cities = [], amenities = [] }) {
  // Danh sách loại hình cố định (Bạn có thể thay đổi danh sách này tùy theo dữ liệu của bạn)
  const AVAILABLE_TYPES = ["hotel", "apartment", "resort", "villa"];

  const minPrice = Number(filters?.minPrice) || 0;
  const maxPrice = Number(filters?.maxPrice) || 10000000;
  const currentCity = filters?.city || "";
  const selectedTypes = filters?.types ?? []; 
  const selectedAmenities = filters?.amenities ?? [];

  const primaryColor = "#0056b3"; 

  return (
    <Paper elevation={0} sx={{ p: 2, borderRadius: 3, border: "1px solid #e7e7e7", bgcolor: "#fff" }}>
      <Typography fontSize={16} fontWeight={700} mb={2}>Bộ lọc tìm kiếm</Typography>
      <Divider sx={{ mb: 2 }} />

      {/* 1. LOẠI CHỖ NGHỈ */}
      <Box mb={4}>
        <Typography fontSize={13} fontWeight={600} mb={1}>Loại chỗ nghỉ</Typography>
        <FormGroup>
          {AVAILABLE_TYPES.map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  size="small"
                  checked={selectedTypes.includes(type)}
                  onChange={(e) => {
                    const newTypes = e.target.checked
                      ? [...selectedTypes, type]
                      : selectedTypes.filter((t) => t !== type);
                    setFilters((prev) => ({ ...prev, types: newTypes }));
                  }}
                  sx={{ "&.Mui-checked": { color: primaryColor } }}
                />
              }
              // Dùng textTransform: 'capitalize' để hiển thị đẹp mà vẫn giữ giá trị gốc
              label={<Typography fontSize={13} sx={{ textTransform: 'capitalize' }}>{type}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>

      {/* 2. KHOẢNG GIÁ */}
      <Box mb={4}>
        <Typography fontSize={13} fontWeight={600} mb={1}>Khoảng giá / đêm</Typography>
        <Slider
          value={[minPrice, maxPrice]}
          onChange={(_, newValue) => setFilters((prev) => ({ ...prev, minPrice: newValue[0], maxPrice: newValue[1] }))}
          valueLabelDisplay="auto"
          min={0}
          max={10000000}
          step={500000}
          sx={{ color: primaryColor, mb: 1 }}
        />
        <Box display="flex" justifyContent="space-between">
          <Typography fontSize={12}>{minPrice.toLocaleString()}đ</Typography>
          <Typography fontSize={12}>{maxPrice.toLocaleString()}đ</Typography>
        </Box>
      </Box>

      {/* 3. THÀNH PHỐ */}
      <Box mb={4}>
        <Typography fontSize={13} fontWeight={600} mb={1}>Thành phố</Typography>
        <Select
          fullWidth
          size="small"
          value={currentCity}
          onChange={(e) => setFilters((prev) => ({ ...prev, city: e.target.value }))}
          displayEmpty
          sx={{ borderRadius: "8px" }}
        >
          <MenuItem value="">Tất cả thành phố</MenuItem>
          {cities.map((city) => (
            <MenuItem key={city} value={city}>{city}</MenuItem>
          ))}
        </Select>
      </Box>

      {/* 4. TIỆN NGHI */}
      <Box>
        <Typography fontSize={13} fontWeight={600} mb={1}>Tiện nghi</Typography>
        <FormGroup>
          {amenities.map((a) => (
            <FormControlLabel
              key={a}
              control={
                <Checkbox
                  size="small"
                  checked={selectedAmenities.includes(a)}
                  onChange={(e) => {
                    const newAmenities = e.target.checked
                      ? [...selectedAmenities, a]
                      : selectedAmenities.filter((item) => item !== a);
                    setFilters((prev) => ({ ...prev, amenities: newAmenities }));
                  }}
                  sx={{ "&.Mui-checked": { color: primaryColor } }}
                />
              }
              label={<Typography fontSize={13}>{a}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>
    </Paper>
  );
}