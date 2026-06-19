import {
  Box, Typography, Slider, FormGroup, FormControlLabel, 
  Checkbox, Divider, RadioGroup, Radio, FormControl,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { useFilter } from "../../context/FilterContext";
import axios from "../../api/axios";

const ROOM_TYPES = ["Single", "Double", "Suite", "Deluxe", "Family"];
const MAX_PRICE = 10_000_000;
const primaryBlue = "#0056b3";

export default function RoomFilter() {
  const { hotelId } = useParams();
  const { filter, setFilter } = useFilter();
  const [amenitiesList, setAmenitiesList] = useState([]);

  // Lấy giá trị từ filter context với fallback
  const price = Number.isFinite(Number(filter.price)) ? Number(filter.price) : MAX_PRICE;
  const amenities = Array.isArray(filter.amenities) ? filter.amenities : [];

  useEffect(() => {
    const fetchAmenities = async () => {
      try {
        const res = await axios.get(`/rooms/amenities/${hotelId}`);
        // Chuyển đổi dữ liệu trả về thành định dạng label thân thiện
        const formatted = res.data.data.map(item => ({
            id: item,
            label: item.charAt(0).toUpperCase() + item.slice(1).replace(/_/g, ' ')
        }));
        setAmenitiesList(formatted);
      } catch (err) {
        console.error("Lỗi lấy tiện ích:", err);
      }
    };
    if (hotelId) fetchAmenities();
  }, [hotelId]);

  const formatVND = (value) =>
    new Intl.NumberFormat("vi-VN", { style: "currency", currency: "VND", maximumFractionDigits: 0 }).format(value);

  return (
    <Box sx={{
      p: 3, bgcolor: "#FFF", borderRadius: "20px",
      border: "1px solid #e1e8ed",
      position: "sticky", top: 130,
      boxShadow: "0 4px 20px rgba(0,0,0,0.05)",
      maxHeight: "calc(100vh - 160px)", overflowY: "auto",
      "&::-webkit-scrollbar": { width: "4px" },
      "&::-webkit-scrollbar-thumb": { bgcolor: "#ddd", borderRadius: "10px" }
    }}>
      <Typography sx={{ fontSize: "1.2rem", fontWeight: 800, color: "#333", mb: 3 }}>
        Bộ lọc tìm kiếm
      </Typography>

      {/* ===== GIÁ ===== */}
      <Box mb={4}>
        <Typography sx={{ fontSize: 13, fontWeight: 700, color: primaryBlue, mb: 2 }}>
          GIÁ MỖI ĐÊM: {formatVND(price)}
        </Typography>
        <Slider value={price} min={0} max={MAX_PRICE} step={500_000}
          onChange={(_, v) => setFilter((prev) => ({ ...prev, price: Number(v) }))}
          sx={{ color: primaryBlue, "& .MuiSlider-thumb": { bgcolor: "#FFF", border: "2px solid currentColor" } }}
        />
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* ===== LOẠI PHÒNG ===== */}
      <Box mb={3}>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 1, color: "#333" }}>Loại phòng</Typography>
        <FormControl component="fieldset">
          <RadioGroup value={filter.type || "all"} onChange={(e) => setFilter((prev) => ({ ...prev, type: e.target.value }))}>
            <FormControlLabel value="all" control={<Radio size="small" sx={{ color: primaryBlue, "&.Mui-checked": { color: primaryBlue } }} />} label="Tất cả" />
            {ROOM_TYPES.map((t) => (
              <FormControlLabel key={t} value={t} control={<Radio size="small" sx={{ color: primaryBlue, "&.Mui-checked": { color: primaryBlue } }} />} label={t} />
            ))}
          </RadioGroup>
        </FormControl>
      </Box>

      <Divider sx={{ my: 3 }} />

      {/* ===== TIỆN ÍCH (ĐỘNG) ===== */}
      <Box>
        <Typography sx={{ fontSize: 14, fontWeight: 700, mb: 2, color: "#333" }}>
          Tiện ích đi kèm
        </Typography>
        
        <FormGroup 
          sx={{ 
            display: 'flex', 
            flexDirection: 'column', 
            flexWrap: 'nowrap',
            // Đã xóa maxHeight và overflowY để hiển thị tất cả
          }}
        >
          {amenitiesList.map((a) => (
            <FormControlLabel
              key={a.id}
              sx={{ 
                marginRight: 0, 
                marginBottom: 0.5,
                '& .MuiFormControlLabel-label': { width: '100%' }
              }}
              label={
                <Typography sx={{ fontSize: 13.5, color: "#555", display: 'block' }}>
                  {a.label}
                </Typography>
              }
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
                  sx={{ 
                    color: primaryBlue, 
                    "&.Mui-checked": { color: primaryBlue } 
                  }}
                />
              }
            />
          ))}
        </FormGroup>
      </Box>
    </Box>
  );
}