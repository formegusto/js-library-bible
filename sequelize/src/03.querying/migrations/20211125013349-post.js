"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("Post", {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoImcrement: true,
      },
      title: {
        type: Sequelize.STRING,
        defaultValue: "untitle",
        allowNull: false,
      },
      contents: {
        type: Sequelize.TEXT,
        defaultValue: "글을 입력해주세요.",
        allowNull: false,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("Post");
  },
};
