const Sequelize = require('sequelize');
const sequelize = require('../configs/database');

// import models (đúng chuẩn factory)
const User = require('./User')(sequelize, Sequelize);
const Booking = require('./Booking')(sequelize, Sequelize);
const ChiTietBooking = require('./ChiTietBooking')(sequelize, Sequelize);
const TinhTrangPhongTrong = require('./TinhTrangPhongTrong')(sequelize, Sequelize);
const ThanhToan = require('./ThanhToan')(sequelize, Sequelize);
const Hotel = require('./Hotel')(sequelize, Sequelize);
const LoaiPhong = require('./LoaiPhong')(sequelize, Sequelize);
const KhuyenMai = require('./KhuyenMai')(sequelize, Sequelize);

const ChuyenBay = require('./ChuyenBay')(sequelize, Sequelize);
const TuyenDuong = require('./TuyenDuong')(sequelize, Sequelize);
const SanBay = require('./SanBay')(sequelize, Sequelize);
const Ghe = require('./Ghe')(sequelize, Sequelize);
const CTBookingGhe = require('./CTBookingGhe')(sequelize, Sequelize);

const DichVu = require('./DichVu')(sequelize, Sequelize);
const DV_DU_LICH = require('./DV_DU_LICH')(sequelize, Sequelize);

// ===== QUAN HỆ =====
Hotel.hasMany(LoaiPhong, { foreignKey: 'MaKS', as: 'rooms' });
LoaiPhong.belongsTo(Hotel, { foreignKey: 'MaKS' });

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

ChuyenBay.hasMany(Ghe, { foreignKey: 'MaChuyenBay' });
Ghe.belongsTo(ChuyenBay, { foreignKey: 'MaChuyenBay' });

ChiTietBooking.belongsToMany(Ghe, { through: CTBookingGhe, foreignKey: 'MaCTBooking' });
Ghe.belongsToMany(ChiTietBooking, { through: CTBookingGhe, foreignKey: 'MaGhe' });

// Tour Relations
DV_DU_LICH.belongsTo(DichVu, {
    foreignKey: "MaDV_DL"
});

DichVu.hasOne(DV_DU_LICH, {
    as: "TourDetails",
    foreignKey: "MaDV_DL"
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
db.Hotel = Hotel;
db.LoaiPhong = LoaiPhong;
db.KhuyenMai = KhuyenMai;

db.ChuyenBay = ChuyenBay;
db.TuyenDuong = TuyenDuong;
db.SanBay = SanBay;
db.Ghe = Ghe;
db.CTBookingGhe = CTBookingGhe;

db.DichVu = DichVu;
db.DV_DU_LICH = DV_DU_LICH;

module.exports = db;