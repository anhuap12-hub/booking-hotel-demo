import { Box, Typography, Button, Divider, Stack } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";

const MotionBox = motion(Box);

export default function RightSideBar({ hotel }) {
  const navigate = useNavigate();
  const hotelId = hotel?._id;

  return (
    <MotionBox
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, delay: 0.2 }}
      sx={{
        border: "1px solid #F1F0EE",
        borderRadius: "24px",
        p: 3.5,
        position: "sticky",
        top: 100,
        bgcolor: "#FFFFFF",
        boxShadow: "0 20px 50px rgba(28, 27, 25, 0.05)",
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
        {/* TRẠNG THÁI */}
        <Box>
          <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Trạng thái
          </Typography>
          <Stack direction="row" alignItems="center" spacing={1} mt={0.5}>
            <Box sx={{ width: 8, height: 8, bgcolor: "#00b14f", borderRadius: "50%" }} />
            <Typography sx={{ fontWeight: 600, color: "#1C1B19", fontSize: "0.95rem" }}>
              {hotel?.status || "Đang hoạt động"}
            </Typography>
          </Stack>
        </Box>

        <Divider sx={{ borderColor: "#F1F0EE" }} />

        {/* ĐÁNH GIÁ */}
        <Box>
          <Typography variant="caption" sx={{ color: "#A8A7A1", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.1em" }}>
            Hạng mức
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
          disabled={!hotelId}
          onClick={() => navigate(`/hotels/${hotelId}/rooms`)}
          component={motion.button}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          sx={{
            py: 1.8,
            borderRadius: "14px",
            fontWeight: 800,
            bgcolor: "#1C1B19",
            color: "#C2A56D",
            textTransform: "none",
            fontSize: "1rem",
            "&:hover": {
              bgcolor: "#2D2C29",
              boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
            },
            "&.Mui-disabled": {
              bgcolor: "#F1F0EE",
              color: "#A8A7A1"
            }
          }}
        >
          Xem phòng trống
        </Button>

        <Stack direction="row" spacing={1} justifyContent="center" mt={2} alignItems="center" sx={{ opacity: 0.6 }}>
          <VerifiedUserIcon sx={{ fontSize: 14, color: "#C2A56D" }} />
          <Typography fontSize={12} fontWeight={500} color="#72716E">
            Đảm bảo giá tốt nhất
          </Typography>
        </Stack>
      </Box>

      {/* FOOTER WIDGET */}
      <Box 
        sx={{ 
          mt: 4, pt: 3, 
          borderTop: "1px dashed #F1F0EE", 
          display: "flex", 
          gap: 1.5, 
          alignItems: "flex-start" 
        }}
      >
        <InfoOutlinedIcon sx={{ fontSize: 18, color: "#C2A56D", mt: 0.2 }} />
        <Typography fontSize={12} color="#72716E" lineHeight={1.5}>
          Giá phòng có thể thay đổi tùy theo thời điểm và hạng phòng bạn chọn.
        </Typography>
      </Box>
    </MotionBox>
  );
}