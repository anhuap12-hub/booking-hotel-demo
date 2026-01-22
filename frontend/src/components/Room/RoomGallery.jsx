import { Grid, Paper, Box, Stack, Button, Typography } from "@mui/material";
import CollectionsOutlinedIcon from "@mui/icons-material/CollectionsOutlined";

export default function RoomGallery({ photos = [] }) {
  // 1. Giữ nguyên logic chiều cao nhưng sử dụng height cụ thể để tránh lỗi render
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
          mb: 4
        }}
      >
        <CollectionsOutlinedIcon sx={{ color: "#C2A56D", fontSize: 40, opacity: 0.5 }} />
        <Typography sx={{ color: "#A8A7A1", fontWeight: 500 }}>Hình ảnh đang được cập nhật</Typography>
      </Paper>
    );
  }

  // Giữ nguyên logic lấy URL
  const getImgUrl = (img) => (typeof img === "string" ? img : img?.url);

  return (
    <Box sx={{ position: "relative", mb: 4 }}>
      <Grid container spacing={1.5}>
        {/* ẢNH CHÍNH (Bên trái) */}
        <Grid item xs={12} sm={photos.length === 1 ? 12 : 8}>
          <Box 
            sx={{ 
              overflow: "hidden", 
              height: GALLERY_HEIGHT, 
              // Bo góc thông minh: Mobile bo đều, Desktop chỉ bo trái
              borderRadius: { xs: "16px", sm: "24px 0 0 24px" },
              position: "relative",
              bgcolor: "#f0f0f0" 
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
                "&:hover": { transform: "scale(1.05)" }
              }}
            />
          </Box>
        </Grid>

        {/* CỘT ẢNH PHỤ (Bên phải) */}
        {photos.length > 1 && (
          <Grid item xs={12} sm={4} sx={{ display: { xs: "none", sm: "block" } }}>
            <Stack spacing={1.5} sx={{ height: GALLERY_HEIGHT }}>
              {photos.slice(1, 3).map((img, idx) => (
                <Box 
                  key={idx} 
                  sx={{ 
                    flex: 1, 
                    overflow: "hidden",
                    position: "relative",
                    // Chỉ bo góc phải (trên và dưới)
                    borderRadius: idx === 0 ? "0 24px 0 0" : "0 0 24px 0",
                    bgcolor: "#f0f0f0"
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
                      "&:hover": { transform: "scale(1.1)" }
                    }}
                  />
                  
                  {/* Giữ nguyên logic Overlay */}
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
                        pointerEvents: "none",
                        zIndex: 2
                      }}
                    >
                      <Typography sx={{ color: "#C2A56D", fontWeight: 700, fontSize: "1.1rem" }}>
                        +{photos.length - 3} Tuyệt tác khác
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
          zIndex: 10, // Đảm bảo luôn nằm trên ảnh
          "&:hover": { 
            bgcolor: "#1C1B19", 
            color: "#C2A56D",
          },
        }}
      >
        Khám phá tất cả ảnh
      </Button>
    </Box>
  );
}