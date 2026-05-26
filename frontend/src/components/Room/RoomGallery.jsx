import { Grid, Paper, Box, Stack, Button, Typography } from "@mui/material";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";
import { useState } from "react";
// Import thư viện Lightbox
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

export default function RoomGallery({ photos = [] }) {
  const [open, setOpen] = useState(false);
  const GALLERY_HEIGHT = { xs: "300px", sm: "400px", md: "450px" };

  if (!photos || photos.length === 0) {
    return (
      <Paper
        sx={{
          height: GALLERY_HEIGHT,
          bgcolor: "#F9F8F6",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: "24px",
          border: "1px dashed #D6C9B8",
          gap: 1,
          mb: 4,
        }}
      >
        <CollectionsOutlinedIcon sx={{ color: "#C2A56D", fontSize: 40, opacity: 0.5 }} />
        <Typography sx={{ color: "#A8A7A1", fontWeight: 500 }}>
          Hình ảnh đang được cập nhật
        </Typography>
      </Paper>
    );
  }

  const getImgUrl = (img) => (typeof img === "string" ? img : img?.url);

  // Chuẩn bị mảng ảnh cho Lightbox
  const slides = photos.map((img) => ({ src: getImgUrl(img) }));

  return (
    <Box sx={{ position: "relative", mb: 4 }}>
      <Grid container spacing={1.5}>
        {/* ẢNH CHÍNH */}
        <Grid item xs={12} sm={photos.length === 1 ? 12 : 8}>
          <Box
            onClick={() => setOpen(true)} // Ấn vào ảnh chính cũng mở gallery
            sx={{
              overflow: "hidden",
              height: GALLERY_HEIGHT,
              borderRadius: { xs: "16px", sm: "24px 0 0 24px" },
              position: "relative",
              bgcolor: "#f0f0f0",
              cursor: "pointer",
            }}
          >
            <Box
              component="img"
              src={getImgUrl(photos[0])}
              alt="room-main"
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                display: "block",
                transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                "&:hover": { transform: "scale(1.05)" },
              }}
            />
          </Box>
        </Grid>

        {/* CỘT ẢNH PHỤ */}
        {photos.length > 1 && (
          <Grid item xs={12} sm={4} sx={{ display: { xs: "none", sm: "block" } }}>
            <Stack spacing={1.5} sx={{ height: GALLERY_HEIGHT }}>
              {photos.slice(1, 3).map((img, idx) => (
                <Box
                  key={idx}
                  onClick={() => setOpen(true)}
                  sx={{
                    flex: 1,
                    overflow: "hidden",
                    position: "relative",
                    borderRadius: idx === 0 ? "0 24px 0 0" : "0 0 24px 0",
                    bgcolor: "#f0f0f0",
                    cursor: "pointer",
                  }}
                >
                  <Box
                    component="img"
                    src={getImgUrl(img)}
                    alt={`sub-${idx}`}
                    sx={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)",
                      "&:hover": { transform: "scale(1.1)" },
                    }}
                  />

                  {/* Lớp phủ cho ảnh cuối cùng */}
                  {idx === 1 && photos.length > 3 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        bgcolor: "rgba(28,27,25,0.6)",
                        backdropFilter: "blur(3px)",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        zIndex: 2,
                      }}
                    >
                      <Typography sx={{ color: "#C2A56D", fontWeight: 700, fontSize: "1.1rem" }}>
                        +{photos.length - 3} Hình ảnh khác
                      </Typography>
                    </Box>
                  )}
                </Box>
              ))}
            </Stack>
          </Grid>
        )}
      </Grid>

      {/* NÚT XEM TẤT CẢ */}
      <Button
        variant="contained"
        startIcon={<CollectionsOutlinedIcon />}
        onClick={() => setOpen(true)}
        sx={{
          position: "absolute",
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          bgcolor: "#FFF",
          color: "#1C1B19",
          px: 3,
          py: 1,
          borderRadius: "12px",
          textTransform: "none",
          fontWeight: 700,
          boxShadow: "0 8px 20px rgba(0,0,0,0.15)",
          border: "1px solid #EFE7DD",
          zIndex: 10,
          "&:hover": {
            bgcolor: "#1C1B19",
            color: "#C2A56D",
          },
        }}
      >
        Khám phá tất cả ảnh
      </Button>

      {/* LIGHTBOX MODAL - Hiện khi open === true */}
      <Lightbox
        open={open}
        close={() => setOpen(false)}
        slides={slides}
      />
    </Box>
  );
}