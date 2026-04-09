const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("quanly_booking", "root", "280106", {
  host: "localhost",
  dialect: "mysql",
});

module.exports = sequelize;