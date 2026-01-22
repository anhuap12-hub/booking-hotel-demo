import {
  Box,
  Typography,
  Grid,
  Button,
  Collapse
} from "@mui/material";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import { useState } from "react";
import { motion } from "framer-motion";

export default function HotelAmenities({ amenities = [] }) {
  const [showAll, setShowAll] = useState(false);
  if (!amenities.length) return null;

  // Hiển thị 6 cái đầu tiên khi thu gọn
  const visibleAmenities = showAll ? amenities : amenities.slice(0, 6);

  return (
    <Box sx={{ py: 2 }}>
      <Typography
        sx={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.6rem",
          fontWeight: 800,
          color: "#1C1B19",
          mb: 3,
          letterSpacing: "-0.01em"
        }}
      >
        Tiện ích & Dịch vụ
      </Typography>

      <Grid container spacing={2.5}>
        {visibleAmenities.map((a, i) => (
          <Grid item xs={12} sm={6} key={i}>
            <Box
              component={motion.div}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 2,
                p: 1.5,
                borderRadius: "12px",
                transition: "all 0.3s ease",
                "&:hover": {
                  bgcolor: "#FAF9F7",
                  transform: "translateX(5px)"
                }
              }}
            >
              {/* Icon thay thế cho CheckIcon truyền thống */}
              <FiberManualRecordIcon
                sx={{
                  fontSize: 8,
                  color: "#C2A56D",
                }}
              />
              <Typography
                sx={{
                  fontSize: "0.95rem",
                  fontWeight: 500,
                  color: "#4A4947",
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
          disableRipple
          onClick={() => setShowAll(!showAll)}
          endIcon={showAll ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          sx={{
            mt: 4,
            px: 0,
            fontSize: "0.85rem",
            fontWeight: 700,
            color: "#1C1B19",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            borderBottom: "1px solid #C2A56D",
            borderRadius: 0,
            minWidth: "auto",
            "&:hover": {
              bgcolor: "transparent",
              color: "#C2A56D",
              borderBottomColor: "#1C1B19",
            },
            transition: "all 0.3s ease"
          }}
        >
          {showAll ? "Thu gọn" : `Khám phá tất cả (${amenities.length})`}
        </Button>
      )}
    </Box>
  );
}