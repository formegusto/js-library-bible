const sequelize = require("../../utils/defaultSequelize");

const Project = require("./project");
const Task = require("./task");
const User = require("./user");
const UserProject = require("./userProject");

// # init
Project.init(sequelize);
Task.init(sequelize);
User.init(sequelize);
UserProject.init(sequelize);

// # assocications
const db = {
  Project,
  Task,
  User,
  UserProject,
};
Project.associate(db);
Task.associate(db);
User.associate(db);

module.exports = sequelize;
