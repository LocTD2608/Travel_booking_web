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

module.exports = {
  getRoomDetail,
};