const roomService = require("../services/room.service");

const getRoomDetail = async (req, res) => {
  try {
    const { id } = req.params;

    const data = await roomService.getRoomDetail(id);

    res.status(200).json(data);
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

const handleRoomBooking = async (req, res) => {
    try {
        const { roomId, bookingDate, quantity } = req.body;

        // Kiểm tra đầu vào cơ bản
        if (!roomId || !bookingDate || !quantity) {
            return res.status(400).json({ message: "Thiếu thông tin đặt phòng (roomId, bookingDate, quantity)" });
        }

        const result = await roomService.updateRoomAvailability(roomId, bookingDate, quantity);

        return res.status(200).json({
            message: "Đặt phòng thành công!",
            data: result
        });
    } catch (error) {
        // Trả về lỗi nếu hết phòng hoặc không tìm thấy phòng (lỗi throw từ Service)
        return res.status(400).json({ message: error.message });
    }
};

module.exports = {
  getRoomDetail,
  handleRoomBooking
};