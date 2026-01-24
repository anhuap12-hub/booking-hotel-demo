import { useState, useEffect } from "react";
import { 
  Box, Typography, Paper, Table, TableBody, TableCell, 
  TableContainer, TableHead, TableRow, Select, MenuItem, 
  IconButton, Chip, Tooltip, CircularProgress 
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { getAllUsers, updateUserRole, deleteUser } from "../../api/admin.api";
import { useAuth } from "../../context/AuthContext"; // Thêm context để biết mình là ai

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user: currentUser } = useAuth(); // Lấy thông tin admin đang đăng nhập

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await getAllUsers();
      // Đảm bảo res.data là mảng trước khi set
      setUsers(Array.isArray(res.data) ? res.data : []);
    } catch (err) {
      console.error("Lỗi lấy danh sách user:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRoleChange = async (userId, newRole) => {
    // Chặn nếu admin tự đổi role chính mình (Backend đã chặn, Frontend chặn thêm cho chắc)
    if (userId === currentUser?._id) {
      alert("Bạn không thể tự thay đổi quyền hạn của chính mình!");
      return;
    }

    try {
      await updateUserRole(userId, newRole);
      setUsers(prev => prev.map(u => u._id === userId ? { ...u, role: newRole } : u));
    } catch (err) {
      alert(err.response?.data?.message || "Không thể cập nhật quyền");
    }
  };

  const handleDelete = async (userId) => {
    // Chặn admin tự xóa chính mình
    if (userId === currentUser?._id) {
      alert("Bạn không thể tự xóa tài khoản của chính mình!");
      return;
    }

    if (!window.confirm("Bạn có chắc chắn muốn xóa người dùng này?")) return;
    try {
      await deleteUser(userId);
      setUsers(prev => prev.filter(u => u._id !== userId));
    } catch (err) {
      alert(err.response?.data?.message || "Lỗi khi xóa người dùng");
    }
  };

  if (loading) return <Box sx={{ display: 'flex', justifyContent: 'center', p: 10 }}><CircularProgress /></Box>;

  return (
    <Box sx={{ p: 4 }}>
      <Typography variant="h5" sx={{ mb: 3, fontWeight: 800, fontFamily: "'Playfair Display', serif" }}>
        Quản lý tài khoản hệ thống
      </Typography>

      <TableContainer component={Paper} sx={{ borderRadius: "12px", boxShadow: "0 4px 20px rgba(0,0,0,0.05)" }}>
        <Table>
          <TableHead sx={{ bgcolor: "#1C1B19" }}>
            <TableRow>
              <TableCell sx={{ color: "white" }}>Tên người dùng</TableCell>
              <TableCell sx={{ color: "white" }}>Email</TableCell>
              <TableCell sx={{ color: "white" }}>Quyền hạn</TableCell>
              <TableCell sx={{ color: "white" }}>Trạng thái</TableCell>
              <TableCell sx={{ color: "white" }} align="center">Hành động</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.length > 0 ? (
              users.map((user) => (
                <TableRow key={user._id} hover>
                  <TableCell sx={{ fontWeight: 600 }}>
                    {user.username} {user._id === currentUser?._id && <Chip label="Bạn" size="small" variant="outlined" sx={{ ml: 1, height: 20 }} />}
                  </TableCell>
                  <TableCell>{user.email}</TableCell>
                  <TableCell>
                    <Select
                      value={user.role}
                      size="small"
                      disabled={user._id === currentUser?._id} // Disable nếu là chính mình
                      onChange={(e) => handleRoleChange(user._id, e.target.value)}
                      sx={{ minWidth: 120, borderRadius: "8px" }}
                    >
                      <MenuItem value="user">Người dùng</MenuItem>
                      <MenuItem value="admin">Quản trị viên</MenuItem>
                    </Select>
                  </TableCell>
                  <TableCell>
                    <Chip 
                      label={user.isActive !== false ? "Đang hoạt động" : "Bị khóa"} 
                      color={user.isActive !== false ? "success" : "error"} 
                      size="small" 
                    />
                  </TableCell>
                  <TableCell align="center">
                    <Tooltip title={user._id === currentUser?._id ? "Không thể xóa chính mình" : "Xóa tài khoản"}>
                      <span>
                        <IconButton 
                          color="error" 
                          onClick={() => handleDelete(user._id)}
                          disabled={user._id === currentUser?._id} // Vô hiệu hóa nút xóa chính mình
                        >
                          <DeleteIcon />
                        </IconButton>
                      </span>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell colSpan={5} align="center" sx={{ py: 3 }}>
                  Không tìm thấy người dùng nào.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}