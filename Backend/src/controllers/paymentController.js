const db = require('../models');
const emailService = require('../services/emailService');

exports.handleSuccess = async (req, res) => {
    const { MaBooking, amount, method } = req.query;

    if (!MaBooking) {
        return res.status(400).json({ message: 'Missing MaBooking' });
    }

    const t = await db.sequelize.transaction();

    try {
        // 1. Lấy booking trước
        const booking = await db.Booking.findByPk(MaBooking, { transaction: t });

        if (!booking) {
            throw new Error('Booking not found');
        }

        // 2. Lấy user
        const user = await db.User.findByPk(booking.UserID, { transaction: t });

        // 3. Update trạng thái booking
        await booking.update(
            {
                TrangThaiBooking: 'DA_THANH_TOAN',
                ThoiDiemThanhToan: new Date()
            },
            { transaction: t }
        );

        // 4. Lưu thanh toán
        const payment = await db.ThanhToan.create(
            {
                MaBooking,
                PhuongThucThanhToan: method || 'vnpay',
                SoTien: parseFloat(amount) || booking.TongTien,
                TrangThaiTT: 'success',
                ThoiDiemThanhToan: new Date()
            },
            { transaction: t }
        );

        await t.commit();

        // 5. Gửi email (sau khi commit)
        await emailService.sendBookingSuccess({
            ...booking.toJSON(),
            Email: user ? user.Email : undefined
        });

        return res.json({ success: true, message: 'Payment successful', booking, payment });

    } catch (err) {
        await t.rollback();
        return res.status(500).json({ message: err.message });
    }
};

exports.handleFail = async (req, res) => {
    const { MaBooking } = req.query;

    if (!MaBooking) {
        return res.status(400).json({ message: 'Missing MaBooking' });
    }

    const t = await db.sequelize.transaction();

    try {
        // 1. Lấy booking
        const booking = await db.Booking.findByPk(MaBooking, { transaction: t });

        if (!booking) {
            throw new Error('Booking not found');
        }

        // 2. Lấy chi tiết booking
        const details = await db.ChiTietBooking.findAll({
            where: { MaBooking },
            transaction: t
        });

        // 3. Trả lại phòng
        for (let item of details) {
            if (item.LoaiDoiTuong === 'hotel') {
                await db.TinhTrangPhongTrong.increment(
                    { SoLuongPhong: 1 },
                    {
                        where: { MaLoaiPhong: item.MaLoaiPhong },
                        transaction: t
                    }
                );
            }
        }

        // 4. Xóa chi tiết booking
        await db.ChiTietBooking.destroy({
            where: { MaBooking },
            transaction: t
        });

        // 5. Xóa thanh toán nếu có
        await db.ThanhToan.destroy({
            where: { MaBooking },
            transaction: t
        });

        // 6. Cập nhật trạng thái booking thành "DA_HUY"
        await booking.update({
            TrangThaiBooking: 'DA_HUY'
        }, { transaction: t });

        await t.commit();

        return res.json({ success: false, message: 'Payment failed', booking });

    } catch (err) {
        await t.rollback();
        return res.status(500).json({ message: err.message });
    }
};

