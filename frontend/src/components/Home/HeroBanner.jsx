import {
  Box, Typography, TextField, Button, Paper, Stack
} from "@mui/material";
import { LocationOnOutlined } from "@mui/icons-material";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function HeroBanner() {
  const [keyword, setKeyword] = useState("");
  const navigate = useNavigate();

  return (
    <Box sx={{ 
      position: "relative", 
      // Chiều cao vừa vặn, không quá cao
      height: { xs: "400px", md: "480px" }, 
      width: "100vw", // Ép tràn hết chiều ngang trình duyệt
      marginLeft: "calc(-50vw + 50%)", // Kỹ thuật để tràn lề nếu component cha có padding
      display: "flex", 
      alignItems: "center",
      justifyContent: "center",
      overflow: "hidden",
      // Background bao phủ toàn bộ không gian
      backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.3), rgba(0, 0, 0, 0.3)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&q=80&w=2070')`,
      backgroundPosition: "center",
      backgroundSize: "cover",
      backgroundRepeat: "no-repeat"
    }}>
      
      {/* Không dùng Container ở đây để nội dung có thể tùy biến tự do */}
      <Stack spacing={4} alignItems="center" sx={{ width: "100%", px: 2, zIndex: 1 }}>
        
        <Box sx={{ textAlign: "center" }}>
          <Typography sx={{
            fontFamily: "'Playfair Display', serif",
            fontWeight: 900,
            fontSize: { xs: "2.2rem", md: "3.8rem" },
            color: "#fff",
            lineHeight: 1.1,
            textShadow: "0 2px 10px rgba(0,0,0,0.3)",
            mb: 1,
          }}>
            Tìm nơi dừng chân <Box component="span" sx={{ color: "#C2A56D" }}>hoàn hảo</Box>
          </Typography>
          
          <Typography sx={{ 
            color: "rgba(255,255,255,0.95)", 
            fontSize: { xs: "0.9rem", md: "1.1rem" }, 
            fontWeight: 400,
            letterSpacing: "0.05em"
          }}>
            Khám phá không gian nghỉ dưỡng thượng lưu tại Coffee Stay
          </Typography>
        </Box>

        {/* Search Box - Cố định kích thước vừa phải, nằm giữa */}
        <Paper
          elevation={0}
          sx={{
            display: "flex", 
            alignItems: "center", 
            p: "4px", 
            pl: 3,
            width: "100%",
            maxWidth: 800, // Thanh search không nên quá dài, giữ ở mức 800px là đẹp nhất
            borderRadius: "100px",
            bgcolor: "#fff",
            boxShadow: "0 10px 40px rgba(0,0,0,0.2)"
          }}
        >
          <LocationOnOutlined sx={{ color: "#C2A56D", fontSize: 24, mr: 1.5 }} />
          <TextField
            fullWidth
            placeholder="Bạn muốn đi đâu?"
            variant="standard"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
            InputProps={{ 
              disableUnderline: true,
              sx: { fontSize: "1.1rem", fontWeight: 500 } 
            }}
          />
          <Button
            onClick={() => navigate("/hotels")}
            variant="contained"
            sx={{
              height: 54, 
              px: { xs: 3, md: 6 }, 
              borderRadius: "100px",
              bgcolor: "#1C1B19", 
              color: "#C2A56D",
              fontWeight: 800,
              fontSize: "0.95rem",
              textTransform: "none",
              whiteSpace: "nowrap",
              "&:hover": { bgcolor: "#000" }
            }}
          >
            Tìm kiếm
          </Button>
        </Paper>
      </Stack>
    </Box>
  );
}