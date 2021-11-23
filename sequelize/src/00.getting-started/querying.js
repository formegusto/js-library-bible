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
  firstName: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  lastName: {
    type: Sequelize.STRING,
  },
  age: {
    type: Sequelize.INTEGER,
  },
  isPerson: {
    type: Sequelize.BOOLEAN,
  },
};
class User extends Sequelize.Model {}
User.init(attributes, {
  sequelize,
  modelName: "user",
});

async function queryProcess() {
  // Find
  const users = await User.findAll();
  console.log("Find All Result");
  console.log(users);

  // Create
  const createUser_1 = await User.create({
    firstName: "forme",
    lastName: "gusto",
    age: 3,
    sex: false,
  });
  console.log("Create Formegusto!");
  console.log(createUser_1.dataValues);
  const createUser_2 = await User.create({
    firstName: "No",
    age: 3,
    sex: false,
  });
  console.log("Create No!");
  console.log(createUser_2.dataValues);

  // Find
  const formegusto = await User.findOne({
    where: {
      firstName: "forme",
      lastName: "gusto",
    },
    raw: true,
  });
  console.log("Find Formegusto!");
  console.log(formegusto);
  const nullUsers = await User.findAll({
    where: {
      lastName: null,
    },
    raw: true,
  });
  console.log("Find Null Users!");
  console.log(nullUsers);

  // Update
  const updateUser = await User.update(
    {
      lastName: "th",
    },
    {
      where: {
        firstName: "no",
        lastName: null,
      },
    }
  );
  console.log("Update No Null!");
  // id return
  console.log(updateUser);

  // Delete
  const deleteUser = await User.destroy({
    where: {
      firstName: "no",
    },
  });
  console.log("Delete No!");
  // id return
  console.log(deleteUser);
}

sequelize.sync({ force: true }).then(async () => {
  console.log("database synchronizing success.");

  await queryProcess();
});
