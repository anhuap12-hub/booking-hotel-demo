import {
  Breadcrumbs,
  Typography,
  Link as MUILink,
  Box,
  Container,
} from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import { breadcrumbMap } from "./breadcrumbConfig";

export default function AppBreadcrumbs({ currentLabel }) {
  const location = useLocation();
  const { id } = useParams();

  // Loại bỏ "home" vì chúng ta đã có icon Trang chủ mặc định
  const segments = location.pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => seg !== "home");

  return (
    <Box
      sx={{
        bgcolor: "#F9F8F6", // Màu nền giấy cũ rất nhẹ (Cream Pearl)
        borderBottom: "1px solid rgba(194,165,109,0.15)", // Viền Gold siêu mảnh
        py: { xs: 1.5, md: 2 },
      }}
    >
      <Container maxWidth="xl">
        <Breadcrumbs
          separator={
            <NavigateNextIcon
              sx={{ fontSize: 16, color: "#C2A56D", opacity: 0.6 }}
            />
          }
          aria-label="breadcrumb"
          sx={{
            "& .MuiBreadcrumbs-ol": {
              alignItems: "center",
            },
          }}
        >
          {/* TRANG CHỦ */}
          <MUILink
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: "#72716E",
              fontSize: "0.85rem",
              fontWeight: 500,
              textDecoration: "none",
              transition: "0.3s",
              "&:hover": {
                color: "#C2A56D",
              },
            }}
          >
            <HomeOutlinedIcon sx={{ fontSize: 18 }} />
            Trang chủ
          </MUILink>

          {segments.map((seg, index) => {
            const to = "/" + segments.slice(0, index + 1).join("/");
            const isLast = index === segments.length - 1;

            let label =
              breadcrumbMap[seg]?.label ||
              seg.charAt(0).toUpperCase() + seg.slice(1);

            // Nếu là ID của hotel, ưu tiên hiển thị tên hotel (currentLabel)
            if (seg === id && currentLabel) {
              label = currentLabel;
            }

            return isLast ? (
              <Typography
                key={to}
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  color: "#1C1B19", // Màu Ebony cho trang hiện tại
                  letterSpacing: 0.2,
                }}
              >
                {label}
              </Typography>
            ) : (
              <MUILink
                key={to}
                component={Link}
                to={to}
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 500,
                  color: "#72716E",
                  textDecoration: "none",
                  transition: "0.3s",
                  "&:hover": {
                    color: "#C2A56D",
                  },
                }}
              >
                {label}
              </MUILink>
            );
          })}
        </Breadcrumbs>
      </Container>
    </Box>
  );
}