const sequelize = require("../utils/defaultSequelize");
const { Model, DataTypes } = require("sequelize");

class User extends Model {}
User.init({}, { sequelize, modelName: "user" });
class Project extends Model {}
Project.init({}, { sequelize, modelName: "project" });

Project.hasOne(User);
// FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`)

// options
// Project.hasOne(User, { foreignKey: "initiatorId" });
// Project.hasOne(User, { as: "Initiator" });

class Person extends Model {}
Person.init({}, { sequelize, modelName: "person" });
Person.hasOne(Person, { as: "Father", foreignKey: "dadId" });
// FOREIGN KEY (`dadId`) REFERENCES `people` (`id`)

class Team extends Model {}
Team.init({}, { sequelize, modelName: "team" });
class Game extends Model {}
Game.init({}, { sequelize, modelName: "game" });

Team.hasOne(Game, { as: "HomeTeam", foreignKey: "homeTeamId" });
Team.hasOne(Game, { as: "AwayTeam", foreignKey: "awayTeamId" });
Game.belongsTo(Team);
/*
FOREIGN KEY (`homeTeamId`) REFERENCES `teams` (`id`) 
FOREIGN KEY (`awayTeamId`) REFERENCES `teams` (`id`)
*/

class Company extends Model {}
Company.init(
  {
    name: {
      type: DataTypes.STRING,
      unique: true,
    },
  },
  { sequelize, modelName: "company" }
);
Company.hasOne(User, { foreignKey: "companyName", sourceKey: "name" });
/*
FOREIGN KEY (`companyName`) REFERENCES `companies` (`name`)
*/

sequelize.sync({ force: true }).then(() => {
  console.log("[database] connected :)");
});
