import {
  Box,
  Typography,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Divider,
  RadioGroup,
  Radio,
  FormControl,
} from "@mui/material";
import { useFilter } from "../../context/FilterContext";

// Đồng bộ với các field trong Schema Room
const AMENITIES = [
  { id: "wifi", label: "Wifi miễn phí" },
  { id: "pool", label: "Hồ bơi" },
  { id: "parking", label: "Chỗ đậu xe" },
  { id: "gym", label: "Phòng Gym" },
  { id: "air_conditioning", label: "Điều hòa" },
  { id: "television", label: "Tivi" },
];

const ROOM_TYPES = ["Single", "Double", "Suite", "Deluxe", "Family"];

export default function RoomFilter() {
  const { filter, setFilter } = useFilter();

  // Format tiền VND
  const formatVND = (value) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(value);
  };

  return (
    <Box
      p={3}
      bgcolor="#fff"
      borderRadius={3}
      border="1px solid #eee"
      sx={{
        position: "sticky",
        top: 100,
        boxShadow: "0 2px 12px rgba(0,0,0,0.04)",
      }}
    >
      <Typography variant="h6" fontWeight={700} mb={3}>
        Bộ lọc tìm kiếm
      </Typography>

      {/* 1. LỌC THEO GIÁ (Schema: price) */}
      <Box mb={4}>
        <Typography fontSize={14} fontWeight={600} gutterBottom>
          Giá mỗi đêm: {formatVND(filter.price)}
        </Typography>
        <Slider
          value={filter.price}
          onChange={(_, v) => setFilter((prev) => ({ ...prev, price: v }))}
          min={0}
          max={10000000}
          step={500000}
          valueLabelDisplay="auto"
          sx={{ color: "primary.main" }}
        />
        <Box display="flex" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">0 ₫</Typography>
          <Typography variant="caption" color="text.secondary">10tr+ ₫</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 2. LOẠI PHÒNG (Schema: type) */}
      <Box mb={3}>
        <Typography fontSize={14} fontWeight={600} mb={1}>
          Loại phòng
        </Typography>
        <FormControl>
          <RadioGroup
            value={filter.type || "all"}
            onChange={(e) => setFilter((prev) => ({ ...prev, type: e.target.value }))}
          >
            <FormControlLabel value="all" control={<Radio size="small" />} label="Tất cả loại phòng" />
            {ROOM_TYPES.map((t) => (
              <FormControlLabel 
                key={t} 
                value={t} 
                control={<Radio size="small" />} 
                label={t} 
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 3. SỐ KHÁCH (Schema: maxPeople) */}
      <Box mb={3}>
        <Typography fontSize={14} fontWeight={600} mb={1}>
          Số lượng khách
        </Typography>
        <Slider
          value={filter.maxPeople || 1}
          onChange={(_, v) => setFilter((prev) => ({ ...prev, maxPeople: v }))}
          min={1}
          max={10}
          marks
          valueLabelDisplay="auto"
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* 4. TIỆN NGHI (Schema: amenities) */}
      <Box>
        <Typography fontSize={14} fontWeight={600} mb={1}>
          Tiện ích đi kèm
        </Typography>
        <FormGroup>
          {AMENITIES.map((a) => (
            <FormControlLabel
              key={a.id}
              control={
                <Checkbox
                  size="small"
                  checked={filter.amenities.includes(a.id)}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      amenities: e.target.checked
                        ? [...prev.amenities, a.id]
                        : prev.amenities.filter((x) => x !== a.id),
                    }))
                  }
                />
              }
              label={<Typography fontSize={14}>{a.label}</Typography>}
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
}