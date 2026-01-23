import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
// Tách lẻ Icon để đảm bảo bundle không bị lỗi
import CloseIcon from "@mui/icons-material/Close";
import { useNavigate } from "react-router-dom";

export default function GeniusModal({ open, onClose }) {
  const navigate = useNavigate();
  return (
    <Modal 
      open={open} 
      onClose={onClose}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          width: 420,
          maxWidth: "90vw",
          bgcolor: "#f7f5f2",
          borderRadius: 3,
          p: 4,
          position: "relative",
          textAlign: "center",
          border: "1px solid #e6e1d9",
          boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
          outline: "none", 
        }}
      >
        <Button
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            minWidth: 40,
            width: 40,
            height: 40,
            borderRadius: "50%",
            color: "#6f6b63",
            p: 0,
            "&:hover": { bgcolor: "rgba(0,0,0,0.04)" }
          }}
        >
          <CloseIcon fontSize="small" />
        </Button>

        {/* BADGE */}
        <Typography
          sx={{
            fontSize: 11,
            letterSpacing: 1.5,
            textTransform: "uppercase",
            color: "#8a8377",
            mb: 1,
          }}
        >
          Members privilege
        </Typography>

        {/* TITLE */}
        <Typography
          sx={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: 0.4,
            mb: 1,
            color: "#2b2b2b",
          }}
        >
          Genius
        </Typography>

        {/* DESCRIPTION */}
        <Typography
          sx={{
            fontSize: 14,
            color: "#5f5b53",
            mb: 3,
            lineHeight: 1.6,
          }}
        >
          Đăng nhập để tiết kiệm{" "}
          <Box component="span" sx={{ fontWeight: 600, color: "#3a342b" }}>
            tối thiểu 10%
          </Box>{" "}
          cho mỗi lần lưu trú với chương trình Genius.
        </Typography>

        {/* CTA */}
        <Button
          fullWidth
          size="large"
          onClick={() => navigate("/login")}
          sx={{
            bgcolor: "#3a342b",
            color: "#fff",
            textTransform: "none",
            fontSize: 14,
            letterSpacing: 0.3,
            py: 1.2,
            borderRadius: 2,
            "&:hover": {
              bgcolor: "#2f2a23",
            },
          }}
        >
          Đăng nhập hoặc tạo tài khoản
        </Button>

        {/* FOOT NOTE */}
        <Typography
          sx={{
            fontSize: 11,
            color: "#8a8377",
            mt: 2,
          }}
        >
          Ưu đãi dành riêng cho thành viên
        </Typography>
      </Box>
    </Modal>
  );
}