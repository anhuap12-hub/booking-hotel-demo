import { Box, Typography } from "@mui/material";

export default function HotelDescription({ hotel }) {
  return (
    <Box>
      <Typography
        sx={{
          fontFamily: "Playfair Display, serif",
          fontSize: "1.35rem",
          fontWeight: 500,
          color: "text.primary",
          mb: 1.5,
        }}
      >
        Giới thiệu không gian lưu trú
      </Typography>

      <Typography
        sx={{
          fontSize: 15,
          lineHeight: 1.9,
          color: "text.secondary",
          maxWidth: 820,
        }}
      >
        {hotel.desc ||
          `Nằm trong một không gian yên tĩnh và riêng tư, khách sạn mang đến cảm giác
          thư thái ngay từ những khoảnh khắc đầu tiên khi bạn đặt chân đến. Thiết kế
          tổng thể theo phong cách tối giản, ấm áp với tông màu trầm, lấy cảm hứng từ
          thiên nhiên và nhịp sống chậm rãi, giúp du khách dễ dàng tìm lại sự cân bằng
          sau những ngày bận rộn.

          Hệ thống phòng nghỉ được chăm chút kỹ lưỡng với nội thất tinh gọn, ánh sáng
          dịu nhẹ và đầy đủ tiện nghi cần thiết cho cả chuyến đi công tác lẫn kỳ nghỉ
          dài ngày. Mỗi không gian đều được bố trí để tối ưu sự thoải mái, riêng tư và
          cảm giác dễ chịu khi lưu trú.

          Từ khách sạn, bạn có thể thuận tiện di chuyển đến các khu ẩm thực, điểm tham
          quan và khu mua sắm nổi bật trong khu vực. Dù bạn đang tìm kiếm một nơi để
          nghỉ ngơi, làm việc hay đơn giản là chậm lại và tận hưởng không khí xung
          quanh, đây sẽ là lựa chọn phù hợp cho một kỳ nghỉ nhẹ nhàng và trọn vẹn.`}
      </Typography>
    </Box>
  );
}
