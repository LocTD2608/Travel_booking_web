module.exports = (sequelize, DataTypes) => {
    const SanBay = sequelize.define("SanBay", {
        MaSanBay: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Ten: DataTypes.STRING,
        Code: DataTypes.STRING
    }, {
        tableName: "san_bay",
        timestamps: false
    });

    return SanBay;
};