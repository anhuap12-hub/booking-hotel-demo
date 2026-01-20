import { Box, Typography, Stack } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import SecurityIcon from "@mui/icons-material/Security";

export default function QuickStats({ hotels, cities }) {
  return (
    <Box
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "repeat(4, 1fr)",
        },
        gap: 3,
        mb: 5,
      }}
    >
      <StatCard
        icon={<HotelIcon fontSize="small" />}
        value={hotels.length}
        title="Khách sạn đa dạng"
        subtitle="Từ bình dân đến cao cấp"
      />

      <StatCard
        icon={<LocationOnIcon fontSize="small" />}
        value={cities.length}
        title="Thành phố phổ biến"
        subtitle="Phủ khắp điểm du lịch"
      />

      <StatCard
        icon={<StarIcon fontSize="small" />}
        value="9 / 10"
        title="Đánh giá trung bình"
        subtitle="Từ hàng nghìn khách hàng"
      />

      <StatCard
        icon={<SecurityIcon fontSize="small" />}
        value="100%"
        title="Thanh toán an toàn"
        subtitle="Bảo mật chuẩn quốc tế"
      />
    </Box>
  );
}

/* ================== CARD ================== */
function StatCard({ icon, value, title, subtitle }) {
  return (
    <Box
      sx={{
        p: 3,
        borderRadius: 4,
        // Màu nền Gradient nhạt tông Sand/Milk Coffee
        background: "linear-gradient(135deg, #fffcf9 0%, #f7f3ee 100%)",
        color: "#3a342b",
        // Đổ bóng màu nâu nhạt siêu mịn
        boxShadow: "0 10px 25px -5px rgba(139, 111, 78, 0.1)",
        border: "1px solid #f1ede7",
        transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 20px 35px -10px rgba(139, 111, 78, 0.15)",
          transform: "translateY(-6px)",
          borderColor: "#e5ddd3",
          "& .icon-box": {
            bgcolor: "#8B6F4E",
            color: "#fff",
            transform: "scale(1.1)",
          }
        },
      }}
    >
      <Stack spacing={2}>
        {/* ICON BOX */}
        <Box
          className="icon-box"
          sx={{
            width: 42,
            height: 42,
            borderRadius: 2, 
            bgcolor: "#f3ede4",
            color: "#8B6F4E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.3s ease",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography
            fontSize="1.6rem"
            fontWeight={900}
            sx={{ 
              color: "#3a342b",
              lineHeight: 1.1,
              letterSpacing: "-0.5px"
            }}
          >
            {value}
          </Typography>

          <Typography
            fontSize="0.95rem"
            fontWeight={700}
            sx={{ 
              color: "#5d4a35",
              mt: 0.8 
            }}
          >
            {title}
          </Typography>

          <Typography
            fontSize="0.8rem"
            sx={{ 
              color: "#8a7d6a",
              mt: 0.4,
              fontWeight: 500,
              lineHeight: 1.4
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </Box>
  );
}