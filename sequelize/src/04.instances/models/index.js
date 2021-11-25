const sequelize = require("../../utils/defaultSequelize");

const Project = require("./project");
const Task = require("./task");
const User = require("./user");
const ValidateTask = require("./validateTask");

Project.init(sequelize);
Task.init(sequelize);
User.init(sequelize);
ValidateTask.init(sequelize);

module.exports = sequelize;
