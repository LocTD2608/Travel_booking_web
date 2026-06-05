module.exports = (sequelize, DataTypes) => {
    const DV_DU_LICH = sequelize.define("DV_DU_LICH", {
        MaDV_DL: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: false
        },
        DiemDon: DataTypes.STRING,
        DiaDiemThamQuan: DataTypes.STRING
    }, {
        tableName: "dv_du_lich",
        timestamps: false
    });

    return DV_DU_LICH;
};
