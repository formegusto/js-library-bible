"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "Post",
      [
        {
          title: "안녕하세요",
          contents: "hi",
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
        },
        {
          title: "안녕하세요",
          contents: "hi",
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
        },
        {
          title: "안녕하세요",
          contents: "hi",
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
        },
        {
          title: "안녕하세요",
          contents: "hi",
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
        },
        {
          title: "안녕하세요",
          contents: "hi",
          createdAt: new Date(),
          updatedAt: new Date(),
          authorId: 1,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("Post", null, {});
  },
};
