import { Modal, Box, Typography, Button, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function GeniusModal({ open, onClose }) {
  return (
    <Modal 
      open={open} 
      onClose={onClose}
      // Căn giữa Modal hoàn hảo bằng Flexbox
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
          // Đã loại bỏ mt: "15vh" và mx: "auto" vì Modal cha đã xử lý căn giữa
          position: "relative",
          textAlign: "center",
          border: "1px solid #e6e1d9",
          boxShadow: "0 30px 80px rgba(0,0,0,0.25)",
          outline: "none", // Loại bỏ viền xanh mặc định khi Modal focus
        }}
      >
        {/* CLOSE */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            color: "#6f6b63",
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

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
          onClick={() => (window.location.href = "/login")}
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