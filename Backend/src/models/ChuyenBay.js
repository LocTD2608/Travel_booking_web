module.exports = (sequelize, DataTypes) => {
    const ChuyenBay = sequelize.define("ChuyenBay", {
        MaChuyenBay: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        MaTuyenDuong: DataTypes.INTEGER,
        HangBay: DataTypes.STRING(50),

        GiaCoBan: DataTypes.DECIMAL(15, 2),
        GioKhoiHanh: DataTypes.DATE,
        GioHaCanh: DataTypes.DATE
    }, {
        tableName: "chuyen_bay",
        timestamps: false
    });

    return ChuyenBay;
};