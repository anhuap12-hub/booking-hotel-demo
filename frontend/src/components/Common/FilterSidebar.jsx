import { Box, Typography, Slider, FormGroup, FormControlLabel, Checkbox, Select, MenuItem, Divider, Stack } from "@mui/material";

export default function FilterSidebar({ filters = {}, setFilters, cities = [], amenities = [] }) {
  const types = filters?.types ?? [];
  const selectedAmenities = filters?.amenities ?? [];
  const currentCity = filters?.city ?? "";
  const currentPriceRange = [Number(filters?.minPrice) || 0, Number(filters?.maxPrice) || 10000000];

  const safeSetFilters = (updater) => {
    if (typeof setFilters === "function") {
      setFilters(updater);
    }
  };

  return (
    <Box width="100%" sx={{ p: 0.5 }}>
      <Typography fontSize={16} fontWeight={800} mb={2} color="#C2A56D">Bộ lọc tìm kiếm</Typography>
      <Divider sx={{ mb: 2 }} />

      {/* KHOẢNG GIÁ - Đã sửa onChange thành onChangeCommitted để chống lag */}
      <Box mb={4}>
        <Typography fontSize={13} fontWeight={700} gutterBottom>Khoảng giá / đêm</Typography>
        <Box sx={{ px: 1 }}>
          <Slider
            size="small"
            defaultValue={currentPriceRange}
            value={currentPriceRange}
            min={0} max={10000000} step={100000}
            // Dùng onChangeCommitted để chỉ lọc khi người dùng thả tay, tránh lag máy
            onChangeCommitted={(_, v) => safeSetFilters((f) => ({ ...f, minPrice: v[0], maxPrice: v[1] }))}
            // Vẫn giữ onChange để hiển thị con số chạy theo tay người dùng
            onChange={(_, v) => safeSetFilters((f) => ({ ...f, minPrice: v[0], maxPrice: v[1] }))}
            valueLabelDisplay="auto"
            valueLabelFormat={(v) => `${(v / 1000000).toFixed(1)}M`}
            sx={{ color: "#C2A56D" }}
          />
        </Box>
        <Stack direction="row" justifyContent="space-between">
          <Typography fontSize={11} color="text.secondary">{currentPriceRange[0].toLocaleString()}đ</Typography>
          <Typography fontSize={11} color="text.secondary">{currentPriceRange[1].toLocaleString()}đ</Typography>
        </Stack>
      </Box>

      {/* THÀNH PHỐ */}
      <Box mb={4}>
        <Typography fontSize={13} fontWeight={700} gutterBottom>Thành phố</Typography>
        <Select
          fullWidth size="small" value={currentCity} displayEmpty
          onChange={(e) => safeSetFilters((f) => ({ ...f, city: e.target.value }))}
          sx={{ 
            fontSize: 13, 
            borderRadius: "10px",
            "& .MuiOutlinedInput-notchedOutline": { borderColor: "rgba(194, 165, 109, 0.3)" },
            "&:hover .MuiOutlinedInput-notchedOutline": { borderColor: "#C2A56D" },
            "&.Mui-focused .MuiOutlinedInput-notchedOutline": { borderColor: "#C2A56D" }
          }}
        >
          <MenuItem value="" sx={{ fontSize: 13 }}>Tất cả thành phố</MenuItem>
          {cities.map((c) => (<MenuItem key={c} value={c} sx={{ fontSize: 13 }}>{c}</MenuItem>))}
        </Select>
      </Box>

      {/* LOẠI CHỖ Ở */}
      <Box mb={4}>
        <Typography fontSize={13} fontWeight={700} gutterBottom>Loại chỗ ở</Typography>
        <FormGroup>
          {["hotel", "apartment", "resort", "villa"].map((type) => (
            <FormControlLabel
              key={type}
              control={
                <Checkbox
                  size="small" checked={types.includes(type)}
                  sx={{ color: "rgba(194, 165, 109, 0.5)", "&.Mui-checked": { color: "#C2A56D" } }}
                  onChange={(e) => safeSetFilters((f) => ({
                    ...f,
                    types: e.target.checked ? [...types, type] : types.filter((t) => t !== type),
                  }))}
                />
              }
              label={<Typography fontSize={13} sx={{ textTransform: 'capitalize' }}>{type}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>

      {/* TIỆN NGHI */}
      <Box>
        <Typography fontSize={13} fontWeight={700} gutterBottom>Tiện nghi</Typography>
        <FormGroup sx={{ maxHeight: 300, overflowY: 'auto', pr: 1 }}> 
          {/* Thêm scrollbar nếu quá nhiều tiện nghi */}
          {amenities.length > 0 ? (
            amenities.map((a, index) => (
              <FormControlLabel
                key={`${a}-${index}`} // Key an toàn hơn
                control={
                  <Checkbox
                    size="small" checked={selectedAmenities.includes(a)}
                    sx={{ color: "rgba(194, 165, 109, 0.5)", "&.Mui-checked": { color: "#C2A56D" } }}
                    onChange={(e) => safeSetFilters((f) => ({
                      ...f,
                      amenities: e.target.checked ? [...selectedAmenities, a] : selectedAmenities.filter((x) => x !== a),
                    }))}
                  />
                }
                label={<Typography fontSize={13}>{a}</Typography>}
              />
            ))
          ) : (
            <Typography fontSize={11} color="text.secondary" sx={{ fontStyle: 'italic', mt: 1 }}>
              Đang cập nhật tiện nghi...
            </Typography>
          )}
        </FormGroup>
      </Box>
    </Box>
  );
}