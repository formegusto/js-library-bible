const { Model, DataTypes } = require("sequelize");

class User extends Model {
  static init(sequelize) {
    super.init({}, { sequelize, modelName: "User" });
  }
  static associate(db) {
    User.belongsToMany(db.Project, {
      through: db.UserProject,
      as: { singular: "Task", plural: "Tasks" },
      foreignKey: "workerId",
    });
  }
}

module.exports = User;
