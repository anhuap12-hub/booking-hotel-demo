import { Box, Typography, Stack, ButtonBase, Container } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import HorizontalHotelRow from "../Hotel/HorizontalHotelRow";
import { motion } from "framer-motion";

const CITY_META = {
  "Hà Nội": { desc: "Di sản nghìn năm văn hiến", color: "#1C1B19" },
  "TP. Hồ Chí Minh": { desc: "Nhịp sống năng động & hiện đại", color: "#C2A56D" },
  "Đà Nẵng": { desc: "Thành phố của những cây cầu", color: "#6D8C8E" },
  "Đà Lạt": { desc: "Xứ sở sương mù thơ mộng", color: "#8E7D6D" },
  "Phú Quốc": { desc: "Thiên đường đảo ngọc biển xanh", color: "#5F7D95" },
};

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
      priceRange: [0, 10000000], 
    });
    navigate("/hotels");
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    // Giảm gap từ 10 xuống 8 để nội dung cô đọng hơn
    <Stack spacing={{ xs: 6, md: 8 }} sx={{ width: "100%", py: 4 }}>
      {citiesSorted.map(([cityName, hotelList]) => {
        const meta = CITY_META[cityName] || {
          desc: "Khám phá những điểm đến tuyệt vời.",
          color: "#1C1B19",
        };

        return (
          <Box 
            key={cityName} 
            component={motion.section}
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-100px" }}
          >
            {/* ================= HEADER SECTION ================= */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="flex-end"
              sx={{ 
                mb: 3, 
                px: { xs: 2, md: 0 },
                borderLeft: { md: `4px solid ${meta.color}` },
                pl: { md: 3 }
              }}
            >
              <Box>
                <Typography
                  variant="h4"
                  sx={{
                    fontFamily: "'Playfair Display', serif",
                    fontWeight: 900,
                    fontSize: { xs: "1.8rem", md: "2.4rem" },
                    color: "#1C1B19",
                    lineHeight: 1,
                    mb: 1
                  }}
                >
                  {cityName}
                </Typography>

                <Typography
                  sx={{
                    color: "#A8A7A1",
                    letterSpacing: "0.15em",
                    textTransform: "uppercase",
                    fontSize: { xs: "0.65rem", md: "0.75rem" },
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5
                  }}
                >
                  {meta.desc} 
                  <Box component="span" sx={{ width: 4, height: 4, borderRadius: "50%", bgcolor: meta.color }} />
                  {hotelList.length} điểm đến
                </Typography>
              </Box>

              <ButtonBase
                onClick={() => handleViewAll(cityName)}
                sx={{
                  color: "#C2A56D",
                  pb: 0.5,
                  "&:hover": {
                    "& .arrow": { transform: "translateX(6px)" },
                    "& .text": { color: "#1C1B19" }
                  }
                }}
              >
                <Typography className="text" sx={{ fontSize: "0.7rem", fontWeight: 800, mr: 1, letterSpacing: "0.1em", transition: "0.3s" }}>
                  KHÁM PHÁ THÊM
                </Typography>
                <ArrowForwardIosIcon className="arrow" sx={{ fontSize: 10, transition: "0.3s" }} />
              </ButtonBase>
            </Stack>

            {/* ================= HOTEL LIST ================= */}
            <Box
              sx={{
                position: "relative",
                // Loại bỏ border rườm rà, dùng âm hưởng của Luxury Resort: sạch và thoáng
                "& .MuiPaper-root": { 
                  boxShadow: "none", 
                  bgcolor: "transparent" 
                }
              }}
            >
              {/* Chỉ giữ lại Row, loại bỏ bọc viền nếu HorizontalHotelRow đã có style riêng */}
              <HorizontalHotelRow hotels={hotelList} />
            </Box>
          </Box>
        );
      })}
    </Stack>
  );
}