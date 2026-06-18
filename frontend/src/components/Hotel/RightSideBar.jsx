import { Box, Typography, Button, Divider, Stack, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";

const MotionBox = motion(Box);

// InfoField nằm ngoài để tránh lỗi render
const InfoField = ({ label, value, color }) => (
  <Box>
    <Typography variant="caption" sx={{ color: "#72716E", fontWeight: 700, fontSize: "0.6rem" }}>
      {label}
    </Typography>
    <Typography sx={{ fontSize: "0.85rem", fontWeight: 700, color: color || "#1C1B19" }}>
      {value}
    </Typography>
  </Box>
);

export default function RightSideBar({ hotel }) {
  const navigate = useNavigate();
  const isActive = hotel?.status === "active";

  return (
    <MotionBox
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      sx={{
        border: "2px solid",
        borderColor: isActive ? "#C2A56D" : "#FFC1C1",
        borderRadius: "20px",
        p: 1.5, // Thu gọn padding
        maxWidth: 320, // Giới hạn độ rộng tối đa
        mx: "auto", // Căn giữa
        position: "sticky",
        top: 100,
        bgcolor: "#FFFFFF",
        boxShadow: isActive ? "0 10px 30px rgba(194, 165, 109, 0.1)" : "none",
      }}
    >
      <Typography sx={{ fontWeight: 800, fontSize: "1.1rem", mb: 1.5, color: "#1C1B19" }}>
        Thông tin lưu trú
      </Typography>

      {/* Grid 2 cột */}
      <Grid container spacing={1.5} sx={{ mb: 1.5 }}>
        <Grid item xs={6}>
          <InfoField label="TRẠNG THÁI" value={isActive ? "Đang đón khách" : "Đóng cửa"} color={isActive ? "#00b14f" : "#ef4444"} />
        </Grid>
        <Grid item xs={6}>
          <InfoField label="ĐÁNH GIÁ" value={`${hotel?.rating || "N/A"}/10`} />
        </Grid>
        <Grid item xs={6}>
          <InfoField label="LOẠI HÌNH" value={hotel?.type || "Khách sạn"} />
        </Grid>
        <Grid item xs={6}>
          <InfoField label="GIỜ CHECKIN/OUT" value={`${hotel?.checkInTime || "14:00"}/${hotel?.checkOutTime || "12:00"}`} />
        </Grid>
      </Grid>

      <Divider sx={{ mb: 1.5 }} />

      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 1, mb: 1 }}>
        <Button
          disabled={!isActive}
          onClick={() => navigate(`/hotels/${hotel?._id}/rooms`)}
          sx={{
            py: 0.8, // Nút mỏng hơn
            px: 2.5,
            borderRadius: "8px",
            fontSize: "0.85rem",
            fontWeight: 800,
            textTransform: "none",
            width: "auto", 
            bgcolor: isActive ? "#1C1B19" : "#F5F5F5",
            color: isActive ? "#C2A56D" : "#BCBCBC",
            "&:hover": { bgcolor: isActive ? "#000" : "#F5F5F5" },
          }}
          startIcon={isActive ? <MeetingRoomIcon /> : null}
        >
          {isActive ? "Xem danh sách phòng" : "Hiện không khả dụng"}
        </Button>
      </Box>

      <Box sx={{ mt: 1, textAlign: "center" }}>
        {isActive && (
          <Stack direction="row" spacing={0.5} alignItems="center" justifyContent="center" mb={0.5}>
            <VerifiedUserIcon sx={{ fontSize: 10, color: "#C2A56D" }} />
            <Typography sx={{ fontSize: "0.65rem", color: "#72716E", fontWeight: 600 }}>Giá trực tiếp từ đối tác</Typography>
          </Stack>
        )}
        <Typography sx={{ fontSize: "0.65rem", color: "#A8A7A1", lineHeight: 1.3 }}>
          {isActive 
            ? "Giá hiển thị là giá khởi điểm. Dịch vụ kèm theo\nsẽ được cập nhật chi tiết ở bước tiếp theo."
            : "Lịch đón khách đang được điều chỉnh.\nVui lòng quay lại sau."}
        </Typography>
      </Box>
    </MotionBox>
  );
}