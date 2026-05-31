module.exports = (sequelize, DataTypes) => {
    return sequelize.define("Hotel", {
        MaKS: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },

        TenKS: {
            type: DataTypes.STRING,
            allowNull: false
        },

        DiaChi: {
            type: DataTypes.STRING
        },

        HangSao: {
            type: DataTypes.INTEGER
        }

    }, {
        tableName: "khach_san",
        timestamps: false
    });
};