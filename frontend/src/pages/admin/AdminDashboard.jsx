import { useEffect, useState } from "react";
import {
  Box, Typography, Stack, Paper, Divider, CircularProgress, Grid
} from "@mui/material";
import HotelIcon from "@mui/icons-material/Hotel";
import BookOnlineIcon from "@mui/icons-material/BookOnline";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet"; // Icon cho tiền cọc
import PaidIcon from "@mui/icons-material/Paid"; // Icon cho tổng doanh thu
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

  if (loading) return (
    <Box py={6} textAlign="center">
      <CircularProgress />
    </Box>
  );

  return (
    <Box>
      <Typography variant="h4" fontWeight={700} mb={1}>Dashboard</Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Tổng quan hoạt động kinh doanh & dòng tiền thanh toán
      </Typography>

      {/* HÀNG 1: CHỈ SỐ BOOKING & CSKH */}
      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} sm={4}>
          <Card
            title="Tổng lượt đặt"
            value={stats.total}
            icon={<BookOnlineIcon />}
            color="#1976d2"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            title="Đơn thành công"
            value={stats.closed}
            icon={<HotelIcon />}
            color="#2e7d32"
          />
        </Grid>
        <Grid item xs={12} sm={4}>
          <Card
            title="Tỉ lệ chốt"
            value={`${stats.conversionRate}%`}
            icon={<TrendingUpIcon />}
            color="#ed6c02"
          />
        </Grid>
      </Grid>

      {/* HÀNG 2: CHỈ SỐ TÀI CHÍNH (Bổ sung mới) */}
      <Typography variant="h6" fontWeight={600} mb={2} mt={4}>
        Báo cáo tài chính (Tạm tính)
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Card
            title="Tiền cọc đã nhận (SePay)"
            // Giả sử backend trả về trường totalDeposited
            value={`${stats.totalDeposited?.toLocaleString()} đ`}
            icon={<AccountBalanceWalletIcon />}
            color="#0288d1"
            subtitle="Tiền thực tế đã vào tài khoản ngân hàng"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Card
            title="Doanh thu dự kiến"
            // Giả sử backend trả về tổng giá trị các đơn thành công
            value={`${stats.totalRevenue?.toLocaleString()} đ`}
            icon={<PaidIcon />}
            color="#d32f2f"
            subtitle="Tổng tiền của tất cả đơn đã cọc hoặc đã trả"
          />
        </Grid>
      </Grid>
    </Box>
  );
}

function Card({ title, value, icon, color, subtitle = "Auto updated" }) {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 3,
        borderRadius: 3,
        border: "1px solid",
        borderColor: "divider",
        height: '100%'
      }}
    >
      <Stack direction="row" spacing={2} alignItems="center">
        <Box
          sx={{
            width: 56,
            height: 56,
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
          <Typography variant="body2" color="text.secondary" fontWeight={500}>
            {title}
          </Typography>
          <Typography variant="h5" fontWeight={800}>
            {value}
          </Typography>
        </Box>
      </Stack>

      <Divider sx={{ my: 2 }} />
      <Typography variant="caption" color="text.secondary">
        {subtitle}
      </Typography>
    </Paper>
  );
}