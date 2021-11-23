"use strict";

// sequelize migration:create --name timestamps
// sequelize db:migrate --env development
module.exports = {
  up: async (queryInterface, Sequelize) => {
    return queryInterface.createTable("myTable", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },

      // Timestamps
      createdAt: Sequelize.DATE,
      updatedAt: Sequelize.DATE,
    });
  },

  down: async (queryInterface, Sequelize) => {
    return queryInterface.dropTable("myTable");
  },
};
