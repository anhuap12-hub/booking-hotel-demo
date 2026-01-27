import { Box, Typography, Button, Divider, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ErrorOutlineIcon from "@mui/icons-material/ErrorOutline"; // Thêm icon cảnh báo
import MeetingRoomIcon from "@mui/icons-material/MeetingRoom";
const MotionBox = motion(Box);

export default function RightSideBar({ hotel }) {
  const navigate = useNavigate();
  const hotelId = hotel?._id;
  
  // Logic kiểm tra trạng thái Production
  const isActive = hotel?.status === "active";

  return (
    <MotionBox
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      sx={{
        // --- PHẦN VIỀN ĐÃ CẬP NHẬT ---
        border: "2px solid", 
        borderColor: isActive ? "#C2A56D" : "#FFC1C1", 
        borderRadius: "24px",
        p: 3.5,
        position: "sticky",
        top: 100,
        bgcolor: "#FFFFFF",
        boxShadow: isActive 
          ? "0 20px 50px rgba(194, 165, 109, 0.15)" 
          : "0 10px 30px rgba(239, 68, 68, 0.08)",
      }}
    >
      <Typography
        sx={{
          fontFamily: "'Playfair Display', serif",
          fontSize: "1.4rem",
          fontWeight: 800,
          color: "#1C1B19",
          mb: 2.5,
          letterSpacing: "-0.01em"
        }}
      >
        Thông tin lưu trú
      </Typography>

      <Stack spacing={2.5}>
        <Box>
          <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Trạng thái vận hành
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            <Box sx={{ width: 8, height: 8, bgcolor: isActive ? "#00b14f" : "#ef4444", borderRadius: "50%" }} />
            <Typography sx={{ fontWeight: 600, color: "#1C1B19", fontSize: "0.95rem" }}>
              {isActive ? "Đang đón khách" : "Tạm ngưng nhận lịch"}
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "#F1F0EE" }} />

        <Box>
          <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Hạng mức tin cậy
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            <Typography sx={{ fontWeight: 800, color: "#1C1B19", fontSize: "1.1rem" }}>
              {hotel?.rating || "Mới"}
            </Typography>
            <Typography sx={{ color: "#C2A56D", fontSize: "0.9rem", fontWeight: 600 }}>
              Tuyệt vời
            </Typography>
          </Stack>
        </Box>
      </Stack>

      <Box sx={{ mt: 4 }}>
        <Button
          fullWidth
          size="large"
          disabled={!hotelId || !isActive}
          onClick={() => navigate(`/hotels/${hotelId}/rooms`)}
          component={motion.button}
          whileHover={isActive ? { scale: 1.02 } : {}}
          whileTap={isActive ? { scale: 0.98 } : {}}
          startIcon={isActive ? <MeetingRoomIcon /> : null} // Thêm icon cho sinh động
          sx={{
            py: 1.8,
            borderRadius: "14px",
            fontWeight: 800,
            textTransform: "none",
            fontSize: "1rem",
            bgcolor: isActive ? "#1C1B19" : "#F5F5F5",
            color: isActive ? "#C2A56D" : "#BCBCBC",
            border: isActive ? "none" : "1px solid #E5E2DC",
            "&:hover": {
              bgcolor: isActive ? "#2D2C29" : "#F5F5F5",
              boxShadow: isActive ? "0 10px 20px rgba(0,0,0,0.15)" : "none",
            },
            "&.Mui-disabled": {
              bgcolor: "#F5F5F5",
              color: "#BCBCBC",
            }
          }}
        >
          {isActive ? "Xem danh sách phòng" : "Hiện không khả dụng"}
        </Button>

        {!isActive && (
          <Stack direction="row" spacing={0.8} mt={1.5} justifyContent="center" alignItems="center" sx={{ color: "#ef4444" }}>
            <ErrorOutlineIcon sx={{ fontSize: 15 }} />
            <Typography fontSize={11.5} fontWeight={600}>
              Chỗ nghỉ này hiện đang đóng cửa
            </Typography>
          </Stack>
        )}

        {isActive && (
          <Stack direction="row" spacing={1} justifyContent="center" mt={2.5} alignItems="center" sx={{ opacity: 0.6 }}>
            <VerifiedUserIcon sx={{ fontSize: 14, color: "#C2A56D" }} />
            <Typography fontSize={12} fontWeight={500} color="#72716E">
              Đảm bảo giá trực tiếp từ đối tác
            </Typography>
          </Stack>
        )}
      </Box>

      <Box 
        sx={{ 
          mt: 4, pt: 3, 
          borderTop: "1px dashed #F1F0EE", 
          display: "flex", 
          gap: 1.5, 
          alignItems: "flex-start" 
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 18, color: isActive ? "#C2A56D" : "#A8A7A1", mt: 0.2 }} />
        <Typography fontSize={11.5} color="#72716E" lineHeight={1.6}>
          {isActive 
            ? "Giá hiển thị tại danh sách phòng là giá khởi điểm. Tùy chọn hạng phòng và dịch vụ kèm theo sẽ được cập nhật tại bước tiếp theo."
            : "Lịch đón khách tại chỗ nghỉ này đang được điều chỉnh. Vui lòng quay lại sau hoặc chọn các điểm lưu trú khác."}
        </Typography>
      </Box>
    </MotionBox>
  );
}