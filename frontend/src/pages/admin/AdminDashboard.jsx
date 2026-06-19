import { useEffect, useState, useCallback } from "react";
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
  FilterAlt as FilterIcon,
  Refresh as RefreshIcon
} from "@mui/icons-material";
import { getAdminStats } from "../../api/admin.api";
import * as XLSX from 'xlsx';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mặc định: Lọc từ đầu tháng hiện tại đến ngày hôm nay
  const [dateFilter, setDateFilter] = useState({
    startDate: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    endDate: new Date().toISOString().split('T')[0]
  });

  // --- 1. HÀM LẤY DỮ LIỆU ---
  const fetchData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      // Gửi tham số lọc vào API
      const res = await getAdminStats(dateFilter.startDate, dateFilter.endDate);
      
      if (res.data && res.data.success) {
        setStats(res.data.data);
      } else {
        // Dự phòng trường hợp cấu trúc trả về khác
        setStats(res.data || null);
      }
    } catch (e) {
      console.error("Stats Error:", e);
      setError("Không thể kết nối đến máy chủ hoặc bạn không có quyền truy cập.");
    } finally {
      setLoading(false);
    }
  }, [dateFilter]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  // --- 2. XUẤT EXCEL THEO DỮ LIỆU ĐÃ LỌC ---
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

  // Hàm helper định dạng tiền tệ an toàn
  const formatMoney = (amount) => `${(amount || 0).toLocaleString()}đ`;

  if (loading && !stats) return (
    <Box py={10} textAlign="center"><CircularProgress sx={{ color: '#C2A56D' }} /></Box>
  );

  return (
    <Box sx={{ p: 1 }}>
      {/* TIÊU ĐỀ & NÚT XUẤT */}
      <Stack direction={{ xs: 'column', sm: 'row' }} justifyContent="space-between" alignItems="center" mb={4} spacing={2}>
        <Box>
          <Typography variant="h4" fontWeight={800} sx={{ fontFamily: "'Playfair Display', serif" }}>
            Quản trị Tài chính
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Phân tích dòng tiền thực tế theo thời gian
          </Typography>
        </Box>
        <Button 
          variant="contained" 
          startIcon={<DownloadIcon />} 
          onClick={handleExportExcel}
          disabled={!stats?.paymentHistory?.length}
          sx={{ bgcolor: '#1C1B19', borderRadius: '10px', px: 3, fontWeight: 700, '&:hover': { bgcolor: '#333' } }}
        >
          Xuất Báo Cáo
        </Button>
      </Stack>

      {/* BỘ LỌC THỜI GIAN */}
      <Paper elevation={0} sx={{ p: 2, mb: 4, borderRadius: '16px', border: '1px solid #E5E2DC', bgcolor: '#FDFCFB' }}>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Từ ngày"
              size="small"
              value={dateFilter.startDate}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <TextField
              fullWidth
              type="date"
              label="Đến ngày"
              size="small"
              value={dateFilter.endDate}
              InputLabelProps={{ shrink: true }}
              onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
            />
          </Grid>
          <Grid item xs={12} sm={4} md={3}>
            <Button 
              fullWidth
              variant="contained" 
              startIcon={<RefreshIcon />}
              onClick={fetchData}
              sx={{ bgcolor: '#C2A56D', height: '40px', borderRadius: '8px', fontWeight: 700 }}
            >
              Cập nhật dữ liệu
            </Button>
          </Grid>
        </Grid>
      </Paper>

      {error && <Alert severity="error" sx={{ mb: 3, borderRadius: '12px' }}>{error}</Alert>}

      {/* CÁC CHỈ SỐ TỔNG QUAN */}
      <Grid container spacing={3} mb={5}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tiền cọc (Bank)" value={formatMoney(stats?.totalDeposited)} icon={<AccountBalanceWalletIcon />} color="#0288d1" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tiền mặt (Cash)" value={formatMoney(stats?.totalCashCollected)} icon={<PaidIcon />} color="#2e7d32" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Tổng doanh thu" value={formatMoney(stats?.totalRevenue)} icon={<TrendingUpIcon />} color="#ed6c02" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard title="Đã hoàn trả" value={`-${formatMoney(stats?.totalRefunded)}`} icon={<HistoryIcon />} color="#d32f2f" />
        </Grid>
      </Grid>

      {/* BẢNG CHI TIẾT GIAO DỊCH */}
      <Typography variant="h6" fontWeight={700} mb={2} sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
        <HistoryIcon fontSize="small" /> Lịch sử giao dịch trong kỳ
      </Typography>
      
      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: "1px solid #E5E2DC", overflow: 'hidden' }}>
        <Table>
          <TableHead sx={{ bgcolor: "#F9F8F6" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Ngày & Giờ</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Mã đơn</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Khách hàng</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Loại</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Phương thức</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="right">Số tiền</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {stats?.paymentHistory?.length > 0 ? (
              stats.paymentHistory.map((p, idx) => (
                <TableRow key={idx} hover>
                  <TableCell>
                    <Typography variant="body2" fontWeight={500}>{new Date(p.createdAt).toLocaleDateString('vi-VN')}</Typography>
                    <Typography variant="caption" color="text.secondary">{new Date(p.createdAt).toLocaleTimeString('vi-VN')}</Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" fontWeight={700} color="primary.main">
                        #{p.bookingId ? p.bookingId.slice(-6).toUpperCase() : 'N/A'}
                    </Typography>
                  </TableCell>
                  <TableCell><Typography variant="body2">{p.guestName || "---"}</Typography></TableCell>
                  <TableCell>
                    <Chip 
                      size="small" 
                      icon={p.type === 'INFLOW' ? <ArrowUpwardIcon sx={{fontSize: '14px !important'}}/> : <ArrowDownwardIcon sx={{fontSize: '14px !important'}}/>}
                      label={p.type === 'INFLOW' ? "Thu tiền" : "Hoàn tiền"} 
                      color={p.type === 'INFLOW' ? "success" : "error"}
                      variant="outlined"
                      sx={{ fontWeight: 700, fontSize: 11 }}
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="caption" sx={{ fontWeight: 700, color: '#555' }}>
                      {(p.method || "").toUpperCase().includes("CASH") ? 'CASH' : 'BANK'}
                    </Typography>
                  </TableCell>
                  <TableCell align="right">
                    <Typography variant="body2" fontWeight={800} color={p.type === 'INFLOW' ? "success.main" : "error.main"}>
                      {p.type === 'INFLOW' ? '+' : '-'}{(p.amount || 0).toLocaleString()}đ
                    </Typography>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={6} align="center" sx={{ py: 10 }}>
                  <Typography variant="body1" color="text.secondary">Không tìm thấy giao dịch nào trong khoảng thời gian này.</Typography>
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

function StatCard({ title, value, icon, color }) {
  return (
    <Paper elevation={0} sx={{ 
      p: 2.5, borderRadius: "16px", border: "1px solid #E5E2DC", bgcolor: '#fff', transition: '0.3s', 
      '&:hover': { transform: 'translateY(-4px)', boxShadow: '0 12px 24px rgba(0,0,0,0.05)' } 
    }}>
      <Stack direction="row" spacing={2} alignItems="center">
        <Box sx={{ width: 48, height: 48, borderRadius: "12px", display: "flex", alignItems: "center", justifyContent: "center", bgcolor: `${color}12`, color }}>
          {icon}
        </Box>
        <Box>
          <Typography variant="caption" color="text.secondary" fontWeight={700} sx={{ textTransform: 'uppercase', letterSpacing: 1 }}>{title}</Typography>
          <Typography variant="h5" fontWeight={900} color="#1C1B19">{value || '0đ'}</Typography>
        </Box>
      </Stack>
    </Paper>
  );
}