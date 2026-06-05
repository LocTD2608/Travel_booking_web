const hotelService = require("../services/hotel.service");
const db = require("../models");

const Hotel = db.Hotel;
// Get all
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
// Get detail
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
// Create
const createHotel = async (req, res) => {
    try {
        const { Room = [], ...hotelData } = req.body;

        const hotel = await Hotel.create(hotelData);

        if (Room.length > 0) {
            await db.LoaiPhong.bulkCreate(
                Room.map(room => ({
                    MaKS: hotel.MaKS,
                    TenPhong: room.TenPhong,
                    GiaPhong: room.GiaPhong,
                    SoNguoiOToiDa: room.SoNguoiOToiDa
                }))
            );
        }

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
// Update
const updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khách sạn"
            });
        }

        const {
            TenKS,
            DiaChi,
            HangSao,
            Room
        } = req.body;

        await hotel.update({
            TenKS,
            DiaChi,
            HangSao
        });

        if (Room && Array.isArray(Room)) {

            await db.LoaiPhong.destroy({
                where: {
                    MaKS: hotel.MaKS
                }
            });

            await db.LoaiPhong.bulkCreate(
                Room.map(room => ({
                    MaKS: hotel.MaKS,
                    TenPhong: room.TenPhong,
                    GiaPhong: room.GiaPhong,
                    SoNguoiOToiDa: room.SoNguoiOToiDa
                }))
            );
        }

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

// Xóa ks
const deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByPk(req.params.id);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khách sạn"
            });
        }

        await db.LoaiPhong.destroy({
            where: {
                MaKS: hotel.MaKS
            }
        });

        await hotel.destroy();

        res.status(200).json({
            success: true,
            message: "Xóa khách sạn và toàn bộ phòng thành công"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};
// Xóa phòng trong ks
const deleteRoomInHotel = async (req, res) => {
    try {
        const { hotelId, roomId } = req.params;

        const hotel = await db.Hotel.findByPk(hotelId);

        if (!hotel) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy khách sạn"
            });
        }

        const room = await db.LoaiPhong.findOne({
            where: {
                MaLoaiPhong: roomId,
                MaKS: hotelId
            }
        });

        if (!room) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy phòng trong khách sạn này"
            });
        }

        await room.destroy();

        res.status(200).json({
            success: true,
            message: "Xóa phòng thành công"
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
    deleteHotel,
    deleteRoomInHotel
};