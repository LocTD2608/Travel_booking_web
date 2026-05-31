const hotelService = require("../services/hotel.service");
const db = require("../models");

const Hotel = db.Hotel;

// GET ALL
const getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.findAll();

        res.status(200).json({
            success: true,
            data: hotels
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// GET DETAIL
const getHotelDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const data = await hotelService.getHotelDetail(id);

        res.status(200).json({
            success: true,
            data
        });
    } catch (error) {
        const status = error.message === "Hotel not found" ? 404 : 500;

        res.status(status).json({
            success: false,
            message: error.message
        });
    }
};

// CREATE
const createHotel = async (req, res) => {
    try {
        const hotel = await Hotel.create(req.body);

        res.status(201).json({
            success: true,
            message: "Tạo khách sạn thành công",
            data: hotel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// UPDATE
const updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khách sạn"
            });
        }

        await hotel.update(req.body);

        res.status(200).json({
            success: true,
            message: "Cập nhật khách sạn thành công",
            data: hotel
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

// DELETE
const deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khách sạn"
            });
        }

        await hotel.destroy();

        res.status(200).json({
            success: true,
            message: "Xóa khách sạn thành công"
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getAllHotels,
    getHotelDetail,
    createHotel,
    updateHotel,
    deleteHotel
};