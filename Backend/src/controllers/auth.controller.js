const { User } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const emailService = require("../services/emailService");
const crypto = require("crypto");

const otpStore = new Map();

exports.register = async (req, res) => {
    try {
        const Ho = req.body.Ho || req.body.ho;
        const Ten = req.body.Ten || req.body.ten;
        const Email = req.body.Email || req.body.email;
        const SDT = req.body.SDT || req.body.sdt;
        const Password = req.body.Password || req.body.password;
        
        if (!Email) return res.status(400).json({ message: "Email là bắt buộc" });
        const existingUser = await User.findOne({ where: { Email } });
        if (existingUser) return res.status(400).json({ message: "Email đã được sử dụng" });

        const hashedPassword = await bcrypt.hash(Password, 10);
        const newUser = await User.create({ Ho, Ten, Email, SDT, Password: hashedPassword });

        const token = jwt.sign({ id: newUser.UserID }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.status(201).json({ message: "Đăng ký thành công", token, user: { id: newUser.UserID, Ho, Ten, Email } });
    } catch (error) {
        console.error("Register Error:", error);
        if (error.name === 'SequelizeUniqueConstraintError') {
            return res.status(400).json({ message: "Dữ liệu đã tồn tại (Email hoặc Số điện thoại)" });
        }
        res.status(500).json({ message: "Lỗi Server", error: error.message, details: error.errors });
    }
};

exports.login = async (req, res) => {
    try {
        const email = req.body.Email || req.body.email;
        const password = req.body.Password || req.body.password;
        
        if (!email) return res.status(400).json({ message: "Vui lòng nhập Email" });
        if (!password) return res.status(400).json({ message: "Vui lòng nhập Password" });

        const user = await User.findOne({ where: { Email: email } });
        if (!user) return res.status(400).json({ message: "Tài khoản không tồn tại" });

        let isMatch = false;
        try {
            isMatch = await bcrypt.compare(password, user.Password);
        } catch (err) {
            isMatch = false;
        }
        
        // Hỗ trợ đăng nhập cho các tài khoản dùng mật khẩu chưa mã hóa (mock data)
        if (!isMatch && password === user.Password) {
            isMatch = true;
        }

        if (!isMatch) return res.status(400).json({ message: "Mật khẩu không chính xác" });

        const token = jwt.sign({ id: user.UserID }, process.env.JWT_SECRET, { expiresIn: "7d" });
        res.json({ message: "Đăng nhập thành công", token, user: { id: user.UserID, Ho: user.Ho, Ten: user.Ten, Email: user.Email } });
    } catch (error) {
        console.error("Login Error:", error);
        res.status(500).json({ message: "Lỗi Server", error: error.message });
    }
};

exports.forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await User.findOne({ where: { Email: email } });
        if (!user) return res.status(404).json({ message: "Email không tồn tại" });

        const otp = Math.floor(100000 + Math.random() * 900000).toString();
        otpStore.set(email, { otp, expires: Date.now() + 600000 });
        await emailService.sendOtpEmail(email, otp);
        res.json({ message: "Mã OTP đã được gửi" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};

exports.verifyOtp = async (req, res) => {
    const { email, otp } = req.body;
    const storedData = otpStore.get(email);
    if (!storedData || storedData.otp !== otp || storedData.expires < Date.now()) {
        return res.status(400).json({ message: "Mã OTP không hợp lệ" });
    }
    const resetToken = crypto.randomBytes(32).toString("hex");
    otpStore.set(email, { resetToken, expires: Date.now() + 600000 });
    res.json({ message: "Xác thực thành công", resetToken });
};

exports.resetPassword = async (req, res) => {
    const { email, resetToken, newPassword } = req.body;
    const storedData = otpStore.get(email);
    if (!storedData || storedData.resetToken !== resetToken) return res.status(400).json({ message: "Yêu cầu không hợp lệ" });

    try {
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await User.update({ Password: hashedPassword }, { where: { Email: email } });
        otpStore.delete(email);
        res.json({ message: "Đổi mật khẩu thành công" });
    } catch (error) {
        res.status(500).json({ message: "Lỗi Server" });
    }
};
