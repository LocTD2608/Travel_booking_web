module.exports = (sequelize, DataTypes) => {
    const ChiTietBooking = sequelize.define('chi_tiet_booking', {
        MaCTBooking: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        MaBooking: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        SoLuongNguoi: {
            type: DataTypes.INTEGER
        },
        DonGia: {
            type: DataTypes.DECIMAL(15, 2)
        },
        LoaiDoiTuong: {
            type: DataTypes.STRING(30)
        },
        MaKM: {
            type: DataTypes.INTEGER
        }
    }, {
        tableName: 'chi_tiet_booking',
        timestamps: false
    });

    ChiTietBooking.associate = (models) => {
        ChiTietBooking.belongsTo(models.Booking, {
            foreignKey: 'MaBooking'
        });
    };

    return ChiTietBooking;
};