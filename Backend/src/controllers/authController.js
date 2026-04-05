const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const db = require('../configs/db'); // File db.js mình vừa tạo ở bước trước

// HÀM ĐĂNG KÝ
exports.register = async (req, res) => {
    try {
        const { fullName, email, phoneNumber, password } = req.body;
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const query = 'INSERT INTO Users (full_name, email, phone_number, password) VALUES (?, ?, ?, ?)';
        await db.execute(query, [fullName, email, phoneNumber, hashedPassword]);

        res.status(201).json({ message: "Đăng ký thành công!" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

// HÀM ĐĂNG NHẬP
exports.login = async (req, res) => {
    try {
        const { identifier, password } = req.body;
        const query = 'SELECT * FROM Users WHERE email = ? OR phone_number = ?';
        const [users] = await db.execute(query, [identifier, identifier]);
        
        if (users.length === 0) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

        const isMatch = await bcrypt.compare(password, users[0].password);
        if (!isMatch) return res.status(401).json({ message: "Sai tài khoản hoặc mật khẩu" });

        const token = jwt.sign({ id: users[0].id }, 'SECRET_KEY', { expiresIn: '1d' });
        res.status(200).json({ message: "Thành công", token, user: { id: users[0].id, email: users[0].email, fullName: users[0].full_name } });
    } catch (error) {
        res.status(500).json({ message: "Lỗi server" });
    }
};

// HÀM QUÊN MẬT KHẨU (Tạm thời để trống để không bị lỗi router)
const nodemailer = require('nodemailer');

exports.forgotPassword = async (req, res) => {
    const { email } = req.body;
    try {
        // 1. Kiểm tra email có tồn tại không
        const [users] = await db.execute('SELECT * FROM Users WHERE email = ?', [email]);
        if (users.length === 0) return res.status(404).json({ message: "Email không tồn tại!" });

        // 2. Tạo mã OTP 6 số ngẫu nhiên
        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        const expiry = new Date(Date.now() + 5 * 60000); // Hết hạn sau 5 phút

        // 3. Lưu OTP vào Database
        await db.execute('UPDATE Users SET reset_otp = ?, otp_expiry = ? WHERE email = ?', [otp, expiry, email]);

        // 4. Gửi Mail (Mô phỏng - bạn sẽ thấy mã hiện ở Terminal Backend)
        console.log(`--- OTP cho ${email} là: ${otp} ---`);
        
        res.json({ message: "Mã OTP đã được gửi về Email của bạn!" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi hệ thống" });
    }
};

// HÀM XÁC THỰC OTP (Tạm thời để trống)
exports.verifyOtp = async (req, res) => {
    res.json({ message: "Chức năng đang phát triển" });
};