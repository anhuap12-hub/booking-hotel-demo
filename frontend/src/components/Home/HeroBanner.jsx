import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
  Container,
} from "@mui/material";
import {
  Search,
  History,
  Close,
  Hotel,
  DeleteOutline,
  LocationOnOutlined,
} from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch, createDefaultSearch } from "../../context/SearchContext";
import { detectCity } from "../../utils/detectCity";
import { getRecentSearches, clearRecentSearches } from "../../utils/recentSearch";
import { normalizeText } from "../../utils/normalizeText";

const MAX_HISTORY = 6;
const VISIBLE_HOTELS = 5;

const MotionPaper = motion(Paper);

export default function HeroBanner({ hotels = [] }) {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);

  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  useEffect(() => {
    setHistory(getRecentSearches().slice(0, MAX_HISTORY));
  }, []);

  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  const hotelSuggest = useMemo(() => {
    if (!keyword) return [];
    const k = normalizeText(keyword);
    return hotels
      .filter((h) => normalizeText(h.name).includes(k) || normalizeText(h.city).includes(k))
      .slice(0, VISIBLE_HOTELS);
  }, [keyword, hotels]);

  const submit = (text = keyword) => {
    const value = text.trim();
    if (!value) return;
    const cityDetected = detectCity(value);
    updateSearch({ ...createDefaultSearch(), keyword: value });

    const newItem = { keyword: value, city: cityDetected?.label || "" };
    const nextHistory = [newItem, ...history.filter((h) => h.keyword !== newItem.keyword)].slice(0, MAX_HISTORY);
    setHistory(nextHistory);
    localStorage.setItem("recentSearches", JSON.stringify(nextHistory));

    navigate("/hotels");
    setOpen(false);
  };

  return (
    <Box
      sx={{
        position: "relative",
        pt: "80px",
        height: { xs: "500px", md: "550px" },
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {/* Background Image with Parallax-like feel */}
      <Box
        sx={{
          position: "absolute",
          top: 0, left: 0, width: "100%", height: "100%",
          backgroundImage: "url('https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg')",
          backgroundPosition: "center",
          backgroundSize: "cover",
          zIndex: -2,
        }}
      />
      {/* Dark Overlay with Gradient */}
      <Box
        sx={{
          position: "absolute",
          top: 0, left: 0, width: "100%", height: "100%",
          background: "linear-gradient(to bottom, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.7) 100%)",
          zIndex: -1,
        }}
      />

      <Container maxWidth="md" sx={{ textAlign: "center", zIndex: 1 }}>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <Typography
            variant="h2"
            sx={{
              fontFamily: "'Playfair Display', serif",
              fontWeight: 900,
              fontSize: { xs: "2.5rem", md: "4rem" },
              color: "#fff",
              mb: 2,
              lineHeight: 1.2,
            }}
          >
            Tìm nơi dừng chân <br /> 
            <Box component="span" sx={{ color: "#C2A56D" }}>hoàn hảo</Box> của bạn
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.8)", mb: 6, fontSize: "1.1rem", letterSpacing: "0.05em" }}>
            Khám phá hơn 500+ khách sạn hạng sang tại Việt Nam
          </Typography>
        </motion.div>

        {/* SEARCH BOX WRAPPER */}
        <Box ref={wrapRef} sx={{ width: "100%", maxWidth: 700, mx: "auto", position: "relative" }}>
          <MotionPaper
            elevation={0}
            animate={{ borderRadius: open ? "28px 28px 0 0" : "100px" }}
            sx={{
              display: "flex", alignItems: "center", p: 1, pl: 3, height: 72,
              bgcolor: "rgba(255, 255, 255, 0.95)",
              backdropFilter: "blur(10px)",
              boxShadow: "0 20px 50px rgba(0,0,0,0.3)",
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
                startAdornment: (
                  <InputAdornment position="start">
                    <LocationOnOutlined sx={{ color: "#C2A56D" }} />
                  </InputAdornment>
                ),
                endAdornment: keyword && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => { setKeyword(""); setOpen(false); }}>
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{ "& fieldset": { border: "none" }, "& input": { fontSize: 16, fontWeight: 500 } }}
            />

            <Button
              onClick={() => submit()}
              variant="contained"
              sx={{
                height: "100%", px: 5, fontWeight: 800, borderRadius: "100px",
                bgcolor: "#1C1B19", color: "#C2A56D",
                textTransform: "none", fontSize: "1rem",
                "&:hover": { bgcolor: "#333" },
              }}
            >
              Tìm kiếm
            </Button>
          </MotionPaper>

          {/* DROPDOWN SUGGESTIONS */}
          <AnimatePresence>
            {open && (
              <MotionPaper
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 10 }}
                sx={{
                  position: "absolute", width: "100%", mt: "1px",
                  borderRadius: "0 0 28px 28px", overflow: "hidden",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.2)", textAlign: "left",
                }}
              >
                {/* SUGGESTED HOTELS */}
                {hotelSuggest.length > 0 && (
                  <Box py={1}>
                    <Typography px={3} py={1} variant="caption" sx={{ fontWeight: 800, color: "#A09F9C", textTransform: "uppercase" }}>
                      Khách sạn gợi ý
                    </Typography>
                    {hotelSuggest.map((h) => (
                      <Box key={h._id} onClick={() => submit(h.name)} sx={{ px: 3, py: 1.5, display: "flex", gap: 2, cursor: "pointer", "&:hover": { bgcolor: "#F9F7F2" } }}>
                        <Hotel fontSize="small" sx={{ color: "#C2A56D" }} />
                        <Box>
                          <Typography variant="body2" fontWeight={700}>{h.name}</Typography>
                          <Typography variant="caption" color="text.secondary">{h.city}</Typography>
                        </Box>
                      </Box>
                    ))}
                    <Divider sx={{ my: 1 }} />
                  </Box>
                )}

                {/* RECENT HISTORY */}
                {history.length > 0 && (
                  <Box py={1}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" px={3} py={1}>
                      <Typography variant="caption" sx={{ fontWeight: 800, color: "#A09F9C", textTransform: "uppercase" }}>
                        Tìm kiếm gần đây
                      </Typography>
                      <IconButton size="small" onClick={() => { clearRecentSearches(); setHistory([]); }}>
                        <DeleteOutline sx={{ fontSize: 16 }} />
                      </IconButton>
                    </Stack>
                    {history.map((h, i) => (
                      <Box key={i} onClick={() => submit(h.keyword || h.city)} sx={{ px: 3, py: 1.5, display: "flex", gap: 2, cursor: "pointer", "&:hover": { bgcolor: "#F9F7F2" } }}>
                        <History fontSize="small" color="disabled" />
                        <Typography variant="body2" fontWeight={500}>{h.keyword || h.city}</Typography>
                      </Box>
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