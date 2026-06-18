import React, { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Select, MenuItem, 
  IconButton, Chip, Tooltip, CircularProgress 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllUsers, updateUserRole, deleteUser } from "../../api/admin.api";
import { useAuth } from "../../context/AuthContext";

const PRIMARY_BLUE = "#0056b3";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth();

  useEffect(() => { fetchUsers(); }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.message || "Không thể cập nhật quyền");
    }
  };

  const handleDelete = async (userId) => {
    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xóa người dùng");
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress sx={{ color: PRIMARY_BLUE }} /></Box>;

  return (
    <Box sx={{ p: 3, maxWidth: 1200, mx: 'auto' }}>
      <Typography variant="h4" fontWeight={800} sx={{ mb: 4 }}>
        Quản lý tài khoản
      </Typography>

      <TableContainer component={Paper} elevation={0} sx={{ borderRadius: "16px", border: "1px solid #e0e0e0" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#f8f9fa" }}>
            <TableRow>
              <TableCell sx={{ fontWeight: 700 }}>Tên người dùng</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Email</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Quyền hạn</TableCell>
              <TableCell sx={{ fontWeight: 700 }}>Trạng thái</TableCell>
              <TableCell sx={{ fontWeight: 700 }} align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user._id} hover>
                <TableCell>
                  <Typography fontWeight={600}>{user.username}</Typography>
                  {user._id === currentUser?._id && <Chip label="Bạn" size="small" sx={{ height: 20, fontSize: 10, bgcolor: "#e3f2fd", color: PRIMARY_BLUE }} />}
                </TableCell>
                <TableCell sx={{ color: "text.secondary" }}>{user.email}</TableCell>
                <TableCell>
                  <Select
                    value={user.role}
                    size="small"
                    disabled={user._id === currentUser?._id}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    sx={{ minWidth: 120, borderRadius: "8px", "& .MuiOutlinedInput-notchedOutline": { borderColor: "#e0e0e0" } }}
                  >
                    <MenuItem value="user">Người dùng</MenuItem>
                    <MenuItem value="admin">Quản trị viên</MenuItem>
                  </Select>
                </TableCell>
                <TableCell>
                  <Chip 
                    label={user.isActive !== false ? "Hoạt động" : "Bị khóa"} 
                    size="small" 
                    sx={{ 
                      bgcolor: user.isActive !== false ? "#e6fffa" : "#fff5f5",
                      color: user.isActive !== false ? "#28a745" : "#dc3545",
                      fontWeight: 600, borderRadius: "8px" 
                    }} 
                  />
                </TableCell>
                <TableCell align="center">
                  <IconButton 
                    color="error" 
                    onClick={() => handleDelete(user._id)}
                    disabled={user._id === currentUser?._id}
                  >
                    <DeleteIcon fontSize="small" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}