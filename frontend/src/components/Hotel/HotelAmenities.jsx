import {
  Box,
  Typography,
  Grid,
  Button,
} from "@mui/material";
import CheckIcon from "@mui/icons-material/Check";
import { useState } from "react";

export default function HotelAmenities({ amenities = [] }) {
  const [showAll, setShowAll] = useState(false);
  if (!amenities.length) return null;

  const visibleAmenities = showAll ? amenities : amenities.slice(0, 6);

  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.4rem",
          fontWeight: 500,
          color: "text.primary",
          mb: 2,
        }}
      >
        Tiện nghi nổi bật
      </Typography>

      <Grid container spacing={2}>
        {visibleAmenities.map((a, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                color: "text.secondary",
              }}
            >
              <CheckIcon
                sx={{
                  fontSize: 18,
                  color: "primary.main",
                  opacity: 0.85,
                }}
              />
              <Typography
                sx={{
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: "text.secondary",
                }}
              >
                {a}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>

      {amenities.length > 6 && (
        <Button
          size="small"
          onClick={() => setShowAll(!showAll)}
          sx={{
            mt: 2.5,
            px: 2.5,
            py: 0.8,
            borderRadius: 999,
            fontSize: 13.5,
            fontWeight: 500,
            color: "primary.main",
            bgcolor: "rgba(139,111,78,0.08)",
            "&:hover": {
              bgcolor: "rgba(139,111,78,0.14)",
            },
          }}
        >
          {showAll ? "Ẩn bớt" : "Xem tất cả tiện nghi"}
        </Button>
      )}
    </Box>
  );
}
