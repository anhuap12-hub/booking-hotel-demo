import {
  Box,
  Paper,
  Typography,
  IconButton,
  Button,
  Stack,
  Avatar,
} from "@mui/material";
import ChatBubbleOutlineIcon from "@mui/icons-material/ChatBubbleOutline";
import CloseIcon from "@mui/icons-material/Close";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

/* ================= QUESTIONS ================= */
const QUESTIONS = [
  {
    q: "Khách sạn có cho hủy miễn phí không?",
    a: "Hầu hết khách sạn cho phép hủy miễn phí trước 24–48h. Bạn có thể kiểm tra chi tiết trong trang phòng.",
  },
  {
    q: "Thời gian check-in / check-out?",
    a: "Check-in từ 14:00 và check-out trước 12:00 trưa.",
  },
  {
    q: "Có thanh toán khi nhận phòng không?",
    a: "Một số khách sạn hỗ trợ thanh toán tại chỗ. Vui lòng xem điều kiện khi đặt phòng.",
  },
  {
    q: "Tôi cần hỗ trợ gấp",
    a: null, // 👉 mở Zalo
  },
];

/* ================= CONFIG ================= */
const ZALO_PHONE = "0395193004";
const ZALO_ICON =
  "https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_of_Zalo.svg";
const BOT_AVATAR =
  "https://cdn-icons-png.flaticon.com/512/4712/4712109.png";

const AUTO_REMOVE_TIME = 4000; // ⏱ xoá tin user sau 4s

export default function ChatSupport() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState([]);

  const handleQuestion = (item) => {
    const id = Date.now();

    // add user message
    setMessages((prev) => [
      ...prev,
      { id, from: "user", text: item.q },
    ]);

    // auto remove user message
    setTimeout(() => {
      setMessages((prev) => prev.filter((m) => m.id !== id));
    }, AUTO_REMOVE_TIME);

    // open Zalo
    if (!item.a) {
      window.open(`https://zalo.me/${ZALO_PHONE}`, "_blank");
      return;
    }

    // bot reply
    setTimeout(() => {
      setMessages((prev) => [
        ...prev,
        { id: id + 1, from: "bot", text: item.a },
      ]);
    }, 400);
  };

  return (
    <>
      {/* FLOAT CHAT BUTTON */}
      <IconButton
        onClick={() => setOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          bgcolor: "#0071c2",
          color: "#fff",
          width: 56,
          height: 56,
          borderRadius: "8px",
          boxShadow: "0 6px 18px rgba(0,0,0,.25)",
          zIndex: 2000,
          "&:hover": { bgcolor: "#005a9e" },
        }}
      >
        <ChatBubbleOutlineIcon />
      </IconButton>

      {/* CHAT BOX */}
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.2 }}
            style={{
              position: "fixed",
              bottom: 90,
              right: 24,
              width: 420,
              zIndex: 2000,
            }}
          >
            <Paper
              sx={{
                borderRadius: "6px", // ✅ radius nhỏ (~0.5)
                overflow: "hidden",
                border: "1px solid rgba(0,0,0,.06)",
                boxShadow: "0 12px 30px rgba(0,0,0,.22)",
              }}
            >
              {/* HEADER */}
              <Box
                sx={{
                  px: 2,
                  py: 1.25,
                  bgcolor: "#fff",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid rgba(0,0,0,.06)",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Avatar src={BOT_AVATAR} sx={{ width: 34, height: 34 }} />
                  <Box>
                    <Typography fontWeight={600} fontSize={14}>
                      Trợ lý đặt phòng
                    </Typography>
                    <Typography fontSize={11} color="text.secondary">
                      Hỗ trợ nhanh 24/7
                    </Typography>
                  </Box>
                </Box>

                <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                  {/* ZALO */}
                  <Button
                    onClick={() =>
                      window.open(`https://zalo.me/${ZALO_PHONE}`, "_blank")
                    }
                    size="small"
                    sx={{
                      textTransform: "none",
                      color: "#0068ff",
                      fontWeight: 600,
                      gap: 0.75,
                      px: 1,
                      minWidth: "auto",
                      borderRadius: "4px",
                      "&:hover": { bgcolor: "rgba(0,104,255,.08)" },
                    }}
                  >
                    <img src={ZALO_ICON} alt="Zalo" width={22} height={22} />
                    Zalo
                  </Button>

                  <IconButton size="small" onClick={() => setOpen(false)}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Box>

              {/* BODY */}
              <Box sx={{ p: 2, maxHeight: 320, overflowY: "auto" }}>
                {messages.length === 0 && (
                  <Typography fontSize={14} color="text.secondary" mb={1}>
                    Xin chào 👋 Tôi có thể giúp gì cho bạn?
                  </Typography>
                )}

                <Stack spacing={1}>
                  {messages.map((m) => (
                    <Box
                      key={m.id}
                      sx={{
                        alignSelf:
                          m.from === "user" ? "flex-end" : "flex-start",
                        bgcolor:
                          m.from === "user"
                            ? "#0071c2"
                            : "rgba(0,0,0,.04)",
                        color: m.from === "user" ? "#fff" : "#000",
                        px: 1.5,
                        py: 1,
                        borderRadius: "6px",
                        maxWidth: "80%",
                        fontSize: 13,
                      }}
                    >
                      {m.text}
                    </Box>
                  ))}
                </Stack>
              </Box>

              {/* QUICK QUESTIONS */}
              <Box sx={{ p: 1.5, borderTop: "1px solid rgba(0,0,0,.06)" }}>
                <Stack spacing={1}>
                  {QUESTIONS.map((q, i) => (
                    <Button
                      key={i}
                      size="small"
                      variant="outlined"
                      onClick={() => handleQuestion(q)}
                      sx={{
                        justifyContent: "flex-start",
                        textAlign: "left",
                        borderRadius: "4px",
                        borderColor: "rgba(0,0,0,.15)",
                      }}
                    >
                      {q.q}
                    </Button>
                  ))}
                </Stack>
              </Box>
            </Paper>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
