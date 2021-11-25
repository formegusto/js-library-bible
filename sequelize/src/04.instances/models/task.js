const { Sequelize } = require("sequelize");

const taskAttributes = {
  title: Sequelize.STRING,
  description: Sequelize.STRING,
  subject: Sequelize.STRING,
  deadline: Sequelize.DATE,
  status: {
    type: Sequelize.ENUM("active", "inactive", "executing", "finished"),
    defaultValue: "inactive",
  },
};

class Task extends Sequelize.Model {
  static init(sequelize) {
    return super.init(taskAttributes, {
      modelName: "Task",
      freezeTableName: true,
      paranoid: true,
      sequelize,
    });
  }

  static association(db) {}
}

module.exports = Task;
