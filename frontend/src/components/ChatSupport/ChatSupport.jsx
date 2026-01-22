import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Stack,
  Avatar,
  Tooltip,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import HeadsetMicIcon from '@mui/icons-material/HeadsetMic';
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* ================= QUESTIONS ================= */
const QUESTIONS = [
  {
    q: "Chính sách hủy phòng miễn phí?",
    a: "Tại Coffee Stay, hầu hết các phòng đều hỗ trợ hủy miễn phí trước 48h. Chi tiết sẽ được hiển thị trong xác nhận đặt phòng của bạn.",
  },
  {
    q: "Giờ nhận và trả phòng?",
    a: "Thời gian nhận phòng là từ 14:00 và trả phòng trước 12:00 trưa hôm sau.",
  },
  {
    q: "Thanh toán bằng hình thức nào?",
    a: "Chúng tôi hỗ trợ chuyển khoản ngân hàng (cọc 30%) và thanh toán phần còn lại khi nhận phòng.",
  },
  {
    q: "Tôi cần gặp nhân viên hỗ trợ",
    a: null, // Mở Zalo
  },
];

const ZALO_PHONE = "0395193004";
const ZALO_ICON = "https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg";
const BOT_AVATAR = "https://cdn-icons-png.flaticon.com/512/4712/4712109.png";
const AUTO_REMOVE_TIME = 5000;

const MotionBox = motion(Box);

export default function ChatSupport() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleQuestion = (item) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, from: "user", text: item.q }]);

    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, AUTO_REMOVE_TIME);

    if (!item.a) {
      window.open(`https://zalo.me/${ZALO_PHONE}`, "_blank");
      return;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: id + 1, from: "bot", text: item.a }]);
    }, 600);
  };

  return (
    <>
      {/* FLOAT CHAT BUTTON */}
      <Tooltip title="Hỗ trợ trực tuyến" placement="left">
        <IconButton
          component={motion.button}
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            bgcolor: "#1C1B19",
            color: "#C2A56D",
            width: 60,
            height: 60,
            borderRadius: "20px",
            boxShadow: "0 10px 30px rgba(0,0,0,0.2)",
            zIndex: 2000,
            "&:hover": { bgcolor: "#333" },
          }}
        >
          <ChatBubbleOutlineIcon />
        </IconButton>
      </Tooltip>

      {/* CHAT BOX */}
      <AnimatePresence>
        {open && (
          <MotionBox
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            style={{
              position: "fixed",
              bottom: 100,
              right: 30,
              width: { xs: "calc(100% - 60px)", sm: 380 },
              zIndex: 2000,
            }}
          >
            <Paper
              elevation={20}
              sx={{
                borderRadius: 5,
                overflow: "hidden",
                border: "1px solid rgba(194, 165, 109, 0.2)",
                bgcolor: "#fff",
              }}
            >
              {/* HEADER */}
              <Box
                sx={{
                  p: 2.5,
                  bgcolor: "#1C1B19",
                  color: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar 
                    src={BOT_AVATAR} 
                    sx={{ width: 40, height: 40, border: '2px solid #C2A56D' }} 
                  />
                  <Box>
                    <Typography fontWeight={700} fontSize={15} sx={{ color: '#C2A56D' }}>
                      Coffee Stay Concierge
                    </Typography>
                    <Typography fontSize={11} sx={{ opacity: 0.7 }}>
                      Trợ lý ảo đang trực tuyến
                    </Typography>
                  </Box>
                </Stack>
                <IconButton size="small" onClick={() => setOpen(false)} sx={{ color: "#fff", opacity: 0.6 }}>
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>

              {/* CHAT BODY */}
              <Box sx={{ p: 2, height: 280, overflowY: "auto", bgcolor: "#FAF9F6" }}>
                <AnimatePresence>
                  {messages.length === 0 && (
                    <Typography fontSize={13} color="text.secondary" textAlign="center" mt={2} sx={{ fontStyle: 'italic' }}>
                      Xin chào, tôi có thể giúp gì cho kỳ nghỉ của bạn?
                    </Typography>
                  )}

                  <Stack spacing={2}>
                    {messages.map((m) => (
                      <MotionBox
                        key={m.id}
                        initial={{ opacity: 0, x: m.from === "user" ? 20 : -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        sx={{
                          alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                          bgcolor: m.from === "user" ? "#C2A56D" : "#fff",
                          color: m.from === "user" ? "#fff" : "#1C1B19",
                          px: 2,
                          py: 1.2,
                          borderRadius: m.from === "user" ? "18px 18px 2px 18px" : "18px 18px 18px 2px",
                          boxShadow: "0 2px 10px rgba(0,0,0,0.05)",
                          maxWidth: "85%",
                          fontSize: 13,
                          lineHeight: 1.5,
                          border: m.from === "bot" ? "1px solid #E5E2DC" : "none"
                        }}
                      >
                        {m.text}
                      </MotionBox>
                    ))}
                  </Stack>
                </AnimatePresence>
              </Box>

              {/* QUICK QUESTIONS MENU */}
              <Box sx={{ p: 2, borderTop: "1px solid #E5E2DC", bgcolor: "#fff" }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: '#A09F9C', mb: 1.5, display: 'block', textTransform: 'uppercase', letterSpacing: 1 }}>
                  Câu hỏi thường gặp
                </Typography>
                <Stack spacing={1}>
                  {QUESTIONS.map((q, i) => (
                    <Button
                      key={i}
                      size="small"
                      onClick={() => handleQuestion(q)}
                      sx={{
                        justifyContent: "flex-start",
                        textAlign: "left",
                        borderRadius: 2,
                        color: "#444",
                        fontSize: 12,
                        textTransform: "none",
                        py: 1,
                        px: 1.5,
                        border: "1px solid #F1EDE7",
                        "&:hover": { 
                          bgcolor: "#F9F7F2", 
                          borderColor: "#C2A56D",
                          color: "#C2A56D" 
                        },
                      }}
                    >
                      {q.q}
                    </Button>
                  ))}
                </Stack>
                
                {/* ZALO DIRECT LINK */}
                <Button
                  fullWidth
                  onClick={() => window.open(`https://zalo.me/${ZALO_PHONE}`, "_blank")}
                  sx={{
                    mt: 2,
                    bgcolor: "#0068ff",
                    color: "#fff",
                    borderRadius: 2,
                    fontSize: 12,
                    fontWeight: 700,
                    textTransform: "none",
                    gap: 1,
                    "&:hover": { bgcolor: "#0056d2" }
                  }}
                >
                  <img src={ZALO_ICON} alt="Zalo" width={18} />
                  Chat trực tiếp qua Zalo
                </Button>
              </Box>
            </Paper>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}