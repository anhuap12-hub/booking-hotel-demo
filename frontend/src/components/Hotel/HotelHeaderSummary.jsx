import { Box, Typography, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function HotelHeaderSummary({ hotel }) {
  return (
    <MotionBox 
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      sx={{ mt: 4, mb: 4 }}
    >
      {/* TÊN KHÁCH SẠN: Tăng kích thước và độ đậm */}
      <Typography
        variant="h1"
        sx={{
          fontFamily: "'Playfair Display', serif",
          fontSize: { xs: "2rem", md: "2.8rem" },
          fontWeight: 900,
          color: "#1C1B19",
          mb: 1.5,
          lineHeight: 1.1,
          letterSpacing: "-0.02em",
        }}
      >
        {hotel.name}
      </Typography>

      {/* THÔNG TIN PHỤ: Rating, Đánh giá, Địa chỉ */}
      <Stack
        direction="row"
        alignItems="center"
        flexWrap="wrap"
        sx={{
          gap: 1.5,
          color: "#72716E",
          fontSize: "0.95rem",
        }}
      >
        {/* RATING SECTION */}
        <Stack direction="row" alignItems="center" spacing={0.5}>
          <StarIcon
            sx={{
              fontSize: 18,
              color: "#C2A56D", // Vàng đồng thương hiệu
            }}
          />
          <Typography sx={{ fontWeight: 700, color: "#1C1B19" }}>
            {hotel.rating ?? "Mới"}
          </Typography>
          <Typography sx={{ color: "#A8A7A1", ml: 0.5 }}>
            ({hotel.reviews ?? 0} đánh giá thực tế)
          </Typography>
        </Stack>

        <Typography sx={{ color: "#D6D5D2", display: { xs: "none", sm: "block" } }}>|</Typography>

        {/* ĐỊA CHỈ SECTION */}
        <Typography 
          sx={{ 
            fontWeight: 500,
            borderBottom: "1px solid #D6D5D2", // Gạch chân mờ tạo cảm giác có thể click xem bản đồ
            cursor: "pointer",
            "&:hover": { color: "#1C1B19", borderColor: "#1C1B19" },
            transition: "0.2s"
          }}
        >
          {hotel.address}, {hotel.city}
        </Typography>
      </Stack>
    </MotionBox>
  );
}