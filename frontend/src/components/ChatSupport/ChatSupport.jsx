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

const ZALO_PHONE = "0395193004";
const ZALO_ICON = "https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg";

const MotionBox = motion(Box);
const MotionButton = motion(Button);

export default function ChatSupport() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef(null);
  const navigate = useNavigate();

  // Tự động cuộn xuống khi có tin nhắn mới
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping]);

  const handleSend = async (customInput) => {
    const textToSend = customInput || input;
    if (!textToSend.trim() || isTyping) return;

    // Hiển thị tin nhắn người dùng ngay lập tức
    const userMsgId = Date.now();
    setMessages((prev) => [...prev, { id: userMsgId, from: "user", text: textToSend }]);
    setInput("");
    setIsTyping(true);

    try {
      const res = await sendChatMessage(textToSend);
      // Lấy dữ liệu từ Backend (trường reply và mảng hotels)
      const { reply, hotels } = res.data;

      setMessages((prev) => [
        ...prev,
        { 
          id: Date.now(), 
          from: "bot", 
          text: reply || "Tôi có thể giúp gì thêm cho bạn?", 
          hotels: hotels || [] 
        }
      ]);
    } catch (err) {
      console.error("Chat Error:", err);
      let errorText = "Hệ thống AI đang bận, bạn thử lại sau nhé.";
      if (err.response?.status === 401) errorText = "Bạn vui lòng đăng nhập để thực hiện chức năng này.";
      
      setMessages((prev) => [...prev, { id: Date.now(), from: "bot", text: errorText }]);
    } finally {
      setIsTyping(false);
    }
  };

  return (
    <>
      {/* Nút bấm mở Chat */}
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
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            sx={{ position: "fixed", bottom: 100, right: 30, width: { xs: "calc(100% - 60px)", sm: 380 }, zIndex: 2000 }}
          >
            <Paper elevation={24} sx={{ borderRadius: 4, overflow: "hidden", border: "1px solid rgba(194, 165, 109, 0.2)" }}>
              
              {/* HEADER */}
              <Box sx={{ p: 2, background: "#1C1B19", color: "#fff", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <Stack direction="row" spacing={1.5} alignItems="center">
                  <Avatar sx={{ bgcolor: "#C2A56D", border: "2px solid #fff" }}><SmartToyIcon /></Avatar>
                  <Box>
                    <Typography fontWeight={700} fontSize={14} sx={{ color: "#C2A56D" }}>COFFEE STAY AI</Typography>
                    <Typography fontSize={10} sx={{ display: "flex", alignItems: "center", gap: 0.5, opacity: 0.8 }}>
                      <Box sx={{ width: 6, height: 6, bgcolor: "#4caf50", borderRadius: "50%" }} /> Đang trực tuyến
                    </Typography>
                  </Box>
                </Stack>
                <Button size="small" onClick={() => setOpen(false)} sx={{ color: "#fff", minWidth: 0 }}><CloseIcon fontSize="small" /></Button>
              </Box>

              {/* CHAT BODY */}
              <Box ref={scrollRef} sx={{ p: 2, height: 350, overflowY: "auto", bgcolor: "#FAF9F6", display: "flex", flexDirection: "column" }}>
                {messages.length === 0 && (
                  <Box sx={{ my: "auto", textAlign: "center", px: 4 }}>
                    <Typography fontSize={13} color="text.secondary" sx={{ fontStyle: "italic" }}>
                      Chào bạn! Coffee Stay AI có thể giúp bạn tìm phòng nhanh hoặc kiểm tra đơn hàng.
                    </Typography>
                  </Box>
                )}

                <Stack spacing={2}>
                  {messages.map((m) => (
                    <Box key={m.id} sx={{ alignSelf: m.from === "user" ? "flex-end" : "flex-start", maxWidth: "90%" }}>
                      {/* Bong bóng chat text */}
                      <Box sx={{
                        bgcolor: m.from === "user" ? "#C2A56D" : "#fff",
                        color: m.from === "user" ? "#fff" : "#1C1B19",
                        px: 2, py: 1.5, borderRadius: m.from === "user" ? "16px 16px 2px 16px" : "16px 16px 16px 2px",
                        fontSize: 13, boxShadow: "0 2px 8px rgba(0,0,0,0.05)",
                        border: m.from === "bot" ? "1px solid #EAE7E0" : "none"
                      }}>
                        {m.text}
                      </Box>

                      {/* Danh sách khách sạn (Carousel) */}
                      {m.hotels?.length > 0 && (
                        <Box sx={{ 
                          display: "flex", gap: 1.5, overflowX: "auto", py: 1, mt: 1, 
                          width: { xs: 280, sm: 330 }, 
                          "&::-webkit-scrollbar": { height: 4 },
                          "&::-webkit-scrollbar-thumb": { bgcolor: "#C2A56D", borderRadius: 2 }
                        }}>
                          {m.hotels.map((h) => (
                            <Paper 
                              key={h._id} 
                              onClick={() => { 
                                setOpen(false); 
                                navigate(`/hotels/${h._id}`); // FIX: Thêm 's' để khớp route /hotels/:id
                              }}
                              sx={{ 
                                minWidth: 160, maxWidth: 160, borderRadius: 2, overflow: "hidden", 
                                cursor: "pointer", border: "1px solid #eee",
                                transition: "0.2s", "&:hover": { transform: "translateY(-3px)", boxShadow: 4 } 
                              }}
                            >
                              <img 
                                src={h.photos?.[0]?.url || "https://via.placeholder.com/160x90?text=No+Image"} 
                                style={{ width: "100%", height: 90, objectFit: "cover" }} 
                                alt={h.name}
                              />
                              <Box sx={{ p: 1 }}>
                                <Typography fontSize={11} fontWeight={700} noWrap>{h.name}</Typography>
                                <Typography fontSize={9} color="text.secondary" noWrap>{h.city}</Typography>
                                <Typography fontSize={11} fontWeight={700} sx={{ color: "#C2A56D", mt: 0.5 }}>
                                  {h.cheapestPrice?.toLocaleString()} VNĐ
                                </Typography>
                              </Box>
                            </Paper>
                          ))}
                        </Box>
                      )}
                    </Box>
                  ))}

                  {isTyping && (
                    <Box sx={{ alignSelf: "flex-start", bgcolor: "#fff", px: 2, py: 1, borderRadius: "12px", border: "1px solid #EAE7E0" }}>
                      <CircularProgress size={16} sx={{ color: "#C2A56D" }} />
                    </Box>
                  )}
                </Stack>
              </Box>

              {/* FOOTER */}
              <Box sx={{ p: 2, bgcolor: "#fff", borderTop: "1px solid #EEE" }}>
                {/* Các câu hỏi gợi ý */}
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5, mb: 1.5 }}>
                  {QUESTIONS.map((q, i) => (
                    <Button 
                      key={i} variant="outlined" size="small" 
                      onClick={() => q.a ? setMessages(prev => [...prev, {id: Date.now(), from:"user", text: q.q}, {id: Date.now()+1, from:"bot", text: q.a}]) : handleSend(q.q)}
                      sx={{ textTransform: "none", fontSize: 10, borderRadius: 4, borderColor: "#C2A56D", color: "#1C1B19", "&:hover": { bgcolor: "#FAF9F6", borderColor: "#1C1B19" } }}
                    >
                      {q.q}
                    </Button>
                  ))}
                </Box>

                {/* Ô nhập tin nhắn */}
                <Stack direction="row" spacing={1}>
                  <TextField 
                    size="small" fullWidth placeholder="Tìm khách sạn, đơn hàng..." 
                    value={input} disabled={isTyping}
                    onChange={(e) => setInput(e.target.value)} 
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()} 
                    sx={{ "& .MuiOutlinedInput-root": { borderRadius: 3 } }}
                  />
                  <Button 
                    variant="contained" onClick={() => handleSend()} disabled={isTyping}
                    sx={{ bgcolor: "#1C1B19", "&:hover": { bgcolor: "#C2A56D" }, borderRadius: 2, minWidth: 60 }}
                  >
                    Gửi
                  </Button>
                </Stack>

                {/* Nút liên hệ Zalo */}
                <Button
                  fullWidth
                  onClick={() => window.open(`https://zalo.me/${ZALO_PHONE}`, "_blank")}
                  sx={{ mt: 1.5, bgcolor: "#0068ff", color: "#fff", borderRadius: 2, fontSize: 11, py: 1, "&:hover": { bgcolor: "#0056d2" } }}
                >
                  <img src={ZALO_ICON} alt="Zalo" width={16} style={{ marginRight: 8 }} />
                  Hỗ trợ nhanh qua Zalo
                </Button>
              </Box>
            </Paper>
          </MotionBox>
        )}
      </AnimatePresence>
    </>
  );
}