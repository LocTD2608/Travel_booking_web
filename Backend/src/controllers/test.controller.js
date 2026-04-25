const db = require('../models');

exports.createTestBooking = async (req, res) => {
    try {
        const newUser = await db.User.create({
            Ten: 'Test User',
            Email: `test${Date.now()}@gmail.com`,
            Password: '123456'
        });

        const booking = await db.Booking.create({
            UserID: newUser.UserID,
            TrangThaiBooking: 'pending'
        });

        console.log("BOOKING DATA VALUES:", booking.dataValues);

        const bookingId = booking.dataValues.MaBooking;

        if (!bookingId) {
            throw new Error("❌ Booking ID is NULL");
        }

        const last = await db.ChiTietBooking.findOne({
            order: [['MaCTBooking', 'DESC']]
        });

        const newId = last ? last.MaCTBooking + 1 : 1;

        await db.ChiTietBooking.create({
            MaCTBooking: newId,
            MaBooking: bookingId,
            SoLuongNguoi: 2,
            LoaiDoiTuong: 'hotel'
        });

        await db.TinhTrangPhongTrong.create({
            MaLoaiPhong: 1,
            SoLuongPhongCoSan: 10
        });

        return res.json({
            message: "Created test booking",
            bookingId: bookingId
        });

    } catch (err) {
        console.error("FULL ERROR:", err);
        return res.status(500).json({ 
            error: err.message,
            details: err.errors 
        });
    }
};