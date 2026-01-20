import {
  Box,
  TextField,
  Button,
  InputAdornment,
  Paper,
  Typography,
  IconButton,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import HistoryIcon from "@mui/icons-material/History";
import CloseIcon from "@mui/icons-material/Close";
import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { DEFAULT_SEARCH } from "../../utils/searchConstants";
import { detectCity } from "../../utils/detectCity";
import {
  getRecentSearches,
  clearRecentSearches,
} from "../../utils/recentSearch";

const VISIBLE_HISTORY = 6;

export default function SearchForm({
  placeholder = "Tìm khách sạn hoặc thành phố",
}) {
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const wrapperRef = useRef(null);

  const [history, setHistory] = useState([]);

  /* ================= LOAD HISTORY ================= */
  useEffect(() => {
    setHistory(getRecentSearches().slice(0, VISIBLE_HISTORY));
  }, []);

  /* ================= CLICK OUTSIDE ================= */
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(e.target)
      ) {
        setOpen(false);
        setActiveIndex(-1);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () =>
      document.removeEventListener(
        "mousedown",
        handleClickOutside
      );
  }, []);

  /* ================= SUBMIT SEARCH (GIỐNG HERO) ================= */
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

    /* ===== SAVE HISTORY (FIFO, NO DUP) ===== */
    const newItem = {
      keyword,
      city: searchData.city,
    };

    const nextHistory = [
      newItem,
      ...history.filter(
        (h) =>
          h.keyword !== newItem.keyword ||
          h.city !== newItem.city
      ),
    ].slice(0, VISIBLE_HISTORY);

    setHistory(nextHistory);
    localStorage.setItem(
      "recentSearches",
      JSON.stringify(nextHistory)
    );

    setOpen(false);
    setActiveIndex(-1);
    navigate("/hotels");
  };

  /* ================= PICK HISTORY ================= */
  const handlePickHistory = (item) => {
    setValue(item.keyword || item.city);
    handleSearch(item.keyword || item.city);
  };

  const visibleHistory = history.slice(0, VISIBLE_HISTORY);

  return (
    <Box
      ref={wrapperRef}
      sx={{
        position: "relative",
        width: "100%",
        maxWidth: 920,
        mx: "auto",
        mt: 4,
      }}
    >
      {/* SEARCH BAR (UI GIỮ NGUYÊN) */}
      <Box
        sx={{
          display: "flex",
          borderRadius: "50px",
          overflow: "hidden",
          background: "rgba(32,31,40,0.75)",
          backdropFilter: "blur(10px)",
          boxShadow: "0 12px 36px rgba(0,0,0,0.45)",
          border: "1px solid rgba(255,255,255,0.08)",
          flexDirection: { xs: "column", sm: "row" },
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
            if (!open || !visibleHistory.length) {
              if (e.key === "Enter") handleSearch();
              return;
            }

            if (e.key === "ArrowDown") {
              e.preventDefault();
              setActiveIndex((prev) =>
                Math.min(prev + 1, visibleHistory.length - 1)
              );
            }

            if (e.key === "ArrowUp") {
              e.preventDefault();
              setActiveIndex((prev) =>
                Math.max(prev - 1, 0)
              );
            }

            if (e.key === "Enter") {
              e.preventDefault();
              if (activeIndex >= 0)
                handlePickHistory(visibleHistory[activeIndex]);
              else handleSearch();
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon
                  sx={{
                    color: "rgba(255,255,255,0.55)",
                    ml: 2,
                  }}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              "& fieldset": { border: "none" },
            },
            "& input": {
              py: 2.1,
              fontSize: 15,
              color: "#f5f4f2",
              ml: 1,
            },
          }}
        />

        <Button
          onClick={() => handleSearch()}
          sx={{
            px: 5,
            minWidth: 160,
            bgcolor: "#c2a56d",
            color: "#1c1b19",
            borderRadius: { xs: 0, sm: "0 999px 999px 0" },
            fontWeight: 700,
            textTransform: "none",
            "&:hover": { bgcolor: "#d1b67a" },
          }}
        >
          Tìm kiếm
        </Button>
      </Box>

      {/* DROPDOWN HISTORY (UI GIỮ NGUYÊN) */}
      {open && visibleHistory.length > 0 && (
        <Paper
          sx={{
            position: "absolute",
            top: "calc(100% + 8px)",
            width: "100%",
            borderRadius: 2,
            bgcolor: "#242321",
            zIndex: 20,
            border: "1px solid rgba(255,255,255,0.06)",
            boxShadow: "0 20px 40px rgba(0,0,0,0.6)",
            overflow: "hidden",
          }}
        >
          <Box
            sx={{
              px: 2,
              py: 1.5,
              borderBottom:
                "1px solid rgba(255,255,255,0.06)",
              display: "flex",
              justifyContent: "space-between",
            }}
          >
            <Typography
              fontSize={11}
              fontWeight={700}
              sx={{
                color: "rgba(194,165,109,0.8)",
                letterSpacing: 1,
              }}
            >
              TÌM KIẾM GẦN ĐÂY
            </Typography>

            <IconButton
              size="small"
              onClick={() => {
                clearRecentSearches();
                setHistory([]);
              }}
            >
              <CloseIcon
                sx={{
                  fontSize: 16,
                  color: "rgba(255,255,255,0.4)",
                }}
              />
            </IconButton>
          </Box>

          {visibleHistory.map((item, idx) => (
            <Box
              key={`${item.keyword}-${idx}`}
              onMouseEnter={() => setActiveIndex(idx)}
              onClick={() => handlePickHistory(item)}
              sx={{
                px: 2,
                py: 1.2,
                display: "flex",
                alignItems: "center",
                cursor: "pointer",
                bgcolor:
                  idx === activeIndex
                    ? "rgba(194,165,109,0.12)"
                    : "transparent",
                borderLeft:
                  idx === activeIndex
                    ? "4px solid #c2a56d"
                    : "4px solid transparent",
                transition: "all 0.2s ease",
              }}
            >
              <HistoryIcon
                sx={{
                  fontSize: 18,
                  color:
                    idx === activeIndex
                      ? "#c2a56d"
                      : "rgba(255,255,255,0.4)",
                  mr: 1.5,
                }}
              />
              <Typography
                fontSize={14}
                sx={{ color: "#f5f4f2" }}
                noWrap
              >
                {item.keyword || item.city}
              </Typography>
            </Box>
          ))}
        </Paper>
      )}
    </Box>
  );
}
