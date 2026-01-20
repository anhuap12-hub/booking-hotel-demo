import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  InputAdornment,
  IconButton,
  Divider,
} from "@mui/material";
import {
  Search,
  History,
  Close,
  Hotel,
  DeleteOutline,
} from "@mui/icons-material";
import { AnimatePresence, motion } from "framer-motion";
import { useState, useEffect, useRef, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import {
  useSearch,
  createDefaultSearch,
} from "../../context/SearchContext";
import { detectCity } from "../../utils/detectCity";
import {
  getRecentSearches,
  clearRecentSearches,
} from "../../utils/recentSearch";
import { normalizeText } from "../../utils/normalizeText";

const MAX_HISTORY = 6;
const VISIBLE_HOTELS = 5;

export default function HeroBanner({ hotels = [] }) {
  const [keyword, setKeyword] = useState("");
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState([]);

  const wrapRef = useRef(null);
  const navigate = useNavigate();
  const { updateSearch } = useSearch();

  /* ===== LOAD HISTORY ===== */
  useEffect(() => {
    setHistory(getRecentSearches().slice(0, MAX_HISTORY));
  }, []);

  /* ===== CLICK OUTSIDE ===== */
  useEffect(() => {
    const close = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, []);

  /* ===== HOTEL SUGGEST ===== */
  const hotelSuggest = useMemo(() => {
    if (!keyword) return [];
    const k = normalizeText(keyword);

    return hotels
      .filter(
        (h) =>
          normalizeText(h.name).includes(k) ||
          normalizeText(h.city).includes(k)
      )
      .slice(0, VISIBLE_HOTELS);
  }, [keyword, hotels]);

  /* ===== SUBMIT SEARCH ===== */
  const submit = (text = keyword) => {
    const value = text.trim();
    if (!value) return;

    const cityDetected = detectCity(value);

    // 🔑 CHUẨN THỰC TẾ:
    // - Reset search
    // - KHÔNG ép city filter
    // - Keyword dùng để search backend
    const searchData = {
      ...createDefaultSearch(),
      keyword: value,
    };

    updateSearch(searchData);

    /* ===== UPDATE HISTORY ===== */
    const newItem = {
      keyword: value,
      city: cityDetected?.label || "",
    };

    const nextHistory = [
      newItem,
      ...history.filter(
        (h) =>
          h.keyword !== newItem.keyword || h.city !== newItem.city
      ),
    ].slice(0, MAX_HISTORY);

    setHistory(nextHistory);
    localStorage.setItem(
      "recentSearches",
      JSON.stringify(nextHistory)
    );

    navigate("/hotels");
    setOpen(false);
  };

  return (
    <Box
      sx={{
        pt: "80px",
        height: { xs: 420, md: 360 },
        width: "100vw",
        marginLeft: "calc(50% - 50vw)",
        background:
          "linear-gradient(rgba(0,0,0,.45), rgba(0,0,0,.45)), url('https://images.pexels.com/photos/271624/pexels-photo-271624.jpeg') center/cover",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        color: "#fff",
        px: 2,
      }}
    >
      <Typography variant="h3" fontWeight={700} mb={1.5}>
        Tìm khách sạn phù hợp nhất
      </Typography>
      <Typography sx={{ opacity: 0.9, mb: 4 }}>
        Trải nghiệm kỳ nghỉ tuyệt vời tại các thành phố hàng đầu
      </Typography>

      {/* SEARCH */}
      <Box
        ref={wrapRef}
        sx={{ width: "100%", maxWidth: 560, position: "relative" }}
      >
        <Paper
          sx={{
            display: "flex",
            alignItems: "center",
            p: 1,
            pl: 2,
            height: 60,
            borderRadius: open ? "22px 22px 0 0" : "100px",
            boxShadow: "0 15px 35px rgba(0,0,0,.25)",
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
                  <Search />
                </InputAdornment>
              ),
              endAdornment: keyword && (
                <InputAdornment position="end">
                  <IconButton
                    size="small"
                    onClick={() => {
                      setKeyword("");
                      setOpen(false);
                    }}
                  >
                    <Close fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{
              "& fieldset": { border: "none" },
              "& input": { fontSize: 15 },
            }}
          />

          <Button
            onClick={() => submit()}
            variant="contained"
            sx={{
              height: "100%",
              px: 4,
              fontWeight: 700,
              borderRadius: "100px",
            }}
          >
            Tìm kiếm
          </Button>
        </Paper>

        {/* DROPDOWN */}
        <AnimatePresence>
          {open && (hotelSuggest.length || history.length) && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.2 }}
              style={{ position: "absolute", width: "100%", zIndex: 10 }}
            >
              <Paper sx={{ borderRadius: "0 0 22px 22px" }}>
                {/* HOTEL */}
                {hotelSuggest.length > 0 && (
                  <>
                    <Typography px={3} py={1} fontSize={12}>
                      Khách sạn
                    </Typography>
                    {hotelSuggest.map((h) => (
                      <Box
                        key={h._id}
                        onClick={() => submit(h.name)}
                        sx={{
                          px: 3,
                          py: 1.5,
                          display: "flex",
                          gap: 2,
                          cursor: "pointer",
                          "&:hover": {
                            bgcolor: "rgba(0,0,0,.05)",
                          },
                        }}
                      >
                        <Hotel fontSize="small" />
                        <Box>
                          <Typography fontWeight={600}>
                            {h.name}
                          </Typography>
                          <Typography fontSize={12}>
                            {h.city}
                          </Typography>
                        </Box>
                      </Box>
                    ))}
                    <Divider />
                  </>
                )}

                {/* HISTORY */}
                {history.length > 0 && (
                  <Box
                    px={3}
                    py={1}
                    display="flex"
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Typography fontSize={12}>
                      Lịch sử tìm kiếm
                    </Typography>
                    <IconButton
                      size="small"
                      onClick={() => {
                        clearRecentSearches();
                        setHistory([]);
                      }}
                    >
                      <DeleteOutline fontSize="small" />
                    </IconButton>
                  </Box>
                )}

                {history.map((h, i) => (
                  <Box
                    key={i}
                    onClick={() => submit(h.keyword || h.city)}
                    sx={{
                      px: 3,
                      py: 1.5,
                      display: "flex",
                      gap: 2,
                      cursor: "pointer",
                      "&:hover": {
                        bgcolor: "rgba(0,0,0,.05)",
                      },
                    }}
                  >
                    <History fontSize="small" />
                    <Typography>
                      {h.keyword || h.city}
                    </Typography>
                  </Box>
                ))}
              </Paper>
            </motion.div>
          )}
        </AnimatePresence>
      </Box>
    </Box>
  );
}
