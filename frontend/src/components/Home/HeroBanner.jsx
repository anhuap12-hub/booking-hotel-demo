import { Box, Typography, TextField, Button, Paper, Stack, Divider } from "@mui/material";
import { LocationOnOutlined, CalendarMonthOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";

export default function HeroBanner() {
  const navigate = useNavigate();
  const { handleSearch } = useSearch();
  
  const [localSearch, setLocalSearch] = useState({
    keyword: "",
    checkIn: "",
    checkOut: ""
  });

  const onSearchClick = () => {
    handleSearch(localSearch);
    // Nếu đang ở trang chủ thì navigate, nếu đang ở trang /hotels thì context sẽ tự cập nhật
    navigate("/hotels");
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") onSearchClick();
  };

  return (
    <Box sx={{ 
      position: "relative", 
      minHeight: { xs: "400px", md: "500px" }, 
      width: "100%", // Thay vì 100vw để an toàn hơn
      display: "flex", 
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      bgcolor: "#1C1B19"
    }}>
      {/* BACKGROUND IMAGE WITH OVERLAY */}
      <Box sx={{
        position: "absolute",
        inset: 0,
        backgroundImage: `url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070')`,
        backgroundPosition: "center",
        backgroundSize: "cover",
        "&::after": {
          content: '""',
          position: "absolute",
          inset: 0,
          background: "rgba(0, 0, 0, 0.4)" // Overlay an toàn
        }
      }} />
      
      <Stack spacing={4} alignItems="center" sx={{ width: "100%", px: 2, zIndex: 2 }}>
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: { xs: "2rem", md: "3.5rem" },
            color: "#fff",
            lineHeight: 1.2,
            mb: 1,
          }}>
            Tìm nơi dừng chân <Box component="span" sx={{ color: "#C2A56D" }}>hoàn hảo</Box>
          </Typography>
          <Typography sx={{ color: "rgba(255,255,255,0.9)", fontSize: "1.1rem" }}>
            Khám phá không gian nghỉ dưỡng thượng lưu tại Coffee Stay
          </Typography>
        </Box>

        <Paper
          elevation={0}
          sx={{
            display: "flex", 
            flexDirection: { xs: "column", md: "row" },
            alignItems: "center", 
            p: { xs: 2, md: 1 }, 
            width: "100%",
            maxWidth: 950, 
            borderRadius: { xs: "24px", md: "100px" },
            bgcolor: "#fff",
            boxShadow: "0 20px 40px rgba(0,0,0,0.3)",
            border: "1px solid rgba(194, 165, 109, 0.2)"
          }}
        >
          {/* 1. Địa điểm */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1.5, px: 2, width: "100%" }}>
            <LocationOnOutlined sx={{ color: "#C2A56D", mr: 1 }} />
            <TextField
              fullWidth
              placeholder="Bạn muốn đi đâu?"
              variant="standard"
              value={localSearch.keyword}
              onChange={(e) => setLocalSearch({...localSearch, keyword: e.target.value})}
              onKeyDown={handleKeyDown}
              InputProps={{ disableUnderline: true, sx: { fontWeight: 600 } }}
            />
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" }, mx: 1 }} />

          {/* 2. Ngày nhận phòng */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, px: 2, width: "100%", mt: { xs: 2, md: 0 } }}>
            <CalendarMonthOutlined sx={{ color: "#C2A56D", mr: 1 }} />
            <TextField
              fullWidth
              type="date"
              label="Nhận phòng"
              InputLabelProps={{ shrink: true }}
              variant="standard"
              value={localSearch.checkIn}
              onChange={(e) => setLocalSearch({...localSearch, checkIn: e.target.value})}
              InputProps={{ disableUnderline: true, sx: { fontSize: "0.85rem" } }}
            />
          </Box>

          <Divider orientation="vertical" flexItem sx={{ display: { xs: "none", md: "block" }, mx: 1 }} />

          {/* 3. Ngày trả phòng */}
          <Box sx={{ display: "flex", alignItems: "center", flex: 1, px: 2, width: "100%", mt: { xs: 2, md: 0 } }}>
            <CalendarMonthOutlined sx={{ color: "#C2A56D", mr: 1 }} />
            <TextField
              fullWidth
              type="date"
              label="Trả phòng"
              InputLabelProps={{ shrink: true }}
              variant="standard"
              value={localSearch.checkOut}
              onChange={(e) => setLocalSearch({...localSearch, checkOut: e.target.value})}
              InputProps={{ disableUnderline: true, sx: { fontSize: "0.85rem" } }}
            />
          </Box>

          <Button
            onClick={onSearchClick}
            variant="contained"
            sx={{
              height: { xs: 50, md: 60 }, 
              px: { xs: 4, md: 5 }, 
              mt: { xs: 2, md: 0 },
              borderRadius: "100px",
              bgcolor: "#1C1B19", 
              color: "#C2A56D",
              fontWeight: 800,
              textTransform: "none",
              whiteSpace: "nowrap",
              width: { xs: "100%", md: "auto" },
              "&:hover": { bgcolor: "#C2A56D", color: "#1C1B19" },
              transition: "all 0.3s ease"
            }}
          >
            Tìm kiếm
          </Button>
        </Paper>
      </Stack>
    </Box>
  );
}