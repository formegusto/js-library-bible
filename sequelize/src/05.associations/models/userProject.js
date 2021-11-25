const { Model, DataTypes } = require("sequelize");

class UserProjects extends Model {
  static init(sequelize) {
    super.init(
      {
        status: DataTypes.STRING,
      },
      { sequelize, modelName: "UserProjects" }
    );
  }

  static associate(db) {}
}

module.exports = UserProjects;
