import {
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogActions,
  Stack,
} from "@mui/material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

export default function RoomCard({ room, onBook }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [openLogin, setOpenLogin] = useState(false);

  // ===== DISCOUNT LOGIC (FIX CỨNG) =====
  const discountPercent =
    typeof room.discountPercent === "number"
      ? room.discountPercent
      : typeof room.discount === "number"
      ? room.discount
      : 0;

  const hasDiscount = discountPercent > 0;

  const finalPrice = hasDiscount
    ? Math.round(room.price * (1 - discountPercent / 100))
    : room.price;

  const handleBookClick = () => {
    if (!user) {
      setOpenLogin(true);
      return;
    }
    onBook(room);
  };

  return (
    <>
      <Card
        sx={{
          display: "flex",
          borderRadius: 3,
          overflow: "hidden",
          boxShadow: "0 10px 26px rgba(0,0,0,0.06)",
        }}
      >
        {/* IMAGE */}
        <Box sx={{ position: "relative" }}>
          <CardMedia
            component="img"
            sx={{ width: 260, filter: "brightness(0.95)" }}
            image={
              room.photos?.[0]?.url ||
              "https://images.pexels.com/photos/271618/pexels-photo-271618.jpeg"
            }
            alt={room.name}
          />

          {hasDiscount && (
            <Chip
              label={`-${discountPercent}%`}
              size="small"
              sx={{
                position: "absolute",
                top: 12,
                left: 12,
                bgcolor: "#1C1C1C",
                color: "#fff",
                fontWeight: 700,
              }}
            />
          )}
        </Box>

        {/* CONTENT */}
        <CardContent sx={{ flex: 1 }}>
          <Typography sx={{ fontSize: 13, color: "text.secondary", mb: 0.5 }}>
            {room.type?.toUpperCase()}
          </Typography>

          <Typography
            sx={{
              fontFamily: "Playfair Display, serif",
              fontSize: "1.1rem",
              fontWeight: 500,
            }}
          >
            {room.name}
          </Typography>

          <Typography sx={{ fontSize: 14, color: "text.secondary", mt: 1 }}>
            {room.maxPeople} khách · {room.amenities?.slice(0, 3).join(", ")}
          </Typography>

          <Box mt={1}>
            <Chip
              size="small"
              label={
                room.cancellationPolicy
                  ? `Huỷ miễn phí trước ${room.cancellationPolicy.freeCancelBeforeHours}h · Hoàn ${room.cancellationPolicy.refundPercent}%`
                  : "Huỷ linh hoạt"
              }
              sx={{ bgcolor: "#EFEAE3", color: "text.secondary" }}
            />
          </Box>

          {/* PRICE */}
          <Box
            mt={2}
            display="flex"
            justifyContent="space-between"
            alignItems="center"
          >
            <Box>
              {hasDiscount && (
                <Typography
                  sx={{
                    fontSize: 13,
                    color: "text.secondary",
                    textDecoration: "line-through",
                  }}
                >
                  {room.price.toLocaleString("vi-VN")} ₫
                </Typography>
              )}

              <Typography sx={{ fontWeight: 700, fontSize: "1.1rem" }}>
                {finalPrice.toLocaleString("vi-VN")} ₫
                <Typography component="span" sx={{ fontWeight: 400 }}>
                  {" "}
                  / đêm
                </Typography>
              </Typography>
            </Box>

            <Button
              size="large"
              onClick={handleBookClick}
              sx={{
                px: 3,
                py: 1,
                fontSize: 14,
                borderRadius: 999,
                fontWeight: 600,
                bgcolor: "primary.main",
                color: "#1C1C1C",
                textTransform: "none",
                "&:hover": { bgcolor: "#9A7B56" },
              }}
            >
              Đặt phòng
            </Button>
          </Box>
        </CardContent>
      </Card>

      {/* LOGIN DIALOG */}
      <Dialog
        open={openLogin}
        onClose={() => setOpenLogin(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 4, px: 2, py: 3 } }}
      >
        <DialogContent>
          <Stack spacing={2} alignItems="center" textAlign="center">
            <Box
              sx={{
                width: 64,
                height: 64,
                borderRadius: "50%",
                bgcolor: "#EFEAE3",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 28,
              }}
            >
              ☕
            </Box>

            <Typography
              sx={{
                fontFamily: "Playfair Display, serif",
                fontSize: "1.25rem",
                fontWeight: 500,
              }}
            >
              Cần đăng nhập để tiếp tục
            </Typography>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic", maxWidth: 260 }}
            >
              “Chỉ một bước nhỏ nữa thôi, để căn phòng chờ đón bạn.”
            </Typography>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ justifyContent: "center", pb: 2 }}>
          <Stack spacing={1.5} width="100%">
            <Button
              size="large"
              onClick={() => navigate("/login")}
              sx={{
                borderRadius: 999,
                bgcolor: "primary.main",
                color: "#1C1C1C",
                fontWeight: 600,
                "&:hover": { bgcolor: "#9A7B56" },
              }}
            >
              Đăng nhập
            </Button>

            <Button
              onClick={() => setOpenLogin(false)}
              sx={{ color: "text.secondary", textTransform: "none" }}
            >
              Để sau
            </Button>
          </Stack>
        </DialogActions>
      </Dialog>
    </>
  );
}
