import { Box, Typography, Grid, LinearProgress, Stack } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

export default function ReviewsSection({ rating, reviews }) {
  // Giả lập dữ liệu đánh giá chi tiết để giao diện trông chuyên nghiệp hơn
  const detailRatings = [
    { label: "Sạch sẽ", value: 95 },
    { label: "Vị trí", value: 90 },
    { label: "Dịch vụ", value: 85 },
  ];

  return (
    <Box sx={{ py: 4, borderTop: "1px solid #F1F0EE", borderBottom: "1px solid #F1F0EE", my: 6 }}>
      <Grid container spacing={4} alignItems="center">
        {/* CỘT TRÁI: ĐIỂM TỔNG QUÁT */}
        <Grid item xs={12} md={5}>
          <Typography
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 1,
              fontFamily: "'Playfair Display', serif",
              fontSize: "1.75rem",
              fontWeight: 800,
              color: "#1C1B19",
              mb: 1.5,
            }}
          >
            <StarIcon sx={{ fontSize: 24, color: "#C2A56D" }} />
            {rating || "Mới"} <Box component="span" sx={{ fontSize: "1.1rem", color: "#A8A7A1", ml: 1 }}>· {reviews || 0} đánh giá</Box>
          </Typography>

          <Typography
            sx={{
              color: "#72716E",
              fontSize: "0.95rem",
              lineHeight: 1.8,
              maxWidth: 400,
            }}
          >
            Du khách đánh giá cao sự sạch sẽ, vị trí thuận tiện và trải nghiệm lưu trú
            nhẹ nhàng, thoải mái trong suốt thời gian nghỉ.
          </Typography>
        </Grid>

        {/* CỘT PHẢI: CHI TIẾT (PROGRESS BARS) */}
        <Grid item xs={12} md={7}>
          <Stack spacing={2.5}>
            {detailRatings.map((item, index) => (
              <MotionBox 
                key={item.label}
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <Stack direction="row" justifyContent="space-between" mb={0.5}>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#1C1B19", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                    {item.label}
                  </Typography>
                  <Typography variant="caption" sx={{ fontWeight: 700, color: "#C2A56D" }}>
                    {(item.value / 10).toFixed(1)}
                  </Typography>
                </Stack>
                <LinearProgress 
                  variant="determinate" 
                  value={item.value} 
                  sx={{ 
                    height: 4, 
                    borderRadius: 2, 
                    bgcolor: "#F1F0EE",
                    "& .MuiLinearProgress-bar": { bgcolor: "#1C1B19" } 
                  }} 
                />
              </MotionBox>
            ))}
          </Stack>
        </Grid>
      </Grid>
    </Box>
  );
}