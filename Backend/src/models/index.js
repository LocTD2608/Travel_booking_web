const Sequelize = require('sequelize');
const sequelize = require('../configs/database');

// import models (đúng chuẩn factory)
const User = require('./User')(sequelize, Sequelize);
const Booking = require('./Booking')(sequelize, Sequelize);
const ChiTietBooking = require('./ChiTietBooking')(sequelize, Sequelize);
const TinhTrangPhongTrong = require('./TinhTrangPhongTrong')(sequelize, Sequelize);
const ThanhToan = require('./ThanhToan')(sequelize, Sequelize);

const ChuyenBay = require('./ChuyenBay')(sequelize, Sequelize);
const TuyenDuong = require('./TuyenDuong')(sequelize, Sequelize);
const SanBay = require('./SanBay')(sequelize, Sequelize);

// ===== QUAN HỆ =====
ChuyenBay.belongsTo(TuyenDuong, {
    foreignKey: "MaTuyenDuong"
});

TuyenDuong.belongsTo(SanBay, {
    as: "SanBayDi",
    foreignKey: "MaSanBayXuatPhat"
});

TuyenDuong.belongsTo(SanBay, {
    as: "SanBayDen",
    foreignKey: "MaSanBayDich"
});

// ===== EXPORT =====
const db = {};

db.sequelize = sequelize;
db.Sequelize = Sequelize;

db.User = User;
db.Booking = Booking;
db.ChiTietBooking = ChiTietBooking;
db.TinhTrangPhongTrong = TinhTrangPhongTrong;
db.ThanhToan = ThanhToan;

db.ChuyenBay = ChuyenBay;
db.TuyenDuong = TuyenDuong;
db.SanBay = SanBay;

module.exports = db;