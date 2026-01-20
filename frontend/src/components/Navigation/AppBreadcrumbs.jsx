import {
  Breadcrumbs,
  Typography,
  Link as MUILink,
  Box,
} from "@mui/material";
import { Link, useLocation, useParams } from "react-router-dom";
import NavigateNextIcon from "@mui/icons-material/NavigateNext";
import HomeIcon from "@mui/icons-material/Home";
import { breadcrumbMap } from "./breadcrumbConfig";

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
        px: { xs: 2, md: 4 },
        py: 1.5,
        bgcolor: "#EFE7DD",          // ✅ nâu coffee đậm hơn
        borderBottom: "1px solid #D6C9B8",
      }}
    >
      <Breadcrumbs
        separator={
          <NavigateNextIcon
            fontSize="small"
            sx={{ color: "#9C8466" }}
          />
        }
        sx={{
          "& a": {
            fontSize: "0.8rem",
            fontWeight: 500,
            color: "#5C4A36",
            display: "flex",
            alignItems: "center",
            gap: 0.5,
            textDecoration: "none",
            transition: "0.2s",
            "&:hover": {
              color: "#8B6F4E",
            },
          },
        }}
      >
        {/* Trang chủ */}
        <MUILink component={Link} to="/home">
          <HomeIcon fontSize="small" sx={{ mb: "1px" }} />
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
                fontSize: "0.8rem",
                fontWeight: 700,
                color: "#8B6F4E",
              }}
            >
              {label}
            </Typography>
          ) : (
            <MUILink key={to} component={Link} to={to}>
              {label}
            </MUILink>
          );
        })}
      </Breadcrumbs>
    </Box>
  );
}
