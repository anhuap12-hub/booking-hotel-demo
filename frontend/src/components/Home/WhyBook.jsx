import { Box, Typography, Stack, Container } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AutorenewIcon from "@mui/icons-material/Autorenew";

const REASONS = [
  {
    icon: <LocalOfferIcon fontSize="small" />,
    title: "Giá tốt mỗi ngày",
    desc: "Cập nhật mức giá cạnh tranh nhất.",
    iconBg: "#fef3c7",
    iconColor: "#92400e",
  },
  {
    icon: <VisibilityOffIcon fontSize="small" />,
    title: "Không phí ẩn",
    desc: "Minh bạch trong từng chi tiết.",
    iconBg: "#fff7ed",
    iconColor: "#9a3412",
  },
  {
    icon: <SupportAgentIcon fontSize="small" />,
    title: "Hỗ trợ 24/7",
    desc: "Tận tâm đồng hành cùng bạn.",
    iconBg: "#fefce8",
    iconColor: "#854d0e",
  },
  {
    icon: <AutorenewIcon fontSize="small" />,
    title: "Hoàn huỷ linh hoạt",
    desc: "Dễ dàng thay đổi kế hoạch.",
    iconBg: "#faf5ff",
    iconColor: "#6b21a8",
  },
];

export default function WhyBook() {
  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 8, mb: 6, textAlign: "center" }}>
        {/* HEADER: Thu nhỏ font size và margin */}
        <Stack alignItems="center" spacing={0.5} sx={{ mb: 4 }}>
          <Typography
            sx={{
              fontSize: "1.25rem",
              fontWeight: 800,
              color: "#3a342b",
            }}
          >
            Vì sao chọn Coffee Stay?
          </Typography>
          <Box sx={{ width: 40, height: 3, bgcolor: "#d4a373", borderRadius: 2, mt: 1 }} />
        </Stack>

        {/* GRID: Card nhỏ hơn */}
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr 1fr", // Mobile hiện 2 cột cho gọn
              md: "repeat(4, 1fr)",
            },
            gap: 2,
          }}
        >
          {REASONS.map((item) => (
            <ReasonItem key={item.title} {...item} />
          ))}
        </Box>
      </Box>
    </Container>
  );
}

function ReasonItem({ icon, title, desc, iconBg, iconColor }) {
  return (
    <Box
      sx={{
        bgcolor: "#fff",
        p: 2,
        borderRadius: 3,
        border: "1px solid #f0efed",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-5px)",
          borderColor: "#d4a373",
          boxShadow: "0 4px 12px rgba(0,0,0,0.05)"
        },
      }}
    >
      <Box
        sx={{
          width: 44,
          height: 44,
          borderRadius: "12px",
          bgcolor: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 1.5,
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontWeight: 700,
          fontSize: "0.9rem",
          color: "#3a342b",
          mb: 0.5,
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.75rem",
          color: "#7c6f64",
          lineHeight: 1.4,
        }}
      >
        {desc}
      </Typography>
    </Box>
  );
}