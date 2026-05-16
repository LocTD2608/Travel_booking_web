module.exports = (sequelize, DataTypes) => {
    const DichVu = sequelize.define("DichVu", {
        MaDV: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        LoaiDichVu: DataTypes.STRING,
        MoTa: DataTypes.TEXT,
        Gia: DataTypes.DECIMAL(15, 2),
        DonViTinh: DataTypes.STRING
    }, {
        tableName: "dich_vu",
        timestamps: false
    });

    return DichVu;
};
