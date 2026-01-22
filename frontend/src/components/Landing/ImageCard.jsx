import { Paper, Box, Typography, Stack, Chip } from "@mui/material";
import { motion } from "framer-motion";
import StarIcon from '@mui/icons-material/Star';

const MotionPaper = motion(Paper);

export default function ImageCard({
  title,
  subtitle,
  imageUrl,
  sx = {},
  onClick,
}) {
  return (
    <MotionPaper
      onClick={onClick}
      elevation={0}
      // Hiệu ứng "Nhún" kiểu Cartoon nhưng vẫn sang trọng
      whileHover={{ y: -10, scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
      transition={{ type: "spring", stiffness: 400, damping: 17 }}
      sx={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",
        borderRadius: 5, // Bo góc sâu tạo cảm giác mềm mại
        border: "1px solid #F1F0ED",
        backgroundColor: "#fff",
        "&:hover": {
          boxShadow: "0 20px 40px rgba(28,27,25,0.08)",
          borderColor: "#c2a56d",
        },
        ...sx,
      }}
    >
      {/* FLOATING BADGE - Info quan trọng lơ lửng */}
      <Box sx={{ position: "absolute", top: 12, left: 12, zIndex: 2 }}>
        <Chip 
          label="Phổ biến" 
          size="small"
          sx={{ 
            bgcolor: "rgba(255,255,255,0.9)", 
            backdropFilter: "blur(4px)",
            fontWeight: 700,
            fontSize: 10,
            height: 22,
            border: "1px solid #E5E2DC"
          }} 
        />
      </Box>

      {/* IMAGE - Visual sạch sẽ */}
      <Box sx={{ width: "100%", height: 200, overflow: "hidden" }}>
        <Box
          component="img"
          src={imageUrl || "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg"}
          alt={title}
          loading="lazy"
          sx={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)",
            "MotionPaper:hover &": {
              transform: "scale(1.1)",
            },
          }}
        />
      </Box>

      {/* TEXT - Tập trung rõ Info */}
      <Box sx={{ p: 2.5 }}>
        <Stack spacing={0.5}>
          <Typography
            sx={{
              fontWeight: 800,
              fontSize: 16,
              color: "#1c1b19",
              lineHeight: 1.2,
              fontFamily: "'Playfair Display', serif", // Đồng bộ font banner
            }}
            noWrap
          >
            {title}
          </Typography>

          <Stack direction="row" alignItems="center" spacing={0.5}>
             <StarIcon sx={{ fontSize: 14, color: "#c2a56d" }} />
             <Typography
                sx={{
                  fontSize: 13,
                  color: "#6b6a67",
                  fontWeight: 500,
                }}
              >
                {subtitle || "Địa điểm nổi bật"}
              </Typography>
          </Stack>

          {/* Line trang trí tối giản để phân tách meta info */}
          <Box sx={{ pt: 1.5 }}>
             <Typography
                sx={{
                  fontSize: 11,
                  color: "#c2a56d",
                  fontWeight: 700,
                  textTransform: "uppercase",
                  letterSpacing: "0.05em"
                }}
              >
                Khám phá ngay →
              </Typography>
          </Box>
        </Stack>
      </Box>
    </MotionPaper>
  );
}