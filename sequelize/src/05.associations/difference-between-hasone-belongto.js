const sequelize = require("../utils/defaultSequelize");
const { Model, DataTypes } = require("sequelize");

class Player extends Model {}
class Coach extends Model {}
class Team extends Model {}

Player.init({}, { sequelize, modelName: "player" });
Coach.init({}, { sequelize, modelName: "coach" });
Team.init({}, { sequelize, modelName: "team" });

Player.belongsTo(Team);
Coach.hasOne(Team);

sequelize.sync({ force: false }).then(() => {
  console.log("[database] connected :)");
});
