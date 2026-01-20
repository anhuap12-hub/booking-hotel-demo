import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Paper,
  Stack,
  CircularProgress,
  Chip,
} from "@mui/material";
import { getFollowUpBookings } from "../../api/admin.api";

export default function AdminFollowUp() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      try {
        const res = await getFollowUpBookings();
        setItems(Array.isArray(res.data) ? res.data : []);
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

  if (!items.length)
    return (
      <Box py={6} textAlign="center">
        <Typography color="text.secondary">
          No follow-up required 🎉
        </Typography>
      </Box>
    );

  return (
    <Box>
      <Typography variant="h5" fontWeight={600} mb={3}>
        Follow-up required
      </Typography>

      <Stack spacing={2}>
        {items.map((b) => (
          <Paper
            key={b._id}
            sx={{
              p: 2.5,
              borderRadius: 2,
              border: "1px solid #E5E2DC",
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Box>
                <Typography fontWeight={600}>
                  {b.user?.name} – {b.hotel?.name}
                </Typography>
                <Typography fontSize={13} color="text.secondary">
                  {new Date(b.createdAt).toLocaleString()}
                </Typography>
              </Box>

              <Chip
                label={b.contactStatus}
                color={b.contactStatus === "NEW" ? "warning" : "info"}
                size="small"
              />
            </Stack>
          </Paper>
        ))}
      </Stack>
    </Box>
  );
}
