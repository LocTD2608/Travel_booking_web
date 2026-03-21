const ChuyenBay = require("./ChuyenBay");
const TuyenDuong = require("./TuyenDuong");
const SanBay = require("./SanBay");

// Quan hệ
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

module.exports = {
  ChuyenBay,
  TuyenDuong,
  SanBay
};