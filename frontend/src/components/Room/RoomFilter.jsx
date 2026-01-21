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

  /* ===== SAFETY GUARDS (FIX NaN 100%) ===== */
  const price =
    Number.isFinite(Number(filter.price)) ? Number(filter.price) : MAX_PRICE;

  const maxPeople =
    Number.isFinite(Number(filter.maxPeople)) && filter.maxPeople > 0
      ? Number(filter.maxPeople)
      : 1;

  const amenities = Array.isArray(filter.amenities) ? filter.amenities : [];

  /* ===== FORMAT ===== */
  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
      maximumFractionDigits: 0,
    }).format(value);

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

      {/* ===== PRICE ===== */}
      <Box mb={4}>
        <Typography fontSize={14} fontWeight={600} gutterBottom>
          Giá mỗi đêm: {formatVND(price)}
        </Typography>

        <Slider
          value={price}
          min={0}
          max={MAX_PRICE}
          step={500_000}
          onChange={(_, v) =>
            setFilter((prev) => ({
              ...prev,
              price: Number(v),
            }))
          }
        />

        <Box display="flex" justifyContent="space-between">
          <Typography variant="caption" color="text.secondary">
            0 ₫
          </Typography>
          <Typography variant="caption" color="text.secondary">
            10tr+ ₫
          </Typography>
        </Box>
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* ===== ROOM TYPE ===== */}
      <Box mb={3}>
        <Typography fontSize={14} fontWeight={600} mb={1}>
          Loại phòng
        </Typography>

        <FormControl>
          <RadioGroup
            value={filter.type || "all"}
            onChange={(e) =>
              setFilter((prev) => ({
                ...prev,
                type: e.target.value,
              }))
            }
          >
            <FormControlLabel
              value="all"
              control={<Radio size="small" />}
              label="Tất cả loại phòng"
            />
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

      {/* ===== MAX PEOPLE ===== */}
      <Box mb={3}>
        <Typography fontSize={14} fontWeight={600} mb={1}>
          Số lượng khách
        </Typography>

        <Slider
          value={maxPeople}
          min={1}
          max={10}
          marks
          valueLabelDisplay="auto"
          onChange={(_, v) =>
            setFilter((prev) => ({
              ...prev,
              maxPeople: Number(v),
            }))
          }
        />
      </Box>

      <Divider sx={{ my: 2 }} />

      {/* ===== AMENITIES ===== */}
      <Box>
        <Typography fontSize={14} fontWeight={600} mb={1}>
          Tiện ích đi kèm
        </Typography>

        <FormGroup>
          {AMENITIES.map((a) => (
            <FormControlLabel
              key={a.id}
              label={<Typography fontSize={14}>{a.label}</Typography>}
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
                />
              }
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
}
