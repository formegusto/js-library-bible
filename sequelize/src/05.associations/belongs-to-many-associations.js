const sequelize = require("../utils/defaultSequelize");
const { Model, DataTypes } = require("sequelize");

class User extends Model {}
class Project extends Model {}

User.init({}, { sequelize, modelName: "user" });
Project.init({}, { sequelize, modelName: "project" });

// User.belongsToMany(Project, { through: "UserProject" });
// Project.belongsToMany(User, { through: "UserProject" });
/*
CREATE TABLE IF NOT EXISTS `UserProject` 
(`createdAt` DATETIME NOT NULL, `updatedAt` DATETIME NOT NULL, 
`userId` INTEGER , `projectId` INTEGER , 
PRIMARY KEY (`userId`, `projectId`), 
FOREIGN KEY (`userId`) REFERENCES `users` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE, 
FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`) 
ON DELETE CASCADE ON UPDATE CASCADE) ENGINE=InnoDB;
*/
User.belongsToMany(Project, {
  as: "Tasks",
  through: "UserProject",
  foreignKey: "taskId",
  otherKey: "workerId",
});

class Person extends Model {}
Person.init({}, { sequelize, modelName: "person" });
Person.belongsToMany(Person, {
  as: "Children",
  through: "PersonChildren",
  otherKey: "childId",
  foreignKey: "parentId",
});

sequelize.sync({ force: false }).then(() => {
  console.log("[database] connected :)");
});
