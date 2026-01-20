import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Stack,
  Paper,
  Divider,
  CircularProgress,
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import { getAdminStats } from "../../api/admin.api";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getAdminStats();
        setStats(res.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, []);

  if (loading)
    return (
      <Box py={6} textAlign="center">
        <CircularProgress />
      </Box>
    );

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>
        Dashboard
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        CSKH & booking overview
      </Typography>

      <Stack direction={{ xs: "column", md: "row" }} spacing={3}>
        <Card
          title="Total Leads"
          value={stats.total}
          icon={<BookOnlineIcon />}
          color="#1976d2"
        />
        <Card
          title="Confirmed"
          value={stats.closed}
          icon={<HotelIcon />}
          color="#2e7d32"
        />
        <Card
          title="Conversion"
          value={`${stats.conversionRate}%`}
          icon={<TrendingUpIcon />}
          color="#ed6c02"
        />
      </Stack>
    </Box>
  );
}

function Card({ title, value, icon, color }) {
  return (
    <Paper
      elevation={0}
      sx={{
        flex: 1,
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: 2,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            bgcolor: `${color}15`,
            color,
          }}
        >
          {icon}
        </Box>

        <Box>
          <Typography variant="body2" color="text.secondary">
            {title}
          </Typography>
          <Typography variant="h4" fontWeight={700}>
            {value}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />
      <Typography variant="caption" color="text.secondary">
        Auto updated
      </Typography>
    </Paper>
  );
}
