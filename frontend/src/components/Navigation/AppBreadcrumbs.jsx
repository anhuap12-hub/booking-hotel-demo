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

// Màu đồng bộ với Booking-style Navbar
const COLORS = {
  primary: "#003580",    // Xanh đậm
  textActive: "#003580", // Xanh đậm cho trang hiện tại
  textInactive: "#595959", // Xám trung tính cho link trước đó
  divider: "#E0E0E0"      // Xám nhạt cho border
};

export default function AppBreadcrumbs({ currentLabel }) {
  const location = useLocation();
  const { id } = useParams();

  const segments = location.pathname
    .split("/")
    .filter(Boolean)
    .filter((seg) => seg !== "home");

  return (
    <Box
      sx={{
        bgcolor: "#FFFFFF", // Nền trắng sạch
        borderBottom: `1px solid ${COLORS.divider}`,
        py: { xs: 1.5, md: 1.5 },
      }}
    >
      <Container maxWidth="xl">
        <Breadcrumbs
          separator={
            <NavigateNextIcon
              sx={{ fontSize: 16, color: COLORS.textInactive }}
            />
          }
          aria-label="breadcrumb"
        >
          {/* TRANG CHỦ */}
          <MUILink
            component={Link}
            to="/"
            sx={{
              display: "flex",
              alignItems: "center",
              gap: 0.5,
              color: COLORS.textInactive,
              fontSize: "0.85rem",
              fontWeight: 500,
              textDecoration: "none",
              "&:hover": { color: COLORS.primary, textDecoration: "underline" },
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

            if (seg === id && currentLabel) {
              label = currentLabel;
            }

            return isLast ? (
              <Typography
                key={to}
                sx={{
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  color: COLORS.textActive, // Màu xanh đậm trang hiện tại
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
                  color: COLORS.textInactive,
                  textDecoration: "none",
                  "&:hover": { color: COLORS.primary, textDecoration: "underline" },
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