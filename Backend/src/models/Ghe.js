module.exports = (sequelize, DataTypes) => {
    const Ghe = sequelize.define("Ghe", {
        MaGhe: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        MaChuyenBay: DataTypes.INTEGER,
        SoGhe: DataTypes.STRING(10),
        HangGhe: DataTypes.STRING(30),
        GiaPhuPhi: DataTypes.DECIMAL(15, 2),
        TrangThaiGhe: DataTypes.STRING(30)
    }, {
        tableName: "GHE",
        timestamps: false
    });

    return Ghe;
};
