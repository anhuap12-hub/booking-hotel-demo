import React, { useEffect, useState, useCallback } from "react";
import {
  Box, Typography, Stack, Paper, CircularProgress, Grid,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Chip, Alert, Button, TextField, Divider
} from "@mui/material";
import {
  TrendingUp as TrendingUpIcon,
  AccountBalanceWallet as AccountBalanceWalletIcon, 
  Paid as PaidIcon,
  History as HistoryIcon, 
  ArrowUpward as ArrowUpwardIcon, 
  ArrowDownward as ArrowDownwardIcon,
  Download as DownloadIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import { getAdminStats } from "../../api/admin.api";
import * as XLSX from 'xlsx';

const PRIMARY_BLUE = "#0056b3";

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getAdminStats(dateFilter.startDate, dateFilter.endDate);
      setStats(res.data?.success ? res.data.data : res.data);
    } catch (e) {
      setError("Không thể kết nối máy chủ hoặc bạn không có quyền truy cập.");
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => { fetchData(); }, [fetchData]);

  const handleExportExcel = () => {
    if (!stats?.paymentHistory?.length) return;
    const excelData = stats.paymentHistory.map((p) => ({
      "Ngày giao dịch": new Date(p.createdAt).toLocaleDateString('vi-VN'),
      "Mã đơn": p.bookingId ? `#${p.bookingId.slice(-6).toUpperCase()}` : 'N/A',
      "Khách hàng": p.guestName || "N/A",
      "Loại": p.type === 'INFLOW' ? "Thu tiền" : "Hoàn tiền",
      "Phương thức": (p.method || "").toUpperCase().includes("CASH") ? 'Tiền mặt' : 'Chuyển khoản',
      "Số tiền (VNĐ)": p.amount,
      "Trạng thái": "Thành công"
    }));
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Báo cáo tài chính");
    XLSX.writeFile(wb, `Bao_cao_${dateFilter.startDate}_den_${dateFilter.endDate}.xlsx`);
  };

  const formatMoney = (amount) => `${(amount || 0).toLocaleString()}đ`;

  if (loading && !stats) return <Box py={10} textAlign="center"><CircularProgress sx={{ color: PRIMARY_BLUE }} /></Box>;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={4} spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={800} color="#1a1a1a">Quản trị Tài chính</Typography>
          <Typography variant="body1" color="text.secondary">Phân tích dòng tiền thực tế theo thời gian</Typography>
        </Box>
        <Button variant="contained" startIcon={<DownloadIcon />} onClick={handleExportExcel}
          disabled={!stats?.paymentHistory?.length}
          sx={{ bgcolor: PRIMARY_BLUE, borderRadius: '12px', px: 4, py: 1.5, fontWeight: 700, '&:hover': { bgcolor: '#004494' } }}>
          Xuất Báo Cáo
        </Button>
      </Stack>

      <Paper elevation={0} sx={{ p: 3, mb: 4, borderRadius: '16px', border: '1px solid #e0e0e0' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4}><TextField fullWidth type="date" label="Từ ngày" size="small" value={dateFilter.startDate} InputLabelProps={{ shrink: true }} onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })} /></Grid>
          <Grid item xs={12} sm={4}><TextField fullWidth type="date" label="Đến ngày" size="small" value={dateFilter.endDate} InputLabelProps={{ shrink: true }} onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })} /></Grid>
          <Grid item xs={12} sm={4}><Button fullWidth variant="contained" startIcon={<RefreshIcon />} onClick={fetchData} sx={{ bgcolor: '#333', height: '40px', borderRadius: '8px' }}>Cập nhật</Button></Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Tiền cọc" value={formatMoney(stats?.totalDeposited)} icon={<AccountBalanceWalletIcon />} color="#0056b3" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Tiền mặt" value={formatMoney(stats?.totalCashCollected)} icon={<PaidIcon />} color="#28a745" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Tổng thu" value={formatMoney(stats?.totalRevenue)} icon={<TrendingUpIcon />} color="#ed6c02" /></Grid>
        <Grid item xs={12} sm={6} md={3}><StatCard title="Đã hoàn" value={`-${formatMoney(stats?.totalRefunded)}`} icon={<HistoryIcon />} color="#d32f2f" /></Grid>
      </Grid>

      <Typography variant="h6" fontWeight={700} mb={2}>Lịch sử giao dịch</Typography>
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: "1px solid #e0e0e0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Ngày</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Mã đơn</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Khách hàng</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Loại</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Số tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats?.paymentHistory?.map((p, idx) => (
              <TableRow key={idx} hover>
                <TableCell>{new Date(p.createdAt).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell sx={{ fontWeight: 700, color: PRIMARY_BLUE }}>#{p.bookingId?.slice(-6).toUpperCase()}</TableCell>
                <TableCell>{p.guestName}</TableCell>
                <TableCell>
                  <Chip size="small" label={p.type === 'INFLOW' ? "Thu tiền" : "Hoàn tiền"} 
                    sx={{ bgcolor: p.type === 'INFLOW' ? "#e6fffa" : "#fff5f5", color: p.type === 'INFLOW' ? "#28a745" : "#dc3545", fontWeight: 600, borderRadius: '8px' }} />
                </TableCell>
                <TableCell align="right" sx={{ fontWeight: 800 }}>{p.type === 'INFLOW' ? '+' : '-'}{p.amount.toLocaleString()}đ</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Paper elevation={0} sx={{ p: 3, borderRadius: "16px", border: "1px solid #e0e0e0" }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ width: 48, height: 48, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: `${color}10`, color }}>
          {React.cloneElement(icon, { sx: { fontSize: 26 } })}
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 0.5 }}>
            {title}
          </Typography>
          <Typography 
            variant="h5" 
            fontWeight={800} 
            sx={{ 
              color: "#1a1a1a",
              // Font chữ số chuyên dụng để dễ đọc
              fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
              fontVariantNumeric: 'tabular-nums', 
              lineHeight: 1.2 
            }}
          >
            {value}
          </Typography>
        </Box>
      </Stack>
    </Paper>
  );
}