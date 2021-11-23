module.exports = function getMySQLInfo() {
  const dotenv = require("dotenv");
  dotenv.config();

  return {
    username: process.env.MYSQL_USERNAME,
    password: process.env.MYSQL_PASSWORD,
    host: process.env.MYSQL_HOST,
    port: process.env.MYSQL_PORT,
    database: process.env.MYSQL_DBNAME,
  };
};
