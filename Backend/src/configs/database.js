const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
  "quanly_booking",    //  tên DB
  "root",        //  user MySQL
  "root",        //  password
  {
    host: "localhost",
    dialect: "mysql",
    logging: false,
  }
);

module.exports = sequelize;
