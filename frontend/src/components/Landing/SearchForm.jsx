import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Typography,
  IconButton,
  Stack,
  Fade,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { DEFAULT_SEARCH } from "../../utils/searchConstants";
import { detectCity } from "../../utils/detectCity";
import { getRecentSearches, clearRecentSearches } from "../../utils/recentSearch";
import { motion, AnimatePresence } from "framer-motion";

const VISIBLE_HISTORY = 6;
const MotionPaper = motion(Paper);

export default function SearchForm({ placeholder = "Tìm khách sạn hoặc thành phố" }) {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    setHistory(getRecentSearches().slice(0, VISIBLE_HISTORY));
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSearch = (text = value) => {
    const keyword = text.trim();
    if (!keyword) return;

    const cityDetected = detectCity(keyword);
    const searchData = {
      ...DEFAULT_SEARCH,
      keyword: cityDetected ? "" : keyword,
      city: cityDetected?.label || "",
    };

    updateSearch(searchData);

    const newItem = { keyword, city: searchData.city };
    const nextHistory = [
      newItem,
      ...history.filter(h => h.keyword !== newItem.keyword || h.city !== newItem.city),
    ].slice(0, VISIBLE_HISTORY);

    setHistory(nextHistory);
    localStorage.setItem("recentSearches", JSON.stringify(nextHistory));
    setOpen(false);
    navigate("/hotels");
  };

  const handlePickHistory = (item) => {
    setValue(item.keyword || item.city);
    handleSearch(item.keyword || item.city);
  };

  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 860,
        mx: "auto",
        zIndex: 1000,
      }}
    >
      {/* MAIN SEARCH BAR */}
      <Box
        sx={{
          display: "flex",
          borderRadius: "100px",
          p: 0.8,
          background: "rgba(28, 27, 25, 0.7)",
          backdropFilter: "blur(20px)",
          border: "1px solid rgba(194, 165, 109, 0.2)",
          boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
          flexDirection: { xs: "column", sm: "row" },
          transition: "0.3s ease",
          "&:focus-within": {
            borderColor: "#C2A56D",
            boxShadow: "0 20px 50px rgba(194, 165, 109, 0.15)",
          }
        }}
      >
        <TextField
          fullWidth
          placeholder={placeholder}
          value={value}
          onFocus={() => setOpen(true)}
          onChange={(e) => {
            setValue(e.target.value);
            setActiveIndex(-1);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (activeIndex >= 0) handlePickHistory(history[activeIndex]);
              else handleSearch();
            }
            if (e.key === "ArrowDown") setActiveIndex(p => Math.min(p + 1, history.length - 1));
            if (e.key === "ArrowUp") setActiveIndex(p => Math.max(p - 1, 0));
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#C2A56D", ml: 2, fontSize: 22 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": { "& fieldset": { border: "none" } },
            "& input": {
              py: 2,
              fontSize: 16,
              color: "#F1F0EE",
              ml: 1,
              "&::placeholder": { color: "rgba(241, 240, 238, 0.4)", opacity: 1 }
            },
          }}
        />

        <Button
          onClick={() => handleSearch()}
          sx={{
            px: 6,
            minWidth: 180,
            bgcolor: "#C2A56D",
            color: "#1C1B19",
            borderRadius: "100px",
            fontWeight: 800,
            fontSize: 15,
            textTransform: "none",
            "&:hover": { bgcolor: "#D4BC8E", transform: "scale(1.02)" },
            transition: "0.2s"
          }}
        >
          Tìm kiếm
        </Button>
      </Box>

      {/* DROPDOWN HISTORY */}
      <AnimatePresence>
        {open && history.length > 0 && (
          <MotionPaper
            initial={{ opacity: 0, y: 15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10 }}
            transition={{ duration: 0.2 }}
            sx={{
              position: "absolute",
              top: "calc(100% + 12px)",
              width: "100%",
              borderRadius: "24px",
              bgcolor: "rgba(28, 27, 25, 0.95)",
              backdropFilter: "blur(20px)",
              zIndex: 2000,
              border: "1px solid rgba(255,255,255,0.08)",
              boxShadow: "0 30px 60px rgba(0,0,0,0.5)",
              overflow: "hidden",
            }}
          >
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <Typography variant="caption" sx={{ color: "#C2A56D", fontWeight: 800, letterSpacing: "0.15em" }}>
                GẦN ĐÂY
              </Typography>
              <Button 
                size="small" 
                onClick={() => { clearRecentSearches(); setHistory([]); }}
                sx={{ color: "rgba(255,255,255,0.3)", fontSize: 11, "&:hover": { color: "#ff4d4f" } }}
              >
                Xóa tất cả
              </Button>
            </Stack>

            <Box sx={{ py: 1 }}>
              {history.map((item, idx) => (
                <Box
                  key={idx}
                  onMouseEnter={() => setActiveIndex(idx)}
                  onClick={() => handlePickHistory(item)}
                  sx={{
                    px: 3,
                    py: 1.8,
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    bgcolor: idx === activeIndex ? "rgba(194, 165, 109, 0.1)" : "transparent",
                    transition: "0.2s",
                  }}
                >
                  {item.city ? (
                    <LocationOnIcon sx={{ fontSize: 20, color: "#C2A56D", mr: 2 }} />
                  ) : (
                    <HistoryIcon sx={{ fontSize: 20, color: "rgba(255,255,255,0.3)", mr: 2 }} />
                  )}
                  <Typography sx={{ color: idx === activeIndex ? "#F1F0EE" : "rgba(241, 240, 238, 0.8)", fontSize: 15, fontWeight: idx === activeIndex ? 600 : 400 }}>
                    {item.keyword || item.city}
                  </Typography>
                </Box>
              ))}
            </Box>
          </MotionPaper>
        )}
      </AnimatePresence>
    </Box>
  );
}