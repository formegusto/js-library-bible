const Sequelize = require("sequelize");
const getMySQLInfo = require("../utils/getMySQLInfo");

const { username, password, host, port, database } = getMySQLInfo();
const dialect = "mysql";

// Option 1: Passing parameters separately
const sequelize_1 = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
});

// Option 2: Passing a connection URI
const sequelize_2 = new Sequelize(
  `mysql://${username}:${password}@${host}:${port}/${database}`
);

// Note: setting up SQLite
const sqlite_sequlize = new Sequelize({
  dialect: "sqlite",
  storage: "storage/sqlite_database.sqlite",
});

// Note: connection pool
const pool_sequlize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
  pool: {
    max: 5,
    min: 0,
    acquire: 30000,
    idle: 10000,
  },
});

sequlize_1
  .authenticate()
  .then(() => {
    console.log("connection has been extablished successfully");
  })
  .catch((err) => {
    console.error(err);
  });
