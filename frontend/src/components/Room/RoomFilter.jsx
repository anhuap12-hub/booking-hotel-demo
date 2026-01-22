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

/* ===== CONSTANTS ===== */
const AMENITIES = [
  { id: "wifi", label: "Wifi miễn phí" },
  { id: "pool", label: "Hồ bơi" },
  { id: "parking", label: "Chỗ đậu xe" },
  { id: "gym", label: "Phòng Gym" },
  { id: "air_conditioning", label: "Điều hòa" },
  { id: "television", label: "Tivi" },
];

const ROOM_TYPES = ["Single", "Double", "Suite", "Deluxe", "Family"];
const MAX_PRICE = 10_000_000;

export default function RoomFilter() {
  const { filter, setFilter } = useFilter();

  /* ===== SAFETY GUARDS ===== */
  const price = Number.isFinite(Number(filter.price)) ? Number(filter.price) : MAX_PRICE;
  const maxPeople = Number.isFinite(Number(filter.maxPeople)) && filter.maxPeople > 0
      ? Number(filter.maxPeople) : 1;
  const amenities = Array.isArray(filter.amenities) ? filter.amenities : [];

  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

  return (
    <Box
      sx={{
        p: 3,
        bgcolor: "#FFF",
        borderRadius: "20px",
        border: "1px solid rgba(194,165,109,0.15)", // Viền Gold siêu mảnh
        position: "sticky",
        top: 130, // Đồng bộ khoảng cách với Booking Card
        boxShadow: "0 10px 30px rgba(28,27,25,0.05)",
        maxHeight: "calc(100vh - 160px)",
        overflowY: "auto", // Cho phép cuộn bên trong nếu bộ lọc quá dài
        "&::-webkit-scrollbar": { width: "4px" },
        "&::-webkit-scrollbar-thumb": { bgcolor: "#EFE7DD", borderRadius: "10px" }
      }}
    >
      <Typography 
        sx={{ 
          fontFamily: "'Playfair Display', serif", 
          fontSize: "1.2rem", 
          fontWeight: 800, 
          color: "#1C1B19", 
          mb: 3 
        }}
      >
        Bộ lọc tìm kiếm
      </Typography>

      {/* ===== GIÁ MỖI ĐÊM ===== */}
      <Box mb={4}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: "#C2A56D", mb: 2, letterSpacing: 0.5 }}>
          GIÁ MỖI ĐÊM: {formatVND(price)}
        </Typography>

        <Slider
          value={price}
          min={0}
          max={MAX_PRICE}
          step={500_000}
          onChange={(_, v) => setFilter((prev) => ({ ...prev, price: Number(v) }))}
          sx={{
            color: "#C2A56D", // Màu Gold thương hiệu
            height: 4,
            "& .MuiSlider-thumb": {
              width: 18,
              height: 18,
              bgcolor: "#FFF",
              border: "2px solid currentColor",
              "&:hover, &.Mui-focusVisible": { boxShadow: "0px 0px 0px 8px rgba(194, 165, 109, 0.16)" },
            },
            "& .MuiSlider-rail": { opacity: 0.2, bgcolor: "#A8A7A1" },
          }}
        />

        <Box display="flex" justifyContent="space-between" mt={1}>
          <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 500 }}>0 ₫</Typography>
          <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 500 }}>10tr+ ₫</Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 3, borderColor: "rgba(0,0,0,0.04)" }} />

      {/* ===== LOẠI PHÒNG ===== */}
      <Box mb={3}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 2, color: "#1C1B19" }}>
          Loại phòng
        </Typography>

        <FormControl component="fieldset">
          <RadioGroup
            value={filter.type || "all"}
            onChange={(e) => setFilter((prev) => ({ ...prev, type: e.target.value }))}
          >
            <FormControlLabel
              value="all"
              control={<Radio size="small" sx={{ color: "#C2A56D", "&.Mui-checked": { color: "#C2A56D" } }} />}
              label={<Typography sx={{ fontSize: 14, fontWeight: 500 }}>Tất cả</Typography>}
            />
            {ROOM_TYPES.map((t) => (
              <FormControlLabel
                key={t}
                value={t}
                control={<Radio size="small" sx={{ color: "#C2A56D", "&.Mui-checked": { color: "#C2A56D" } }} />}
                label={<Typography sx={{ fontSize: 14, fontWeight: 500 }}>{t}</Typography>}
              />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      <Divider sx={{ my: 3, borderColor: "rgba(0,0,0,0.04)" }} />

      {/* ===== SỨC CHỨA ===== */}
      <Box mb={4}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1, color: "#1C1B19" }}>
          Số lượng khách: {maxPeople}
        </Typography>

        <Slider
          value={maxPeople}
          min={1}
          max={10}
          marks
          valueLabelDisplay="auto"
          onChange={(_, v) => setFilter((prev) => ({ ...prev, maxPeople: Number(v) }))}
          sx={{ color: "#1C1B19" }} // Màu đen Ebony cho thanh này để tạo sự khác biệt
        />
      </Box>

      <Divider sx={{ my: 3, borderColor: "rgba(0,0,0,0.04)" }} />

      {/* ===== TIỆN ÍCH ===== */}
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 2, color: "#1C1B19" }}>
          Tiện ích đi kèm
        </Typography>

        <FormGroup>
          {AMENITIES.map((a) => (
            <FormControlLabel
              key={a.id}
              label={<Typography sx={{ fontSize: 13.5, fontWeight: 500, color: "#444" }}>{a.label}</Typography>}
              control={
                <Checkbox
                  size="small"
                  checked={amenities.includes(a.id)}
                  onChange={(e) =>
                    setFilter((prev) => ({
                      ...prev,
                      amenities: e.target.checked
                        ? [...amenities, a.id]
                        : amenities.filter((x) => x !== a.id),
                    }))
                  }
                  sx={{ color: "#C2A56D", "&.Mui-checked": { color: "#C2A56D" } }}
                />
              }
              sx={{ mb: 0.5 }}
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
}