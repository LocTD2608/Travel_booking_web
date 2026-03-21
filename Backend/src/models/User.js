const { DataTypes } = require("sequelize");
const sequelize = require("../configs/database");

const User = sequelize.define(
  "User",
  {
    UserID: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    Ho: {
      type: DataTypes.STRING(100),
    },
    Ten: {
      type: DataTypes.STRING(100),
    },
    Email: {
      type: DataTypes.STRING(100),
      unique: true,
      allowNull: false,
    },
    SDT: {
      type: DataTypes.STRING(15),
    },
    CCCD: {
      type: DataTypes.STRING(20),
    },
    Password: {
      type: DataTypes.STRING(255),
      allowNull: false,
    },
    Role: {
      type: DataTypes.STRING(30),
      defaultValue: "USER",
    },
    TrangThai: {
      type: DataTypes.STRING(50),
      defaultValue: "ACTIVE"
    },

    TinhTrangXacMinh: {
      type: DataTypes.STRING(50),
      defaultValue: "UNVERIFIED"
    },

    NgayTaoTK: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  },
  {
    tableName: "USERS",
    timestamps: false,
  }
);

module.exports = User;