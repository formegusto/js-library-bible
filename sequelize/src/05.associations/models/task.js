const { Model, DataTypes } = require("sequelize");

class Task extends Model {
  static init(sequelize) {
    super.init(
      {
        title: DataTypes.STRING,
      },
      {
        sequelize,
        modelName: "Task",
      }
    );
  }

  static associate(db) {
    Task.belongsTo(db.Project);
  }
}

module.exports = Task;
