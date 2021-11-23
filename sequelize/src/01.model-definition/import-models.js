const { Sequelize } = require("sequelize");
const sequelize = require("../utils/defaultSequelize");

// option 1. File Import
const Project = sequelize.import(__dirname + "/models/project");

// option 2. callback argument
const Book = sequelize.import("book", (sequelize, DataTypes) => {
  class Book extends Sequelize.Model {}
  Book.init(
    {
      title: DataTypes.STRING,
      description: DataTypes.TEXT,
    },
    { sequelize }
  );
  return Book;
});

sequelize.sync({ force: true }).then(() => {
  console.log("table synchronizing success");
});
