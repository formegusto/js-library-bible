"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("teachers", [
      {
        name: "no th",
        taskId: 1,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        name: "formegusto",
        taskId: 2,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("teachers", null, {});
  },
};
