const hotelService = require("../services/hotel.service");

const getHotelDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await hotelService.getHotelDetail(id);
        res.status(200).json({ success: true, data });
    } catch (error) {
        const status = error.message === "Hotel not found" ? 404 : 500;
        res.status(status).json({ success: false, message: error.message });
    }
};

module.exports = { getHotelDetail };
