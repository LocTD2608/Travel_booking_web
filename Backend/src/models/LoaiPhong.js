module.exports = (sequelize, DataTypes) => {
    return sequelize.define("LoaiPhong", {
        MaLoaiPhong: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        MaKS: {
            type: DataTypes.INTEGER,
            allowNull: false
        },
        TenPhong: {
            type: DataTypes.STRING,
            allowNull: false
        },
        GiaPhong: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false
        },
        SoNguoiOToiDa: {
            type: DataTypes.INTEGER,
            allowNull: false
        }
    }, {
        tableName: "loai_phong",
        timestamps: false
    });
};
