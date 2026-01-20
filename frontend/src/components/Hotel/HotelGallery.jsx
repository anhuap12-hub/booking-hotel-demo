import { Grid, Box } from "@mui/material";

const FALLBACK_PEXELS = [
  "https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg",
  "https://images.pexels.com/photos/261102/pexels-photo-261102.jpeg",
  "https://images.pexels.com/photos/164595/pexels-photo-164595.jpeg",
  "https://images.pexels.com/photos/237371/pexels-photo-237371.jpeg",
  "https://images.pexels.com/photos/258154/pexels-photo-258154.jpeg",
];

export default function HotelGallery({ photos }) {
  let images = FALLBACK_PEXELS;

  if (Array.isArray(photos) && photos.length > 0) {
    images = photos
      .map((p) => (typeof p === "string" ? p : p?.url))
      .filter(Boolean);
  }

  return (
    <Grid container spacing={1.2} sx={{ mb: 3, mt: 4 }}>
      {images.slice(0, 5).map((src, i) => (
        <Grid item xs={12} md={i === 0 ? 6 : 3} key={i}>
          <Box
            component="img"
            src={src}
            alt={`Hotel image ${i + 1}`}
            loading="lazy"
            sx={{
              width: "100%",
              height: i === 0 ? 400 : 195,
              objectFit: "cover",
              borderRadius: 3,
              filter: "brightness(0.92) contrast(1.05)",
              transition: "all 0.4s ease",
              "&:hover": {
                filter: "brightness(1) contrast(1.08)",
                transform: "scale(1.01)",
              },
            }}
          />
        </Grid>
      ))}
    </Grid>
  );
}
