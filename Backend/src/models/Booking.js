const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const Booking = sequelize.define("BOOKING", {
  MaBooking: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
  },
  UserID: {
    type: DataTypes.INTEGER,
  },
  ThoiDiemDat: {
    type: DataTypes.DATE,
  },
  ThoiDiemThanhToan: {
    type: DataTypes.DATE,
    allowNull: true,
  },
  TongTien: {
    type: DataTypes.FLOAT,
    defaultValue: 0,
  },
  TrangThaiBooking: {
    type: DataTypes.STRING,
    defaultValue: "PENDING",
  },
}, {
  tableName: "BOOKING",
  timestamps: false,
});

module.exports = Booking;