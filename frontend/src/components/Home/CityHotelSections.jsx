import { Box, Typography, Stack } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import HorizontalHotelRow from "../Hotel/HorizontalHotelRow";

/* ================= CITY META ================= */
const CITY_META = {
  "Hà Nội": { desc: "Thủ đô nghìn năm văn hiến.", color: "#003580" },
  "TP. Hồ Chí Minh": { desc: "Đô thị năng động, nhộn nhịp.", color: "#e67e22" },
  "Đà Nẵng": { desc: "Thành phố biển đáng sống nhất.", color: "#2ecc71" },
  "Đà Lạt": { desc: "Xứ sở sương mù thơ mộng.", color: "#9b59b6" },
  "Phú Quốc": { desc: "Thiên đường đảo ngọc biển xanh.", color: "#3498db" },
};

export default function CityHotelSections({ citiesSorted = [] }) {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  if (!citiesSorted.length) return null;

  /* ================= CLICK HANDLER ================= */
  const handleViewAll = (cityName) => {
  updateSearch({
    city: cityName,          // ✅ field chính
    types: [],               // reset
    rating: null,
    amenities: [],
    priceRange: [0, 2_000_000], // ✅ đúng tên field
  });

  navigate("/hotels");
  window.scrollTo({ top: 0, behavior: "smooth" });
};


  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: 5 }}>
      {citiesSorted.map(([cityName, hotelList]) => {
        const meta =
          CITY_META[cityName] || {
            desc: "Khám phá những điểm đến tuyệt vời.",
            color: "#003580",
          };

        return (
          <Box
            key={cityName}
            sx={{
              position: "relative",
              "&:hover .city-title": { color: meta.color },
              "&:hover .view-all-btn": {
                transform: "translateX(6px)",
                color: meta.color,
              },
            }}
          >
            {/* ================= HEADER ================= */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
              mb={2}
              sx={{ px: 1 }}
            >
              <Box>
                <Typography
                  className="city-title"
                  variant="h5"
                  sx={{
                    fontWeight: 900,
                    fontSize: { xs: "1.2rem", md: "1.5rem" },
                    letterSpacing: "-0.02em",
                    transition: "all 0.3s ease",
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    color: "#1a1a1a",
                  }}
                >
                  {cityName}
                  <Box
                    sx={{
                      width: 30,
                      height: 4,
                      bgcolor: meta.color,
                      borderRadius: 1,
                      opacity: 0.4,
                    }}
                  />
                </Typography>

                <Typography
                  variant="caption"
                  sx={{
                    color: "text.secondary",
                    fontWeight: 600,
                    textTransform: "uppercase",
                    letterSpacing: "0.05em",
                    fontSize: "0.65rem",
                  }}
                >
                  {hotelList.length} chỗ nghỉ tiêu biểu • {meta.desc}
                </Typography>
              </Box>

              {/* ================= VIEW ALL ================= */}
              <Stack
                className="view-all-btn"
                direction="row"
                alignItems="center"
                spacing={0.5}
                onClick={() => handleViewAll(cityName)}
                sx={{
                  cursor: "pointer",
                  color: "text.disabled",
                  transition: "all 0.3s ease-in-out",
                  userSelect: "none",
                }}
              >
                <Typography sx={{ fontSize: "0.7rem", fontWeight: 800 }}>
                  XEM TẤT CẢ
                </Typography>
                <ArrowForwardIosIcon sx={{ fontSize: 10 }} />
              </Stack>
            </Stack>

            {/* ================= HOTEL ROW ================= */}
            <Box
              sx={{
                p: { xs: 1.5, md: 2 },
                borderRadius: "20px",
                bgcolor: "#ffffff",
                border: "1px solid rgba(0,0,0,0.03)",
                boxShadow: "0 4px 20px rgba(0,0,0,0.02)",
                background: `linear-gradient(145deg, #ffffff 90%, ${meta.color}08 100%)`,
                overflow: "hidden",
              }}
            >
              <HorizontalHotelRow hotels={hotelList} />
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
