const { Sequelize } = require("sequelize");

const userAttributes = {
  username: Sequelize.STRING,
  isAdmin: {
    type: Sequelize.BOOLEAN,
    defaultValue: false,
  },
  age: {
    type: Sequelize.INTEGER,
    defaultValue: 10,
  },
};
class User extends Sequelize.Model {
  static init(sequelize) {
    return super.init(userAttributes, {
      modelName: "User",
      freezeTableName: true,
      sequelize,
    });
  }

  static association(db) {}
}

module.exports = User;
