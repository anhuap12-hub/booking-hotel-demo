import { Paper, Box, Typography, Stack } from "@mui/material";

export default function ImageCard({
  title,
  subtitle,
  imageUrl,
  sx = {},
  onClick,
}) {
  return (
    <Paper
      onClick={onClick}
      elevation={0}
      sx={{
        position: "relative",
        overflow: "hidden",
        cursor: "pointer",

        borderRadius: 1.25,
        border: "1px solid #E5E2DC",
        backgroundColor: "#fff",

        transition: "border-color 0.15s ease, box-shadow 0.15s ease",

        "&:hover": {
          borderColor: "#D6CBBE",
          boxShadow: "0 4px 12px rgba(0,0,0,0.06)",
        },

        "&:hover img": {
          transform: "scale(1.02)",
        },

        ...sx,
      }}
    >
      {/* IMAGE */}
      <Box sx={{ width: "100%", height: 175, overflow: "hidden" }}>
        <img
          src={
            imageUrl ||
            "https://images.pexels.com/photos/1838554/pexels-photo-1838554.jpeg"
          }
          alt={title}
          loading="lazy"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
            transition: "transform 0.2s ease",
          }}
        />
      </Box>

      {/* TEXT */}
      <Box sx={{ p: 1.5 }}>
        <Stack spacing={0.25}>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: 14,
              color: "text.primary",
              lineHeight: 1.35,
            }}
            noWrap
          >
            {title}
          </Typography>

          {subtitle && (
            <Typography
              sx={{
                fontSize: 13,
                color: "text.secondary",
              }}
            >
              {subtitle}
            </Typography>
          )}

          {/* META LINE */}
          <Typography
            sx={{
              fontSize: 12,
              color: "#text.secondary",
            }}
          >
            Phổ biến · Được ưa chuộng
          </Typography>
        </Stack>
      </Box>
    </Paper>
  );
}
