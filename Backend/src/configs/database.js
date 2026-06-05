const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(process.env.MYSQL_PUBLIC_URL, {
  dialect: "mysql",
  logging: false,
});

module.exports = sequelize;