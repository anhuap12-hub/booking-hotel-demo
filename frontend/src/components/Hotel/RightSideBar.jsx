import { Box, Typography, Button, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";

export default function RightSideBar({ hotel }) {
  const navigate = useNavigate();
  const hotelId = hotel?._id;

  return (
    <Box
      sx={{
        border: "1px solid",
        borderColor: "divider",
        borderRadius: 3,
        p: 3,
        position: "sticky",
        top: 90,
        bgcolor: "background.paper",
        boxShadow: "0 10px 28px rgba(0,0,0,0.06)",
      }}
    >
      <Typography
        sx={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.25rem",
          fontWeight: 500,
          color: "text.primary",
          mb: 1.5,
        }}
      >
        Thông tin lưu trú
      </Typography>

      <Typography fontSize={13.5} color="text.secondary">
        Trạng thái
      </Typography>
      <Typography fontWeight={500} mb={1.5} color="text.primary">
        {hotel?.status || "Đang hoạt động"}
      </Typography>

      <Divider sx={{ my: 2 }} />

      <Typography fontSize={13.5} color="text.secondary">
        Đánh giá
      </Typography>
      <Typography fontWeight={500} color="text.primary">
        ⭐ {hotel?.rating || "Mới"}
      </Typography>

      <Divider sx={{ my: 2.5 }} />

      <Button
        fullWidth
        size="large"
        disabled={!hotelId}
        onClick={() => navigate(`/hotels/${hotelId}/rooms`)}
        sx={{
          py: 1.4,
          borderRadius: 999,
          fontWeight: 600,
          bgcolor: "primary.main",
          color: "#1C1C1C",
          "&:hover": {
            bgcolor: "#9A7B56",
          },
        }}
      >
        Xem phòng trống
      </Button>

      <Typography
        mt={1.2}
        fontSize={12.5}
        color="text.secondary"
        textAlign="center"
      >
        Xem danh sách phòng & giá chi tiết
      </Typography>
    </Box>
  );
}
