const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const SanBay = sequelize.define("SanBay", {
  MaSanBay: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  Ten: DataTypes.STRING,
  Code: DataTypes.STRING
}, {
  tableName: "san_bay",
  timestamps: false
});

module.exports = SanBay;