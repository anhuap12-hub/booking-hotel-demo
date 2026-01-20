import { Box, Typography } from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

export default function HotelHeaderSummary({ hotel }) {
  return (
    <Box sx={{ mt: 2 }}>
      <Typography
        sx={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.9rem",
          fontWeight: 500,
          color: "text.primary",
          mb: 0.5,
          lineHeight: 1.2,
        }}
      >
        {hotel.name}
      </Typography>

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 0.75,
          color: "text.secondary",
        }}
      >
        <StarIcon
          sx={{
            fontSize: 17,
            color: "primary.main",
            opacity: 0.9,
          }}
        />

        <Typography sx={{ fontWeight: 500, color: "text.primary" }}>
          {hotel.rating ?? "Mới"}
        </Typography>

        <Typography sx={{ opacity: 0.6 }}>•</Typography>

        <Typography>
          {hotel.reviews ?? 0} đánh giá
        </Typography>

        <Typography sx={{ opacity: 0.6 }}>•</Typography>

        <Typography>
          {hotel.city}, {hotel.address}
        </Typography>
      </Box>
    </Box>
  );
}
