const { Sequelize } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
  class Project extends Sequelize.Model {}
  Project.init(
    {
      name: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    { sequelize }
  );
  return Project;
};
