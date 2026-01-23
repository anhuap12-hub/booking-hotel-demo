import { useEffect, useState } from "react";
import {
  Box, Typography, Stack, Paper, Divider, CircularProgress, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip
} from "@mui/material";
import {
  Hotel as HotelIcon, BookOnline as BookOnlineIcon, TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon, Paid as PaidIcon,
  History as HistoryIcon, ArrowUpward as ArrowUpwardIcon, ArrowDownward as ArrowDownwardIcon
} from "@mui/icons-material";
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
    <Box py={10} textAlign="center"><CircularProgress sx={{ color: '#C2A56D' }} /></Box>
  );

  return (
    <Box sx={{ p: 1 }}>
      <Typography variant="h4" fontWeight={800} mb={1} sx={{ fontFamily: "'Playfair Display', serif" }}>
        Báo cáo Tài chính
      </Typography>
      <Typography variant="body2" color="text.secondary" mb={4}>
        Theo dõi biến động dòng tiền và lịch sử giao dịch thực tế
      </Typography>

      {/* TỔNG QUAN TÀI CHÍNH (CARDS) */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng tiền cọc (30%)" value={`${stats.totalDeposited?.toLocaleString()}đ`} icon={<AccountBalanceWalletIcon />} color="#0288d1" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tiền mặt đã thu" value={`${stats.totalCashCollected?.toLocaleString()}đ`} icon={<PaidIcon />} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng doanh thu" value={`${stats.totalRevenue?.toLocaleString()}đ`} icon={<TrendingUpIcon />} color="#ed6c02" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tiền đã hoàn (Refund)" value={`-${stats.totalRefunded?.toLocaleString()}đ`} icon={<HistoryIcon />} color="#d32f2f" />
        </Grid>
      </Grid>

      {/* BẢNG LỊCH SỬ THANH TOÁN */}
      <Typography variant="h6" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryIcon fontSize="small" /> Lịch sử giao dịch gần đây
      </Typography>
      
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: "1px solid #E5E2DC" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F9F8F6" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Ngày giao dịch</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Mã đơn</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Loại giao dịch</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Phương thức</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Số tiền</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats.paymentHistory?.map((payment, idx) => (
              <TableRow key={idx} hover>
                <TableCell>
                  <Typography variant="body2">{new Date(payment.createdAt).toLocaleDateString('vi-VN')}</Typography>
                  <Typography variant="caption" color="text.secondary">{new Date(payment.createdAt).toLocaleTimeString('vi-VN')}</Typography>
                </TableCell>
                <TableCell>
                  <Typography variant="body2" fontWeight={700}>#{payment.bookingId?.slice(-6).toUpperCase()}</Typography>
                </TableCell>
                <TableCell>
                  <Chip 
                    size="small" 
                    icon={payment.type === 'INFLOW' ? <ArrowUpwardIcon fontSize="small"/> : <ArrowDownwardIcon fontSize="small"/>}
                    label={payment.type === 'INFLOW' ? "Thu tiền" : "Hoàn tiền"} 
                    color={payment.type === 'INFLOW' ? "success" : "error"}
                    variant="outlined"
                    sx={{ fontWeight: 700, fontSize: 11 }}
                  />
                </TableCell>
                <TableCell>
                  <Typography variant="caption" sx={{ fontWeight: 600, color: '#72716E' }}>
                    {payment.method === 'BANK_TRANSFER' ? 'Chuyển khoản (SePay)' : 'Tiền mặt tại quầy'}
                  </Typography>
                </TableCell>
                <TableCell align="right">
                  <Typography variant="body2" fontWeight={800} color={payment.type === 'INFLOW' ? "success.main" : "error.main"}>
                    {payment.type === 'INFLOW' ? '+' : '-'}{payment.amount?.toLocaleString()}đ
                  </Typography>
                </TableCell>
                <TableCell>
                  <Chip label="Thành công" size="small" sx={{ bgcolor: '#E8F5E9', color: '#2E7D32', fontWeight: 700, fontSize: 10 }} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

// Component phụ cho Card chỉ số
function StatCard({ title, value, icon, color }) {
  return (
    <Paper elevation={0} sx={{ p: 2.5, borderRadius: "16px", border: "1px solid #E5E2DC", bgcolor: '#fff' }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ width: 48, height: 48, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: `${color}10`, color }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={600} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>{title}</Typography>
          <Typography variant="h5" fontWeight={900} color="#1C1B19">{value}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}