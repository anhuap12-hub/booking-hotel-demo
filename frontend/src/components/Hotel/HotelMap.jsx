import { Box, Typography } from "@mui/material";

export default function HotelMap({ hotel }) {
  const query = encodeURIComponent(`${hotel.address}, ${hotel.city}`);

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.4rem",
          fontWeight: 500,
          color: "text.primary",
          mb: 0.5,
        }}
      >
        Vị trí & khu vực xung quanh
      </Typography>

      <Typography
        sx={{
          color: "text.secondary",
          fontSize: 14.5,
          mb: 2,
        }}
      >
        {hotel.address}, {hotel.city}
      </Typography>

      <Box
        sx={{
          width: "100%",
          height: 320,
          borderRadius: 3,
          overflow: "hidden",
          border: "1px solid",
          borderColor: "divider",
          boxShadow: "0 8px 24px rgba(0,0,0,0.06)",
        }}
      >
        <iframe
          title="hotel-map"
          width="100%"
          height="100%"
          style={{
            border: 0,
            filter: "grayscale(0.2) contrast(1.05)",
          }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
          src={`https://www.google.com/maps?q=${query}&output=embed`}
        />
      </Box>
    </Box>
  );
}
