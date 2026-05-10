module.exports = (sequelize, DataTypes) => {
  const Booking = sequelize.define(
    "Booking",
    {
      MaBooking: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      UserID: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },

      ThoiDiemDat: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
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
        defaultValue: "Chưa thanh toán",
      },
    },
    {
      tableName: "booking",
      timestamps: false,
    }
  );

  return Booking;
};