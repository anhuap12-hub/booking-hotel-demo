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
import { useState, useRef, useEffect } from "react";
import { sendChatMessage } from "../../api/chat.api";

const QUESTIONS = [
  { q: "Chính sách hủy phòng miễn phí?", a: "Hầu hết các phòng hỗ trợ hủy miễn phí trước 48h." },
  { q: "Giờ nhận và trả phòng?", a: "Check-in từ 14:00, check-out trước 12:00 trưa hôm sau." },
  { q: "Thanh toán bằng hình thức nào?", a: "Hỗ trợ chuyển khoản ngân hàng hoặc thanh toán trực tiếp." },
  { q: "Tôi cần gặp nhân viên hỗ trợ", a: null },
];

const ZALO_PHONE = "0395193004";
const ZALO_ICON = "https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function ChatSupport() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const scrollRef = useRef(null);

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({
        top: scrollRef.current.scrollHeight,
        behavior: "smooth",
      });
    }
  }, [messages]);

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
    if (!input.trim()) return;
    const userMsgId = Date.now();
    setMessages((prev) => [...prev, { id: userMsgId, from: "user", text: input }]);
    const currentInput = input;
    setInput("");

    try {
      const res = await sendChatMessage(currentInput);
      // Bóc tách data chuẩn theo Backend trả về { success: true, reply: "..." }
      const botReply = res.data?.reply || "Tôi đã nhận được thông tin.";
      setMessages((prev) => [...prev, { id: Date.now(), from: "bot", text: botReply }]);
    } catch (err) {
      let errorText = "Xin lỗi, hệ thống gặp lỗi.";
      if (err.response?.status === 401) errorText = "Bạn chưa đăng nhập.";
      if (err.response?.status === 403) errorText = "Vui lòng xác thực email.";
      setMessages((prev) => [...prev, { id: Date.now(), from: "bot", text: errorText }]);
    }
  };

  return (
    <>
      <Tooltip title="Hỗ trợ trực tuyến" placement="left">
        <MotionButton
          whileHover={{ scale: 1.1, rotate: 5 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            // SỬA TẠI ĐÂY: Dùng background thay vì bgcolor để chạy Gradient
            background: "linear-gradient(135deg, #C2A56D 0%, #1C1B19 100%)",
            color: "#fff",
            minWidth: 64,
            width: 64,
            height: 64,
            borderRadius: "50%",
            boxShadow: "0 8px 32px rgba(194, 165, 109, 0.4)",
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
            <Paper elevation={24} sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid rgba(194, 165, 109, 0.2)" }}>
              {/* HEADER */}
              <Box sx={{ p: 2, background: "#1C1B19", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: "#C2A56D", width: 40, height: 40, border: "2px solid #fff" }}>
                    <SmartToyIcon />
                  </Avatar>
                  <Box>
                    <Typography fontWeight={700} fontSize={14} sx={{ color: "#C2A56D", letterSpacing: 0.5 }}>
                      COFFEE STAY AI
                    </Typography>
                    <Typography fontSize={10} sx={{ opacity: 0.8, display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box component="span" sx={{ width: 6, height: 6, bgcolor: "#4caf50", borderRadius: "50%" }} />
                      Đang trực tuyến
                    </Typography>
                  </Box>
                </Stack>
                <Button size="small" onClick={() => setOpen(false)} sx={{ color: "#fff", minWidth: 0 }}>
                  <CloseIcon fontSize="small" />
                </Button>
              </Box>

              {/* CHAT BODY */}
              <Box 
                ref={scrollRef}
                sx={{ p: 2, height: 320, overflowY: "auto", bgcolor: "#FAF9F6", display: "flex", flexDirection: "column" }}
              >
                {messages.length === 0 && (
                  <Box sx={{ mt: "auto", mb: "auto", textAlign: "center", px: 4 }}>
                    <Typography fontSize={13} color="text.secondary" sx={{ fontStyle: "italic", opacity: 0.7 }}>
                      Xin chào! Tôi có thể giúp gì cho chuyến đi của bạn?
                    </Typography>
                  </Box>
                )}
                <Stack spacing={2}>
                  {messages.map((m) => (
                    <MotionBox
                      key={m.id}
                      initial={{ opacity: 0, x: m.from === "user" ? 10 : -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      sx={{
                        alignSelf: m.from === "user" ? "flex-end" : "flex-start",
                        bgcolor: m.from === "user" ? "#C2A56D" : "#fff",
                        color: m.from === "user" ? "#fff" : "#1C1B19",
                        px: 2,
                        py: 1.5,
                        borderRadius: m.from === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
                        maxWidth: "80%",
                        fontSize: 13,
                        border: m.from === "bot" ? "1px solid #EAE7E0" : "none",
                      }}
                    >
                      {m.text}
                    </MotionBox>
                  ))}
                </Stack>
              </Box>

              {/* FOOTER */}
              <Box sx={{ p: 2, borderTop: "1px solid #EEE", bgcolor: "#fff" }}>
                <Stack spacing={1} mb={2}>
                  <Typography variant="caption" sx={{ color: "#999", fontWeight: 600, ml: 0.5 }}>Gợi ý nhanh:</Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {QUESTIONS.map((q, i) => (
                      <Button 
                        key={i} 
                        variant="outlined"
                        size="small" 
                        onClick={() => handleQuestion(q)} 
                        sx={{ 
                          textTransform: "none", 
                          fontSize: 11, 
                          borderRadius: 4,
                          color: "#1C1B19",
                          borderColor: "#C2A56D",
                          "&:hover": { borderColor: "#1C1B19", bgcolor: "rgba(194, 165, 109, 0.05)" }
                        }}
                      >
                        {q.q}
                      </Button>
                    ))}
                  </Box>
                </Stack>

                <Stack direction="row" spacing={1}>
                  <TextField
                    size="small"
                    fullWidth
                    placeholder="Hỏi về khách sạn, giá phòng..."
                    value={input}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    onChange={(e) => setInput(e.target.value)}
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />
                  <Button 
                    variant="contained" 
                    onClick={handleSend}
                    sx={{ bgcolor: "#1C1B19", "&:hover": { bgcolor: "#C2A56D" }, borderRadius: 2 }}
                  >
                    Gửi
                  </Button>
                </Stack>

                <Button
                  fullWidth
                  onClick={() => window.open(`https://zalo.me/${ZALO_PHONE}`, "_blank")}
                  sx={{ mt: 1.5, bgcolor: "#0068ff", color: "#fff", borderRadius: 2, fontSize: 12, py: 1, "&:hover": { bgcolor: "#0052cc" } }}
                >
                  <img src={ZALO_ICON} alt="Zalo" width={16} style={{ marginRight: 8 }} />
                  Chat với nhân viên qua Zalo
                </Button>
              </Box>
            </Paper>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}