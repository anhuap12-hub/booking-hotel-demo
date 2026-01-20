import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export default function ReviewsSection({ rating, reviews }) {
  return (
    <Box>
      <Typography
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 0.75,
          fontFamily: "Playfair Display, serif",
          fontSize: "1.35rem",
          fontWeight: 500,
          color: "text.primary",
          mb: 0.5,
        }}
      >
        <StarIcon
          sx={{
            fontSize: 18,
            color: "primary.main",
          }}
        />
        {rating || "Mới"} · {reviews || 0} đánh giá
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          fontSize: 14.5,
          maxWidth: 520,
        }}
      >
        Du khách đánh giá cao sự sạch sẽ, vị trí thuận tiện và trải nghiệm lưu trú
        nhẹ nhàng, thoải mái trong suốt thời gian nghỉ.
      </Typography>
    </Box>
  );
}
