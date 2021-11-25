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
      as: { singular: "Task", plural: "Tasks" },
      foreignKey: "taskId",
    });
  }
}

module.exports = Project;
