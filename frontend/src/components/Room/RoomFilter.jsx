import { Box, Typography, Slider, FormGroup, FormControlLabel, Checkbox } from "@mui/material";
import { useFilter } from "../../context/FilterContext";

const AMENITIES = ["wifi", "pool", "parking", "gym", "spa"];

export default function RoomFilter() {
  const { filter, setFilter } = useFilter();

  return (
    <Box p={3} bgcolor="#fff" borderRadius={2} boxShadow={1} position="sticky" top={120}>
      <Typography fontWeight={600} mb={2}>
        Lọc phòng
      </Typography>

      {/* PRICE */}
      <Typography fontSize={14}>Giá mỗi đêm</Typography>
      <Slider
        value={filter.price}
        onChange={(_, v) => setFilter(prev => ({ ...prev, price: v }))}
        min={0}
        max={5000000}
        step={100000}
        valueLabelDisplay="auto"
      />

      {/* AMENITIES */}
      <Typography mt={3} fontSize={14}>
        Tiện nghi
      </Typography>

      <FormGroup>
        {AMENITIES.map(a => (
          <FormControlLabel
            key={a}
            control={
              <Checkbox
                checked={filter.amenities.includes(a)}
                onChange={(e) =>
                  setFilter(prev => ({
                    ...prev,
                    amenities: e.target.checked
                      ? [...prev.amenities, a]
                      : prev.amenities.filter(x => x !== a),
                  }))
                }
              />
            }
            label={a}
          />
        ))}
      </FormGroup>
    </Box>
  );
}
