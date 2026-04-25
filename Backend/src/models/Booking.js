module.exports = (sequelize, DataTypes) => {
    const Booking = sequelize.define("Booking", {
        MaBooking: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        UserID: DataTypes.INTEGER,
        ThoiDiemDat: DataTypes.DATE,
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
        tableName: "booking",
        timestamps: false,
    });

    return Booking;
};