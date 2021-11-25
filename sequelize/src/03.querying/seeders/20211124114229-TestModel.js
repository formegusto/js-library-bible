"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      "TestModel",
      [
        {
          foo: "is Foo!",
          bar: "is Bar!",
          hats: true,
        },
        {
          foo: "is Foo!",
          bar: "is Bar!",
        },
        {
          foo: "is Foo!",
          bar: "is Bar!",
        },
        {
          foo: "is Foo!",
          bar: "is Bar!",
          hats: true,
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("TestModel", null, {});
  },
};
