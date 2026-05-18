const db = require('../models');
const emailService = require('../services/emailService');
const moment = require('moment');
const crypto = require('crypto');
const querystring = require('qs');

function sortObject(obj) {
    let sorted = {};
    let str = [];
    let key;
    for (key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            str.push(encodeURIComponent(key));
        }
    }
    str.sort();
    for (key = 0; key < str.length; key++) {
        sorted[str[key]] = encodeURIComponent(obj[str[key]]).replace(/%20/g, "+");
    }
    return sorted;
}

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

// Chức năng 1: Tạo URL thanh toán VNPay
exports.createPaymentUrl = async (req, res) => {
    try {
        const { amount, orderId } = req.body;
        
        let date = new Date();
        // Sử dụng moment để định dạng thời gian chuẩn yyyyMMddHHmmss
        let createDate = moment(date).format('YYYYMMDDHHmmss');
        
        // Lấy IP của client
        let ipAddr = req.headers['x-forwarded-for'] ||
            req.connection.remoteAddress ||
            req.socket.remoteAddress ||
            req.connection.socket.remoteAddress;

        // Thông tin cấu hình VNPay
        let tmnCode = 'PJIXF7GZ';
        let secretKey = 'AF82U26MITR6OKJ88U75NGBSDUHVNPF5';
        let vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
        let returnUrl = 'http://localhost:5173/payment-return';

        // Khởi tạo các tham số theo tài liệu VNPay
        let currCode = 'VND';
        let vnp_Params = {};
        vnp_Params['vnp_Version'] = '2.1.0';
        vnp_Params['vnp_Command'] = 'pay';
        vnp_Params['vnp_TmnCode'] = tmnCode;
        vnp_Params['vnp_Locale'] = 'vn';
        vnp_Params['vnp_CurrCode'] = currCode;
        vnp_Params['vnp_TxnRef'] = orderId; // Mã đơn hàng
        vnp_Params['vnp_OrderInfo'] = 'Thanh toan cho ma GD:' + orderId;
        vnp_Params['vnp_OrderType'] = 'other';
        vnp_Params['vnp_Amount'] = amount * 100; // VNPay yêu cầu số tiền nhân 100
        vnp_Params['vnp_ReturnUrl'] = returnUrl;
        vnp_Params['vnp_IpAddr'] = ipAddr;
        vnp_Params['vnp_CreateDate'] = createDate;

        // 1. Sắp xếp tham số
        vnp_Params = sortObject(vnp_Params);

        // 2. Tạo chuỗi ký
        let signData = querystring.stringify(vnp_Params, { encode: false });
        
        // 3. Tạo chữ ký HMAC-SHA512
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex"); 
        
        // 4. Gắn chữ ký vào tham số
        vnp_Params['vnp_SecureHash'] = signed;
        
        // 5. Tạo URL cuối cùng
        vnpUrl += '?' + querystring.stringify(vnp_Params, { encode: false });

        return res.json({ success: true, paymentUrl: vnpUrl });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

// Chức năng 2: Kiểm tra kết quả callback từ VNPay
exports.vnpayReturn = async (req, res) => {
    try {
        let vnp_Params = req.query;

        // 1. Lấy Secure Hash từ URL
        let secureHash = vnp_Params['vnp_SecureHash'];

        // 2. Xóa các tham số hash để chuẩn bị tính toán lại checksum
        delete vnp_Params['vnp_SecureHash'];
        delete vnp_Params['vnp_SecureHashType'];

        // 3. Sắp xếp lại tham số như lúc tạo URL
        vnp_Params = sortObject(vnp_Params);

        let secretKey = 'AF82U26MITR6OKJ88U75NGBSDUHVNPF5';

        // 4. Băm lại chuỗi tham số
        let signData = querystring.stringify(vnp_Params, { encode: false });
        let hmac = crypto.createHmac("sha512", secretKey);
        let signed = hmac.update(Buffer.from(signData, 'utf-8')).digest("hex");     

        // 5. Đối chiếu chữ ký (Checksum)
        if (secureHash === signed) {
            // Checksum đúng, dữ liệu không bị can thiệp
            if (vnp_Params['vnp_ResponseCode'] === '00') {
                
                // Update Booking in DB
                const MaBooking = vnp_Params['vnp_TxnRef'];
                const amount = vnp_Params['vnp_Amount'] / 100;
                
                const t = await db.sequelize.transaction();
                try {
                    const booking = await db.Booking.findByPk(MaBooking, { transaction: t });
                    if (booking) {
                        await booking.update(
                            {
                                TrangThaiBooking: 'DA_THANH_TOAN',
                                ThoiDiemThanhToan: new Date()
                            },
                            { transaction: t }
                        );

                        // Lấy user
                        const user = await db.User.findByPk(booking.UserID, { transaction: t });

                        // Lưu thanh toán
                        await db.ThanhToan.create(
                            {
                                MaBooking,
                                PhuongThucThanhToan: 'vnpay',
                                SoTien: amount || booking.TongTien,
                                TrangThaiTT: 'success',
                                ThoiDiemThanhToan: new Date()
                            },
                            { transaction: t }
                        );
                        
                        await t.commit();
                        
                        // Gửi email (sau khi commit)
                        try {
                            await emailService.sendBookingSuccess({
                                ...booking.toJSON(),
                                Email: user ? user.Email : undefined
                            });
                        } catch (emailErr) {
                            console.error('Error sending email:', emailErr);
                        }
                    } else {
                        await t.rollback();
                    }
                } catch (dbErr) {
                    await t.rollback();
                    console.error('Error updating DB for VNPay:', dbErr);
                }

                return res.json({ 
                    success: true, 
                    message: 'Giao dịch thành công', 
                    code: vnp_Params['vnp_ResponseCode'],
                    data: vnp_Params
                });
            } else {
                return res.json({ 
                    success: false, 
                    message: 'Giao dịch thất bại', 
                    code: vnp_Params['vnp_ResponseCode'],
                    data: vnp_Params
                });
            }
        } else {
            // Checksum sai, dữ liệu bị giả mạo
            return res.status(400).json({ 
                success: false, 
                message: 'Chữ ký không hợp lệ (Invalid Checksum)' 
            });
        }
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};

exports.confirmPayment = async (req, res) => {
    // VNPay webhook already updates the DB
    // We just return success to avoid frontend 404
    try {
        return res.json({ success: true, message: 'Payment confirmed via callback' });
    } catch (error) {
        return res.status(500).json({ message: error.message });
    }
};
