const { Sequelize } = require("sequelize");

const projectAttributes = {
  title: Sequelize.STRING,
  description: Sequelize.STRING,
};
class Project extends Sequelize.Model {
  static init(sequelize) {
    return super.init(projectAttributes, {
      sequelize,
      modelName: "Project",
      freezeTableName: true,
    });
  }

  static associate(db) {}
}

module.exports = Project;
