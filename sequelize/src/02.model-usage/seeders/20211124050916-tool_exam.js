"use strict";

// sequelize db:seed --seed 20211124050916-tool_exam.js
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("tools", [
      {
        name: "Toothpick",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
      },
      {
        name: "Toothpick",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 2,
      },
      {
        name: "Computer",
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: 1,
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("tools", null, {});
  },
};
