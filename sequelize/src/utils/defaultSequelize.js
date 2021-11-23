const { Sequelize } = require("sequelize");
const getMySQLInfo = require("./getMySQLInfo");

const { username, password, host, port, database } = getMySQLInfo();
const dialect = "mysql";

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
});

module.exports = sequelize;
