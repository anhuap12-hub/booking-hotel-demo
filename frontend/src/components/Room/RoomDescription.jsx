import { Box, Typography, Button } from "@mui/material";
import { useState } from "react";
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';

export default function RoomDescription({ room }) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Giới hạn số ký tự hiển thị ban đầu (ví dụ: 300 ký tự)
  const description = room?.desc || "Thông tin mô tả đang được cập nhật...";
  const isLongDescription = description.length > 300;
  const displayedText = isExpanded ? description : description.slice(0, 300);

  return (
    <Box>
      <Typography variant="h6" fontWeight={700} mb={2}>
        Về căn phòng này
      </Typography>

      <Typography 
        sx={{ 
          color: "#444", 
          lineHeight: 1.8,
          whiteSpace: 'pre-line', // Cực kỳ quan trọng để hiển thị dấu xuống dòng từ Admin
          fontSize: '1.05rem',
          textAlign: 'justify'
        }}
      >
        {displayedText}
        {!isExpanded && isLongDescription && "..."}
      </Typography>

      {isLongDescription && (
        <Button
          onClick={() => setIsExpanded(!isExpanded)}
          startIcon={isExpanded ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          sx={{ 
            mt: 1, 
            p: 0, 
            textTransform: 'none', 
            fontWeight: 700,
            color: 'primary.main',
            '&:hover': { bgcolor: 'transparent', textDecoration: 'underline' }
          }}
        >
          {isExpanded ? "Thu gọn" : "Xem thêm mô tả"}
        </Button>
      )}
    </Box>
  );
}