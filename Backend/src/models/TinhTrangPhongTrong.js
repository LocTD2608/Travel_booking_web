module.exports = (sequelize, DataTypes) => {
    const TinhTrangPhongTrong = sequelize.define('tinh_trang_phong_trong', {
        MaPhongKhaDung: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        MaLoaiPhong: {
            type: DataTypes.INTEGER
        },
        NgayDatPhong: {
            type: DataTypes.DATE
        },
        SoLuongPhongCoSan: {
            type: DataTypes.INTEGER
        },
        TongTien: {
            type: DataTypes.DECIMAL(15, 2)
        }
    }, {
        tableName: 'tinh_trang_phong_trong',
        timestamps: false
    });

    return TinhTrangPhongTrong;
};