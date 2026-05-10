module.exports = (sequelize, DataTypes) => {
    const User = sequelize.define("User", {
        UserID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        Ho: DataTypes.STRING(50),
        Ten: DataTypes.STRING(50),
        SDT: DataTypes.STRING(20),
        CCCD: DataTypes.STRING(20),
        Email: DataTypes.STRING(100),
        Password: {
            type: DataTypes.STRING(255),
            allowNull: false,
        },
        Role: {
            type: DataTypes.STRING(30),
            defaultValue: "USER",
        },
        TrangThai: {
            type: DataTypes.STRING(50),
            defaultValue: "ACTIVE",
        },
        TinhTrangXacMinh: {
            type: DataTypes.STRING(50),
            defaultValue: "UNVERIFIED",
        },
        NgayTaoTK: {
            type: DataTypes.DATE,
            defaultValue: DataTypes.NOW,
        }
    }, {
        tableName: "users",
        timestamps: false,
    });

    return User;
};