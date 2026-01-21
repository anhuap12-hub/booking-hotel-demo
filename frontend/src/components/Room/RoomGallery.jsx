import { Grid, Paper, Box, Stack, Button } from "@mui/material";
import CollectionsIcon from "@mui/icons-material/Collections";
import Typography from "@mui/material/Typography";

export default function RoomGallery({ photos = [] }) {
  // 1. Chiều cao cố định cho Gallery (Giảm xuống để không quá to)
  const GALLERY_HEIGHT = 360; 

  if (!photos || photos.length === 0) {
    return (
      <Paper 
        sx={{ 
          height: GALLERY_HEIGHT, 
          bgcolor: "#f5f5f5", 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          borderRadius: 4,
          border: "1px dashed #ccc"
        }}
      >
        <Typography color="text.secondary">Hình ảnh đang được cập nhật</Typography>
      </Paper>
    );
  }

  const getImgUrl = (img) => (typeof img === "string" ? img : img?.url);

  return (
    <Paper 
      elevation={0} 
      sx={{ 
        borderRadius: 4, 
        overflow: "hidden", 
        position: "relative",
        mb: 3,
        bgcolor: "transparent"
      }}
    >
      <Grid container spacing={1.5}> {/* Tăng spacing nhẹ */}
        {/* ẢNH CHÍNH */}
        <Grid item xs={12} sm={photos.length === 1 ? 12 : 8}>
          <Box sx={{ overflow: "hidden", height: GALLERY_HEIGHT, borderRadius: 2 }}>
            <img
              src={getImgUrl(photos[0])}
              alt="room-main"
              style={{ 
                width: "100%", 
                height: "100%", 
                objectFit: "cover",
                display: "block",
                transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
              }}
              onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.03)"}
              onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
            />
          </Box>
        </Grid>

        {/* CỘT ẢNH PHỤ */}
        {photos.length > 1 && (
          <Grid item xs={12} sm={4}>
            <Stack spacing={1.5} sx={{ height: GALLERY_HEIGHT }}>
              {photos.slice(1, 3).map((img, idx) => (
                <Box 
                  key={idx} 
                  sx={{ 
                    flex: 1, 
                    overflow: "hidden",
                    position: "relative",
                    borderRadius: 2 // Bo góc ảnh con
                  }}
                >
                  <img
                    src={getImgUrl(img)}
                    alt={`sub-${idx}`}
                    style={{ 
                      width: "100%", 
                      height: "100%", 
                      objectFit: "cover",
                      display: "block",
                      transition: "transform 0.6s cubic-bezier(0.4, 0, 0.2, 1)"
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                  
                  {/* Lớp phủ số lượng ảnh */}
                  {idx === 1 && photos.length > 3 && (
                    <Box
                      sx={{
                        position: "absolute",
                        top: 0, left: 0, right: 0, bottom: 0,
                        bgcolor: "rgba(0,0,0,0.4)",
                        backdropFilter: "blur(2px)", // Thêm hiệu ứng mờ nhẹ
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        pointerEvents: "none"
                      }}
                    >
                      <Typography sx={{ color: "#fff", fontWeight: 700, fontSize: "1.1rem" }}>
                        +{photos.length - 3} ảnh nữa
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
        startIcon={<CollectionsIcon sx={{ fontSize: "1.2rem !important" }} />}
        sx={{
          position: "absolute",
          bottom: 20,
          right: 20,
          bgcolor: "rgba(255, 255, 255, 0.9)",
          backdropFilter: "blur(4px)",
          color: "#000",
          px: 2,
          py: 0.8,
          borderRadius: 2,
          textTransform: "none",
          fontWeight: 700,
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
          "&:hover": { bgcolor: "#fff", transform: "translateY(-2px)" },
          transition: "all 0.2s ease"
        }}
      >
        Tất cả ảnh
      </Button>
    </Paper>
  );
}