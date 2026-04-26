import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button"; 
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { sendChatMessage } from "../../api/chat.api";

const QUESTIONS = [
  { q: "Chính sách hủy phòng miễn phí?", a: "Hầu hết các phòng hỗ trợ hủy miễn phí trước 48h." },
  { q: "Giờ nhận và trả phòng?", a: "Check-in từ 14:00, check-out trước 12:00 trưa hôm sau." },
  { q: "Thanh toán bằng hình thức nào?", a: "Hỗ trợ chuyển khoản ngân hàng hoặc thanh toán trực tiếp." },
  { q: "Tôi cần gặp nhân viên hỗ trợ", a: null },
];

const ZALO_PHONE = "0395193004";
const ZALO_ICON = "https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg";
const AUTO_REMOVE_TIME = 5000;

const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function ChatSupport() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleQuestion = (item) => {
    const id = Date.now();
    setMessages((prev) => [...prev, { id, from: "user", text: item.q }]);

    if (!item.a) {
      window.open(`https://zalo.me/${ZALO_PHONE}`, "_blank");
      return;
    }

    setTimeout(() => {
      setMessages((prev) => [...prev, { id: id + 1, from: "bot", text: item.a }]);
    }, 600);
  };

  const handleSend = async () => {
    if (!input) return;
    const id = Date.now();
    setMessages((prev) => [...prev, { id, from: "user", text: input }]);
    setInput("");

    try {
      const res = await sendChatMessage(input);
      setMessages((prev) => [...prev, { id: id + 1, from: "bot", text: res.data.reply }]);
    } catch (err) {
  if (err.response?.status === 401) {
    setMessages((prev) => [...prev, { id: id + 1, from: "bot", text: "Bạn chưa đăng nhập." }]);
  } else if (err.response?.status === 403) {
    setMessages((prev) => [...prev, { id: id + 1, from: "bot", text: "Vui lòng xác thực email trước khi tiếp tục." }]);
  } else {
    setMessages((prev) => [...prev, { id: id + 1, from: "bot", text: "Xin lỗi, hệ thống gặp lỗi." }]);
  }
}
  };

  return (
    <>
      <Tooltip title="Hỗ trợ trực tuyến" placement="left">
        <MotionButton
          whileHover={{ scale: 1.15, rotate: 10 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            bgcolor: "linear-gradient(135deg, #C2A56D, #1C1B19)",
            color: "#fff",
            minWidth: 64,
            width: 64,
            height: 64,
            borderRadius: "50%",
            boxShadow: "0 8px 25px rgba(0,0,0,0.3)",
            zIndex: 2000,
            p: 0,
          }}
        >
          <ChatBubbleOutlineIcon fontSize="large" />
        </MotionButton>
      </Tooltip>

      <AnimatePresence>
        {open && (
          <MotionBox
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            sx={{
              position: "fixed",
              bottom: 100,
              right: 30,
              width: { xs: "calc(100% - 60px)", sm: 380 },
              zIndex: 2000,
            }}
          >
            <Paper elevation={20} sx={{ borderRadius: 5, overflow: "hidden" }}>
              {/* HEADER */}
              <Box sx={{ p: 2.5, bgcolor: "#1C1B19", color: "#fff", display: "flex", justifyContent: "space-between" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: "#C2A56D", width: 40, height: 40 }}>
                    <SmartToyIcon />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700} fontSize={15} sx={{ color: "#C2A56D" }}>
                      Coffee Stay Concierge
                    </Typography>
                    <Typography fontSize={11} sx={{ opacity: 0.7 }}>
                      Trợ lý ảo đang trực tuyến
                    </Typography>
                  </Box>
                </Stack>
                <Button size="small" onClick={() => setOpen(false)} sx={{ color: "#fff", opacity: 0.6 }}>
                  <CloseIcon fontSize="small" />
                </Button>
              </Box>

              {/* CHAT BODY */}
              <Box sx={{ p: 2, height: 280, overflowY: "auto", bgcolor: "#FAF9F6" }}>
                {messages.length === 0 && (
                  <Typography fontSize={13} color="text.secondary" textAlign="center" mt={2} sx={{ fontStyle: "italic" }}>
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
                        border: m.from === "bot" ? "1px solid #E5E2DC" : "none",
                      }}
                    >
                      {m.text}
                    </MotionBox>
                  ))}
                </Stack>
              </Box>

              {/* FOOTER: FAQ + Input */}
              <Box sx={{ p: 2, borderTop: "1px solid #E5E2DC", bgcolor: "#fff" }}>
                <Typography variant="caption" sx={{ fontWeight: 700, color: "#A09F9C", mb: 1.5 }}>
                  Câu hỏi thường gặp
                </Typography>
                <Stack spacing={1}>
                  {QUESTIONS.map((q, i) => (
                    <Button key={i} size="small" onClick={() => handleQuestion(q)} sx={{ textTransform: "none" }}>
                      {q.q}
                    </Button>
                  ))}
                </Stack>

                {/* Input chat tự do */}
                <Stack direction="row" spacing={1} mt={2}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Nhập câu hỏi..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                  />
                  <Button variant="contained" onClick={handleSend}>
                    Gửi
                  </Button>
                </Stack>

                <Button
                  fullWidth
                  onClick={() => window.open(`https://zalo.me/${ZALO_PHONE}`, "_blank")}
                  sx={{ mt: 2, bgcolor: "#0068ff", color: "#fff", borderRadius: 2 }}
                >
                  <img src={ZALO_ICON} alt="Zalo" width={18} style={{ marginRight: 8 }} />
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