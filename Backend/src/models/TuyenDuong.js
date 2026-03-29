const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const TuyenDuong = sequelize.define("TuyenDuong", {
  MaTuyenDuong: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  MaSanBayXuatPhat: DataTypes.INTEGER,
  MaSanBayDich: DataTypes.INTEGER
}, {
  tableName: "tuyen_duong",
  timestamps: false
});

module.exports = TuyenDuong;