import {
  Box,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Select,
  MenuItem,
} from "@mui/material";

export default function FilterSidebar({
  filters,
  setFilters,
  cities = [],
  amenities = [],
}) {
  const price = filters.priceRange || [0, 2_000_000];
  const types = filters.types || [];
  const selectedAmenities = filters.amenities || [];

  return (
    <Box width="100%">
      <Typography fontSize={14} fontWeight={700} mb={1}>
        Bộ lọc
      </Typography>

      {/* PRICE */}
      <Box mb={1.2}>
        <Typography fontSize={12}>Giá / đêm</Typography>
        <Slider
          size="small"
          value={price}
          min={0}
          max={2_000_000}
          step={50_000}
          onChange={(_, v) =>
            setFilters((f) => ({ ...f, priceRange: v }))
          }
        />
        <Typography fontSize={11}>
          {price[0].toLocaleString()} – {price[1].toLocaleString()}
        </Typography>
      </Box>

      {/* CITY */}
      <Box mb={1.2}>
        <Typography fontSize={12}>Thành phố</Typography>
        <Select
          fullWidth
          size="small"
          value={filters.city || ""}
          displayEmpty
          onChange={(e) =>
            setFilters((f) => ({ ...f, city: e.target.value }))
          }
        >
          <MenuItem value="">Tất cả thành phố</MenuItem>
          {cities.map((c) => (
            <MenuItem key={c} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </Box>

      {/* TYPE */}
      <Box mb={1.2}>
        <Typography fontSize={12}>Loại chỗ ở</Typography>
        <FormGroup>
          {["hotel", "apartment", "resort"].map((type) => (
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
              label={<Typography fontSize={12}>{type}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>

      {/* AMENITIES */}
      <Box>
        <Typography fontSize={12}>Tiện nghi</Typography>
        <FormGroup>
          {amenities.map((a) => (
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
              label={<Typography fontSize={12}>{a}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
}
