import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Typography,
  Stack,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
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
        // Loại bỏ hoàn toàn padding/margin thừa gây ra khối màu trắng
        p: 0, 
        background: "transparent", 
      }}
    >
      {/* MAIN SEARCH BAR: Tinh chỉnh bo góc và độ trong suốt */}
      <Box
        sx={{
          display: "flex",
          borderRadius: "100px",
          p: 0.6, // Giảm padding để thanh search gọn gàng hơn
          background: "rgba(28, 27, 25, 0.75)", // Ebony với độ trong suốt
          backdropFilter: "blur(20px)", // Hiệu ứng kính mờ
          border: "1px solid rgba(194, 165, 109, 0.3)", // Viền Gold mờ
          boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
          flexDirection: { xs: "column", sm: "row" },
          transition: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:focus-within": {
            borderColor: "#C2A56D",
            background: "rgba(28, 27, 25, 0.9)", // Đậm lên khi focus
            boxShadow: "0 20px 60px rgba(194, 165, 109, 0.2)",
            transform: "translateY(-2px)"
          }
        }}
      >
        <TextField
          fullWidth
          variant="standard" // Dùng standard để dễ custom
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
            disableUnderline: true, // Tắt đường gạch chân mặc định của MUI
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#C2A56D", ml: 3, fontSize: 24 }} />
              </InputAdornment>
            ),
          }}
          sx={{
            "& input": {
              py: 2.2,
              fontSize: 16,
              color: "#F1F0EE",
              ml: 1,
              "&::placeholder": { color: "rgba(241, 240, 238, 0.5)", opacity: 1 }
            },
          }}
        />

        <Button
          onClick={() => handleSearch()}
          sx={{
            px: 6,
            minWidth: 160,
            bgcolor: "#C2A56D",
            color: "#1C1B19",
            borderRadius: "100px",
            fontWeight: 800,
            fontSize: 15,
            textTransform: "uppercase", // Chuyển sang uppercase cho vibe luxury
            letterSpacing: "0.1em",
            "&:hover": { 
              bgcolor: "#D4BC8E",
              boxShadow: "0 0 20px rgba(194, 165, 109, 0.4)" 
            },
            transition: "0.3s",
            m: 0.4 // Khoảng cách nhỏ với viền ngoài
          }}
        >
          Tìm kiếm
        </Button>
      </Box>

      {/* DROPDOWN HISTORY: Tinh chỉnh lại đổ bóng và vị trí */}
      <AnimatePresence>
        {open && history.length > 0 && (
          <MotionPaper
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 5 }}
            sx={{
              position: "absolute",
              top: "calc(100% + 15px)",
              left: 0,
              right: 0,
              borderRadius: "28px",
              bgcolor: "rgba(28, 27, 25, 0.98)",
              backdropFilter: "blur(25px)",
              zIndex: 2000,
              border: "1px solid rgba(194, 165, 109, 0.15)",
              boxShadow: "0 40px 80px rgba(0,0,0,0.6)",
              overflow: "hidden",
            }}
          >
            {/* ... giữ nguyên phần nội dung history bên trong ... */}
            <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ px: 3, py: 2.5, borderBottom: "1px solid rgba(255,255,255,0.05)" }}>
              <Typography variant="caption" sx={{ color: "#C2A56D", fontWeight: 800, letterSpacing: "0.2em" }}>
                GẦN ĐÂY
              </Typography>
              <Button 
                size="small" 
                onClick={() => { clearRecentSearches(); setHistory([]); }}
                sx={{ color: "rgba(255,255,255,0.4)", fontSize: 11, textTransform: "none" }}
              >
                Xóa lịch sử
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
                    py: 2,
                    display: "flex",
                    alignItems: "center",
                    cursor: "pointer",
                    bgcolor: idx === activeIndex ? "rgba(194, 165, 109, 0.12)" : "transparent",
                    transition: "0.2s",
                  }}
                >
                  {item.city ? (
                    <LocationOnIcon sx={{ fontSize: 20, color: "#C2A56D", mr: 2 }} />
                  ) : (
                    <HistoryIcon sx={{ fontSize: 20, color: "rgba(255,255,255,0.3)", mr: 2 }} />
                  )}
                  <Typography sx={{ color: idx === activeIndex ? "#F1F0EE" : "rgba(241, 240, 238, 0.8)", fontSize: 15 }}>
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