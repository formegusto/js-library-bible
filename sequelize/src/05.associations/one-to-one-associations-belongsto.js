const sequelize = require("../utils/defaultSequelize");
const { Model, DataTypes } = require("sequelize");

class Player extends Model {}
Player.init({}, { sequelize, modelName: "player" });
class Team extends Model {}
Team.init({}, { sequelize, modelName: "team" });

Player.belongsTo(Team);
/*
CREATE TABLE IF NOT EXISTS `players` 
(`id` INTEGER NOT NULL auto_increment , 
`createdAt` DATETIME NOT NULL, `
updatedAt` DATETIME NOT NULL, 
`teamId` INTEGER, PRIMARY KEY (`id`), 
FOREIGN KEY (`teamId`) REFERENCES `teams` (`id`) 
ON DELETE 
SET NULL 
ON UPDATE CASCADE) 
ENGINE=InnoDB;
*/

class User extends Model {}
User.init({}, { sequelize, modelName: "user", underscored: true });
class Company extends Model {}
Company.init(
  {
    uuid: {
      type: DataTypes.UUID,
      primaryKey: true,
    },
  },
  { sequelize, modelName: "company" }
);
User.belongsTo(Company);
/*
CREATE TABLE IF NOT EXISTS `users` 
(`id` INTEGER NOT NULL auto_increment , 
`created_at` DATETIME NOT NULL, 
`updated_at` DATETIME NOT NULL, `
company_uuid` CHAR(36) BINARY, PRIMARY KEY (`id`), 
FOREIGN KEY (`company_uuid`) 
REFERENCES `companies` (`uuid`) 
ON DELETE 
SET NULL 
ON UPDATE CASCADE) ENGINE=InnoDB;
*/

class Person extends Model {}
Person.init({}, { sequelize, modelName: "person" });
class Household extends Model {}
Household.init(
  {
    name: {
      type: DataTypes.STRING,
      unique: "nameIndex",
    },
  },
  { sequelize, modelName: "household" }
);
// Person.belongsTo(Household, { as: "house" });
/*
FOREIGN KEY (`houseId`) REFERENCES `households` (`id`)
*/
// Person.belongsTo(Household, { foreignKey: "householdNumber" });
/*
FOREIGN KEY (`householdNumber`) REFERENCES `households`
*/
Person.belongsTo(Household, { foreignKey: "apartName", targetKey: "name" });
/*
FOREIGN KEY (`apartName`) REFERENCES `households` (`name`)
*/

sequelize.sync({ force: true }).then(() => {
  console.log("db start success :)");
});
