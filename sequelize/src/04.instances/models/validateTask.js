const { Sequelize } = require("sequelize");

const validateTaskAttributes = {
  name: {
    type: Sequelize.STRING,
    allowNull: false,
    validate: {
      notNull: { args: true, msg: "name cannot be null" },
    },
  },
  code: {
    type: Sequelize.STRING,
    validate: {
      len: { args: [3, 10], msg: "code is [code >= 3] and [code <= 10]" },
    },
  },
};

class ValidateTask extends Sequelize.Model {
  static init(sequelize) {
    return super.init(validateTaskAttributes, {
      modelName: "ValidateTask",
      freezeTableName: true,
      sequelize,
    });
  }

  static associate(db) {}
}

module.exports = ValidateTask;
