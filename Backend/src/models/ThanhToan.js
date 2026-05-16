module.exports = (sequelize, DataTypes) => {
    const ThanhToan = sequelize.define('thanh_toan', {
        MaTT: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        MaBooking: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        PhuongThucThanhToan: {
            type: DataTypes.STRING(50)
        },
        SoTien: {
            type: DataTypes.DECIMAL(15, 2)
        },
        TrangThaiTT: {
            type: DataTypes.STRING(30)
        },
        ThoiDiemThanhToan: {
            type: DataTypes.DATE
        }
    }, {
        tableName: 'thanh_toan',
        timestamps: false
    });

    ThanhToan.associate = (models) => {
        ThanhToan.belongsTo(models.Booking, {
            foreignKey: 'MaBooking'
        });
    };

    return ThanhToan;
};