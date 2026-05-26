import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Avatar from "@mui/material/Avatar";
import Tooltip from "@mui/material/Tooltip";
import TextField from "@mui/material/TextField";
import CircularProgress from "@mui/material/CircularProgress";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import SmartToyIcon from "@mui/icons-material/SmartToy";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { sendChatMessage } from "../../api/chat.api";

const QUESTIONS = [
  { q: "Chính sách hủy phòng?", a: "Hầu hết hỗ trợ hủy miễn phí trước 48h." },
  { q: "Giờ nhận/trả phòng?", a: "Check-in 14:00, Check-out 12:00." },
  { q: "Tìm phòng tại Hà Nội", a: null },
  { q: "Xem đơn hàng của tôi", a: null },
];

const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function ChatSupport() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
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

      setMessages((prev) => [
        ...prev,
        { id: Date.now(), from: "bot", text: reply, hotels: hotels || [] }
      ]);
    } catch (err) {
      setMessages((prev) => [...prev, { id: Date.now(), from: "bot", text: "Dạ, hệ thống đang bận một chút Anh/Chị vui lòng thử lại sau nhé." }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Nút bong bóng Chat */}
      <Tooltip title="Hỗ trợ trực tuyến" placement="left">
        <MotionButton
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setOpen(true)}
          sx={{
            position: "fixed", bottom: 30, right: 30, zIndex: 2000,
            background: "linear-gradient(135deg, #C2A56D 0%, #1C1B19 100%)",
            color: "#fff", width: 64, height: 64, borderRadius: "50%",
            boxShadow: "0 8px 32px rgba(194, 165, 109, 0.4)",
          }}
        >
          <ChatBubbleOutlineIcon fontSize="large" />
        </MotionButton>
      </Tooltip>

      <AnimatePresence>
        {open && (
          <MotionBox
            initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 40 }}
            sx={{ position: "fixed", bottom: 100, right: 30, width: { xs: "calc(100% - 60px)", sm: 400 }, zIndex: 2000 }}
          >
            <Paper elevation={24} sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid rgba(194, 165, 109, 0.2)" }}>
              
              {/* Header */}
              <Box sx={{ p: 2, background: "#1C1B19", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: "#C2A56D" }}><SmartToyIcon /></Avatar>
                  <Box>
                    <Typography fontWeight={700} fontSize={14} sx={{ color: "#C2A56D" }}>COFFEE STAY AI</Typography>
                    <Typography fontSize={10} sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                      <Box sx={{ width: 6, height: 6, bgcolor: "#4caf50", borderRadius: "50%" }} /> Trực tuyến
                    </Typography>
                  </Box>
                </Stack>
                <Button size="small" onClick={() => setOpen(false)} sx={{ color: "#fff", minWidth: 0 }}><CloseIcon /></Button>
              </Box>

              {/* Body */}
              <Box ref={scrollRef} sx={{ p: 2, height: 400, overflowY: "auto", bgcolor: "#FAF9F6" }}>
                <Stack spacing={2}>
                  {messages.map((m) => (
                    <Box key={m.id} sx={{ alignSelf: m.from === "user" ? "flex-end" : "flex-start", width: "100%", display: "flex", flexDirection: "column", alignItems: m.from === "user" ? "flex-end" : "flex-start" }}>
                      
                      {/* Text Bubble */}
                      <Box sx={{
                        bgcolor: m.from === "user" ? "#C2A56D" : "#fff",
                        color: m.from === "user" ? "#fff" : "#1C1B19",
                        px: 2, py: 1.5, borderRadius: 3, fontSize: 13, maxWidth: "85%",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.05)", border: m.from === "bot" ? "1px solid #EAE7E0" : "none"
                      }}>
                        {m.text}
                      </Box>

                      {/* Hotel Carousel - Hiển thị khi bot trả về danh sách khách sạn */}
                      {m.hotels?.length > 0 && (
  <Box sx={{ 
    display: "flex", gap: 1.5, overflowX: "auto", pb: 1, mt: 1.5, width: "100%",
    "&::-webkit-scrollbar": { height: 4 },
    "&::-webkit-scrollbar-thumb": { backgroundColor: "rgba(194, 165, 109, 0.3)", borderRadius: 10 }
  }}>
    {m.hotels.map((h) => (
      <Paper key={h._id} onClick={() => { setOpen(false); navigate(`/hotels/${h._id}`); }} elevation={1}
        sx={{ 
          minWidth: 200, // Thu nhỏ chiều rộng card
          maxWidth: 200,
          borderRadius: 2.5, overflow: "hidden", cursor: "pointer", bgcolor: "#fff",
          border: "1px solid #EAE7E0", position: "relative",
          "&:hover": { transform: "translateY(-2px)", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" }, 
          transition: "0.2s ease-in-out" 
        }}
      >
        {/* Badge loại hình - Thu nhỏ lại */}
        <Box sx={{
          position: "absolute", top: 6, left: 6, bgcolor: "rgba(28, 27, 25, 0.8)", color: "#C2A56D",
          px: 0.8, py: 0.2, borderRadius: 1, fontSize: 8, fontWeight: 700, textTransform: "uppercase", zIndex: 1
        }}>
          {h.type || 'Hotel'}
        </Box>

        <img src={h.photos?.[0]?.url} alt={h.name} style={{ width: "100%", height: 100, objectFit: "cover" }} />
        
        <Box sx={{ p: 1 }}>
          <Typography fontSize={13} fontWeight={700} noWrap sx={{ color: "#1C1B19", mb: 0.2 }}>
            {h.name}
          </Typography>
          
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography fontSize={10} color="text.secondary">{h.city}</Typography>
            <Typography fontSize={12} fontWeight={700} color="#C2A56D">
              {h.cheapestPrice?.toLocaleString()}đ
            </Typography>
          </Stack>

          <Button fullWidth size="small" variant="contained"
            sx={{ 
              py: 0.5, fontSize: 10, bgcolor: "#1C1B19", borderRadius: 1.5, 
              textTransform: "none", "&:hover": { bgcolor: "#C2A56D" } 
            }}
          >
            Xem ngay
          </Button>
        </Box>
      </Paper>
    ))}
  </Box>
)}
                    </Box>
                  ))}
                  
                  {isTyping && (
                    <Box sx={{ alignSelf: "flex-start", display: "flex", alignItems: "center", gap: 1 }}>
                      <CircularProgress size={16} sx={{ color: "#C2A56D" }} />
                      <Typography fontSize={12} color="text.secondary italic">AI đang tìm kiếm...</Typography>
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* Footer */}
              <Box sx={{ p: 2, bgcolor: "#fff", borderTop: "1px solid #EAE7E0" }}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.8, mb: 1.5 }}>
                  {QUESTIONS.map((q, i) => (
                    <Button key={i} variant="outlined" size="small" 
                      onClick={() => q.a ? setMessages(prev => [...prev, {id: Date.now(), from:"user", text: q.q}, {id: Date.now()+1, from:"bot", text: q.a}]) : handleSend(q.q)}
                      sx={{ textTransform: "none", fontSize: 11, borderRadius: 4, borderColor: "#EAE7E0", color: "#1C1B19", "&:hover": { borderColor: "#C2A56D", bgcolor: "rgba(194, 165, 109, 0.05)" } }}
                    >
                      {q.q}
                    </Button>
                  ))}
                </Box>
                <Stack direction="row" spacing={1}>
                  <TextField size="small" fullWidth placeholder="Hỏi về địa điểm, tiện ích..." value={input} 
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />
                  <Button variant="contained" onClick={() => handleSend()} 
                    sx={{ bgcolor: "#1C1B19", borderRadius: 3, px: 3, "&:hover": { bgcolor: "#C2A56D" } }}
                  >
                    Gửi
                  </Button>
                </Stack>
              </Box>
            </Paper>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}