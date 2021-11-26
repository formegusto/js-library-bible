const { Model, DataTypes } = require("sequelize");

class Project extends Model {
  static init(sequelize) {
    super.init(
      {
        status: {
          type: DataTypes.STRING,
          defaultValue: "project init",
        },
      },
      {
        modelName: "Project",
        sequelize,
      }
    );
  }

  static associate(db) {
    Project.hasMany(db.Task);
    Project.belongsToMany(db.User, {
      through: db.UserProject,
      as: { singular: "Worker", plural: "Workers" },
      foreignKey: "taskId",
    });
  }
}

module.exports = Project;
