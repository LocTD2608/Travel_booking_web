const { Sequelize } = require("sequelize");

const sequelize = process.env.MYSQL_PUBLIC_URL
  ? new Sequelize(process.env.MYSQL_PUBLIC_URL, {
      dialect: "mysql",
      logging: false,
    })
  : new Sequelize(
      process.env.DB_NAME,
      process.env.DB_USER,
      process.env.DB_PASSWORD,
      {
        host: process.env.DB_HOST || "localhost",
        port: process.env.DB_PORT || 3306,
        dialect: process.env.DB_DIALECT || "mysql",
        logging: false,
      }
    );

module.exports = sequelize;