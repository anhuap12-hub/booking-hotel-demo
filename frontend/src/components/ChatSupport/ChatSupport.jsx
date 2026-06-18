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
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../../api/chat.api";

const BLUE = "#0056b3";
const LIGHT_BG = "#f8f9fa";

const QUESTIONS = [
  { q: "Chính sách hủy?", a: "Hủy miễn phí trước 48h." },
  { q: "Giờ check-in?", a: "Check-in 14:00, Check-out 12:00." },
  { q: "Tìm phòng Hà Nội", a: null },
];

export default function ChatSupport() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, isTyping]);

  const handleSend = async (customInput) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isTyping) return;
    setMessages((prev) => [...prev, { id: Date.now(), from: "user", text: textToSend }]);
    setInput("");
    setIsTyping(true);
    try {
      const res = await sendChatMessage(textToSend);
      const { reply, hotels } = res.data;
      setMessages((prev) => [...prev, { id: Date.now(), from: "bot", text: reply, hotels: hotels || [] }]);
    } catch (err) {
      setMessages((prev) => [...prev, { id: Date.now(), from: "bot", text: "Hệ thống đang bận, vui lòng thử lại sau!" }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      <Tooltip title="Hỗ trợ trực tuyến" placement="left">
        <motion.button whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }} onClick={() => setOpen(true)}
          style={{ position: "fixed", bottom: 30, right: 30, zIndex: 2000, background: BLUE, color: "#fff", width: 60, height: 60, borderRadius: "50%", border: "none", cursor: "pointer", boxShadow: "0 4px 15px rgba(0, 86, 179, 0.3)" }}
        >
          <ChatBubbleOutlineIcon />
        </motion.button>
      </Tooltip>

      <AnimatePresence>
        {open && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 20 }}
            style={{ position: "fixed", bottom: 100, right: 30, width: 360, zIndex: 2000 }}
          >
            <Paper elevation={12} sx={{ borderRadius: 3, overflow: "hidden", border: `1px solid ${BLUE}` }}>
              {/* Header */}
              <Box sx={{ p: 2, bgcolor: BLUE, color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: "#fff", color: BLUE }}><SmartToyIcon /></Avatar>
                  <Box>
                    <Typography fontWeight={700} fontSize={14}>HỖ TRỢ AI</Typography>
                    <Typography fontSize={10} sx={{ opacity: 0.8 }}>● Đang trực tuyến</Typography>
                  </Box>
                </Stack>
                <Button size="small" onClick={() => setOpen(false)} sx={{ color: "#fff", minWidth: 0 }}><CloseIcon /></Button>
              </Box>

              {/* Chat Body */}
              <Box ref={scrollRef} sx={{ p: 2, height: 320, overflowY: "auto", bgcolor: LIGHT_BG }}>
                <Stack spacing={2}>
                  {messages.map((m) => (
                    <Box key={m.id} sx={{ alignSelf: m.from === "user" ? "flex-end" : "flex-start", width: "100%", display: "flex", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start" }}>
                      <Box sx={{ bgcolor: m.from === "user" ? BLUE : "#fff", color: m.from === "user" ? "#fff" : "#333", px: 2, py: 1, borderRadius: 2, fontSize: 13, border: m.from === "bot" ? "1px solid #e0e0e0" : "none" }}>{m.text}</Box>
                      {m.hotels?.length > 0 && (
                        <Box sx={{ display: "flex", gap: 1, overflowX: "auto", pt: 1, width: "100%" }}>
                          {m.hotels.map((h) => (
                            <Paper key={h._id} onClick={() => navigate(`/hotels/${h._id}`)} sx={{ minWidth: 150, borderRadius: 2, overflow: "hidden", border: "1px solid #e0e0e0", cursor: "pointer", flexShrink: 0 }}>
                              <img src={h.photos?.[0]?.url} alt={h.name} style={{ width: "100%", height: 80, objectFit: "cover" }} />
                              <Box sx={{ p: 1 }}>
                                <Typography fontSize={11} fontWeight={700} noWrap>{h.name}</Typography>
                                <Stack direction="row" spacing={0.5} sx={{ my: 0.3 }}>
                                  <Typography fontSize={8} sx={{ bgcolor: "#eef2f7", color: BLUE, px: 0.5, borderRadius: 0.5 }}>{h.type || "Hotel"}</Typography>
                                  <Typography fontSize={8} color="text.secondary">★ {h.rating || "4.5"}</Typography>
                                </Stack>
                                <Typography fontSize={9} color="text.secondary" noWrap sx={{ mb: 0.5 }}>{h.features?.slice(0, 2).join(", ") || "Wifi, Bãi đỗ xe"}</Typography>
                                <Typography fontSize={10} fontWeight={700} color={BLUE} sx={{ mb: 0.8 }}>{h.cheapestPrice?.toLocaleString()} đ</Typography>
                                <Button fullWidth size="small" variant="contained" sx={{ fontSize: 9, py: 0.2, bgcolor: BLUE, borderRadius: 1, textTransform: "none" }}>Xem chi tiết</Button>
                              </Box>
                            </Paper>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* Quick Questions & Input */}
              <Box sx={{ p: 1.5, bgcolor: "#fff", borderTop: "1px solid #e0e0e0" }}>
                <Stack direction="row" spacing={0.5} sx={{ mb: 1, overflowX: "auto" }}>
                  {QUESTIONS.map((q, i) => (
                    <Button 
  key={i} 
  variant="outlined" 
  size="small" 
  onClick={() => q.a ? setMessages(prev => [...prev, {id: Date.now(), from:"user", text: q.q}, {id: Date.now()+1, from:"bot", text: q.a}]) : handleSend(q.q)} 
  sx={{ 
    fontSize: 10, 
    borderRadius: 2, 
    textTransform: "none", 
    whiteSpace: "nowrap",
    // Thêm các dòng này để đổi sang màu xanh:
    color: BLUE, 
    borderColor: BLUE,
    "&:hover": {
      borderColor: BLUE,
      backgroundColor: "rgba(0, 86, 179, 0.05)" // Màu xanh nhạt khi hover
    }
  }}
>
  {q.q}
</Button>
))}
 </Stack>
<Stack direction="row" spacing={1}>
  <TextField 
    size="small" 
    fullWidth 
    placeholder="Bạn cần giúp gì?" 
    value={input} 
    onChange={(e) => setInput(e.target.value)} 
    sx={{ 
      "& .MuiOutlinedInput-root": { 
        borderRadius: 2, 
        fontSize: 13,
        // Màu viền bình thường
        "& fieldset": { borderColor: "#ced4da" },
        // Màu viền khi hover
        "&:hover fieldset": { borderColor: BLUE },
        // Màu viền khi đang gõ (focus)
        "&.Mui-focused fieldset": { borderColor: BLUE, borderWidth: "2px" }
      } 
    }} 
  />
  <Button 
    variant="contained" 
    onClick={() => handleSend()} 
    sx={{ 
      bgcolor: BLUE, 
      borderRadius: 2,
      "&:hover": { bgcolor: "#004494" } // Màu xanh đậm hơn một chút khi di chuột vào nút gửi
    }}
  >
    Gửi
  </Button>
</Stack>
          </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}