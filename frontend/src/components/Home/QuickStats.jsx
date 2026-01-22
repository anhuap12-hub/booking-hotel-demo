import { Box, Typography, Stack } from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import StarIcon from "@mui/icons-material/Star";
import SecurityIcon from "@mui/icons-material/Security";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function QuickStats({ hotels = [], cities = [] }) {
  // Container variants để quản lý hiệu ứng chảy của các con số
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15, // Mỗi card hiện cách nhau 0.15s
        delayChildren: 0.2,
      },
    },
  };

  return (
    <MotionBox
      variants={containerVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      sx={{
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          sm: "1fr 1fr",
          md: "repeat(4, 1fr)",
        },
        gap: 3,
        mb: 8, // Tăng khoảng cách dưới để layout thoáng hơn
      }}
    >
      <StatCard
        icon={<HotelIcon fontSize="small" />}
        value={hotels.length || 250}
        title="Chỗ nghỉ cao cấp"
        subtitle="Tuyển chọn từ boutique đến resort"
      />

      <StatCard
        icon={<LocationOnIcon fontSize="small" />}
        value={cities.length || 12}
        title="Điểm đến hàng đầu"
        subtitle="Khám phá Việt Nam theo cách riêng"
      />

      <StatCard
        icon={<StarIcon fontSize="small" />}
        value="9.2 / 10"
        title="Sự hài lòng tuyệt đối"
        subtitle="Dựa trên đánh giá thực tế"
      />

      <StatCard
        icon={<SecurityIcon fontSize="small" />}
        value="100%"
        title="Thanh toán bảo mật"
        subtitle="Chuẩn mã hóa đa tầng quốc tế"
      />
    </MotionBox>
  );
}

/* ================== CARD ================== */
function StatCard({ icon, value, title, subtitle }) {
  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { duration: 0.6, ease: "easeOut" }
    },
  };

  return (
    <MotionBox
      variants={itemVariants}
      sx={{
        p: 3.5,
        borderRadius: 5, // Bo cong mềm mại hơn
        background: "linear-gradient(145deg, #ffffff 0%, #fcfaf8 100%)",
        color: "#3a342b",
        boxShadow: "0 12px 30px -10px rgba(139, 111, 78, 0.08)",
        border: "1px solid #f1ede7",
        transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
        position: "relative",
        overflow: "hidden",
        "&:hover": {
          boxShadow: "0 25px 45px -12px rgba(139, 111, 78, 0.15)",
          transform: "translateY(-8px) scale(1.02)",
          borderColor: "#C2A56D", // Đổi sang màu vàng đồng đặc trưng khi hover
          "& .icon-box": {
            bgcolor: "#1C1B19", // Chuyển sang đen Ebony khi hover
            color: "#C2A56D",
            transform: "rotate(10deg)", // Xoay icon nhẹ tạo sự thú vị
          },
          "& .stat-value": {
            color: "#C2A56D",
          }
        },
      }}
    >
      <Stack spacing={2.5}>
        <Box
          className="icon-box"
          sx={{
            width: 48,
            height: 48,
            borderRadius: "14px",
            bgcolor: "#f7f3ee",
            color: "#8B6F4E",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            transition: "all 0.4s ease",
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography
            className="stat-value"
            sx={{ 
              fontFamily: "'Playfair Display', serif", // Dùng font serif cho con số
              fontSize: "1.8rem",
              fontWeight: 900,
              color: "#1C1B19",
              lineHeight: 1.1,
              transition: "color 0.3s ease",
            }}
          >
            {value}
          </Typography>

          <Typography
            sx={{ 
              fontSize: "0.9rem",
              fontWeight: 700,
              color: "#3a342b",
              mt: 1,
              textTransform: "uppercase",
              letterSpacing: "0.05em"
            }}
          >
            {title}
          </Typography>

          <Typography
            sx={{ 
              fontSize: "0.8rem",
              color: "#8a7d6a",
              mt: 0.5,
              fontWeight: 400,
              lineHeight: 1.5,
              opacity: 0.8
            }}
          >
            {subtitle}
          </Typography>
        </Box>
      </Stack>
    </MotionBox>
  );
}