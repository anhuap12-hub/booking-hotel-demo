import React from "react";
import { Box, Typography, Stack, Container } from "@mui/material";

const REASONS = [
  {
    title: "Giá tốt mỗi ngày",
    desc: "Cập nhật mức giá cạnh tranh nhất.",
  },
  {
    title: "Không phí ẩn",
    desc: "Minh bạch trong từng chi tiết.",
  },
  {
    title: "Hỗ trợ 24/7",
    desc: "Tận tâm đồng hành cùng bạn.",
  },
  {
    title: "Hoàn huỷ linh hoạt",
    desc: "Dễ dàng thay đổi kế hoạch.",
  },
];

const WhyBook = () => {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 10, mb: 10 }}>
        {/* HEADER */}
        <Box sx={{ mb: 6, textAlign: "center" }}>
          <Stack alignItems="center" spacing={1}>
            <Typography
              sx={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "1.75rem",
                fontWeight: 800,
                color: "#1C1B19",
              }}
            >
              Trải nghiệm khác biệt
            </Typography>
            <Box sx={{ width: 40, height: 2, bgcolor: "#C2A56D" }} />
          </Stack>
        </Box>

        {/* GRID */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)",
              md: "repeat(4, 1fr)",
            },
            gap: { xs: 2, md: 4 },
          }}
        >
          {REASONS.map((item) => (
            <Box
              key={item.title}
              sx={{
                bgcolor: "#fff",
                p: { xs: 2.5, md: 4 },
                borderRadius: "24px",
                border: "1px solid #F1F0EE",
                textAlign: "center",
                transition: "all 0.3s ease-in-out",
                "&:hover": {
                  borderColor: "#C2A56D",
                  boxShadow: "0 20px 40px rgba(0,0,0,0.06)",
                  transform: "translateY(-8px)",
                },
              }}
            >
              {/* Decorative circle thay icon */}
              <Box
                sx={{
                  width: 50,
                  height: 50,
                  borderRadius: "50%",
                  bgcolor: "#F9F5F0",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  mb: 2,
                }}
              >
                <Typography
                  sx={{
                    fontWeight: 700,
                    fontSize: "0.9rem",
                    color: "#C2A56D",
                  }}
                >
                  {item.title.charAt(0)}
                </Typography>
              </Box>

              <Typography
                sx={{
                  fontWeight: 800,
                  fontSize: "1rem",
                  color: "#1C1B19",
                  mb: 1,
                  letterSpacing: "-0.01em",
                }}
              >
                {item.title}
              </Typography>

              <Typography
                sx={{
                  fontSize: "0.85rem",
                  color: "#72716E",
                  lineHeight: 1.6,
                  fontWeight: 500,
                }}
              >
                {item.desc}
              </Typography>
            </Box>
          ))}
        </Box>
      </Box>
    </Container>
  );
};

export default WhyBook;
