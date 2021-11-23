const { Sequelize } = require("sequelize");
const getMySQLInfo = require("../utils/getMySQLInfo");

const { username, password, host, port, database } = getMySQLInfo();
const dialect = "mysql";

const sequelize = new Sequelize(database, username, password, {
  host: host,
  port: port,
  dialect: dialect,
});

const attributes = {
  // attributes
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
    // allowNull defaults to true
  },
};

// option 1 : Sequlize.Model.init(attributes, options)
const Model = Sequelize.Model;
class User_1 extends Model {}
User_1.init(attributes, {
  sequelize,
  modelName: "user_1",
});

// option 2 : sequelize.define
const User_2 = sequelize.define("user_2", attributes, {
  // options
});

// User_1.sync({ force: true })
//   .then(() => {
//     return User_1.create({
//       firstName: "forme",
//       lastName: "gusto",
//     });
//   })
//   .then((result) => {
//     console.log(result);
//   });

// User_2.sync({ force: true })
//   .then(() => {
//     return User_2.create({
//       firstName: "forme",
//       lastName: "gusto",
//     });
//   })
//   .then((result) => {
//     console.log(result);
//   });

sequelize
  .sync({ force: true })
  .then(() => {
    return User_1.create({
      firstName: "forme",
      lastName: "gusto",
    });
  })
  .then((result) => {
    console.log(result);
  });
