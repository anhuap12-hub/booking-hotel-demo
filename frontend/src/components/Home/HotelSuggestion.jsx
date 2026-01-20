import { useState, useEffect, useMemo } from "react";
import { Box, Typography, CircularProgress, Button } from "@mui/material";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import HotelCard from "../Hotel/HotelCard";
import { getAllHotels } from "../../api/hotel.api";

export default function HotelSuggestion({ filters }) {
  const [allHotelsData, setAllHotelsData] = useState([]); // Kho dữ liệu tổng
  const [displayCount, setDisplayCount] = useState(3); // Số lượng đang hiển thị
  const [loading, setLoading] = useState(false); // Loading khi gọi API
  const [btnLoading, setBtnLoading] = useState(false); // Loading khi ấn nút Xem thêm

  const STEP = 3; // Mỗi lần hiện thêm đúng 3 cái

  // 1. Gọi API lấy dữ liệu khi bộ lọc (filters) thay đổi
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        // Lấy khoảng 50 cái làm "kho" để người dùng ấn xem thêm không phải đợi API nhiều lần
        const res = await getAllHotels({ ...filters, limit: 50 }); 
        setAllHotelsData(res.data?.data || []);
        setDisplayCount(3); // Reset về 3 cái đầu tiên khi có bộ lọc mới
      } catch (error) {
        console.error("Lỗi lấy dữ liệu:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [filters]);

  // 2. Logic cắt mảng để hiển thị đúng số lượng yêu cầu
  const visibleHotels = useMemo(() => {
    return allHotelsData.slice(0, displayCount);
  }, [allHotelsData, displayCount]);

  // 3. Hàm xử lý click Xem thêm với hiệu ứng loading giả
  const handleShowMore = () => {
    setBtnLoading(true);
    // Tạo độ trễ nhẹ 400ms để hiệu ứng nút bấm trông mượt và thật hơn
    setTimeout(() => {
      setDisplayCount((prev) => prev + STEP);
      setBtnLoading(false);
    }, 400);
  };

  return (
    <Box sx={{ mt: 4, mb: 6, width: "100%" }}>
      {/* Tiêu đề Section */}
      <Typography 
        variant="h5" 
        fontWeight={900} 
        mb={4} 
        sx={{ 
          display: "flex", 
          alignItems: "center",
          color: "#1a1a1a",
          "&::before": {
            content: '""',
            width: "5px",
            height: "28px",
            bgcolor: "#003580",
            borderRadius: "4px",
            mr: 2
          }
        }}
      >
        Tất cả chỗ ở gợi ý
      </Typography>

      {loading && allHotelsData.length === 0 ? (
        // Loading toàn trang khi bắt đầu hoặc đổi filter
        <Box sx={{ display: "flex", justifyContent: "center", py: 10 }}>
          <CircularProgress sx={{ color: "#003580" }} />
        </Box>
      ) : (
        <Box>
          {/* GRID HIỂN THỊ: Luôn dàn hàng ngang 3 cột trên desktop */}
          <Box sx={{ 
            display: "grid", 
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)", 
            },
            gap: 4,
            width: "100%"
          }}>
            {visibleHotels.map((h) => (
              <Box key={h._id}>
                <HotelCard hotel={h} />
              </Box>
            ))}
          </Box>

          {/* NÚT XEM THÊM VỚI HIỆU ỨNG */}
          {displayCount < allHotelsData.length && (
            <Box sx={{ display: "flex", justifyContent: "center", mt: 8 }}>
              <Button
                variant="outlined"
                disabled={btnLoading}
                onClick={handleShowMore}
                endIcon={
                  btnLoading ? (
                    <CircularProgress size={16} sx={{ color: "inherit" }} />
                  ) : (
                    <ArrowForwardIcon className="arrow-icon" />
                  )
                }
                sx={{
                  color: "#003580",
                  borderColor: "#003580",
                  px: 6,
                  py: 1.5,
                  borderRadius: "100px",
                  textTransform: "none",
                  fontWeight: 800,
                  fontSize: "1rem",
                  transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
                  
                  "&:hover": {
                    bgcolor: "#003580",
                    color: "#fff",
                    borderColor: "#003580",
                    boxShadow: "0 8px 20px rgba(0, 53, 128, 0.2)",
                    transform: "translateY(-4px)",
                    "& .arrow-icon": {
                      transform: "translateX(6px)"
                    }
                  },
                  
                  "& .arrow-icon": {
                    transition: "transform 0.3s ease"
                  },

                  "&.Mui-disabled": {
                    borderColor: "#e0e0e0",
                    color: "#9e9e9e"
                  }
                }}
              >
                {btnLoading ? "Đang xử lý..." : `Xem thêm 3 chỗ nghỉ khác`}
              </Button>
            </Box>
          )}
        </Box>
      )}

      {/* Thông báo khi không tìm thấy dữ liệu */}
      {!loading && allHotelsData.length === 0 && (
        <Box sx={{ textAlign: "center", py: 10, bgcolor: "#f8f9fa", borderRadius: 4 }}>
          <Typography color="text.secondary" fontWeight={500}>
            Không tìm thấy khách sạn nào phù hợp với bộ lọc của bạn.
          </Typography>
        </Box>
      )}
    </Box>
  );
}