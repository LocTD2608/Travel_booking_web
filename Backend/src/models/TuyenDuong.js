module.exports = (sequelize, DataTypes) => {
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

    return TuyenDuong;
};