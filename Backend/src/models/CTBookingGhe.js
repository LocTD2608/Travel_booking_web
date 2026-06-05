module.exports = (sequelize, DataTypes) => {
    const CTBookingGhe = sequelize.define("CTBookingGhe", {
        MaCTBooking: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        MaGhe: {
            type: DataTypes.INTEGER,
            primaryKey: true,
        },
        GiaPhuPhi: DataTypes.DECIMAL(15, 2)
    }, {
        tableName: "ctbooking_ghe",
        timestamps: false
    });

    return CTBookingGhe;
};
