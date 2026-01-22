import { Box, Typography, Stack, Container } from "@mui/material";
import LocalOfferIcon from "@mui/icons-material/LocalOffer";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import { motion } from "framer-motion";

const MotionBox = motion(Box);

const REASONS = [
  {
    icon: <LocalOfferIcon fontSize="small" />,
    title: "Giá tốt mỗi ngày",
    desc: "Cập nhật mức giá cạnh tranh nhất.",
    iconBg: "#F9F5F0", // Tông Sand nhẹ
    iconColor: "#C2A56D", // Vàng đồng thương hiệu
  },
  {
    icon: <VisibilityOffIcon fontSize="small" />,
    title: "Không phí ẩn",
    desc: "Minh bạch trong từng chi tiết.",
    iconBg: "#F9F5F0",
    iconColor: "#C2A56D",
  },
  {
    icon: <SupportAgentIcon fontSize="small" />,
    title: "Hỗ trợ 24/7",
    desc: "Tận tâm đồng hành cùng bạn.",
    iconBg: "#F9F5F0",
    iconColor: "#C2A56D",
  },
  {
    icon: <AutorenewIcon fontSize="small" />,
    title: "Hoàn huỷ linh hoạt",
    desc: "Dễ dàng thay đổi kế hoạch.",
    iconBg: "#F9F5F0",
    iconColor: "#C2A56D",
  },
];

export default function WhyBook() {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <Container maxWidth="lg">
      <Box sx={{ mt: 10, mb: 10 }}>
        {/* HEADER */}
        <MotionBox
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          sx={{ mb: 6, textAlign: "center" }}
        >
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
        </MotionBox>

        {/* GRID VỚI MOTION */}
        <MotionBox
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
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
            <ReasonItem key={item.title} {...item} />
          ))}
        </MotionBox>
      </Box>
    </Container>
  );
}

function ReasonItem({ icon, title, desc, iconBg, iconColor }) {
  const itemVariants = {
    hidden: { opacity: 0, scale: 0.95, y: 20 },
    visible: { 
      opacity: 1, 
      scale: 1, 
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    },
  };

  return (
    <MotionBox
      variants={itemVariants}
      whileHover={{ 
        y: -8,
        transition: { duration: 0.3 }
      }}
      sx={{
        bgcolor: "#fff",
        p: { xs: 2.5, md: 4 },
        borderRadius: "24px",
        border: "1px solid #F1F0EE",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        textAlign: "center",
        transition: "border-color 0.3s ease",
        "&:hover": {
          borderColor: "#C2A56D",
          boxShadow: "0 20px 40px rgba(0,0,0,0.04)"
        },
      }}
    >
      <Box
        sx={{
          width: 50,
          height: 50,
          borderRadius: "16px",
          bgcolor: iconBg,
          color: iconColor,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          transition: "0.3s ease",
        }}
      >
        {icon}
      </Box>

      <Typography
        sx={{
          fontWeight: 800,
          fontSize: "1rem",
          color: "#1C1B19",
          mb: 1,
          letterSpacing: "-0.01em"
        }}
      >
        {title}
      </Typography>

      <Typography
        sx={{
          fontSize: "0.85rem",
          color: "#72716E",
          lineHeight: 1.6,
          fontWeight: 500
        }}
      >
        {desc}
      </Typography>
    </MotionBox>
  );
}