import {
  Box, Typography, TextField, Button, Paper, InputAdornment, IconButton, Divider, Container, Stack
} from "@mui/material";
import {
  Search, History, Close, Hotel, DeleteOutline, LocationOnOutlined, ExploreOutlined
} from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch, createDefaultSearch } from "../../context/SearchContext";
import { detectCity } from "../../utils/detectCity";
import { getRecentSearches, clearRecentSearches } from "../../utils/recentSearch";
import { normalizeText } from "../../utils/normalizeText";

const MotionPaper = motion(Paper);

export default function HeroBanner({ hotels = [] }) {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);
  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  // FIX: Chỉ load history một lần duy nhất khi mount để tránh cascading renders
  useEffect(() => {
    const saved = getRecentSearches();
    if (saved && saved.length > 0) {
      setHistory(saved.slice(0, 5));
    }
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const hotelSuggest = useMemo(() => {
    if (!keyword || keyword.trim().length < 2) return [];
    const k = normalizeText(keyword);
    return hotels
      .filter((h) => normalizeText(h.name).includes(k) || normalizeText(h.city).includes(k))
      .slice(0, 5);
  }, [keyword, hotels]);

  const submit = (text = keyword) => {
    const value = text.trim();
    if (!value) return;

    // FIX: Sử dụng detectCity để gán city vào search context nếu tìm thấy
    const cityDetected = detectCity(value);
    
    updateSearch({ 
      ...createDefaultSearch(), 
      keyword: value,
      city: cityDetected ? cityDetected.label : "" 
    });
    
    // Logic lưu history (nên bọc trong try/catch hoặc check null)
    const newItem = { keyword: value };
    const nextHistory = [newItem, ...history.filter(h => h.keyword !== value)].slice(0, 5);
    setHistory(nextHistory);
    localStorage.setItem("recentSearches", JSON.stringify(nextHistory));

    navigate("/hotels");
    setOpen(false);
  };

  return (
    <Box sx={{ 
      position: "relative", 
      height: { xs: "500px", md: "600px" }, 
      width: "100%",
      display: "flex", 
      alignItems: "center",
      justifyContent: "center",
      overflow: "visible",
    }}>
      {/* Background Image từ thiết kế của bạn */}
      <Box sx={{ 
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        backgroundImage: "url('https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg')",
        backgroundPosition: "center", 
        backgroundSize: "cover", 
        zIndex: -2 
      }} />
      
      {/* Lớp Overlay Gradient để chữ trắng nổi bật hơn */}
      <Box sx={{ 
        position: "absolute", top: 0, left: 0, width: "100%", height: "100%",
        background: "linear-gradient(180deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.7) 100%)",
        zIndex: -1 
      }} />

      {/* Backdrop mờ khi focus tìm kiếm */}
      <AnimatePresence>
        {open && (
          <Box
            component={motion.div}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            sx={{ 
              position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
              bgcolor: "rgba(0,0,0,0.2)", backdropFilter: "blur(4px)", zIndex: 10 
            }}
          />
        )}
      </AnimatePresence>

      <Container maxWidth="md" sx={{ zIndex: 11, textAlign: "center" }}>
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }}>
          <Typography
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: { xs: "2.5rem", md: "4.2rem" },
              color: "#fff", // Trắng theo ảnh mẫu
              textShadow: "0 2px 10px rgba(0,0,0,0.2)",
              mb: 1,
              lineHeight: 1.1
            }}
          >
            Tìm nơi dừng chân <br />
            <Box component="span" sx={{ color: "#C2A56D" }}>hoàn hảo</Box> của bạn
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.9)", mb: 6, fontSize: "1.1rem", fontWeight: 500 }}>
            Khám phá hơn 500+ khách sạn hạng sang tại Việt Nam
          </Typography>
        </motion.div>

        {/* SEARCH BOX */}
        <Box ref={wrapRef} sx={{ position: "relative", maxWidth: 750, mx: "auto" }}>
          <MotionPaper
            elevation={0}
            animate={{ 
              borderRadius: open ? "28px 28px 0 0" : "100px",
              scale: open ? 1.02 : 1
            }}
            sx={{
              display: "flex", alignItems: "center", p: 1, pl: 4, height: 76,
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: open ? "0 25px 50px rgba(0,0,0,0.3)" : "0 10px 30px rgba(0,0,0,0.15)",
              transition: "box-shadow 0.3s ease"
            }}
          >
            <TextField
              fullWidth
              placeholder="Bạn muốn đi đâu?"
              value={keyword}
              onFocus={() => setOpen(true)}
              onChange={(e) => setKeyword(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && submit()}
              InputProps={{
                startAdornment: <LocationOnOutlined sx={{ color: "#C2A56D", mr: 1 }} />,
                endAdornment: keyword && (
                  <IconButton size="small" onClick={() => setKeyword("")} sx={{ mr: 1 }}><Close fontSize="small" /></IconButton>
                )
              }}
              sx={{ "& fieldset": { border: "none" }, "& input": { fontSize: 18, fontWeight: 500 } }}
            />
            <Button
              onClick={() => submit()}
              variant="contained"
              sx={{
                height: "100%", px: 6, borderRadius: "100px",
                bgcolor: "#1C1B19", color: "#C2A56D", fontWeight: 900,
                fontSize: "1rem",
                "&:hover": { bgcolor: "#333", transform: "scale(1.02)" },
                transition: "all 0.2s"
              }}
            >
              Tìm kiếm
            </Button>
          </MotionPaper>

          {/* DROPDOWN LOGIC */}
          <AnimatePresence>
            {open && (hotelSuggest.length > 0 || history.length > 0) && (
              <MotionPaper
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                sx={{
                  position: "absolute", top: "100%", left: 0, width: "100%",
                  bgcolor: "#fff", borderRadius: "0 0 28px 28px",
                  overflow: "hidden", borderTop: "1px solid #F1F0EE",
                  boxShadow: "0 30px 60px rgba(0,0,0,0.25)", textAlign: "left",
                  zIndex: 20
                }}
              >
                {/* Suggestions */}
                {hotelSuggest.length > 0 && (
                  <Box py={2}>
                    <Typography px={4} py={1} variant="caption" sx={{ fontWeight: 800, color: "#C2A56D", letterSpacing: 1.5, textTransform: "uppercase" }}>
                      Khách sạn gợi ý
                    </Typography>
                    {hotelSuggest.map((h) => (
                      <Stack 
                        key={h._id} direction="row" spacing={2} px={4} py={1.5} alignItems="center"
                        onClick={() => submit(h.name)}
                        sx={{ cursor: "pointer", "&:hover": { bgcolor: "#F9F7F2" } }}
                      >
                        <Hotel sx={{ fontSize: 20, color: "#1C1B19" }} />
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{h.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{h.city}</Typography>
                        </Box>
                      </Stack>
                    ))}
                    <Divider sx={{ mx: 3, my: 1 }} />
                  </Box>
                )}

                {/* History */}
                {history.length > 0 && (
                  <Box py={2} bgcolor="#FCFAF7">
                    <Stack direction="row" justifyContent="space-between" px={4} mb={1}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "#A09F9C", letterSpacing: 1.5 }}>TÌM KIẾM GẦN ĐÂY</Typography>
                      <IconButton size="small" onClick={(e) => { e.stopPropagation(); clearRecentSearches(); setHistory([]); }}>
                        <DeleteOutline sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                    {history.map((h, i) => (
                      <Stack 
                        key={i} direction="row" spacing={2} px={4} py={1.2} alignItems="center"
                        onClick={() => submit(h.keyword)}
                        sx={{ cursor: "pointer", "&:hover": { color: "#C2A56D" } }}
                      >
                        <History sx={{ fontSize: 18, color: "#BCBBB9" }} />
                        <Typography variant="body2" fontWeight={500}>{h.keyword}</Typography>
                      </Stack>
                    ))}
                  </Box>
                )}
              </MotionPaper>
            )}
          </AnimatePresence>
        </Box>
      </Container>
    </Box>
  );
}