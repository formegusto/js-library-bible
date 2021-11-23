"use strict";

// sequelize seed:generate --name project_exam
// sequelize db:seed:all
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "project",
      [
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "b Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "c Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "b Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "c Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "c Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "c Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "a Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        {
          title: "c Project",
          name: "formegusto",
          createdAt: new Date(),
          updatedAt: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("project", null, {});
  },
};
