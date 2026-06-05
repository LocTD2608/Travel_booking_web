module.exports = (sequelize, DataTypes) => {
    return sequelize.define("KhuyenMai", {
        MaKM: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        TenKM: {
            type: DataTypes.STRING,
            allowNull: false
        },
        LoaiKM: {
            type: DataTypes.STRING
        },
        NgayApDung: {
            type: DataTypes.DATE
        },
        NgayKetThuc: {
            type: DataTypes.DATE
        },
        DieuKien: {
            type: DataTypes.TEXT
        },
        TrangThaiKM: {
            type: DataTypes.STRING
        }
    }, {
        tableName: "khuyen_mai",
        timestamps: false
    });
};
