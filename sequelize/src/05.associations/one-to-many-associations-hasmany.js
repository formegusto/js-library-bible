const sequelize = require("../utils/defaultSequelize");
const { Model, DataTypes } = require("sequelize");

class User extends Model {}
class Project extends Model {}

User.init({}, { sequelize, modelName: "user" });
Project.init({}, { sequelize, modelName: "project" });

Project.hasMany(User, { as: "Workers" });
// FOREIGN KEY (`projectId`) REFERENCES `projects` (`id`)

class City extends Model {}
class Country extends Model {}

City.init({}, { sequelize, modelName: "city" });
Country.init(
  {
    isoCode: {
      type: DataTypes.CHAR(2),
      allowNull: false,
      primaryKey: true,
    },
  },
  { sequelize, modelName: "country" }
);

Country.hasMany(User, { foreignKey: "countryCode", sourceKey: "isoCode" });
City.belongsTo(Country, { foreignKey: "countryCode", targetKey: "isoCode" });
// FOREIGN KEY (`countryCode`) REFERENCES `countries` (`isoCode`)

sequelize.sync({ force: true }).then(() => {
  console.log("[database] connected :)");
});
