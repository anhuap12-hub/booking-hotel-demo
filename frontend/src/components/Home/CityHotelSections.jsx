import { Box, Typography, Stack, ButtonBase } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import HorizontalHotelRow from "../Hotel/HorizontalHotelRow";
import { motion } from "framer-motion";

/* ================= CITY META ================= */
// Chuyển màu sắc sang palette sang trọng hơn (Muted colors)
const CITY_META = {
  "Hà Nội": { desc: "Di sản nghìn năm văn hiến", color: "#1C1B19" },
  "TP. Hồ Chí Minh": { desc: "Nhịp sống năng động & hiện đại", color: "#C2A56D" },
  "Đà Nẵng": { desc: "Thành phố của những cây cầu", color: "#6D8C8E" },
  "Đà Lạt": { desc: "Xứ sở sương mù thơ mộng", color: "#8E7D6D" },
  "Phú Quốc": { desc: "Thiên đường đảo ngọc biển xanh", color: "#5F7D95" },
};

const MotionBox = motion(Box);

export default function CityHotelSections({ citiesSorted = [] }) {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  if (!citiesSorted.length) return null;

  const handleViewAll = (cityName) => {
    updateSearch({
      city: cityName,
      types: [],
      rating: null,
      amenities: [],
      priceRange: [0, 5000000], 
    });
    navigate("/hotels");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box sx={{ width: "100%", display: "flex", flexDirection: "column", gap: { xs: 6, md: 10 } }}>
      {citiesSorted.map(([cityName, hotelList]) => {
        const meta = CITY_META[cityName] || {
          desc: "Khám phá những điểm đến tuyệt vời.",
          color: "#1C1B19",
        };

        return (
          <Box key={cityName} component="section">
            {/* ================= HEADER ================= */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
              mb={3}
              sx={{ px: { xs: 1, md: 0 } }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 800,
                    fontSize: { xs: "1.75rem", md: "2.25rem" },
                    color: "#1C1B19",
                    mb: 0.5,
                    display: "flex",
                    alignItems: "center",
                    gap: 2
                  }}
                >
                  {cityName}
                  <Box sx={{ width: 40, height: 1, bgcolor: meta.color, opacity: 0.3 }} />
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    color: "#72716E",
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    fontSize: "0.75rem",
                    fontWeight: 600
                  }}
                >
                  {meta.desc} — {hotelList.length} lựa chọn tinh túy
                </Typography>
              </Box>

              {/* VIEW ALL BUTTON - Thiết kế dạng Text Button sang trọng */}
              <ButtonBase
                onClick={() => handleViewAll(cityName)}
                sx={{
                  color: "#1C1B19",
                  transition: "all 0.3s ease",
                  pb: 0.5,
                  borderBottom: "1px solid rgba(0,0,0,0.1)",
                  "&:hover": {
                    color: meta.color,
                    borderBottomColor: meta.color,
                    "& .arrow-icon": { transform: "translateX(4px)" }
                  }
                }}
              >
                <Typography sx={{ fontSize: "0.75rem", fontWeight: 700, mr: 1, letterSpacing: "0.1em" }}>
                  XEM TẤT CẢ
                </Typography>
                <ArrowForwardIosIcon className="arrow-icon" sx={{ fontSize: 10, transition: "0.3s" }} />
              </ButtonBase>
            </Stack>

            {/* ================= HOTEL ROW ================= */}
            <MotionBox
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
              sx={{
                borderRadius: "24px",
                bgcolor: "#FFFFFF",
                // Shadow cực nhẹ để tạo độ nổi khối (Elevation)
                boxShadow: "0 10px 40px rgba(0,0,0,0.03)",
                border: "1px solid #F1F0EE",
                p: { xs: 1, md: 1.5 },
                position: "relative",
                overflow: "hidden",
                "&::before": {
                    content: '""',
                    position: "absolute",
                    top: 0, left: 0, width: "4px", height: "100%",
                    bgcolor: meta.color,
                    opacity: 0.6
                }
              }}
            >
              <HorizontalHotelRow hotels={hotelList} />
            </MotionBox>
          </Box>
        );
      })}
    </Box>
  );
}